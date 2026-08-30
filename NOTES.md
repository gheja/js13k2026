Notes on background:
  - handling the SVG in JS by DOM is probably really wasteful -- should be string

Notes on puzzle data:
  - compression depends on the order of tiles, try to sort it differently -- nope, didn't really help
  - compression depends on the order of parameters (of tiles), probaly could save by arraging shape_index and rotation first (repeated stuffs aligned) -- nope, didn't really help
  - but still, some reordering might help

Zoom is not centering properly.


---


---

(el.dom as SVGPathElement).style.transform = `translate(${slot.x}px, ${slot.y}px) rotate(${slot.r})`

#b > svg { position: fixed; display: block; filter: drop-shadow(0 0 0.5rem #000); transition: filter 1s, opacity 1s, transform 1s; }
#b > svg > g > path { transition: transform 1s; }

    public puzzlesGroups: Array<Array<Puzzle>>

        this.puzzlesGroups = [
        this.puzzles = this.puzzlesGroups[0]
