"use strict"

let _list_items
let _item_n = 0

function init() {
    _list_items = document.getElementById("list_items")
}

function remove_item(event) {
    let row = event.target.parentNode
    row.parentNode.removeChild(row)
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
        return [ 1, 1, 1, 0, false ]
    }
}

function get_puzzle_definition() {
    let result = []

    let b = _list_items.querySelectorAll(".list_row")
    for (let c of b) {
        result.push(get_row_data(b[b.length - 1]))
    }

    console.log(result)
}

function add_item() {
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
    a.addEventListener("keydown", on_key_down.bind(a))
    div.appendChild(a)

    a = document.createElement("input")
    a.type = "text"
    a.className = "pos_x"
    a.value = defaults[1]
    a.addEventListener("keydown", on_key_down.bind(a))
    div.appendChild(a)

    a = document.createElement("input")
    a.type = "text"
    a.className = "pos_y"
    a.value = defaults[2]
    a.addEventListener("keydown", on_key_down.bind(a))
    div.appendChild(a)

    a = document.createElement("input")
    a.type = "text"
    a.className = "rotation"
    a.value = defaults[3]
    a.addEventListener("keydown", on_key_down.bind(a))
    div.appendChild(a)

    a = document.createElement("input")
    a.type = "checkbox"
    a.className = "lock"
    a.value = "1"
    a.checked = defaults[4]
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

}

function on_key_down(event) {
    // console.log(event)
    var value = event.target.value

    if (event.keyCode == 38) { // up arrow
        event.target.value = parseFloat(event.target.value) + 1
        event.target.select()
        event.preventDefault()
    }
    else if (event.keyCode == 40) { // down arrow
        event.target.value = parseFloat(event.target.value) - 1
        event.target.select()
        event.preventDefault()
    }
}

window.addEventListener("load", init)
