const SHAPES = [
    'M 0,-13 -15,13 h 30 z',
    'M 0,-3 -2,0 0,3 2,0 Z',
]

enum ShapeIndex {
    Triangle1 = 0,
    LockedIcon
}

const PUZZLE1 =  [
    [
        [ ShapeIndex.Triangle1, 30, 30, 0,   true  ],
        [ ShapeIndex.Triangle1, 45, 30, 180, false ],
        [ ShapeIndex.Triangle1, 60, 30, 0,   false ],
        [ ShapeIndex.Triangle1, 75, 30, 180, false ],
        [ ShapeIndex.Triangle1, 90, 30, 0,   true  ],
    ],
    [ "#ff0", "#f0f", "#ff0", "#f0f" ]
]

const PUZZLE2 =  [
    [
        [ ShapeIndex.Triangle1, 30, 30, 0,   true  ],
        [ ShapeIndex.Triangle1, 45, 30, 180, false ],
        [ ShapeIndex.Triangle1, 60, 30, 0,   false ],
        [ ShapeIndex.Triangle1, 75, 30, 180, false ],
        [ ShapeIndex.Triangle1, 90, 30, 0,   true  ],
    ],
    [ "#f0f", "#0f0", "#f0f", "#0f0" ]
]

const PUZZLE3 =  [
    [
        [ ShapeIndex.Triangle1, 30, 30, 0,   true  ],
        [ ShapeIndex.Triangle1, 45, 30, 180, false ],
        [ ShapeIndex.Triangle1, 60, 30, 0,   false ],
        [ ShapeIndex.Triangle1, 75, 30, 180, false ],
        [ ShapeIndex.Triangle1, 90, 30, 0,   true  ],
    ],
    [ "#00f", "#0ff", "#00f", "#0ff" ]
]
