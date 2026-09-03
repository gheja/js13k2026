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

function clog(s: any) {
    if (IS_PROD_BUILD) {
        return
    }

    console.log(s)
}

// state keys
//   pl:<puzzle_uid> -- puzzle locked
//   ps:<puzzle_uid> -- player state on a puzzle

let _localState: any

function localStateSet(key: string, value: any) {
    clog(`set "${key}"`)

    // localStorage.setItem(LOCALSTORAGE_PREFIX + key, JSON.stringify(value))
    _localState[key] = value
    localStorage.setItem(LOCALSTORAGE_PREFIX + "a", JSON.stringify(_localState))
}

function localStateGet(key: string, def: any) {
    clog(`get "${key}"`)

    try {
        if (_localState === undefined) {
            let s = localStorage.getItem(LOCALSTORAGE_PREFIX + "a")
            if (s !== null) {
                // @ts-ignore -- it might be invalid, that's why the try-catch
                _localState = JSON.parse(s)
            }
        }
    }
    catch (e) {}
    if (_localState === undefined) {
        _localState = {}
    }

    if (key in _localState) {
        return _localState[key]
    }

    return def
}

function getBigRandomNumber() {
    return Math.round(Math.random() * 1e14)
}

function getNewPlayerName() {
    const a = ["Rainbow", "Sparkle", "Cupcake", "Shiny", "Sunshine", "Dashing"]
    return a[Math.floor(Math.random() * a.length)] + " " + Math.floor(Math.random() * 9000 + 1000)
}

function isValidPlayerName(s: string|null) {
    if (!s) {
        return false
    }

    if (!s.match(/^[a-zA-Z0-9 ]{1,30}$/)) {
        return false
    }

    s = s.toLowerCase()

    let a = 'abcdefghijklmnopqrstuvwxyz5'
    let b = '48cd3f6h1jk1mn099r27vvwxy22'

    // let's say these are bad words, transformation leads to this and they will be filtered
    // leet - l33t - 1337 => 137
    // boobs - boooooobs - b00bs - b00bz - 80085 => 8082

    for (let i=0; i<a.length; i++) {
        s = s.replaceAll(a[i], b[i])
    }

    // remove repeating characters
    s = s.replaceAll(/(.)\1+/g, '$1')

    clog(s)

    // this list contains the transformed bad words, with some optional "x" so github search won't find it at least, ehe
    let c = "21xv7,2hx17,2vxck3r,cvxn7,d1xck,fvxck,91x2,42xh013,h17x13r,7rxvm9,9vx71n,n4x21,cvxm,r3x7x4rd,n1x63r,n1x64,81x7ch,whx0r3".replaceAll("x", "").split(",")

    for (let i=0; i<c.length; i++) {
        if (s.indexOf(c[i]) !== -1) {
            return false
        }
    }

    return true
}
