class Puzzle {
    public svg_dom: SvgInHtml
    public left: number
    public top: number
    public width: number = 300
    public height: number = 300

    private pieces: Array<any> = []
    private slots: Array<any> = []

    private puzzleUid: string
    private state: PuzzleState = PuzzleState.StoppedUnfinished
    private slotHovered: any
    private slotFirstPick: any
    private hint: string
    private startingSolvedProgress: number
    private minStepsRequired: number
    public locked: boolean
    public unlockCountOnWin: number = 1
    public wasSolvedEarlier: boolean = false
    public playerState: Array<any>

    constructor(x: number, y: number, data: any) {
        this.left = x
        this.top = y

        // NOTE: the canvas will start at 0,0 which is some waste but easier than handling the offset
        // NOTE: coordinates of puzzles must always be positive

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

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

        // make sure the sampling is safe
        canvas.width = max_x + 1
        canvas.height = max_y + 1

        // debug:
        // ctx.fillStyle = "#f00"
        // ctx.fillRect(0, 0, canvas.width, canvas.height)

        // in case of 1D puzzles the min and max values are the same, which would mess up things, so add + 1 pixel
        // NOTE: if I ever decide to get rid of the 1D puzzles, I can remove this I guess
        createFourPointGradient(ctx,
            Math.floor(min_x), Math.floor(min_y), Math.ceil(max_x - min_x + 1), Math.ceil(max_y - min_y + 1),
            data[PuzzleDataIndex.Colors][0],
            data[PuzzleDataIndex.Colors][1],
            data[PuzzleDataIndex.Colors][2],
            data[PuzzleDataIndex.Colors][3]
        )
        // ctx.createConicGradient() for U-shaped puzzles

        // debug:
        // _container.appendChild(canvas)

        let pixel_data = ctx.getImageData(0, 0, canvas.width, canvas.height)

        let piece_index = 0
        for (let i=0; i<data[PuzzleDataIndex.Pieces].length; i++) {
            let b = data[PuzzleDataIndex.Pieces][i]
            let n = (Math.floor(b[2]) * canvas.width + Math.floor(b[1])) * 4
            this.slots.push({shape_index: b[0], x: b[1], y: b[2], r: b[3], piece_index: piece_index, correct_piece_index: piece_index, locked: b[4]})
            this.pieces.push({shape_index: b[0], color: `rgb(${pixel_data.data[n]},${pixel_data.data[n+1]},${pixel_data.data[n+2]})`, dom: null})
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
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" version="1.1" xmlns="http://www.w3.org/2000/svg" style="left: ${x}px; top: ${y}px">
  <filter id="shadow" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
    <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
  </filter>
  <g id="layer1"></g>
  <g id="layer2">${path_data}</g>
  <g id="locks">${locked_path_data}</g>
  <g id="layer3" filter="url(#shadow)"></g>
</svg>
        `;

        this.svg_dom = (new DOMParser()).parseFromString(svg_data, "image/svg+xml").documentElement as SvgInHtml
        _container.appendChild(this.svg_dom)

        for (let i=0; i<this.pieces.length; i++) {
            this.pieces[i].dom = this.svg_dom.getElementById("e" + i)
        }

        this.svg_dom.addEventListener("mousemove", this.onMouseMove.bind(this))
        this.svg_dom.addEventListener("click", this.onClick.bind(this))

        this.puzzleUid = data[PuzzleDataIndex.Uid]
        this.startingSolvedProgress = data[PuzzleDataIndex.StartingSolvedProgress]
        this.hint = data[PuzzleDataIndex.Hint]

        this.locked = localStateGet("pl:" + this.puzzleUid, true)
        this.playerState = localStateGet("ps:" + this.puzzleUid, [0, 0, 0, 0, []])

        // generate the seed, etc. on the first run
        if (this.playerState[PlayerStateIndex.PuzzleSeed] == 0) {
            this.newPlayerSession()
        }
        this.shuffle()
        this.checkWinCondition(true)
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

    setMarkerVisibility(value: boolean) {
        (this.svg_dom.getElementById("locks") as SVGElement).style.opacity = value ? "1" : "0"
    }

    setActive(value: boolean, visible: boolean) {
        this.svg_dom.style.opacity = (!this.locked && visible) ? "1" : "0"
        this.setMarkerVisibility(value && this.state != PuzzleState.StoppedFinished)
        this.svg_dom.style.filter = "drop-shadow(0 0 0.5rem #" + ((!value && this.state == PuzzleState.StoppedFinished && this.playerState[PlayerStateIndex.StarsReceived] == 3) ? "ff08" : "000") + ")"

        if (this.state == PuzzleState.StoppedFinished)
        {
            return
        }

        if (value) {
            this.state = PuzzleState.PickFirstPiece
            _hint.innerHTML = this.hint ? this.hint : ""
        }
        else {
            this.state = PuzzleState.StoppedUnfinished
        }

        // just to be sure it looks correct
        this.updateElementPositions()
        this.updatePieceVisuals()
    }

    onClick(event: MouseEvent) {
        if (_game.state == GameState.Initializing || _game.paused || this.locked) {
            return
        }
        else if (_game.state == GameState.MainScreen) {
            this.onClick2(event)
        }
        else if (_game.state == GameState.PuzzleActive && this.state != PuzzleState.StoppedFinished) {
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
                this.playerState[PlayerStateIndex.StepsTaken] += 1
                this.playerState[PlayerStateIndex.SwapList].push([this.getSlotIndexBySlot(this.slotFirstPick), this.getSlotIndexBySlot(this.slotHovered)])
                // save player progress after each steps taken
                this.savePlayerLocalState()

                // clear selection
                this.slotFirstPick = null
                this.dumpStatus()

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

    getSlotIndexBySlot(slot: any) {
        for (let i=0; i<this.slots.length; i++) {
            if (this.slots[i] == slot) {
                return i
            }
        }
    }

    onMouseMove(event: MouseEvent) {
        if (this.state == PuzzleState.StoppedUnfinished || this.state == PuzzleState.StoppedFinished || _game.paused) {
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
            // @ts-ignore - "possibly null"
            var local_point = point.matrixTransform(obj.getScreenCTM().inverse())
            if (obj.isPointInFill(local_point)) {
                for (let slot of this.slots)
                {
                    if (!slot.locked && this.pieces[slot.piece_index].dom == obj)
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
            if (obj.classList.contains("lock")) {
                continue
            }
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

        svg.style.cursor = this.slotHovered ? "pointer" : ""
    }

    checkWinCondition(fromSavedState: boolean=false) {
        for (var slot of this.slots) {
            if (slot.piece_index != slot.correct_piece_index) {
                return
            }
        }

        this.state = PuzzleState.StoppedFinished

        if (!fromSavedState) {
            if (this.playerState[PlayerStateIndex.Peeked]) {
                this.playerState[PlayerStateIndex.StarsReceived] = 1
            }
            else {
                if (this.playerState[PlayerStateIndex.StepsTaken] > this.minStepsRequired) {
                    this.playerState[PlayerStateIndex.StarsReceived] = 2
                }
                else {
                    this.playerState[PlayerStateIndex.StarsReceived] = 3
                    this.svg_dom.style.filter = "drop-shadow(0 0 0.5rem #ff08)"
                }
            }
            this.savePlayerLocalState()

            document.getElementById("p1").innerHTML = this.playerState[PlayerStateIndex.StepsTaken]
            document.getElementById("p2").innerHTML = this.minStepsRequired
            document.getElementById("p3").innerHTML = STAR_TEXTS[this.playerState[PlayerStateIndex.StarsReceived] - 1]

            if (!this.wasSolvedEarlier) {
                _game.puzzleUnlocksPending += this.unlockCountOnWin
            }

            _game.transitionStart(TransitionState.EnteringWinScreen)
        }

        this.wasSolvedEarlier = true
        this.setMarkerVisibility(false)
    }

    dumpStatus() {
        if (IS_PROD_BUILD) {
            return
        }

        let a, m
        clog('status:')
        let n = 0
        for (a=0; a<this.slots.length; a++) {
            if (this.slots[a].locked) {
                clog(`  slot ${a} is locked`)
                continue
            }

            m = this.slots[a].piece_index == this.slots[a].correct_piece_index

            clog(`  slot ${a}, piece: ${this.slots[a].piece_index}, correct ${this.slots[a].correct_piece_index}, ${m}`)

            if (m) {
                n += 1
            }
        }
        clog(`correct: ${n}`)
    }

    shuffle() {
        // We need to start from a solved position.
        //
        // This method will make sure the puzzle needs "pieces - 1" steps to
        // solve. This is per piece shape, with multiple shapes it will take
        // "(shape1 pieces - 1) + (shape2 pieces -1) + ..." steps to solve.
        //
        // Move pieces to random positions, then check how many steps are
        // needed to solve from there. If it equals the minimum, then the
        // state is well shuffled.
        //
        // From this position we can make it easier by moving pieces to their
        // correct places all while keeping track of the fewest steps needed
        // to solve from there.
        //
        // Also, make it reproducible by using a seed.

        let seed = this.playerState[PlayerStateIndex.PuzzleSeed]
        let a
        let b

        clog(`seed: ${seed}`)

        let random = seed
        function getRandom(n: number) {
            seed = (seed + 7985) * 2091 % 7531
            return seed % n
        }

        // start from a solved position
        for (a=0; a<this.slots.length; a++) {
            this.slots[a].piece_index = this.slots[a].correct_piece_index
        }

        let done = false

        // calculate the minimum steps required to solve a fully shuffled puzzle
        this.minStepsRequired = 0
        for (let i=0; i<this.slots.length; i++) {
            if (!this.slots[i].locked) {
                this.minStepsRequired += 1
            }
        }
        this.minStepsRequired -= 1

        clog(`minStepsRequired: ${this.minStepsRequired}`)

        let _n = 0

        // do 100 random swaps until none of the pieces are in their correct positions
        while (true) {
            clog(`mixing #${_n}`)
            for (let i=0; i<100; i++) {
                a = getRandom(this.slots.length)
                b = getRandom(this.slots.length)
                if (a != b && !this.slots[a].locked && !this.slots[b].locked) {
                    this.swapPiecesInSlots2(this.slots[a], this.slots[b])
                }
            }

            clog('solving')

            // --- solve this state

            let piece_index_save = []

            // save positions
            for (a=0; a<this.slots.length; a++) {
                piece_index_save.push(this.slots[a].piece_index)
            }

            let steps_taken = 0
            let solved = false

            while (true) {
                solved = true

                clog('  finding first slot that needs fixing')
                // find the first piece not in correct place, if any
                for (a=0; a<this.slots.length; a++) {
                    if (!this.slots[a].locked && this.slots[a].piece_index != this.slots[a].correct_piece_index) {
                        solved = false
                        break
                    }
                }

                if (solved) {
                    clog(`    all slots have the correct pieces`)
                    break
                }

                clog(`    slot ${a}, starting from here`)


                // pull the correct piece into this slot, then pick that slot, until xxx
                while (this.slots[a].piece_index != this.slots[a].correct_piece_index) {
                    for (b=0; b<this.slots.length; b++) {
                        if (this.slots[b].piece_index == this.slots[a].correct_piece_index) {
                            break
                        }
                    }

                    clog(`      swap slot ${a} ${b}`)

                    this.swapPiecesInSlots(a, b)
                    steps_taken += 1

                    a = b
                }
                clog(`      slot ${a} has the correct piece already`)
            }

            clog(`solved. steps needed: ${steps_taken}, min should be: ${this.minStepsRequired}`)

            // restore positions
            for (a=0; a<this.slots.length; a++) {
                this.slots[a].piece_index = piece_index_save[a]
            }

            if (steps_taken == this.minStepsRequired) {
                clog(`nice, found it after ${_n + 1} mixes`)
                // we found a state that is well shuffled
                break
            }

            _n += 1

            if (!IS_PROD_BUILD) {
                if (_n == 5000) {
                    alert(`ERROR: could not find a proper shuffle in ${_n} tries, giving up`)
                    return
                }
            }
        }

        // calculate the target steps
        let targetStepsRequired = Math.ceil(this.minStepsRequired * (1 - this.startingSolvedProgress))

        // console.log([minStepsRequired, targetStepsRequired])

        // solve the puzzle until that many steps are needed to finish it
        while (this.minStepsRequired > targetStepsRequired) {
            a = getRandom(this.slots.length)

            if (this.slots[a].locked || this.slots[a].correct_piece_index == this.slots[a].piece_index) {
                continue
            }

            b = this.slots[a].piece_index

            if (this.slots[b].correct_piece_index == this.slots[b].piece_index) {
                continue
            }

            // console.log(['a', a, this.slots[a].locked, this.slots[a].correct_piece_index, this.slots[a].piece_index])
            // console.log(['b', b, this.slots[b].locked, this.slots[b].correct_piece_index, this.slots[b].piece_index])

            this.swapPiecesInSlots2(this.slots[a], this.slots[b])
            // console.log(['swap', a, b])
            this.minStepsRequired -= 1
        }
        // console.log([minStepsRequired])

        // replaying the player steps
        for (let swap of this.playerState[PlayerStateIndex.SwapList]) {
            this.swapPiecesInSlots(swap[0], swap[1])
        }

        // resetting the state
        this.state = PuzzleState.PickFirstPiece

        this.updateElementPositions()
        this.setMarkerVisibility(true)
    }

    peekOn() {
        for (let slot of this.slots) {
            slot.before_peek_piece_index = slot.piece_index
            slot.piece_index = slot.correct_piece_index
        }
        this.updateElementPositions()
        this.playerState[PlayerStateIndex.Peeked] = 1
        _hint.style.opacity = "1"
        _hint.innerHTML = "Peeking..."
    }

    peekOff() {
        for (let slot of this.slots) {
            slot.piece_index = slot.before_peek_piece_index
        }
        _hint.style.opacity = "0"
        this.updateElementPositions()
    }

    newPlayerSession() {
        this.playerState[PlayerStateIndex.PuzzleSeed] = Math.floor(Math.random() * 100000)
        this.playerState[PlayerStateIndex.StepsTaken] = 0
        this.playerState[PlayerStateIndex.SwapList] = []
        // this.playerState[PlayerStateIndex.Peeked] -- leave as is
        // this.playerState[PlayerStateIndex.StarsReceived] -- leave as is
    }

    savePlayerLocalState() {
        localStateSet("ps:" + this.puzzleUid, this.playerState)
    }

    unlock() {
        this.locked = false
        localStateSet("pl:" + this.puzzleUid, false)
    }
}
