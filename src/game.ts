class Game {
    public gfx: Gfx
    public puzzlesGroups: Array<Array<Puzzle>>
    public puzzles: Array<Puzzle>
    public activePuzzle: Puzzle | null
    public state: GameState = GameState.Initializing
    public paused: boolean = false
    public nextPuzzleGroup: number = 0

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
    ]

    public puzzleUnlocksPending: number = 0

    constructor() {
        this.activePuzzle = null
        this.puzzlesGroups = [
            [
                new Puzzle("n1",     0,    0,   PUZZLE1, [ "#0ff", "#0ff", "#04f", "#04f" ], 1, 0, 0.99, "Sort the blocks by selecting two of them to swap.<br/>The ones with the diamond shape are locked."), // first bars
                new Puzzle("n2",   200,    0,   PUZZLE2, [ "#ff0", "#0f0", "#f00", "#00f" ], 1, 0, 0.75, "Make sure the blocks create a gradient in all directions."), // first squares
                new Puzzle("n2a",  200,  200,   PUZZLE2, [ "#604", "#e00", "#0af", "#fae" ], 2, 90),
                new Puzzle("n2b",    0,  200,   PUZZLE2, [ "#631", "#ea4", "#0df", "#cff" ], 4),
                new Puzzle("n2c",    0,  400,   PUZZLE2, [ "#fad", "#f4b", "#0fd", "#087" ], 4),
                new Puzzle("n4",   160,  420,   PUZZLE4, [ "#ff0", "#f0f", "#0ff", "#60f" ], 1, 90), // first paralellograms
                new Puzzle("n4a",  400,  400,   PUZZLE4, [ "#604", "#e00", "#0af", "#fae" ], 2), // first paralellograms
                new Puzzle("n4b",  400,  215,   PUZZLE4, [ "#ff0", "#f0f", "#0ff", "#60f" ], 4), // first paralellograms

                new Puzzle("n3",   400,   15,   PUZZLE3, [ "#f0f", "#80f", "#ff0", "#f80" ], 1), // first triangles
                new Puzzle("n3a",  520,   15,   PUZZLE3, [ "#80f", "#ff0", "#f80", "#f0f" ], 2), // first triangles
                new Puzzle("n3b",  500, -200,   PUZZLE3, [ "#604", "#e00", "#0af", "#fae" ], 4, 90), // first triangles

                new Puzzle("n6",   340, -200,   PUZZLE6, [ "#f0f", "#f60", "#60f", "#ff0" ], 1), // diamonds and triangles
                new Puzzle("n6a",  170, -200,   PUZZLE6, [ "#631", "#ea4", "#0df", "#cff" ], 2, 90), // diamonds and triangles
                new Puzzle("n6b",    0, -200,   PUZZLE6, [ "#604", "#e00", "#0af", "#fae" ], 4), // diamonds and triangles
            ],
            [
                new Puzzle("n7",  0, 0, PUZZLE7, [ "#fff", "#fff", "#f0f", "#0ff" ], 1), // j-bird lite
            ],
            [
                new Puzzle("n5",  0,   0, PUZZLE5, [ "#ff0", "#f0f", "#f60", "#60f" ], 1), // diamonds tiled cubes
                new Puzzle("n8",  400, 0,   PUZZLE8, [ "#f0f", "#60f", "#f60", "#ff0" ], 1), // hexagons-pentagons
            ]
        ]
        this.puzzles = this.puzzlesGroups[0]
        this.puzzlesGroups[0][0].unlock()
        this.puzzlesGroups[1][0].unlock()
        this.puzzlesGroups[2][0].unlock()

        this.gfx = new Gfx()
        this.gfx.render()

        // to reset the zoom and everything
        this.setPuzzleGroup(0)
        // this.exitPuzzle()
    }

    setPuzzleGroup(n: number) {
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
        this.gfx.setViewTargetBox(left - 30, top - 30, right + 30, bottom + 30)
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
                _game.gfx.setViewTargetBox(this.activePuzzle.left, this.activePuzzle.top, this.activePuzzle.left + this.activePuzzle.width, this.activePuzzle.top + this.activePuzzle.height)
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
                // unlock the next puzzle(s)
                if (this.puzzleUnlocksPending == 0) {
                    time = 0
                }
                else {
                    for (let p of this.puzzles) {
                        if (p.locked) {
                            p.unlock()
                            this.puzzleUnlocksPending -= 1
                        }
                        if (this.puzzleUnlocksPending == 0) {
                            break
                        }
                    }
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
                break
            }
        }
    }

    exitPuzzle() {
        this.hidePuzzleMenu()
        this.transitionStart(TransitionState.LeavingPuzzle)
    }

    peekPuzzle() {
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
}
