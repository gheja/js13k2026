let _backgroundPaths: Array<SVGPathElement> = []

function backgroundRun() {
    // window.setInterval(backgroundTick, 200)
    window.setInterval(backgroundTick, 300)
}

function backgroundTick() {
    let x = Math.floor(Math.random() * 1920 / 102) * 102
    let y = Math.floor(Math.random() * 1080 / 102) * 102
    let r = 0
    let g = 64 + Math.random() * 16
    let b = 124 + Math.random() * 32
    let a = Math.random() * 0.2 + 0.2 // 0.2 .. 0.4

    // IDEA: make this move with the view, parallax
    // NOTE: this whole thing would be much easier (and probably smaller) with direct SVG as text

    let path = document.createElementNS("http://www.w3.org/2000/svg","path");  
    path.setAttribute("d", "m 27 0 h 46 c 15 0 27 12 27 27 v 46 c 0 15 -12 27 -27 27 H 27 C 12 100 0 88 0 73 V 27 C 0 12 12 0 27 0 Z");
    path.setAttribute("fill", `rgba(${r},${g},${b},${a})`)
    path.setAttribute("transform", `translate(${x},${y})`)
    path.setAttribute("opacity", "0");
    // path.setAttribute("mix-blend-mode", "screen")
        
    let anim = document.createElementNS("http://www.w3.org/2000/svg", "animate")
    anim.setAttribute("attributeName", "opacity")
    anim.setAttribute("values", "0;1;0")
    anim.setAttribute("keyTimes", "0;0.2;1")
    anim.setAttribute("dur", "30s")
    anim.setAttribute("fill", "freeze")
    anim.setAttribute("begin", "indefinite");

    path.appendChild(anim)

    _background.appendChild(path)
    anim.beginElement()

    _backgroundPaths.push(path)

    // count = duration / interval
    //   30000 ms / 200 ms = 150
    //   30000 ms / 300 ms = 100
    while (_backgroundPaths.length > 100) {
        _background.removeChild(_backgroundPaths[0])
        _backgroundPaths.shift()
    }
}
