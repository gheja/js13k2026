const SHAPES = [
    'M 0,-13 -15,13 h 30 z',
    'M 0,-3 -2,0 0,3 2,0 Z',
    'M -13 -13 H 13 V 13 H -13 Z',
    'M -5.6 -13 H 20.4 L 5.6 13 H -20.4 Z',
    'M -50 -13 h 100 v 26 h -100 Z',
]

enum ShapeIndex {
    Triangle1 = 0,
    LockedIcon,
    Square1,
    Paralellogram1,
    WideRectangle,
}

const PUZZLE1 =  [
    [
        [ ShapeIndex.WideRectangle, 80, 30,  0, true  ],
        [ ShapeIndex.WideRectangle, 80, 56,  0, false ],
        [ ShapeIndex.WideRectangle, 80, 82,  0, false ],
        [ ShapeIndex.WideRectangle, 80, 108, 0, false ],
        [ ShapeIndex.WideRectangle, 80, 134, 0, true  ],
    ],
    // [ "#ff0", "#f0f", "#f60", "#60f" ]
    [ "#0ff", "#0ff", "#04f", "#04f" ],
    "Sort the blocks by selecting two of them to swap.<br/>The ones with the diamond shape are locked.",
    0.99, // only one step away from solved
]

const PUZZLE2 =  [
    [
        [ ShapeIndex.Square1, 30,  30,  0, true ],
        [ ShapeIndex.Square1, 56,  30,  0, true ],
        [ ShapeIndex.Square1, 82,  30,  0, true ],
        [ ShapeIndex.Square1, 108, 30,  0, true ],

        [ ShapeIndex.Square1, 30,  56,  0, false ],
        [ ShapeIndex.Square1, 56,  56,  0, true  ],
        [ ShapeIndex.Square1, 82,  56,  0, true  ],
        [ ShapeIndex.Square1, 108, 56,  0, false ],

        [ ShapeIndex.Square1, 30,  82,  0, false ],
        [ ShapeIndex.Square1, 56,  82,  0, true  ],
        [ ShapeIndex.Square1, 82,  82,  0, true  ],
        [ ShapeIndex.Square1, 108, 82,  0, false ],

        [ ShapeIndex.Square1, 30,  108, 0, false ],
        [ ShapeIndex.Square1, 56,  108, 0, true  ],
        [ ShapeIndex.Square1, 82,  108, 0, true  ],
        [ ShapeIndex.Square1, 108, 108, 0, false ],

        [ ShapeIndex.Square1, 30,  134, 0, true  ],
        [ ShapeIndex.Square1, 56,  134, 0, true  ],
        [ ShapeIndex.Square1, 82,  134, 0, true  ],
        [ ShapeIndex.Square1, 108, 134, 0, true  ],
    ],
    // [ "#ff0", "#f0f", "#f60", "#60f" ]
    [ "#ff0", "#0f0", "#f00", "#0ff" ],
    "Make sure the blocks create a gradient in all directions.",
    0.75, // 75% done
]

const PUZZLE3 =  [
    [
        [ ShapeIndex.Triangle1, 30, 30, 0,   true  ],
        [ ShapeIndex.Triangle1, 45, 30, 180, false ],
        [ ShapeIndex.Triangle1, 60, 30, 0,   false ],
        [ ShapeIndex.Triangle1, 75, 30, 180, false ],
        [ ShapeIndex.Triangle1, 90, 30, 0,   true  ],

        [ ShapeIndex.Triangle1, 30, 56, 180,   true  ],
        [ ShapeIndex.Triangle1, 45, 56, 0, false ],
        [ ShapeIndex.Triangle1, 60, 56, 180,   false ],
        [ ShapeIndex.Triangle1, 75, 56, 0, false ],
        [ ShapeIndex.Triangle1, 90, 56, 180,   true  ],

        [ ShapeIndex.Triangle1, 30, 82, 0,   true  ],
        [ ShapeIndex.Triangle1, 45, 82, 180, false ],
        [ ShapeIndex.Triangle1, 60, 82, 0,   false ],
        [ ShapeIndex.Triangle1, 75, 82, 180, false ],
        [ ShapeIndex.Triangle1, 90, 82, 0,   true  ],

        [ ShapeIndex.Triangle1, 30, 108, 180,   true  ],
        [ ShapeIndex.Triangle1, 45, 108, 0, false ],
        [ ShapeIndex.Triangle1, 60, 108, 180,   false ],
        [ ShapeIndex.Triangle1, 75, 108, 0, false ],
        [ ShapeIndex.Triangle1, 90, 108, 180,   true  ],

],
    // [ "#ff0", "#f0f", "#ff0", "#f0f" ],
    // [ "#0ff", "#00f", "#0f0", "#008" ],
    // [ "#f00", "#0ff", "#ff0", "#0f0" ],
    [ "#f0f", "#80f", "#ff0", "#f80" ],
    "Try with different shapes.",
    0, // 0% done
]

const PUZZLE4 =  [
    [
        [ ShapeIndex.Paralellogram1, 30 +45, 30,  0, true  ],
        [ ShapeIndex.Paralellogram1, 56 +45, 30,  0, false ],
        [ ShapeIndex.Paralellogram1, 82 +45, 30,  0, false ],
        [ ShapeIndex.Paralellogram1, 108+45, 30,  0, false ],
        [ ShapeIndex.Paralellogram1, 134+45, 30,  0, true  ],

        [ ShapeIndex.Paralellogram1, 30 +30, 56,  0, true  ],
        [ ShapeIndex.Paralellogram1, 56 +30, 56,  0, false  ],
        [ ShapeIndex.Paralellogram1, 82 +30, 56,  0, false  ],
        [ ShapeIndex.Paralellogram1, 108+30, 56,  0, false  ],
        [ ShapeIndex.Paralellogram1, 134+30, 56,  0, true  ],

        [ ShapeIndex.Paralellogram1, 30 +15, 82,  0, true  ],
        [ ShapeIndex.Paralellogram1, 56 +15, 82,  0, false ],
        [ ShapeIndex.Paralellogram1, 82 +15, 82,  0, false ],
        [ ShapeIndex.Paralellogram1, 108+15, 82,  0, false ],
        [ ShapeIndex.Paralellogram1, 134+15, 82,  0, true  ],

        [ ShapeIndex.Paralellogram1, 30 , 108, 0, true  ],
        [ ShapeIndex.Paralellogram1, 56 , 108, 0, false ],
        [ ShapeIndex.Paralellogram1, 82 , 108, 0, false ],
        [ ShapeIndex.Paralellogram1, 108, 108, 0, false ],
        [ ShapeIndex.Paralellogram1, 134, 108, 0, true  ],
    ],
    [ "#ff0", "#f0f", "#f60", "#60f" ],
    // [ "#ff0", "#0f0", "#f00", "#0ff" ]
    "asd",
    0, // 0% done
]

const STAR_TEXTS = [
    // '<span style="filter: grayscale(1); opacity: 0.3">&#x2b50;&#x2b50;&#x2b50;</span>', // no need for zero stars for now
    '&#x2b50;<span style="filter: grayscale(1); opacity: 0.3">&#x2b50;&#x2b50;</span>',
    '&#x2b50;&#x2b50;<span style="filter: grayscale(1); opacity: 0.3">&#x2b50;</span>',
    '&#x1f31f;&#x1f31f;&#x1f31f;'
]