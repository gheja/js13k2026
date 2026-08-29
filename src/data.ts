const SHAPES = [
    'M 0,-13 -15,13 h 30 z',
    'M 0,-3 -2,0 0,3 2,0 Z',
    'M -13 -13 H 13 V 13 H -13 Z',
    'm -22.5 13 15 -26 30 0 -15 26 z',
    'M -50 -13 h 100 v 26 h -100 Z',
    'M 0 17.333 -30 -0 0 -17.333 30 -0 Z',
    'm 30 0 -15 26 -30 0 -15 -26 15 -26 30 0 z',
    'M -30 0 0 -17.35 30 0 15 26 h -30 z',
]

enum ShapeIndex {
    Triangle1 = 0,
    LockedIcon,
    Square1,
    Paralellogram1,
    WideRectangle,
    Diamond1,
    Hexagon,
    SquishedPentagon,
}

const PUZZLE1 =  [
    "n1",
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
    "n2",
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
    [ "#ff0", "#0f0", "#f00", "#00f" ],
    "Make sure the blocks create a gradient in all directions.",
    0.75, // 75% done
]

const PUZZLE3 =  [
    "n3",
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
    "n4",
    [
        [ ShapeIndex.Paralellogram1, 30 +45, 30,  0, true  ],
        [ ShapeIndex.Paralellogram1, 60 +45, 30,  0, false ],
        [ ShapeIndex.Paralellogram1, 90 +45, 30,  0, false ],
        [ ShapeIndex.Paralellogram1, 120+45, 30,  0, false ],
        [ ShapeIndex.Paralellogram1, 150+45, 30,  0, true  ],

        [ ShapeIndex.Paralellogram1, 30 +30, 56,  0, true  ],
        [ ShapeIndex.Paralellogram1, 60 +30, 56,  0, false  ],
        [ ShapeIndex.Paralellogram1, 90 +30, 56,  0, false  ],
        [ ShapeIndex.Paralellogram1, 120+30, 56,  0, false  ],
        [ ShapeIndex.Paralellogram1, 150+30, 56,  0, true  ],

        [ ShapeIndex.Paralellogram1, 30 +15, 82,  0, true  ],
        [ ShapeIndex.Paralellogram1, 60 +15, 82,  0, false ],
        [ ShapeIndex.Paralellogram1, 90 +15, 82,  0, false ],
        [ ShapeIndex.Paralellogram1, 120+15, 82,  0, false ],
        [ ShapeIndex.Paralellogram1, 150+15, 82,  0, true  ],

        [ ShapeIndex.Paralellogram1, 30 , 108, 0, true  ],
        [ ShapeIndex.Paralellogram1, 60 , 108, 0, false ],
        [ ShapeIndex.Paralellogram1, 90 , 108, 0, false ],
        [ ShapeIndex.Paralellogram1, 120, 108, 0, false ],
        [ ShapeIndex.Paralellogram1, 150, 108, 0, true  ],
   ],
    [ "#ff0", "#f0f", "#0ff", "#60f" ],
    // [ "#ff0", "#0f0", "#f00", "#0ff" ]
    "asd",
    0, // 0% done
]

const PUZZLE5 =  [
    "n5",
    [
        // this format might be easier to follow... might be

        // shift: every second row-pair needs to be shifted by half of element
        // shift2: every second row of a row-pair has two elements, each shifted quarter element
        //
        //                      base x             base y
        //                      |      col index   |      row index
        //                      |      |           |      |        rotation
        //                      |      |   shift   |      |        |
        //                      |      |   |       |      |        |
        [ ShapeIndex.Diamond1, 70 + 60*0 + 0    , 30 + 26*0    ,   0, true  ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 0    , 30 + 26*0    ,   0, true  ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 0    , 30 + 26*0    ,   0, true  ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 0    , 30 + 26*0    ,   0, true  ],

        //                                     shift2
        //                                     |
        [ ShapeIndex.Diamond1, 70 + 60*0 + 0 -15, 30 + 26*0 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*0 + 0 +15, 30 + 26*0 +26, 120, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 0 -15, 30 + 26*0 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 0 +15, 30 + 26*0 +26, 120, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 0 -15, 30 + 26*0 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 0 +15, 30 + 26*0 +26, 120, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 0 -15, 30 + 26*0 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 0 +15, 30 + 26*0 +26, 120, false  ],

        [ ShapeIndex.Diamond1, 70 + 60*0 + 30    , 30 + 26*2    ,   0, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 30    , 30 + 26*2    ,   0, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 30    , 30 + 26*2    ,   0, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 30    , 30 + 26*2    ,   0, false  ],

        [ ShapeIndex.Diamond1, 70 + 60*0 + 30 -15, 30 + 26*2 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*0 + 30 +15, 30 + 26*2 +26, 120, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 30 -15, 30 + 26*2 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 30 +15, 30 + 26*2 +26, 120, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 30 -15, 30 + 26*2 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 30 +15, 30 + 26*2 +26, 120, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 30 -15, 30 + 26*2 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 30 +15, 30 + 26*2 +26, 120, false  ],


        [ ShapeIndex.Diamond1, 70 + 60*0 + 0    , 30 + 26*4    ,   0, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 0    , 30 + 26*4    ,   0, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 0    , 30 + 26*4    ,   0, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 0    , 30 + 26*4    ,   0, false  ],

        [ ShapeIndex.Diamond1, 70 + 60*0 + 0 -15, 30 + 26*4 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*0 + 0 +15, 30 + 26*4 +26, 120, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 0 -15, 30 + 26*4 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 0 +15, 30 + 26*4 +26, 120, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 0 -15, 30 + 26*4 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 0 +15, 30 + 26*4 +26, 120, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 0 -15, 30 + 26*4 +26,  60, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 0 +15, 30 + 26*4 +26, 120, false  ],

        [ ShapeIndex.Diamond1, 70 + 60*0 + 30    , 30 + 26*6    ,   0, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 30    , 30 + 26*6    ,   0, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 30    , 30 + 26*6    ,   0, false  ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 30    , 30 + 26*6    ,   0, false  ],

        [ ShapeIndex.Diamond1, 70 + 60*0 + 30 -15, 30 + 26*6 +26,  60, true ],
        [ ShapeIndex.Diamond1, 70 + 60*0 + 30 +15, 30 + 26*6 +26, 120, true ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 30 -15, 30 + 26*6 +26,  60, true ],
        [ ShapeIndex.Diamond1, 70 + 60*1 + 30 +15, 30 + 26*6 +26, 120, true ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 30 -15, 30 + 26*6 +26,  60, true ],
        [ ShapeIndex.Diamond1, 70 + 60*2 + 30 +15, 30 + 26*6 +26, 120, true ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 30 -15, 30 + 26*6 +26,  60, true ],
        [ ShapeIndex.Diamond1, 70 + 60*3 + 30 +15, 30 + 26*6 +26, 120, true ],
    ],
    [ "#ff0", "#f0f", "#f60", "#60f" ],
    // [ "#ff0", "#0f0", "#f00", "#0ff" ]
    "asd",
    0, // 0% done
]
const PUZZLE6 =  [
    "n6",
    [[3,30,30,0,true],[0,52.5,30,0,false],[0,67.5,30,180,false],[0,82.5,30,0,false],[3,105,30,60,true],[3,30,56,60,true],[0,52.5,56,180,false],[0,67.5,56,0,false],[0,82.5,56,180,false],[3,105,56,0,false],[3,30,82,0,false],[0,52.5,82,0,false],[0,67.5,82,180,false],[0,82.5,82,0,false],[3,105,82,60,false],[3,30,108,60,false],[0,52.5,108,180,false],[0,67.5,108,0,false],[0,82.5,108,180,false],[3,105,108,0,true]],
    [ "#f0f", "#f60", "#60f", "#ff0" ],
    "",
    0,
]

const PUZZLE7 = [
    "n7",
    [[5,90,30,0,true],[5,75,56,60,false],[5,105,56,120,false],[5,60,82,0,false],[5,120,82,0,false],[5,45,108,60,false],[5,75,108,120,false],[5,105,108,60,false],[5,135,108,120,false],[5,30,134,0,false],[5,90,134,0,false],[5,150,134,0,false],[5,15,160,60,true],[5,45,160,120,false],[5,75,160,60,false],[5,105,160,120,false],[5,135,160,60,false],[5,165,160,120,true]],
    ["#fff", "#fff", "#f0f", "#0ff"],
    "",
    0,
]

const PUZZLE8 = [
    "n8",
    [[6,50,36,300,false],[6,170,36,300,false],[7,125,62,240,false],[7,95,62,120,false],[7,170,88,180,true],[7,50,88,180,true],[7,110,88,0,false],[7,65,114,300,false],[7,155,114,60,false],[7,185,114,300,false],[7,35,114,60,false],[6,110,140,0,false],[7,155,166,120,false],[7,185,166,240,false],[7,35,166,120,false],[7,65,166,240,false],[7,110,192,180,false],[7,50,192,0,true],[7,170,192,0,true],[7,95,218,60,false],[7,125,218,300,false],[6,50,244,300,false],[6,170,244,300,false]],
    [ "#f0f", "#60f", "#f60", "#ff0" ],
    "",
    0,
]

const STAR_TEXTS = [
    // '<span style="filter: grayscale(1); opacity: 0.3">&#x2b50;&#x2b50;&#x2b50;</span>', // no need for zero stars for now
    '&#x2b50;<span style="filter: grayscale(1); opacity: 0.3">&#x2b50;&#x2b50;</span>',
    '&#x2b50;&#x2b50;<span style="filter: grayscale(1); opacity: 0.3">&#x2b50;</span>',
    '&#x1f31f;&#x1f31f;&#x1f31f;'
]