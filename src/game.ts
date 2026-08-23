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
            p.setActive(p == puzzle)
        }
        this.state = GameState.PuzzleActive
        if (puzzle) {
            var z = Math.min((window.innerWidth * 0.66) / puzzle.width, (window.innerHeight * 0.66) / puzzle.height)
            _game.gfx.setTarget(puzzle.left + puzzle.width/2, puzzle.top + puzzle.height/2, z)
            window.setTimeout(this.puzzleEnterTimeout.bind(this), 1500)
            _overlay.style.opacity = "1"
            _overlay.style.zIndex = "1000"
        }
    }

    puzzleEnterTimeout() {
        _hint.style.opacity = "1"
    }

    exitPuzzle() {
        this.selectPuzzle(null)
        this.state = GameState.MainScreen
        this.gfx.setTarget(250, 250, 1.0)
        _hint.style.opacity = "0"
        _overlay.style.opacity = "0"
        _overlay.style.zIndex = "0"
    }
}
