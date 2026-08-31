"use strict"

const WS_BASE = ""

let ws
let net_id
let net_participants = []
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
            if (arr[0] == 'm') {
                if (net_participants.indexOf(arr[1]) == -1) {
                    net_participants.push(arr[1])
                    net_participants.sort()
                }
            }
            else if (arr[0] == 's') {
                // only accept from the leader
                if (arr[1] == net_participants[0]) {
                    try {
                        _state = JSON.parse(arr[2])
                    }
                    catch (e) {}
                    _log(`* new state from leader: ${JSON.stringify(_state)}`)
                }
                else {
                    _log(`* refusing state update from ${arr[1]}`)
                }
            }
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
}

function init() {
    _log("connecting...")
    ws = new WebSocket('wss://relay.js13kgames.com/huenicorn')
    ws.onopen = net_connected
    ws.onclose = net_disconnected
    ws.onmessage = net_message
}

window.addEventListener("load", init)
