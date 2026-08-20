class Game {
    public gfx: Gfx
    public puzzles: Array<Puzzle>

    constructor() {
        this.gfx = new Gfx()
    }

    start() {
        this.gfx.render()
        this.puzzles = []
        this.puzzles.push(new Puzzle(1, 2))
        this.puzzles.push(new Puzzle(1, 2))
    }
}
