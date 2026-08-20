class Puzzle {
    private svg_dom: SvgInHtml

    constructor(x: number, y: number) {
        let svg_data = `
<svg
   width="300"
   height="300"
   viewBox="0 0 264.58333 264.58333"
   version="1.1"
   id="asdf"
   inkscape:version="1.4.4 (1:1.4.4+202605061436+dcaf3e7d9e)"
   sodipodi:docname="drawing1.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <filter id='shadow' color-interpolation-filters="sRGB">
    <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
  </filter>
  <g id="layer1"></g>
  <g id="layer2">
    <path
       id="path1"
       style="fill:#8ae234;stroke:#000000;stroke-width:0.79375"
       transform="matrix(1.2532734,0,0,1.2532734,-10.336337,-3.1892192)"
       d="m 52.669954,4.3762054 40.239806,69.6973926 -80.479616,-2e-6 z" />
    <path
       id="path2"
       style="fill:#4e9a06;stroke:#000000;stroke-width:0.79375"
       transform="matrix(0.62663669,1.0853666,-1.0853666,0.62663669,127.81565,-56.917415)"
       d="m 52.669954,4.3762054 40.239806,69.6973926 -80.479616,-2e-6 z" />
    <path
       id="path3"
       style="fill:#5c3566;stroke:#000000;stroke-width:0.79375"
       transform="matrix(0.62663669,1.0853666,-1.0853666,0.62663669,228.66402,-56.91742)"
       d="m 52.669954,4.3762054 40.239806,69.6973926 -80.479616,-2e-6 z" />
    <path
       id="path4"
       style="fill:#204a87;stroke:#000000;stroke-width:0.79375"
       transform="matrix(1.2532734,0,0,1.2532734,89.595245,-3.1892192)"
       d="m 52.669954,4.3762054 40.239806,69.6973926 -80.479616,-2e-6 z" />
    <path
       id="path5"
       style="fill:#8f5902;stroke:#000000;stroke-width:0.79375"
       transform="matrix(0.62663669,-1.0853666,-1.0853666,-0.62663669,128.27405,235.46331)"
       d="m 52.669954,4.3762054 40.239806,69.6973926 -80.479616,-2e-6 z" />
    <path
       id="path6"
       style="fill:#a40000;stroke:#000000;stroke-width:0.79375"
       transform="matrix(1.2532734,0,0,-1.2532734,90.053647,181.73512)"
       d="m 52.669954,4.3762054 40.239806,69.6973926 -80.479616,-2e-6 z" />
    <path
       id="path7"
       style="fill:#d45500;stroke:#000000;stroke-width:0.79375"
       transform="matrix(0.62663669,1.0853666,-1.0853666,0.62663669,129.27587,116.0219)"
       d="m 52.669954,4.3762054 40.239806,69.6973926 -80.479616,-2e-6 z" />
    <path
       id="path8"
       style="fill:#ff7f2a;stroke:#000000;stroke-width:0.79375"
       transform="matrix(1.2532734,0,0,1.2532734,91.055463,169.75008)"
       d="m 52.669954,4.3762054 40.239806,69.6973926 -80.479616,-2e-6 z" />
  </g>
  <g id="layer3" filter="url(#shadow)"></g>
</svg>
        `;

        this.svg_dom = (new DOMParser()).parseFromString(svg_data, "image/svg+xml").documentElement as SvgInHtml
        document.getElementById("b").appendChild(this.svg_dom)
        this.svg_dom.addEventListener("mousemove", this.onMouseMove.bind(this))
    }



    onMouseMove(event: MouseEvent) {
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