"use strict"

/*
  The WebSocket is connecting to a relay that only passes the messages between
  the connected Participants (clients), this can be private or broadcast.
  
  All Participants have a unique ID.
  
  There is one special role, the Leader which is always the Participant with
  the (alphabetically) lowest ID.
  
  The Leader is responsible for synchronizing the state, it is receiving,
  validating, processing the changes, then sends the state out to all
  Participants.

  The relay does not give a list of the clients connected but sends the change,
  so when connecting we're only aware of the connects/disconnects of later
  clients. This is why we need to broadcast a "hi" and each client replies with
  a "hi" in private in return - this way we can build a list of all
  participants.

  The relay only relays the message, not the ID of the sender, so we need to
  send that too.
*/

let net_ws: WebSocket
let net_my_uid: string
let net_participants: Array<string> = []
let net_bootstrapped = false

function nlog(s: any) {
    if (!IS_PROD_BUILD) {
        clog(`[net] ${s}`)
    }
}

function net_on_connected() {
    nlog("* Connected")
}

function net_on_disconnected() {
    nlog("* Disconnected")
}

function net_send_hi_to_all() {
    nlog(`[>] sending hi to everyone`)
    net_ws.send(`m|${net_my_uid}`)
}

function net_send_hi_to_participant(recipient: string) {
    nlog(`[>] sending hi to ${recipient}`)
    net_ws.send(`@${recipient}|m|${net_my_uid}`)
}

function net_send_state() {
    nlog("[>] sending state...")
    net_ws.send(`s|${net_my_uid}|${JSON.stringify(shared_public_state)}`)
}

function net_send_state_if_leader() {
    if (net_my_uid == net_participants[0]) {
        net_send_state()
        // not sure if this is neccessary, but will leave it here...
        leaderboard_on_update()
    }
}

function net_send_update(s: string) {
    net_ws.send(s)

    // if we are the leader then we won't receive this message, so emulate it
    if (net_my_uid == net_participants[0]) {
        net_message({"data": s })
    }
}

function net_send_participant_data(player_data: Array<any>, leaderboard_data: Array<any>) {
    nlog("[>] sending my participant data...")
    net_send_update(`tp|${net_my_uid}|${JSON.stringify(player_data)}`)
    net_send_update(`tl|${net_my_uid}|${JSON.stringify(leaderboard_data)}`)
}

function net_message(event) {
    // console.log(event)

    const msg = event.data
    switch (msg[0]) {
        case '@':
            // when we establish the connection we get our ID
            net_my_uid = msg.slice(1)
            nlog(`* My ID is: ${net_my_uid}`)
            net_participants.push(net_my_uid)
            net_send_hi_to_all()
        break

        case '+':
            nlog(`* A client connected, ID: ${msg.slice(1)}`)
            net_send_hi_to_participant(msg.slice(1))
        break

        case '-':
            let sender = msg.slice(1)
            nlog(`* A client disconnected, ID: ${sender}`)
            net_participants = net_participants.filter(a => a != sender)
        break

        default:
            nlog(`[<] ${msg}`)
            // please don't have "|" in the JSON...
            let arr = msg.split('|')

            nlog("[debug] " + JSON.stringify(arr))

            // hi and adding to participants
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
                if (arr[1] == net_participants[0] || !net_bootstrapped) {
                    try {
                        shared_public_state = JSON.parse(arr[2])
                        if (!net_bootstrapped) {
                            net_send_state_if_leader()
                            net_bootstrapped = true
                        }
                        leaderboard_on_update()
                    }
                    catch (e) {}
                    nlog(`* new state from leader`)
                }
                else {
                    nlog(`* refusing state update from ${arr[1]}`)
                }
            }
            // player data update
            else if (arr[0] == 'tp') {
                try {
                    leaderboard_update_profile(JSON.parse(arr[2]))
                }
                catch (e) {}
            }
            // leaderboard entry update
            else if (arr[0] == 'tl') {
                try {
                    leaderboard_submit_result(JSON.parse(arr[2]))
                }
                catch (e) {}
                // only the leaderboard entry triggers a send, so we're not spamming but the order is important
                net_send_state_if_leader()
            }
        break
    }
    if (net_participants[0] == net_my_uid) {
        nlog("I am the leader")
    }
}

function net_init() {
    nlog("* Connecting...")
    net_ws = new WebSocket(NET_WS_BASE)
    if (!IS_PROD_BUILD) {
        net_ws.onopen = net_on_connected
        net_ws.onclose = net_on_disconnected
    }
    net_ws.onmessage = net_message
}
