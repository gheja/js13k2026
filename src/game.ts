class Game {
    public gfx: Gfx
    public puzzles: Array<Puzzle>
    public activePuzzle: Puzzle | null
    public state: GameState = GameState.Initializing
    public paused: boolean = false

    public transitionState: TransitionState = TransitionState.Finished
    public transitionMap = [
        [ TransitionState.EnteringPuzzle, TransitionState.EnteringPuzzle2 ],
        [ TransitionState.EnteringPuzzle2, TransitionState.PuzzleActive ],
        [ TransitionState.LeavingPuzzle, TransitionState.UpdateMainScreen ],
        [ TransitionState.UpdateMainScreen, TransitionState.MainScreen  ],
        [ TransitionState.ResettingPuzzle, TransitionState.EnteringPuzzle2 ],
        [ TransitionState.PeekPuzzle, TransitionState.PeekPuzzleReturn ],
        // [ TransitionState.WinScreen, TransitionState.LeavingPuzzle ]
    ]

    public puzzleUnlocksPending: number = 0

    constructor() {
        this.activePuzzle = null
        this.puzzles = [
            new Puzzle(0,   0,   PUZZLE1),
            new Puzzle(200, 0,   PUZZLE2),
            new Puzzle(0,   200, PUZZLE3),
            new Puzzle(200, 200, PUZZLE4),
        ]
        this.puzzles[0].locked = false

        this.gfx = new Gfx()
        this.gfx.render()

        // to reset the zoom and everything
        this.exitPuzzle()
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
                right = Math.max(left, p.left + p.width)
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
                // @ts-ignore - "possibly null"
                _game.gfx.setViewTargetBox(this.activePuzzle.left, this.activePuzzle.top, this.activePuzzle.left + this.activePuzzle.width, this.activePuzzle.top + this.activePuzzle.height)
            break

            case TransitionState.EnteringPuzzle2:
                _puzzleMenuButton.style.opacity = "1"
            break

            case TransitionState.PuzzleActive:
                _hint.style.opacity = "1"
                this.state = GameState.PuzzleActive
            break

            case TransitionState.ResettingPuzzle:
                // @ts-ignore - "possibly null"
                this.activePuzzle.shuffle()
            break

            case TransitionState.LeavingPuzzle:
                this.selectPuzzle(null)
                this.zoomToUnlockedPuzzles()
                _hint.style.opacity = "0"
                _puzzleMenuButton.style.opacity = "0"
                _winMenu.style.display = "none"
                if (this.puzzleUnlocksPending == 0) {
                    time = 2000
                }
            break

            case TransitionState.UpdateMainScreen:
                // unlock the next puzzle(s)
                if (this.puzzleUnlocksPending == 0) {
                    time = 0
                }
                else {
                    console.log("unlocking...")
                    for (let p of this.puzzles) {
                        if (p.locked) {
                            p.locked = false
                            this.puzzleUnlocksPending -= 1
                        }
                        if (this.puzzleUnlocksPending == 0) {
                            break
                        }
                    }
                    this.selectPuzzle(null)
                    this.zoomToUnlockedPuzzles()
                }
            break

            case TransitionState.MainScreen:
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

            case TransitionState.WinScreen:
                _winMenu.style.display = "block"
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
