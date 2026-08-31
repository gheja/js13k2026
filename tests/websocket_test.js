"use strict"

const WS_BASE = ""

let ws
let net_id
let net_participants = []
let bootstrapped = false
let _state = {'peer_states': {}, "a": 42}
let _my_state = {"num": 1234}
let net_init_done = false

function net_connected() {
    _log("* Connected")
}

function net_disconnected() {
    _log("* Disconnected")
}

function _log(s) {
    document.getElementById("messages").innerHTML += s + "<br/>"
    document.getElementById("messages").scrollBy(0, 5000)
}

function net_hi_all() {
    _log(`[>] sending hi to everyone`)
    ws.send(`m|${net_id}|hi`)
}

function net_hi(recipient) {
    _log(`[>] sending hi to ${recipient}`)
    ws.send(`@${recipient}|m|${net_id}|hi`)
}

function net_send_state() {
    _log("[>] sending state...")
    ws.send(`s|${net_id}|${JSON.stringify(_state)}`)
}

function net_send_my_state() {
    _log("[>] sending my state...")
    // we could also send it to anyone and they could update their copy of the state independently - might be more robust on frequent disconnects?

    // send it only to the server
    // ws.send(`@${net_participants[0]}|t|${net_id}|${JSON.stringify(_my_state)}`)

    // send it everyone
    ws.send(`t|${net_id}|${JSON.stringify(_my_state)}`)

    net_send_state_if_leader()
}

function net_send_state_if_leader() {
    if (net_id == net_participants[0]) {
        net_send_state()
    }
}

function update_my_state() {
    _my_state.num = Math.round(Math.random() * 10000)
    _state.peer_states[net_id] = JSON.parse(JSON.stringify(_my_state))
    net_send_my_state()
}

function net_message(event) {
    console.log(event)

    const msg = event.data
    switch (msg[0]) {
        case '@':
            net_id = msg.slice(1)
            _log(`* My ID is: ${net_id}`)
            net_participants.push(net_id)
            net_hi_all()
        break

        case '+':
            _log(`* A client connected, ID: ${msg.slice(1)}`)
            net_hi(msg.slice(1))
        break

        case '-':
            let sender = msg.slice(1)
            _log(`* A client disconnected, ID: ${sender}`)
            net_participants = net_participants.filter(a => a != sender)
            net_participants.sort()
        break

        default:
            _log(`[<] ${msg}`)
            // please don't have "|" in the JSON...
            let arr = msg.split('|')
            _log("[debug] " + JSON.stringify(arr))
            // saying hi and adding to participants
            if (arr[0] == 'm') {
                // this is needed for bootstrapping - the new client might become leader
                net_send_state_if_leader()

                if (net_participants.indexOf(arr[1]) == -1) {
                    net_participants.push(arr[1])
                    net_participants.sort()
                }
            }
            // state update (only trust the leader)
            else if (arr[0] == 's') {
                // only accept from the leader, or from anyone if it is the first update (because if we just became the leader we need to bootstrap)
                if (arr[1] == net_participants[0] || !bootstrapped) {
                    try {
                        _state = JSON.parse(arr[2])
                        if (!bootstrapped) {
                            net_send_state_if_leader()
                            bootstrapped = true
                        }
                    }
                    catch (e) {}
                    _log(`* new state from leader: ${JSON.stringify(_state)}`)
                }
                else {
                    _log(`* refusing state update from ${arr[1]}`)
                }
            }
            // my_state update (per client, we trust everyone)
            else if (arr[0] == 't') {
                try {
                    _state.peer_states[arr[1]] = JSON.parse(arr[2])
                }
                catch (e) {}
                _log(`state of ${arr[1]}: ${JSON.stringify(_state.peer_states[arr[1]])}`)
                net_send_state_if_leader()
            }
        break
    }

    document.getElementById("participants").innerHTML = net_participants.join("<br/>")
    if (net_participants[0] == net_id) {
        document.getElementById("participants").innerHTML += "<br/><b>I am the leader</b>"
    }

    document.getElementById("state").innerHTML = JSON.stringify(_state)
}

function init() {
    _log("connecting...")
    ws = new WebSocket('wss://relay.js13kgames.com/huenicorn')
    ws.onopen = net_connected
    ws.onclose = net_disconnected
    ws.onmessage = net_message
}

window.addEventListener("load", init)
