// The shared_public_state (containing the leaderboard and player data) is only
// modified by the Leader, or when the Leader tells us to.

enum Lb1Index {
    PlayerUid = 0,
    PayerReactionIndex,
    PuzzleUid,
    PlayerState
}

enum LbPSIndex {
    PuzzleSeed = 0,
    A,
    B,
    C,
    Swaps
}

const LEADERBOARD_SIZE_PER_PUZZLE = 300

let shared_public_state = {
    "l": [], // leaderboard
    "p": {}, // player data
}

function leaderboard_process() {
    // this now only has the valid entries
    // console.log(JSON.stringify(shared_public_state['l']))

    // sort them
    shared_public_state['l'] = shared_public_state['l'].sort((a: Array<any>, b: Array<any>) => {
        // puzzle id ASC
        if (a[Lb1Index.PuzzleUid] != b[Lb1Index.PuzzleUid]) {
            return b[Lb1Index.PuzzleUid] > a[Lb1Index.PuzzleUid] ? -1 : +1
        }

        // solution length DESC
        if (a[Lb1Index.PlayerState][LbPSIndex.Swaps].length != b[Lb1Index.PlayerState][LbPSIndex.Swaps].length) {
            return a[Lb1Index.PlayerState][LbPSIndex.Swaps].length - b[Lb1Index.PlayerState][LbPSIndex.Swaps].length
        }

        return 0
    })

    // limit all puzzle leaderboards to LEADERBOARD_SIZE_PER_PUZZLE entries
    let counts = {}
    shared_public_state['l'] = shared_public_state['l'].filter((a: Array<any>) => {
        if (!(a[Lb1Index.PuzzleUid] in counts)) {
            counts[a[Lb1Index.PuzzleUid]] = 0
        }
        if (counts[a[Lb1Index.PuzzleUid]] > LEADERBOARD_SIZE_PER_PUZZLE) {
            return false
        }
        counts[a[Lb1Index.PuzzleUid]] += 1

        return true
    })

    // console.log(JSON.stringify(shared_public_state['l']))
}

function leaderboard_add(data: Array<any>) {
    let puzzle = new PuzzleBase()

    try {
        let d = _knownPuzzles[data[Lb1Index.PuzzleUid]]
        puzzle.setup(d[0], d[1], d[2], data[Lb1Index.PlayerState])
        puzzle.shuffle()
        if (puzzle.isSolved()) {
            clog("puzzle solution validated")
            shared_public_state['l'].push(data)
        }
        else {
            clog("err: puzzle solution is invalid!")
        }
    }
    catch (e) {}
}

function leaderboard_get_as_html(puzzleUid: string) {
    let result = ""
    let i = 0
    let lastStepCount = null
    let n
    for (let d of shared_public_state['l']) {
        if (d[Lb1Index.PuzzleUid] == puzzleUid) {
            i += 1
            n = "unknown"
            if (d[Lb1Index.PlayerUid] in shared_public_state['p']) {
                // name index
                n = shared_public_state['p'][d[Lb1Index.PlayerUid]][1]
            }
            result += "<code>" + (lastStepCount == d[Lb1Index.PlayerState][LbPSIndex.Swaps].length ? "--" : "#" + i) + "</code> " + REACTIONS[d[Lb1Index.PayerReactionIndex]] + " " + n + " (" + d[Lb1Index.PlayerState][LbPSIndex.Swaps].length + " steps)<br/>"
            lastStepCount = d[Lb1Index.PlayerState][LbPSIndex.Swaps].length
        }
    }
    return result
}

function leaderboard_add_player_info(playerUid: number, playerName: string) {
    shared_public_state['p'][playerUid.toString()] = playerName
}

function leaderboard_update_profile(data: Array<any>) {
    // player uid must be the first item
    shared_public_state['p'][data[0]] = data
}

function leaderboard_submit_result(data: Array<any>) {
    // console.log(data)
    leaderboard_add(data)
    leaderboard_process()
}

function leaderboard_on_update() {
    console.log("leaderboard update hook")
    _game.updateWinScreen()
}
