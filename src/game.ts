class Game {
    public gfx: Gfx
    public puzzles: Array<Puzzle>
    public state: GameState = GameState.Initializing

    constructor() {
        this.puzzles = [
            new Puzzle(0,   0,   PUZZLE1),
            new Puzzle(200, 0,   PUZZLE2),
            new Puzzle(0,   200, PUZZLE3),
            new Puzzle(200, 200, PUZZLE4),
        ]
        this.gfx = new Gfx()
        this.gfx.render()
    }

    start() {}

    selectPuzzle(puzzle: Puzzle | null) {
        for (let p of this.puzzles) {
            p.setActive(p == puzzle, !puzzle || p == puzzle)
        }
        this.state = GameState.PuzzleActive
        if (puzzle) {
            var z = Math.min((window.innerWidth * 0.66) / puzzle.width, (window.innerHeight * 0.66) / puzzle.height)
            _game.gfx.setTarget(puzzle.left + puzzle.width/2, puzzle.top + puzzle.height/2, z)
            window.setTimeout(this.transitionPuzzleEnter1.bind(this), 1000)
            window.setTimeout(this.transitionPuzzleEnter2.bind(this), 2000)
        }
    }

    transitionPuzzleEnter1() {
        _puzzleMenuButton.style.opacity = "1"
    }

    transitionPuzzleEnter2() {
        _hint.style.opacity = "1"
    }

    exitPuzzle() {
        this.selectPuzzle(null)
        this.state = GameState.MainScreen
        this.gfx.setTarget(250, 250, 1.0)
        _hint.style.opacity = "0"
        _puzzleMenuButton.style.opacity = "0"
        _puzzleMenu.style.display = "none"
        // _puzzleMenu.style.opacity = "0"
    }
}
