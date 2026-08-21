class Game {
    public gfx: Gfx
    public puzzles: Array<Puzzle>
    public state: GameState = GameState.Initializing

    constructor() {
        this.puzzles = [
            new Puzzle(0, 0, PUZZLE1),
            new Puzzle(300, 300, PUZZLE2),
            new Puzzle(700, 0, PUZZLE3),
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
            _game.gfx.setTarget(puzzle.left + puzzle.width/2, puzzle.top + puzzle.height/2, 3.0)
        }
    }

    exitPuzzle() {
        this.selectPuzzle(null)
        this.state = GameState.MainScreen
        this.gfx.setTarget(250, 250, 1.0)
    }
}
