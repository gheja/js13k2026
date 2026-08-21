class Puzzle {
    public svg_dom: SvgInHtml
    public left: number
    public top: number
    public width: number = 300
    public height: number = 300

    private pieces: Array<any> = []
    private slots: Array<any> = []

    private state: PuzzleState = PuzzleState.StoppedUnfinished
    private slotHovered: any
    private slotFirstPick: any

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

            // TODO: fix the tiny gaps between them
            path_data += `<path id="e${i}" style="fill:${b.color}" d="${SHAPES[b.shape_index]}"/>`
        }

        let svg_data = `
<svg width="300" height="300" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" style="left: ${x}px; top: ${y}px">
  <filter id="shadow" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
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

    swapPiecesInSlots2(slot1: any, slot2: any) {
        let n = slot1.piece_index
        slot1.piece_index = slot2.piece_index
        slot2.piece_index = n
    }

    swapPiecesInSlots(a: number, b: number) {
        this.swapPiecesInSlots2(this.slots[a], this.slots[b])
    }

    updateElementPositions() {
        for (let slot of this.slots) {
            let el = this.pieces[slot.piece_index];
            (el.dom as SVGPathElement).setAttribute("transform", `translate(${slot.x}, ${slot.y}) rotate(${slot.r})`)
        }
    }

    setActive(value: boolean) {
        if (this.state == PuzzleState.StoppedFinished)
        {
            return
        }

        if (value) {
            this.state = PuzzleState.PickFirstPiece
        }
        else {
            this.state = PuzzleState.StoppedUnfinished
        }

        // just to be sure it looks correct
        this.updateElementPositions()
        this.updatePieceVisuals()
    }

    onClick(event: MouseEvent) {
        if (_game.state == GameState.Initializing) {
            return
        }
        else if (_game.state == GameState.MainScreen) {
            this.onClick2(event)
        }
        else if (_game.state == GameState.PuzzleActive) {
            this.onClick3(event)
        }
    }

    onClick2(event: MouseEvent) {
        _game.selectPuzzle(this)
    }

    onClick3(event: MouseEvent) {
        if (this.slotHovered) {
            if (!this.slotFirstPick) {
                this.slotFirstPick = this.slotHovered
            }
            else if (this.slotFirstPick == this.slotHovered) { // unselect
                this.slotFirstPick = null
            }
            else {
                this.swapPiecesInSlots2(this.slotFirstPick, this.slotHovered)
                this.updateElementPositions()
                this.slotFirstPick = null
            }
        }
        else {
            // clear selections
            this.slotFirstPick = null
        }

        // clear the hovered slot, so visuals reset (at least until the first move)
        this.slotHovered = null
        this.updatePieceVisuals()
        this.checkWinCondition()
    }

    onMouseMove(event: MouseEvent) {
        if (this.state == PuzzleState.StoppedUnfinished || this.state == PuzzleState.StoppedFinished) {
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

        let selection_mode = (this.slotFirstPick != null ? 2 : 1)
        
        this.slotHovered = null

        // loop through all elements
        for (let obj of svg.querySelectorAll("path")) {
            var local_point = point.matrixTransform(obj.getScreenCTM().inverse())
            if (obj.isPointInFill(local_point)) {
                for (let slot of this.slots)
                {
                    if (this.pieces[slot.piece_index].dom == obj)
                    {
                        this.slotHovered = slot
                    }
                }
            }
        }

        this.updatePieceVisuals()
    }

    updatePieceVisuals() {
        let svg = this.svg_dom

        var layer1 = svg.getElementById("layer1")
        var layer2 = svg.getElementById("layer2")
        var layer3 = svg.getElementById("layer3")

        // loop through all elements
        for (let obj of svg.querySelectorAll("path")) {
            let hoveredPieceDom = this.slotHovered ? this.pieces[this.slotHovered.piece_index].dom : null
            let firstPickedPieceDom = this.slotFirstPick ? this.pieces[this.slotFirstPick.piece_index].dom : null

            if ((firstPickedPieceDom == null && hoveredPieceDom == obj) || (firstPickedPieceDom == obj)) {
                if (obj.parentNode != layer3)
                {
                    layer3.appendChild(obj)
                }
                obj.style.stroke = obj.style.fill
                obj.style.strokeWidth = "4px"
            }
            else if (hoveredPieceDom == obj) {
                if (obj.parentNode != layer1)
                {
                    layer1.appendChild(obj)
                }
                obj.style.stroke = "#111"
                obj.style.strokeWidth = "4px"
            }
            else {
                if (obj.parentNode != layer2)
                {
                    layer2.appendChild(obj)
                }
                obj.style.stroke = "#0000"
                obj.style.strokeWidth = "0"
            }
        }
    }

    checkWinCondition() {
        for (var slot of this.slots) {
            if (slot.piece_index != slot.correct_piece_index) {
                return
            }
        }

        if (!IS_PROD_BUILD) {
            console.log('won')
        }
        this.state = PuzzleState.StoppedFinished
    }
}