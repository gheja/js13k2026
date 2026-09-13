class Game {
    public gfx: Gfx
    public puzzlesGroups: Array<Array<Puzzle>>
    public puzzles: Array<Puzzle>
    public activePuzzle: Puzzle | null
    public state: GameState = GameState.Initializing
    public paused: boolean = false
    public nextPuzzleGroup: number = 0

    public player_uid: string
    public player_name: string

    public transitionState: TransitionState = TransitionState.Finished
    public transitionMap = [
        [ TransitionState.EnteringPuzzle, TransitionState.EnteringPuzzle2 ],
        [ TransitionState.EnteringPuzzle2, TransitionState.PuzzleActive ],
        [ TransitionState.LeavingPuzzle, TransitionState.UpdateMainScreen ],
        [ TransitionState.UpdateMainScreen, TransitionState.MainScreen  ],
        [ TransitionState.ResettingPuzzle, TransitionState.EnteringPuzzle2 ],
        [ TransitionState.PeekPuzzle, TransitionState.PeekPuzzleReturn ],
        [ TransitionState.EnteringWinScreen, TransitionState.WinScreen ],
        [ TransitionState.SwitchingPuzzleGroup, TransitionState.SwitchingPuzzleGroup2 ],
        [ TransitionState.SwitchingPuzzleGroup2, TransitionState.UpdateMainScreen ],
        [ TransitionState.PopupMessageShow, TransitionState.PopupMessageFinishing ],
        [ TransitionState.PopupMessageFinishing, TransitionState.PopupMessageFinished ],
    ]

    public puzzleUnlocksPending: number = 0
    private popupMessages: Array<string> = []

    constructor() {
        // #fca, #f84, #02f / #79f #028
        // #0f0, #ff0, #0ff, #f60
        // #f0f, #f65, #4fb, #fe0
        // #163, #4ea, #f0f, #fcf
        this.activePuzzle = null
        this.puzzlesGroups = [
            [
                new Puzzle("n1",     0,    0,   PUZZLE1, [ "#0ff", "#0ff", "#04f", "#04f" ], 1, 1, 0, 0.99, "Sort the blocks by selecting two of them to swap.<br/>The ones with the diamond shape are locked."), // first bars
                new Puzzle("n2",   200,    0,   PUZZLE2, [ "#ff0", "#0f0", "#f00", "#00f" ], 1, 1, 0, 0.75, "Make sure the blocks create a gradient in all directions."), // first squares
                new Puzzle("n2a",  200,  200,   PUZZLE2, [ "#604", "#e00", "#0af", "#fae" ], 2, 2, 90),
                new Puzzle("n2b",    0,  200,   PUZZLE2, [ "#631", "#ea4", "#0df", "#cff" ], 2, 2, 90),
                new Puzzle("n2c",    0,  400,   PUZZLE2, [ "#fad", "#f4b", "#0fd", "#087" ], 2, 2, 90),
                new Puzzle("n4",   160,  420,   PUZZLE4, [ "#ff0", "#f0f", "#0ff", "#60f" ], 1, 1, 90), // first paralellograms
                new Puzzle("n4a",  400,  400,   PUZZLE4, [ "#604", "#e00", "#0af", "#fae" ], 2, 1), // first paralellograms
                new Puzzle("n4b",  400,  215,   PUZZLE4, [ "#ff0", "#f0f", "#0ff", "#60f" ], 4, 1), // first paralellograms

                new Puzzle("n3",   400,   15,   PUZZLE3, [ "#f0f", "#80f", "#ff0", "#f80" ], 1, 1), // first triangles
                new Puzzle("n3a",  520,   15,   PUZZLE3, [ "#ff0", "#f80", "#f0f", "#80f" ], 2, 1), // first triangles
                new Puzzle("n3b",  500, -200,   PUZZLE3, [ "#604", "#e00", "#0af", "#fae" ], 4, 1, 90), // first triangles

                new Puzzle("n6",   340, -200,   PUZZLE6, [ "#f0f", "#f60", "#60f", "#ff0" ], 1, 1), // diamonds and triangles
                new Puzzle("n6a",  170, -200,   PUZZLE6, [ "#631", "#ea4", "#0df", "#cff" ], 2, 1, 90), // diamonds and triangles
                new Puzzle("n6b",    0, -200,   PUZZLE6, [ "#604", "#e00", "#0af", "#fae" ], 4, 1), // diamonds and triangles
            ],
            [
                new Puzzle("n7",  0, 0, PUZZLE7, [ "#fff", "#fff", "#f0f", "#0ff" ], 1, 1), // j-bird lite


                new Puzzle("x6",   0,  200,   PUZZLE2, [ "#be0", "#ff0", "#f5a", "#f60" ], 4, 4),
                new Puzzle("x3",   200,  200,   PUZZLE2, [ "#f0f", "#f65", "#4fb", "#fe0" ], 4, 4),

                new Puzzle("x1",   0,  400,   PUZZLE2, [ "#fca", "#f84", "#79f", "#028" ], 4, 4),
                new Puzzle("x4",   200, 400,   PUZZLE2, [ "#163", "#4ea", "#f0f", "#fcf" ], 4, 4),

                new Puzzle("x5",   0,  600,   PUZZLE2, [ "#7ff", "#088", "#79f", "#028" ], 4, 4),
                new Puzzle("x8",   200,600,   PUZZLE2, [ "#f80", "#ff0", "#888", "#fff" ], 4, 4),

                new Puzzle("x7",   0,  800,   PUZZLE2, [ "#f80", "#f88", "#08f", "#88f" ], 4, 4),

                new Puzzle("n10a",   200,  800,   PUZZLE10, [ "#f0f", "#f65", "#4fb", "#fe0" ], 1, 1, 15),
                new Puzzle("n10b",   400,  800,   PUZZLE10, [ "#f80", "#f88", "#08f", "#88f" ], 2, 2, 15),

                new Puzzle("n11a",   200,  1100,   PUZZLE11, [ "#f80", "#ff0", "#888", "#fff" ], 1, 1, 18.435),
                new Puzzle("n11b",   400,  1100,   PUZZLE11, [ "#f0f", "#f65", "#4fb", "#fe0" ], 2, 2),

                new Puzzle("n5b",  -100,   1100, PUZZLE5, [ "#f80", "#ff0", "#888", "#fff" ], 4, 4, 90), // diamonds tiled cubes
            ],
            [
                new Puzzle("n5",  0,   0, PUZZLE5, [ "#ff0", "#f0f", "#f60", "#60f" ], 1, 1), // diamonds tiled cubes
                new Puzzle("n8",  400, 0,   PUZZLE8, [ "#f0f", "#60f", "#f60", "#ff0" ], 1, 1), // hexagons-pentagons
                new Puzzle("n9a",  200, 400,   PUZZLE9, [ "#f0f", "#60f", "#f60", "#ff0" ], 1, 1), // hexagons-pentagons
            ]
        ]
        this.player_uid = localStateGet("pu", getBigRandomNumber())
        this.player_name = localStateGet("pn", getNewPlayerName())

        this.puzzles = this.puzzlesGroups[0]
        this.puzzlesGroups[0][0].unlock()
        this.puzzlesGroups[1][0].unlock()
        this.puzzlesGroups[2][0].unlock()

        this.gfx = new Gfx()
        this.gfx.render()

        // to reset the zoom and everything
        this.setPuzzleGroup(0)
        // this.exitPuzzle()

        this.savePlayerPreferences()
    }

    unlockNextPuzzleIfNeeded() {
        // the puzzle unlocking is happening during the transition to the main
        // screen after a successful first solve of a puzzle. if the player
        // exits during the win screen (or any other bug happnes), the unlock
        // doesn't happen and we might end up with only solved puzzles and no
        // way to proceed. this function is to resolve this issue.

        // find the first puzzle that is unlocked and not solved, if it exists, we're good
        for (let p of this.puzzles) {
            if (!p.locked && p.state != PuzzleState.StoppedFinished) {
                return
            }
        }

        this.puzzleUnlocksPending += 1
    }

    savePlayerPreferences() {
        localStateSet("pu", this.player_uid)
        localStateSet("pn", this.player_name)
    }

    setPuzzleGroup(n: number) {
        if (this.isTransitionInProgress()) {
            return
        }
        this.nextPuzzleGroup = n
        this.transitionStart(TransitionState.SwitchingPuzzleGroup)
    }

    cheatUnlockAllPuzzles() {
        if (IS_PROD_BUILD) {
            return
        }
        for (let p of this.puzzles) {
            p.locked = false
            p.setActive(false, true)
        }
    }

    cheatSolveAllPuzzles() {
        if (IS_PROD_BUILD) {
            return
        }
        for (let p of this.puzzles) {
            p.setActive(false, true)
            p.cheatSolve()
            p.updateElementPositions()
            p.updatePieceVisuals()
        }
    }

    selectPuzzle(puzzle: Puzzle | null) {
        for (let p of this.puzzles) {
            p.setActive(p == puzzle, !puzzle || p == puzzle)
        }

        this.activePuzzle = puzzle

        if (puzzle) {
            this.transitionStart(TransitionState.EnteringPuzzle)
        }
    }

    zoomToUnlockedPuzzles() {
        // first puzzle must be around 0,0 to work properly
        let left = 0
        let top = 0
        let right = 0
        let bottom = 0

        for (let p of this.puzzles) {
            if (!p.locked) {
                left = Math.min(left, p.left)
                top = Math.min(top, p.top)
                right = Math.max(right, p.left + p.width)
                bottom = Math.max(bottom, p.top + p.height)
            }
        }

        // the 30 px border is to have some zoom on selecting the first puzzle - otherwise it looks odd...
        this.gfx.targetViewBox = [left - 30, top - 30, right + 30, bottom + 30]
    }

    transitionStart(state: TransitionState) {
        let time = 1000

        this.transitionState = state

        switch (state) {
            case TransitionState.EnteringPuzzle:
                _background.style.opacity = "0.1"
                _puzzleMenuButton.style.display = "block"
                _mainMenu.style.opacity = "0"
                // @ts-ignore - "possibly null"
                _game.gfx.targetViewBox = [this.activePuzzle.left, this.activePuzzle.top, this.activePuzzle.left + this.activePuzzle.width, this.activePuzzle.top + this.activePuzzle.height]
            break

            case TransitionState.EnteringPuzzle2:
                _puzzleMenuButton.style.opacity = "1"
            break

            case TransitionState.PuzzleActive:
                _hint.style.opacity = "1"
                _mainMenu.style.display = "none"
                this.state = GameState.PuzzleActive
            break

            case TransitionState.ResettingPuzzle:
                // @ts-ignore - "possibly null"
                this.activePuzzle.newPlayerSession()

                // @ts-ignore - "possibly null"
                this.activePuzzle.shuffleWithVisuals()
            break

            case TransitionState.LeavingPuzzle:
                this.selectPuzzle(null)
                this.zoomToUnlockedPuzzles()
                _winMenu.style.opacity = "0"
                _hint.style.opacity = "0"
                _puzzleMenuButton.style.opacity = "0"
                _mainMenu.style.display = "block"
                if (this.puzzleUnlocksPending == 0) {
                    time = 2000
                }
            break

            case TransitionState.SwitchingPuzzleGroup:
                _mainMenu.style.opacity = "0"
                for (let p of this.puzzles) {
                    // this will set opacity to 0, fading them out
                    p.setActive(false, false)
                }
            break;

            case TransitionState.SwitchingPuzzleGroup2:
                _mainMenu.style.display = "block"
                document.body.style.background = PUZZLE_GROUP_COLORS[this.nextPuzzleGroup]
                ; (_background.children[0] as SVGPathElement).style.fill = PUZZLE_GROUP_COLORS[this.nextPuzzleGroup]

                // hide them, making them not clickable
                for (let p of this.puzzles) {
                    p.svg_dom.style.display = "none"
                }

                this.puzzles = this.puzzlesGroups[this.nextPuzzleGroup]
                
                // making them clickable again, still not faded in
                for (let p of this.puzzles) {
                    p.svg_dom.style.display = "block"
                }
                time = 100
            break

            case TransitionState.UpdateMainScreen:
                this.unlockNextPuzzleIfNeeded()

                // unlock the next puzzle(s)
                if (this.puzzleUnlocksPending == 0) {
                    time = 0
                }
                else {
                    // this will just go over all the puzzles once and tries
                    // to unlock enough of them. if it cannot be done
                    // (eg. because the player finished the last puzzle) then
                    // it will just reset the count
                    for (let p of this.puzzles) {
                        if (p.locked) {
                            p.unlock()
                            this.puzzleUnlocksPending -= 1
                        }
                        if (this.puzzleUnlocksPending == 0) {
                            break
                        }
                    }

                    // always set it to zero, don't take the unlocking over a
                    // chapter change for example.
                    this.puzzleUnlocksPending = 0
                }
                this.selectPuzzle(null)
                this.zoomToUnlockedPuzzles()
            break

            case TransitionState.MainScreen:
                // make sure they are not clickable
                _winMenu.style.display = "none"
                _puzzleMenuButton.style.display = "none"
                _mainMenu.style.opacity = "1"
                _background.style.opacity = "1"
                this.state = GameState.MainScreen

                let all_solved_in_this_chapter = true
                for (let p of this.puzzles) {
                    if (p.state != PuzzleState.StoppedFinished) {
                        all_solved_in_this_chapter = false
                        break
                    }
                }

                let max_stars = 0
                let collected_stars = 0
                let total_solved = 0
                let total_puzzles = 0
                for (let i=0; i<this.puzzlesGroups.length; i++) {
                    for (let p of this.puzzlesGroups[i]) {
                        if (p.state == PuzzleState.StoppedFinished) {
                            total_solved += 1
                            max_stars += 3
                            collected_stars += p.playerState[PlayerStateIndex.StarsReceived]
                        }
                        total_puzzles += 1
                    }
                }

                // _chapter1Button.style.display = ""
                _chapter2Button.style.display = (total_solved >= CHAPTER_2_UNLOCK_AFTER) ? "" : "none"
                _chapter3Button.style.display = (total_solved >= CHAPTER_3_UNLOCK_AFTER) ? "" : "none"
                _starStatsBox.innerHTML = "Stars: " + collected_stars + "/" + max_stars

                clog(`total_puzzles = ${total_puzzles}, total_solved = ${total_solved}, all_solved_in_this_chapter=${all_solved_in_this_chapter}`)

                if (total_puzzles == total_solved) {
                        this.popupMessages.push('Thank you for playing!')
                }
                else {
                    // BUG: this triggers every time the change happens
                    if (total_solved == CHAPTER_2_UNLOCK_AFTER || total_solved == CHAPTER_3_UNLOCK_AFTER) {
                        this.popupMessages.push('A new Chapter is available')
                    }

                    if (all_solved_in_this_chapter) {
                        this.popupMessages.push('All puzzles are solved in this Chapter.')
                    }
                }

                if (this.popupMessages.length > 0) {
                    _popupMessageBox.style.display = "block"
                    this.transitionStart(TransitionState.PopupMessageShow)

                    // don't let the transition proceed
                    return
                }
            break

            case TransitionState.PopupMessageShow:
                if (this.popupMessages.length > 0) {
                    _popupMessageBox.innerHTML = this.popupMessages.shift()
                    _popupMessageBox.style.opacity = "1"
                }
                time = 5000
            break

            case TransitionState.PopupMessageFinishing:
                if (this.popupMessages.length > 0) {
                    this.transitionStart(TransitionState.PopupMessageShow)

                    // don't let the transition proceed
                    return
                }
                _popupMessageBox.style.opacity = "0"
            break

            case TransitionState.PopupMessageFinished:
                _popupMessageBox.style.display = "none"
            break


            case TransitionState.PeekPuzzle:
                this.paused = true
                // @ts-ignore - "possibly null"
                this.activePuzzle.peekOn()
                time = 3000
            break

            case TransitionState.PeekPuzzleReturn:
                this.paused = false
                // @ts-ignore - "possibly null"
                this.activePuzzle.peekOff()
            break

            case TransitionState.EnteringWinScreen:
                _winMenu.style.opacity = "0"
                _winMenu.style.display = "block"
                _leaderboardBox.style.display = net_is_connected() ? "block" : "none"

                // don't show the leaderboard for the tutorial puzzles
                if (this.activePuzzle && (this.activePuzzle.puzzleUid == "n1" || this.activePuzzle.puzzleUid == "n2")) {
                    _leaderboardBox.style.display = "none"
                }

                _leaderboardSubmitBox.style.display = "block" 
            break

            case TransitionState.WinScreen:
                _winMenu.style.opacity = "1"
            break
        }

        window.setTimeout(this.transitionProgress.bind(this), time)
    }

    transitionProgress() {
        for (let t of this.transitionMap) {
            if (t[0] == this.transitionState) {
                this.transitionStart(t[1])
                return
            }
        }
        this.transitionState = TransitionState.Finished
    }

    isTransitionInProgress() {
        return this.transitionState != TransitionState.Finished
    }

    exitPuzzle() {
        this.hidePuzzleMenu()
        this.transitionStart(TransitionState.LeavingPuzzle)
    }

    peekPuzzle() {
        if (this.isTransitionInProgress()) {
            return
        }
        this.hidePuzzleMenu()
        this.transitionStart(TransitionState.PeekPuzzle)
    }

    resetPuzzle() {
        this.hidePuzzleMenu()
        this.transitionStart(TransitionState.ResettingPuzzle)
    }

    showPuzzleMenu() {
        _puzzleMenu.style.display = "block"
    }

    hidePuzzleMenu() {
        _puzzleMenu.style.display = "none"
    }

    updateWinScreen() {
        if (this.activePuzzle) {
            // @ts-ignore - "possibly null"
            document.getElementById("p1").innerHTML = `Total steps taken: ${this.activePuzzle.playerState[PlayerStateIndex.StepsTaken]}<br/>Minimum steps: ${this.activePuzzle.minStepsRequired}<br/><br/>${STAR_TEXTS[this.activePuzzle.playerState[PlayerStateIndex.StarsReceived] - 1]}<br/><br/>`
            // @ts-ignore - "possibly null"
            document.getElementById("p2").innerHTML = leaderboard_get_as_html(this.activePuzzle.puzzleUid)
            // @ts-ignore - "possibly null"
            document.getElementById("p3").innerHTML = _game.player_name
        }
    }

    submitResultToLeaderboard(reactionIndex: number) {
        _leaderboardSubmitBox.style.display = "none"

        // @ts-ignore - "possibly null"
        net_send_participant_data([ this.player_uid, this.player_name ], [ _game.player_uid, reactionIndex, this.activePuzzle.puzzleUid, this.activePuzzle.playerState, Date.now()])

        // win screen will be updated when the new state comes in
        // this.updateWinScreen()
    }

    changePlayerName() {
        let a = window.prompt("New name (a-z, A-Z, 0-9, space):", this.player_name)
        // @ts-ignore - "string | null"
        this.player_name = isValidPlayerName(a) ? a : getNewPlayerName()
        this.savePlayerPreferences()
        this.updateWinScreen()
    }
}
