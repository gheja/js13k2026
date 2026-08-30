let _game: Game
let _container: HTMLDivElement
let _hint: HTMLDivElement
let _puzzleMenuButton: HTMLDivElement
let _puzzleMenu: HTMLDivElement // this is an overlay that is handled by changing "display", not "opacity"
let _winMenu: HTMLDivElement
let _background: SvgInHtml
let _mainMenu: HTMLDivElement
let _chapter1Button: HTMLDivElement
let _chapter2Button: HTMLDivElement
let _chapter3Button: HTMLDivElement
let _catPuzzleButton: HTMLDivElement

function init() {
    _container = document.getElementById("b") as HTMLDivElement
    _hint = document.getElementById("h") as HTMLDivElement
    _puzzleMenuButton = document.getElementById("m") as HTMLDivElement
    _puzzleMenu = document.getElementById("n") as HTMLDivElement
    _winMenu = document.getElementById("w") as HTMLDivElement
    _background = document.getElementById("bg") as SvgInHtml
    _mainMenu = document.getElementById("o") as HTMLDivElement
    _chapter1Button = document.getElementById("oa") as HTMLDivElement
    _chapter2Button = document.getElementById("ob") as HTMLDivElement
    _chapter3Button = document.getElementById("oc") as HTMLDivElement
    _catPuzzleButton = document.getElementById("od") as HTMLDivElement
    
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
    _chapter1Button.addEventListener("click", _game.setPuzzleGroup.bind(_game, 0))
    _chapter2Button.addEventListener("click", _game.setPuzzleGroup.bind(_game, 1))
    _chapter3Button.addEventListener("click", _game.setPuzzleGroup.bind(_game, 2))

    backgroundRun()
}

window.addEventListener("load", init)
