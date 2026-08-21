class Puzzle {
    public svg_dom: SvgInHtml
    public left: number
    public top: number
    public width: number = 300
    public height: number = 300
    private active: boolean = false

    constructor(x: number, y: number) {
        this.left = x
        this.top = y
        let svg_data = `
<svg width="300" height="300" viewBox="0 0 265 265" version="1.1" xmlns="http://www.w3.org/2000/svg" style="left: ${x}px; top: ${y}px">
  <filter id='shadow' color-interpolation-filters="sRGB">
    <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
  </filter>
  <g id="layer1"></g>
  <g id="layer2">
    <path style="fill:#00ff00;stroke:none;stroke-width:0;stroke-dasharray:none" d="M 24.596586,5 7.2760776,34.999998 42.000001,35 Z" />
    <path style="fill:#008000;stroke:none;stroke-width:0;stroke-dasharray:none" d="M 59.237601,5.000001 24.596586,5 41.958546,35.071801 Z" />
    <path style="fill:#00ff00;stroke:none;stroke-width:0;stroke-dasharray:none" d="M 59.237599,5 41.917091,34.999998 76.641014,35 Z" />
    <path style="fill:#008000;stroke:none;stroke-width:0;stroke-dasharray:none" d="M 93.878614,5.000001 59.237599,5 76.599559,35.071801 Z" />
    <path style="fill:#00ff00;stroke:none;stroke-width:0;stroke-dasharray:none" d="m 93.920067,5.071803 -17.320508,29.999998 34.723921,2e-6 z" />
    <path style="fill:#008000;stroke:none;stroke-width:0;stroke-dasharray:none" d="m 128.56108,5.071804 -34.641013,-1e-6 17.361963,30.071801 z" />
  </g>
  <g id="layer3" filter="url(#shadow)"></g>
</svg>
        `;

        this.svg_dom = (new DOMParser()).parseFromString(svg_data, "image/svg+xml").documentElement as SvgInHtml
        document.getElementById("b").appendChild(this.svg_dom)
        this.svg_dom.addEventListener("mousemove", this.onMouseMove.bind(this))
        this.svg_dom.addEventListener("click", this.onClick.bind(this))
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