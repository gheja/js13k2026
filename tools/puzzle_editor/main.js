"use strict"

let _list_items
let _item_n = 0

function init() {
    _list_items = document.getElementById("list_items")
}

function remove_item(obj) {
    alert(obj)
}

function add_item() {
    let s = ""

    s += `<div class="list_row" id="item_${_item_n}">`
    s += `<input type="text" class="shape_index" value="1"/>`
    s += `<input type="text" class="pos_x" value="1"/>`
    s += `<input type="text" class="pos_y" value="1"/>`
    s += `<input type="text" class="rotation" value="0"/>`
    s += `<input type="checkbox" class="locked" value="1"/>`
    s += `<button onclick="remove_item(this.parentNode); return false;">x</button>`
    s += `</div>`

    _list_items.innerHTML += s

    let obj = document.getElementById(`item_${_item_n}`)
    obj.children[0].addEventListener("keydown", on_key_down.bind(obj.children[0]))
    obj.children[1].addEventListener("keydown", on_key_down.bind(obj.children[1]))
    obj.children[2].addEventListener("keydown", on_key_down.bind(obj.children[2]))
    obj.children[3].addEventListener("keydown", on_key_down.bind(obj.children[3]))

    obj.children[0].focus()

    _item_n += 1

}

function on_key_down(event) {
    console.log(event)
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
