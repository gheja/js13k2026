class Game {
    public gfx: Gfx
    public puzzles: Array<Puzzle>
    public state: GameState = GameState.Initializing

    constructor() {
        this.gfx = new Gfx()
    }

    start() {
        this.gfx.render()
        this.puzzles = []
        this.puzzles.push(new Puzzle(0, 0))
        this.puzzles.push(new Puzzle(300, 300))
        this.puzzles.push(new Puzzle(700, 0))
    }

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
