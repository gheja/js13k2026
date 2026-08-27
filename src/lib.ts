function createFourPointGradient(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number, c1: string, c2: string, c3: string, c4: string) {
    // IMPORTANT: createLinearGradient() is interpolating in RGB colorspace. It
    // would be really nice to do it in HSL instead, which would give stronger
    // color shades. See https://codepen.io/gheja/pen/YPKbxJx

    // gradient on top
    var g1 = ctx.createLinearGradient(left, 0, left + width, 0)
    g1.addColorStop(0, c1)
    g1.addColorStop(1, c2)

    ctx.fillStyle = g1
    ctx.fillRect(left, top, width, 1)

    // gradient on bottom
    var g2 = ctx.createLinearGradient(left, 0, left + width, 0)
    g2.addColorStop(0, c3)
    g2.addColorStop(1, c4)

    ctx.fillStyle = g2
    ctx.fillRect(left, top + height - 1, width, 1)

    let pixel_data = ctx.getImageData(left, top, width, height) // [rgba]

    for (let x=0; x<width; x += 1) {
        let n = (0 * width + x) * 4
        let m = ((height - 1) * width + x) * 4

        // vertical slices
        var g3 = ctx.createLinearGradient(left, top, left, top + height)
        g3.addColorStop(0, `rgb(${pixel_data.data[n]},${pixel_data.data[n+1]},${pixel_data.data[n+2]})`)
        g3.addColorStop(1, `rgb(${pixel_data.data[m]},${pixel_data.data[m+1]},${pixel_data.data[m+2]})`)

        ctx.fillStyle = g3
        ctx.fillRect(left + x, top, 1, height)
    }
}

function clog(s: string) {
    if (IS_PROD_BUILD) {
        return
    }

    console.log(s)
}
