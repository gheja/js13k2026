class Gfx {
    private view_x: number = 0
    private view_y: number = 0
    private view_zoom: number = 1.0

    private target_x: number = 0
    private target_y: number = 0
    private target_zoom: number = 1.0

    private frame_number: number = 0

    private screen_obj: HTMLDivElement

    constructor() {
        this.screen_obj = document.getElementById("b") as HTMLDivElement
    }

    setTarget(x: number, y: number, zoom: number) {
        // this.target_x = 200 - x
        // this.target_y = 200 - y
        this.target_x = x
        this.target_y = y
        this.target_zoom = zoom

        // console.log([x, y, zoom])
    }

    render() {
        function lerpx(a: number, b: number, step: number, max: number) {
            if (Math.abs(a - b) < max) {
                return b
            }
            return a + (b - a) * step
        }
        this.frame_number += 1

        var cx = window.innerWidth / 2
        var cy = window.innerHeight / 2
        var bx = 250
        var by = 250

/*
        var screen_center_obj = document.getElementById("screen_center") as HTMLDivElement
        screen_center_obj.style.left = cx + "px"
        screen_center_obj.style.top = cy + "px"
*/
        this.view_x = lerpx(this.view_x, this.target_x, 0.05, 0.1)
        this.view_y = lerpx(this.view_y, this.target_y, 0.05, 0.1)
        this.view_zoom = lerpx(this.view_zoom, this.target_zoom, 0.05, 0.002)
        // this.view_zoom = Math.sin(this.frame_number / 100) * 1.0 + 1.0

        var ax = -(this.view_x - bx) * this.view_zoom + (cx - bx)
        var ay = -(this.view_y - by) * this.view_zoom + (cy - by)

        this.screen_obj.style.transform = "translate(" + (ax) + "px," + (ay) + "px) scale(" + this.view_zoom + ")"

        window.requestAnimationFrame(this.render.bind(this))
    }
}