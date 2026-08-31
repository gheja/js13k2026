"use strict"

const WS_BASE = ""

let ws
let net_id
let net_participants = []
let _state = {'a': 42}

function net_connected() {
    console.log("connected")
}

function net_disconnected() {
    console.log("disconnected")
}

function _log(s) {
    document.getElementById("messages").innerHTML += s + "<br/>"
}

function net_hi_all() {
    ws.send(`m|${net_id}|hi`)
}

function net_hi(recipient) {
    ws.send(`@${recipient}|m|${net_id}|hi`)
}

function net_send_state() {
    ws.send(`s|${net_id}|${JSON.stringify(_state)}`)
}

function net_message(event) {
    console.log(event)

    const msg = event.data
    switch (msg[0]) {
        case '@':
            net_id = msg.slice(1)
            _log(`My ID is: ${net_id}`)
            net_participants.push(net_id)
            net_hi_all()
        break

        case '+':
            _log(`A client connected, ID: ${msg.slice(1)}`)
            net_hi(msg.slice(1))
        break

        case '-':
            let sender = msg.slice(1)
            _log(`A client disconnected, ID: ${sender}`)
            net_participants = net_participants.filter(a => a != sender)
            net_participants.sort()
        break

        default:
            _log(`Message: ${msg}`)
            let arr = msg.split('|')
            if (arr[0] == 'm') {
                if (net_participants.indexOf(arr[1]) == -1) {
                    net_participants.push(arr[1])
                    net_participants.sort()
                }
            }
            else if (arr[0] == 's') {
                if (arr[1] == net_participants[0]) {
                    try {
                        _state = JSON.parse(arr[2])
                    }
                    catch (e) {}
                    _log(`new state: ${JSON.stringify(_state)}`)
                }
                else {
                    _log(`refusing state update from ${arr[1]}`)
                }
            }
            console.log(arr)
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
