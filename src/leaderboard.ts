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

let leaderboard_data = [
    [101, 0, "n2", [111, 0, 0, 0, [[1,1]]]],
    [101, 1, "n1", [333, 0, 0, 0, [[3,3],[3,3],[3,3]]]],
    [102, 2, "n1", [444, 0, 0, 0, [[4,4],[4,4],[4,4],[4,4]]]],
    [103, 3, "n1", [222, 0, 0, 0, [[2,2],[2,2]]]],
    [104, 0, "n1", [222, 0, 0, 0, [[2,2],[2,2]]]],
    [105, 1, "n1", [444, 0, 0, 0, [[4,4],[4,4],[4,4],[4,4]]]],
    [106, 2, "n1", [444, 0, 0, 0, [[4,4],[4,4],[4,4],[4,4]]]],
    [107, 4, "n1", [444, 0, 0, 0, [[4,4],[4,4],[4,4],[4,4]]]],
    [108, 5, "n1", [444, 0, 0, 0, [[4,4],[4,4],[4,4],[4,4]]]],
    [109, 5, "n1", [444, 0, 0, 0, [[4,4],[4,4],[4,4],[4,4]]]],
]

let player_data = {
    101: [101, "Rainbow 101"],
    102: [102, "Dash 102"],
    103: [103, "Aasdf 103"],
    104: [104, "Basdf 104"],
    105: [105, "fFAJja"],
    106: [106, "Jhahah"],
    107: [107, "IuqhgH"],
    108: [108, "Bloopeee"],
    109: [109, "Sugar"],
}

function leaderboard_process() {
    // this now only has the valid entries
    console.log(JSON.stringify(leaderboard_data))

    // sort them
    leaderboard_data = leaderboard_data.sort((a: Array<any>, b: Array<any>) => {
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
    leaderboard_data = leaderboard_data.filter((a: Array<any>) => {
        if (!(a[Lb1Index.PuzzleUid] in counts)) {
            counts[a[Lb1Index.PuzzleUid]] = 0
        }
        if (counts[a[Lb1Index.PuzzleUid]] > LEADERBOARD_SIZE_PER_PUZZLE) {
            return false
        }
        counts[a[Lb1Index.PuzzleUid]] += 1

        return true
    })

    console.log(JSON.stringify(leaderboard_data))
}

function leaderboard_add(data: Array<any>) {
    let puzzle = new PuzzleBase()

    // try {
        let d = _knownPuzzles[data[Lb1Index.PuzzleUid]]
        puzzle.setup(d[0], d[1], d[2], data[Lb1Index.PlayerState])
        puzzle.shuffle()
        if (puzzle.isSolved()) {
            clog("puzzle solution validated")
            leaderboard_data.push(data)
        }
        else {
            clog("err: puzzle solution is invalid!")
        }
    // }
    // catch (e) {}
}

function leaderboard_get_as_html(puzzleUid: string) {
    let result = ""
    let i = 0
    let lastStepCount = null
    let n
    for (let d of leaderboard_data) {
        if (d[Lb1Index.PuzzleUid] == puzzleUid) {
            i += 1
            n = "unknown"
            if (d[Lb1Index.PlayerUid] in player_data) {
                // name index
                n = player_data[d[Lb1Index.PlayerUid]][1]
            }
            result += "<code>" + (lastStepCount == d[Lb1Index.PlayerState][LbPSIndex.Swaps].length ? "--" : "#" + i) + "</code> " + REACTIONS[d[Lb1Index.PayerReactionIndex]] + " " + n + " (" + d[Lb1Index.PlayerState][LbPSIndex.Swaps].length + " steps)<br/>"
            lastStepCount = d[Lb1Index.PlayerState][LbPSIndex.Swaps].length
        }
    }
    return result
}

function leaderboard_add_player_info(playerUid: number, playerName: string) {
    player_data[playerUid.toString()] = playerName
}

function leaderboard_update_profile(data: Array<any>) {
    // player uid must be the first item
    player_data[data[0]] = data
}

function leaderboard_submit_result(data: Array<any>) {
    console.log(data)
    leaderboard_add(data)
    leaderboard_process()
}
