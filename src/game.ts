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
    ]

    constructor() {
        this.activePuzzle = null
        this.puzzles = [
            new Puzzle(0,   0,   PUZZLE1),
            new Puzzle(200, 0,   PUZZLE2),
            new Puzzle(0,   200, PUZZLE3),
            new Puzzle(200, 200, PUZZLE4),
        ]
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

    transitionStart(state: TransitionState) {
        let time = 1000

        this.transitionState = state

        switch (state) {
            case TransitionState.EnteringPuzzle:
                // @ts-ignore - "possibly null"
                var z = Math.min((window.innerWidth * 0.66) / this.activePuzzle.width, (window.innerHeight * 0.66) / this.activePuzzle.height)

                // @ts-ignore - "possibly null"
                _game.gfx.setViewTarget(this.activePuzzle.left + this.activePuzzle.width/2, this.activePuzzle.top + this.activePuzzle.height/2, z)
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
                this.gfx.setViewTarget(250, 250, 1.0)
                _hint.style.opacity = "0"
                _puzzleMenuButton.style.opacity = "0"
            break

            case TransitionState.UpdateMainScreen:
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
