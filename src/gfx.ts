class Gfx {
    private view_x: number = 0
    private view_y: number = 0
    private view_zoom: number = 1.0

    private frame_number: number = 0
    public targetViewBox: Array<number> = [0,0,1,1]

    constructor() {
    }

    render() {
        function lerpx(a: number, b: number, step: number, max: number) {
            if (Math.abs(a - b) < max) {
                return b
            }
            return a + (b - a) * step
        }
        this.frame_number += 1

        let target_x = (this.targetViewBox[0] + this.targetViewBox[2]) / 2
        let target_y = (this.targetViewBox[1] + this.targetViewBox[3]) / 2
        let target_zoom = Math.min((window.innerWidth * 0.66) / (this.targetViewBox[2] - this.targetViewBox[0]), (window.innerHeight * 0.66) / (this.targetViewBox[3] - this.targetViewBox[1]))

        let cx = window.innerWidth / 2
        let cy = window.innerHeight / 2
        let bx = 250
        let by = 250

/*
        let screen_center_obj = document.getElementById("screen_center") as HTMLDivElement
        screen_center_obj.style.left = cx + "px"
        screen_center_obj.style.top = cy + "px"
*/
        this.view_x = lerpx(this.view_x, target_x, 0.05, 0.1)
        this.view_y = lerpx(this.view_y, target_y, 0.05, 0.1)
        this.view_zoom = lerpx(this.view_zoom, target_zoom, 0.05, 0.002)
        // this.view_zoom = Math.sin(this.frame_number / 100) * 1.0 + 1.0

        let ax = -(this.view_x - bx) * this.view_zoom + (cx - bx)
        let ay = -(this.view_y - by) * this.view_zoom + (cy - by)

        _container.style.transform = "translate(" + (ax) + "px," + (ay) + "px) scale(" + this.view_zoom + ")"

        window.requestAnimationFrame(this.render.bind(this))
    }
}