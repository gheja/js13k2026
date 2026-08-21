class Puzzle {
    public svg_dom: SvgInHtml
    public left: number
    public top: number
    public width: number = 300
    public height: number = 300
    private active: boolean = false

    private pieces: Array<any> = []
    private slots: Array<any> = []

    constructor(x: number, y: number) {
        this.left = x
        this.top = y

        let a = [
            [ ShapeIndex.Triangle1, 30, 30, 0 ],
            [ ShapeIndex.Triangle1, 45, 30, 180 ],
            [ ShapeIndex.Triangle1, 60, 30, 0 ],
            [ ShapeIndex.Triangle1, 75, 30, 180 ],
            [ ShapeIndex.Triangle1, 90, 30, 0 ],
        ]

        let piece_index = 0
        for (let i=0; i<a.length; i++) {
            let b = a[i]
            this.slots.push({shape_index: b[0], x: b[1], y: b[2], r: b[3], piece_index: piece_index, correct_piece_index: piece_index, locked: false})
            this.pieces.push({shape_index: b[0], color: '#ff0', dom: null})
            piece_index += 1
        }

        this.pieces[0].color = '#ff0'
        this.pieces[1].color = '#fb4'
        this.pieces[2].color = '#f88'
        this.pieces[3].color = '#f4b'
        this.pieces[4].color = '#f0f'

        let path_data = ''

        for (let i=0; i<this.pieces.length; i++) {
            let b = this.pieces[i]

            // TODO: stroke is not correct, the last-first node is cut off
            // TODO: drop shadow is cut off
            // TODO: fix the tiny gaps between them
            path_data += `<path id="e${i}" style="fill:${b.color}" d="${SHAPES[b.shape_index]}"/>`
        }

        let svg_data = `
<svg width="300" height="300" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" style="left: ${x}px; top: ${y}px">
  <filter id="shadow" color-interpolation-filters="sRGB">
    <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
  </filter>
  <g id="layer1"></g>
  <g id="layer2">${path_data}</g>
  <g id="layer3" filter="url(#shadow)"></g>
</svg>
        `;

        this.svg_dom = (new DOMParser()).parseFromString(svg_data, "image/svg+xml").documentElement as SvgInHtml
        document.getElementById("b").appendChild(this.svg_dom)

        for (let i=0; i<this.pieces.length; i++) {
            this.pieces[i].dom = this.svg_dom.getElementById("e" + i)
        }

        this.svg_dom.addEventListener("mousemove", this.onMouseMove.bind(this))
        this.svg_dom.addEventListener("click", this.onClick.bind(this))

        this.swapPiecesInSlots(1, 3)

        this.updateElementPositions()

    }

    swapPiecesInSlots(a: number, b: number) {
        let n = this.slots[a].piece_index
        this.slots[a].piece_index = this.slots[b].piece_index
        this.slots[b].piece_index = n
    }

    updateElementPositions() {
        for (let slot of this.slots) {
            let el = this.pieces[slot.piece_index];
            (el.dom as SVGPathElement).setAttribute("transform", `translate(${slot.x}, ${slot.y}) rotate(${slot.r})`)
        }
    }

    setActive(value: boolean) {
        this.active = value
    }

    onClick(event: MouseEvent) {
        if (_game.state == GameState.Initializing) {
            return
        }
        else if (_game.state == GameState.MainScreen) {
            this.onClick2(event)
        }
    }

    onClick2(event: MouseEvent) {
        _game.selectPuzzle(this)
    }

    onMouseMove(event: MouseEvent) {
        if (!this.active) {
            return
        }

        if (_game.state == GameState.Initializing) {
            return
        }
        else if (_game.state == GameState.MainScreen) {
            // this.onMouseMove2(event)
            return
        }
        else if (_game.state == GameState.PuzzleActive) {
            this.onMouseMove3(event)
        }
    }

    onMouseMove3(event: MouseEvent) {
        var svg = this.svg_dom

        var point = svg.createSVGPoint()
        point.x = event.clientX
        point.y = event.clientY

        var layer1 = svg.getElementById("layer1")
        var layer2 = svg.getElementById("layer2")
        var layer3 = svg.getElementById("layer3")

        let selection_mode = 1
        
        // loop through all elements
        for (let obj of svg.querySelectorAll("path")) {
            var local_point = point.matrixTransform(obj.getScreenCTM().inverse())
            if (obj.isPointInFill(local_point)) {
                if (selection_mode == 1) {
                    if (obj.parentNode != layer3)
                    {
                        layer3.appendChild(obj)
                    }
                    obj.style.stroke = obj.style.fill
                    obj.style.strokeWidth = "4px"
                }
                else {
                    if (obj.parentNode != layer1)
                    {
                        layer1.appendChild(obj)
                    }
                    obj.style.stroke = "#111"
                    obj.style.strokeWidth = "8px"                
                }
            } else {
                if (obj.parentNode != layer2)
                {
                    layer2.appendChild(obj)
                }
                obj.style.stroke = "#0000"
                obj.style.strokeWidth = "0"
            }
        }
    }
/*
    use stroke="color" for highlight (it's over the fill, point test still completes, no shaking)

    svg.addEventListener("mousemove", function(event) {

*/
}