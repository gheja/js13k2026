let _backgroundPaths: Array<SVGPathElement> = []

function backgroundRun() {
    window.setInterval(backgroundTick, 300)
}

function backgroundTick() {
    let x = Math.floor(Math.random() * 1080 / 72) * 72
    let y = Math.floor(Math.random() * 1080 / 72) * 72
    let a = Math.random() * 0.1 + 0.1 // 0.1 .. 0.2

    // IDEA: make this move with the view, parallax
    // NOTE: this whole thing would be much easier (and probably smaller) with direct SVG as text

    let path = document.createElementNS("http://www.w3.org/2000/svg","path");  
    path.setAttribute("d", "M 19 0 H 51 C 62 0 70 8 70 19 V 51 C 70 62 62 70 51 70 H 19 C 8 70 0 62 0 51 V 19 C 0 8 8 0 19 0 Z");
    path.style.mixBlendMode = "color-dodge"
    path.setAttribute("fill", `rgba(255,255,255,${a})`)
    path.setAttribute("transform", `translate(${x},${y})`)
    path.setAttribute("opacity", "0");
        
    let anim = document.createElementNS("http://www.w3.org/2000/svg", "animate")
    anim.setAttribute("attributeName", "opacity")
    anim.setAttribute("values", "0;1;0")
    anim.setAttribute("keyTimes", "0;0.2;1")
    anim.setAttribute("dur", "30s")
    anim.setAttribute("fill", "freeze")
    anim.setAttribute("begin", "indefinite")

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
