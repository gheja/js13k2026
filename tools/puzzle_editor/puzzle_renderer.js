"use strict"

var SHAPES = [
    'M 0,-13 -15,13 h 30 z',
    'M 0,-3 -2,0 0,3 2,0 Z',
    'M -13 -13 H 13 V 13 H -13 Z',
    'm -22.5 13 15 -26 30 0 -15 26 z',
    'M -50 -13 h 100 v 26 h -100 Z',
    'M 0 17.333 -30 -0 0 -17.333 30 -0 Z',
    'm 30 0 -15 26 -30 0 -15 -26 15 -26 30 0 z',
    'M -30 0 0 -17.35 30 0 15 26 h -30 z'
];  

var ShapeIndex = {
    Triangle1: 0,
    LockedIcon: 1,
    Square1: 2,
    Paralellogram1: 3,
    WideRectangle: 4,
    Diamond1: 5,
    Hexagon: 6,
    SquishedPentagon: 7,
    "0": "Triangle1",
    "1": "LockedIcon",
    "2": "Square1",
    "3": "Paralellogram1",
    "4": "WideRectangle",
    "5": "Diamond1",
    "6": "Hexagon",
    "7": "SquishedPentagon",
};  

var PuzzleDataIndex = {
    Uid: 0,
    Pieces: 1,
    Colors: 2,
    Hint: 3,
    StartingSolvedProgress: 4,
    "0": "Uid",
    "1": "Pieces",
    "2": "Colors",
    "3": "Hint",
    "4": "StartingSolvedProgress"
};

// ---

var _colors = [ "#f00", "#f80", "#ff0", "#8f0", "#0f0", "#0f8", "#0ff", "#08f", "#00f", "#80f", "#f0f", "#f08" ]

// ---

class PuzzleRenderer{
    left = 0
    top = 0
    slots = []
    pieces = []

    render(x, y, data) {
        this.slots = []
        this.pieces = []

        let _container = document.getElementById("preview")
        this.left = x
        this.top = y

        let min_x = 1000
        let min_y = 1000
        let max_x = 0
        let max_y = 0

        for (let b of data[PuzzleDataIndex.Pieces]) {
            min_x = Math.min(min_x, b[1])
            min_y = Math.min(min_y, b[2])
            max_x = Math.max(max_x, b[1])
            max_y = Math.max(max_y, b[2])
        }

        let piece_index = 0
        for (let i=0; i<data[PuzzleDataIndex.Pieces].length; i++) {
            let b = data[PuzzleDataIndex.Pieces][i]
            this.slots.push({shape_index: b[0], x: b[1], y: b[2], r: b[3], piece_index: piece_index, correct_piece_index: piece_index, locked: b[4]})
            this.pieces.push({shape_index: b[0], color: (_colors[i % _colors.length]) + "a", dom: null})
            piece_index += 1
        }

        let path_data = ''
        let locked_path_data = ''

        for (let i=0; i<this.pieces.length; i++) {
            let b = this.pieces[i]

            // TODO: fix the tiny gaps between them
            path_data += `<path id="e${i}" style="fill:${b.color}" d="${SHAPES[b.shape_index]}"/>`
        }

        // draw the locked icon
        for (let slot of this.slots) {
            if (slot.locked) {
                locked_path_data += `<path class="lock" style="fill:#000a" d="${SHAPES[ShapeIndex.LockedIcon]}" transform="translate(${slot.x}, ${slot.y})"/>`
            }
        }

        // trying to add a safe margin on the right and bottom side too
        this.width = max_x + min_x
        this.height = max_y + min_y

        let svg_data = `
    <svg width="800" height="800" viewBox="0 0 ${this.width} ${this.height}" version="1.1" xmlns="http://www.w3.org/2000/svg" style="left: ${x}px; top: ${y}px">
    <filter id="shadow" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
    <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
    </filter>
    <g id="layer1"></g>
    <g id="layer2">${path_data}</g>
    <g id="locks">${locked_path_data}</g>
    <g id="layer3" filter="url(#shadow)"></g>
    </svg>
        `;

        this.svg_dom = (new DOMParser()).parseFromString(svg_data, "image/svg+xml").documentElement
        _container.innerHTML = ""
        _container.appendChild(this.svg_dom)

        for (let i=0; i<this.pieces.length; i++) {
            this.pieces[i].dom = this.svg_dom.getElementById("e" + i)
        }

        this.updateElementPositions()
    }

    updateElementPositions() {
        for (let slot of this.slots) {
            let el = this.pieces[slot.piece_index];
            (el.dom).setAttribute("transform", `translate(${slot.x}, ${slot.y}) rotate(${slot.r})`)
        }
    }
}