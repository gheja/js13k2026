let game: Game

function init() {
    game = new Game()
    // game.init()
    game.start()
    zoom_reset()
}

window.addEventListener("load", init)

function zoom_here(obj: HTMLDivElement) {
    game.gfx.setTarget(obj.offsetLeft + obj.offsetWidth/2, obj.offsetTop + obj.offsetHeight/2, 3.0)
}
function zoom_reset() {
    game.gfx.setTarget(250, 250, 1.0)
}