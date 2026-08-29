"use strict"

const LOCAL_STORAGE_KEY = "hg26:puzzle_editor:state"

let _list_items
let _item_n = 0

let _editor_state = null
let _puzzle_renderer

function init() {
    _puzzle_renderer = new PuzzleRenderer()
    _list_items = document.getElementById("list_items")
    document.getElementById("universal").addEventListener("keydown", on_universal_key_down)
    editor_load_state()
    on_update()
}

function remove_item(event) {
    let row = event.target.parentNode
    row.parentNode.removeChild(row)
    on_update()
}

function load_puzzle_from_state() {
    sync_puzzle_selector()
    // document.getElementById("puzzle_editor_id").value = _editor_state["active_editor_id"]

    reset_active_puzzle_data()

    for (var p of _editor_state["puzzles"]) {
        if (p["editor_id"] == _editor_state["active_editor_id"])
        {
            document.getElementById("puzzle_uid").value = p["uid"]
            document.getElementById("puzzle_description").value = p["description"]
            for (var row of p.data) {
                let div = add_item(false)

                div.children[0].value = row[0] // shape index
                div.children[1].value = row[1] // x
                div.children[2].value = row[2] // y
                div.children[3].value = row[3] // rot
                div.children[4].checked = row[4] // lock
            }
        }
    }

    document.getElementById("active_editor_id").value = _editor_state["active_editor_id"]
}

function create_new_puzzle() {
    // 1609113600
    let new_id = "n" + (_editor_state.puzzles.length + 1)

    console.log(`creating new puzzle: ${new_id}`)

    _editor_state["puzzles"].push({"editor_id": new_id, "uid": new_id, "description": "new puzzle", "data": []})
    _editor_state["active_editor_id"] = new_id
}

function sync_puzzle_selector() {
    let option
    let select = document.getElementById("puzzle_selector")
    select.innerHTML = ""

    for (let p of _editor_state["puzzles"]) {
        option = document.createElement("option")
        option.value = p["editor_id"]
        option.innerHTML = `${p["editor_id"]}: ${p["description"]} (${p["uid"]})`
        if (p["editor_id"] == _editor_state["active_editor_id"]) {
            option.selected = true
        }
        select.appendChild(option)
    }

    // select.value = _editor_state["active_editor_id"]
}

function reset_active_puzzle_data() {
    _list_items.innerHTML = ""
}

function editor_reset_all() {
    _editor_state = {
        "active_editor_id": null,
        "puzzles": []
    }

    reset_active_puzzle_data()
    create_new_puzzle()
    load_puzzle_from_state()
    // save_active_puzzle_to_state()
    editor_save_state()
    // update_puzzle_visuals()
}

function save_active_puzzle_to_state() {
    for (var p of _editor_state["puzzles"]) {
        if (p.editor_id == _editor_state["active_editor_id"])
        {
            p.uid = document.getElementById("puzzle_uid").value
            p.description = document.getElementById("puzzle_description").value
            p.data = get_active_puzzle_data()
        }
    }
}

function editor_save_state(save_active = true) {
    console.log("saving editor state")
    if (save_active) {
        save_active_puzzle_to_state()
    }

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(_editor_state))
}

function editor_load_state() {
    console.log("loading editor state")

    let a = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    _editor_state = null

    if (a != null) {
        console.log("state found, loading...")
        try {
            _editor_state = JSON.parse(a)
        }
        catch (e) {}
    }

    if (_editor_state == null)
    {
        console.log("no valid state found, resetting...")
        editor_reset_all()
    }
    load_puzzle_from_state()
}

function get_row_data(obj) {
    if (obj) {
        return [
            parseInt(obj.children[0].value),
            parseFloat(obj.children[1].value),
            parseFloat(obj.children[2].value),
            parseFloat(obj.children[3].value),
            obj.children[4].checked,
        ]
    }
    else {
        return [ 0, 30, 30, 0, false ]
    }
}

function get_active_puzzle_data() {
    let result = []

    let b = _list_items.querySelectorAll(".list_row")
    for (let c of b) {
        result.push(get_row_data(c))
    }

    return result
}

function add_item(call_update_hook = true) {
    let s = ""

    let div = document.createElement("div")
    div.className = "list_row"
    div.id = `item_${_item_n}`

    let defaults

    let b = _list_items.querySelectorAll(".list_row")
    if (b.length > 0) {
        defaults = get_row_data(b[b.length - 1])
    }
    else {
        defaults = get_row_data(null)
    }

    let a

    a = document.createElement("input")
    a.type = "text"
    a.className = "shape_index"
    a.value = defaults[0]
    a.addEventListener("keyup", on_update.bind(a))
    a.addEventListener("keydown", on_key_down.bind(a))
    div.appendChild(a)

    a = document.createElement("input")
    a.type = "text"
    a.className = "pos_x"
    a.value = defaults[1]
    a.addEventListener("keyup", on_update.bind(a))
    a.addEventListener("keydown", on_key_down.bind(a))
    div.appendChild(a)

    a = document.createElement("input")
    a.type = "text"
    a.className = "pos_y"
    a.value = defaults[2]
    a.addEventListener("keyup", on_update.bind(a))
    a.addEventListener("keydown", on_key_down.bind(a))
    div.appendChild(a)

    a = document.createElement("input")
    a.type = "text"
    a.className = "rotation"
    a.value = defaults[3]
    a.addEventListener("keyup", on_update.bind(a))
    a.addEventListener("keydown", on_key_down.bind(a))
    div.appendChild(a)

    a = document.createElement("input")
    a.type = "checkbox"
    a.className = "lock"
    a.value = "1"
    a.checked = defaults[4]
    a.addEventListener("change", on_update.bind(a))
    a.addEventListener("keydown", on_key_down.bind(a))
    div.appendChild(a)

    a = document.createElement("button")
    a.innerHTML = "x"
    a.addEventListener("click", remove_item.bind(div))
    div.appendChild(a)

    _list_items.appendChild(div)

    div.children[0].focus()
    div.children[0].select()

    _item_n += 1

    if (call_update_hook) {
        on_update()
    }

    return div
}

function grid_inc(current, step, count, direction) {
    return Math.floor(parseFloat(current) / step + count * direction) * step
}

function on_key_down(event) {
    let count = 1
    let step = 1
    let direction

    if (event.keyCode == 38) { // up arrow
        direction = +1
    }
    else if (event.keyCode == 40) { // down arrow
        direction = -1
    }
    else if (event.keyCode == 37) { // left arrow
        direction = -1
    }
    else if (event.keyCode == 40) { // right arrow
        direction = +1
    }
    else {
        console.log(`unhandled keyCode: ${event.keyCode}`)
        on_update()
        return
    }

    if (event.target.className == "pos_x") {
        let grid_value = document.getElementById("pos_grid").value.split(",")
        step = parseFloat(grid_value[0])
    }
    else if (event.target.className == "pos_y") {
        direction *= -1

        let grid_value = document.getElementById("pos_grid").value.split(",")
        step = parseFloat(grid_value[1])
    }
    if (event.target.className == "rotation") {
        let grid_value = document.getElementById("rot_grid").value.split(",")
        step = parseFloat(grid_value[0])
    }

    event.target.value = grid_inc(event.target.value, step, count, direction)

    if (event.target.className == "rotation") {
        // map it to 0..360
        event.target.value = (parseFloat(event.target.value) % 360 + 360) % 360
    }

    event.target.select()
    event.preventDefault()

    on_update()
}

function on_universal_key_down(event) {
/*
    // meh, this is too much work for now...

    let pos_grid_values = document.getElementById("pos_grid").value.split(",")
    let rot_grid_values = document.getElementById("rot_grid").value.split(",")
    let obj

    if (event.keyCode == 82) { // "R"

    }
    else if (event.keyCode == 38) { // up arrow
        grid_inc(, step, count, -1)
    }
    else if (event.keyCode == 40) { // down arrow
        direction = -1
    }
    else if (event.keyCode == 37) { // left arrow
        direction = -1
    }
    else  if (event.keyCode == 39) { // right arrow
        direction = +1
    }
    else {
        console.log(event.keyCode)
    }
*/
}

function render() {
    _puzzle_renderer.render(0, 0, [ "x1", get_active_puzzle_data(), ["#0ff", "#0ff", "#04f", "#04f"], "hint", 0.0])
}

function editor_order_to_game_order(rows) {
    rows = rows.sort(sort2)

    let result = []
    for (let row of rows) {
        result.push([row[0], row[3], row[1], row[2], row[4]])
    }
    return result
}

function on_update() {
    editor_save_state()
    render()
    // document.getElementById("output").innerHTML = JSON.stringify(get_active_puzzle_data())
    document.getElementById("output").innerHTML = JSON.stringify(editor_order_to_game_order(get_active_puzzle_data()))
}

function puzzle_selector_load() {

}

function puzzle_selector_new() {
    editor_save_state()
    reset_active_puzzle_data()
    create_new_puzzle()
    load_puzzle_from_state()
    sync_puzzle_selector()

    on_update()
}

function on_puzzle_selector_change(obj) {
    if (obj.value == _editor_state["active_editor_id"]) {
        return
    }
    console.log(`selector value: ${obj.value}`)

    editor_save_state()

    _editor_state["active_editor_id"] = obj.value

    load_puzzle_from_state()

    on_update()
}

function on_save_button() {
    // just trigger an update
    on_update()
}

function sort1(a, b) {
    // this one can be compressed better
    if (a[2] !== b[2]) { // lower y coordinate first
        return a[2] - b[2]
    }
    if (a[1] !== b[1]) { // lower x coordinate first
        return a[1] - b[1]
    }
    return 0
}

function sort2(a, b) {
    if (a[0] !== b[0]) { // lower piece index first
        return a[0] - b[0]
    }
    if (a[3] !== b[3]) { // lower rotation first
        return a[3] - b[3]
    }
    if (a[1] !== b[1]) { // lower x coordinate first
        return a[1] - b[1]
    }
    if (a[2] !== b[2]) { // lower y coordinate first
        return a[2] - b[2]
    }
    return 0
}

function sort_pieces() {
    for (var p of _editor_state["puzzles"]) {
        if (p.editor_id == _editor_state["active_editor_id"])
        {
            p.data = p.data.sort(sort1)
        }
    }

    editor_save_state(false)
    load_puzzle_from_state()
    on_update()
}

async function copy_output(obj) {
  try {
    await navigator.clipboard.writeText(document.getElementById("output").innerHTML)
    obj.innerHTML = "Copied"
    window.setTimeout(function() { obj.innerHTML = "Copy to clipboard"}, 500)
  } catch (error) {
    console.error(error.message)
  }
}

function nudge_all(dx, dy) {
    for (let row of _list_items.children) {
        row.children[1].value = parseFloat(row.children[1].value) + dx
        row.children[2].value = parseFloat(row.children[2].value) + dy
    }
    on_update()
}

window.addEventListener("load", init)
