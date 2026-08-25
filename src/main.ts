let _game: Game
let _container: HTMLDivElement
let _hint: HTMLDivElement
let _puzzleMenuButton: HTMLDivElement
let _puzzleMenu: HTMLDivElement // this is an overlay that is handled by changing "display", not "opacity"

function init() {
    _container = document.getElementById("b") as HTMLDivElement
    _hint = document.getElementById("h") as HTMLDivElement
    _puzzleMenuButton = document.getElementById("m") as HTMLDivElement
    _puzzleMenu = document.getElementById("n") as HTMLDivElement
    
    _game = new Game()
    // game.init()
    _game.start()
    zoom_reset()

    // @ts-ignore - "possibly null"
    document.getElementById("a1").addEventListener("click", _game.resetPuzzle.bind(_game))
    // @ts-ignore - "possibly null"
    document.getElementById("leave").addEventListener("click", zoom_reset)
    // @ts-ignore - "possibly null"
    document.getElementById("back").addEventListener("click", hidePuzzleMenu)
    _puzzleMenuButton.addEventListener("click", showPuzzleMenu)
}

window.addEventListener("load", init)

function showPuzzleMenu() {
    _puzzleMenu.style.display = "block"
    // _puzzleMenu.style.opacity = "1"
}

function hidePuzzleMenu() {
    _puzzleMenu.style.display = "none"
}

function zoom_here(obj: HTMLElement) {
    _game.gfx.setTarget(obj.offsetLeft + obj.offsetWidth/2, obj.offsetTop + obj.offsetHeight/2, 3.0)
}
function zoom_reset() {
    _game.exitPuzzle()
}
