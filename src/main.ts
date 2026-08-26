let _game: Game
let _container: HTMLDivElement
let _hint: HTMLDivElement
let _puzzleMenuButton: HTMLDivElement
let _puzzleMenu: HTMLDivElement // this is an overlay that is handled by changing "display", not "opacity"
let _winMenu: HTMLDivElement
let _background: SvgInHtml

function init() {
    _container = document.getElementById("b") as HTMLDivElement
    _hint = document.getElementById("h") as HTMLDivElement
    _puzzleMenuButton = document.getElementById("m") as HTMLDivElement
    _puzzleMenu = document.getElementById("n") as HTMLDivElement
    _winMenu = document.getElementById("w") as HTMLDivElement
    _background = document.getElementById("bg") as SvgInHtml
    
    _game = new Game()

    // @ts-ignore - "possibly null"
    document.getElementById("a1").addEventListener("click", _game.resetPuzzle.bind(_game))
    // @ts-ignore - "possibly null"
    document.getElementById("a2").addEventListener("click", _game.exitPuzzle.bind(_game))
    // @ts-ignore - "possibly null"
    document.getElementById("a9").addEventListener("click", _game.exitPuzzle.bind(_game))
    // @ts-ignore - "possibly null"
    document.getElementById("a3").addEventListener("click", _game.peekPuzzle.bind(_game))
    // @ts-ignore - "possibly null"
    document.getElementById("a4").addEventListener("click", _game.hidePuzzleMenu.bind(_game))
    _puzzleMenuButton.addEventListener("click", _game.showPuzzleMenu)

    backgroundRun()
}

window.addEventListener("load", init)
