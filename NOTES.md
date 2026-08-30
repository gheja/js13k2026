Reducing size:
  - notes on background:
    - handling the SVG in JS by DOM is probably really wasteful -- should be string

  - Notes on puzzle data:
    - compression depends on the order of tiles, try to sort it differently -- nope, didn't really help
    - compression depends on the order of parameters (of tiles), probaly could save by arraging shape_index and rotation first (repeated stuffs aligned) -- nope, didn't really help
    - but still, some reordering might help

  - Creating PuzzleBase from Puzzle by separating the pure puzzle logic adds +120 bytes to the final size - maybe merging back the new functions and just calling what needed would save some bytes instead of the extra handling of "extends" for the class.

  - Notes on SVGs:
    - Whitespaces SVG could be deleted/shortened.
    - IDs/class names coudl be shortened

  - Index
    - remove "user-scalable=no, minimal-ui"

Bugs:
  - Zoom is not centering properly.

---

css fill transition is buggy 
#bgg { transition: 1s; }

        <svg viewBox="0 0 1080 1080" version="1.1" xmlns="http://www.w3.org/2000/svg" id="bg" preserveAspectRatio="xMidYMid slice">
            <path id="bgg" d="M 0 0 H 1080 V 1080 H 0 Z" style="fill:#012"></path>
        </svg>

---

Safe on an 1080x1920, 1080x2340 (S22) -> 1080x1440, puzzles should fit in this ratio, maybe

---

<div id="safe_view_box"></div>

#safe_view_box {
    border: 2px solid #666;
    position: fixed;
    top: calc(177vw * 0.2);
    left: 0;
    width: 100vw;
    height: calc(177vw * 0.7); /* 177 vw */
}
@media (orientation: landscape) {
    #safe_view_box {
        top: 0;
        left: calc((100vw - 56.25vh)/2);
        height: 100vh;
        width: 56.25vh;
    }
}



---

Undo: &#x21B6; ↶
Basket: &#x1F5D1; 🗑

---

(el.dom as SVGPathElement).style.transform = `translate(${slot.x}px, ${slot.y}px) rotate(${slot.r})`

#b > svg { position: fixed; display: block; filter: drop-shadow(0 0 0.5rem #000); transition: filter 1s, opacity 1s, transform 1s; }
#b > svg > g > path { transition: transform 1s; }

    public puzzlesGroups: Array<Array<Puzzle>>

        this.puzzlesGroups = [
        this.puzzles = this.puzzlesGroups[0]
