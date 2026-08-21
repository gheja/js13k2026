let _game: Game
let _container: HTMLDivElement

function init() {
    _container = document.getElementById("b") as HTMLDivElement
    _game = new Game()
    // game.init()
    _game.start()
    zoom_reset()
    // @ts-ignore - "possibly null"
    document.getElementById("back").addEventListener("click", zoom_reset)
}

window.addEventListener("load", init)

function zoom_here(obj: HTMLElement) {
    _game.gfx.setTarget(obj.offsetLeft + obj.offsetWidth/2, obj.offsetTop + obj.offsetHeight/2, 3.0)
}
function zoom_reset() {
    _game.exitPuzzle()
}
