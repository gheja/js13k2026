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
        [ ShapeIndex.WideRectangle, 0, 80, 30,  true  ],
        [ ShapeIndex.WideRectangle, 0, 80, 56,  false ],
        [ ShapeIndex.WideRectangle, 0, 80, 82,  false ],
        [ ShapeIndex.WideRectangle, 0, 80, 108, false ],
        [ ShapeIndex.WideRectangle, 0, 80, 134, true  ],
    ],
    // [ "#ff0", "#f0f", "#f60", "#60f" ]
    [ "#0ff", "#0ff", "#04f", "#04f" ],
    "Sort the blocks by selecting two of them to swap.<br/>The ones with the diamond shape are locked.",
    0.99, // only one step away from solved
]

const PUZZLE2 =  [
    "n2",
    [
        [ ShapeIndex.Square1, 0, 30,  30,  true ],
        [ ShapeIndex.Square1, 0, 56,  30,  true ],
        [ ShapeIndex.Square1, 0, 82,  30,  true ],
        [ ShapeIndex.Square1, 0, 108, 30,  true ],

        [ ShapeIndex.Square1, 0, 30,  56,  false ],
        [ ShapeIndex.Square1, 0, 56,  56,  true  ],
        [ ShapeIndex.Square1, 0, 82,  56,  true  ],
        [ ShapeIndex.Square1, 0, 108, 56,  false ],

        [ ShapeIndex.Square1, 0, 30,  82,  false ],
        [ ShapeIndex.Square1, 0, 56,  82,  true  ],
        [ ShapeIndex.Square1, 0, 82,  82,  true  ],
        [ ShapeIndex.Square1, 0, 108, 82,  false ],

        [ ShapeIndex.Square1, 0, 30,  108, false ],
        [ ShapeIndex.Square1, 0, 56,  108, true  ],
        [ ShapeIndex.Square1, 0, 82,  108, true  ],
        [ ShapeIndex.Square1, 0, 108, 108, false ],

        [ ShapeIndex.Square1, 0, 30,  134, true  ],
        [ ShapeIndex.Square1, 0, 56,  134, true  ],
        [ ShapeIndex.Square1, 0, 82,  134, true  ],
        [ ShapeIndex.Square1, 0, 108, 134, true  ],
    ],
    // [ "#ff0", "#f0f", "#f60", "#60f" ]
    [ "#ff0", "#0f0", "#f00", "#00f" ],
    "Make sure the blocks create a gradient in all directions.",
    0.75, // 75% done
]

const PUZZLE3 =  [
    "n3",
    [
        [ ShapeIndex.Triangle1,   0, 30, 30, true  ],
        [ ShapeIndex.Triangle1,   0, 60, 30, false ],
        [ ShapeIndex.Triangle1,   0, 90, 30, true  ],
        [ ShapeIndex.Triangle1,   0, 45, 56, false ],
        [ ShapeIndex.Triangle1,   0, 75, 56, false ],
        [ ShapeIndex.Triangle1,   0, 30, 82, true  ],
        [ ShapeIndex.Triangle1,   0, 60, 82, false ],
        [ ShapeIndex.Triangle1,   0, 90, 82, true  ],
        [ ShapeIndex.Triangle1,   0, 45, 108, false ],
        [ ShapeIndex.Triangle1,   0, 75, 108, false ],

        [ ShapeIndex.Triangle1, 180, 45, 30, false ],
        [ ShapeIndex.Triangle1, 180, 75, 30, false ],
        [ ShapeIndex.Triangle1, 180, 30, 56, true  ],
        [ ShapeIndex.Triangle1, 180, 60, 56, false ],
        [ ShapeIndex.Triangle1, 180, 90, 56, true  ],
        [ ShapeIndex.Triangle1, 180, 45, 82, false ],
        [ ShapeIndex.Triangle1, 180, 75, 82, false ],
        [ ShapeIndex.Triangle1, 180, 30, 108, true  ],
        [ ShapeIndex.Triangle1, 180, 60, 108, false ],
        [ ShapeIndex.Triangle1, 180, 90, 108, true  ],

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
        [ ShapeIndex.Paralellogram1, 0, 30 +45, 30, true  ],
        [ ShapeIndex.Paralellogram1, 0, 60 +45, 30, false ],
        [ ShapeIndex.Paralellogram1, 0, 90 +45, 30, false ],
        [ ShapeIndex.Paralellogram1, 0, 120+45, 30, false ],
        [ ShapeIndex.Paralellogram1, 0, 150+45, 30, true  ],

        [ ShapeIndex.Paralellogram1, 0, 30 +30, 56, true  ],
        [ ShapeIndex.Paralellogram1, 0, 60 +30, 56, false  ],
        [ ShapeIndex.Paralellogram1, 0, 90 +30, 56, false  ],
        [ ShapeIndex.Paralellogram1, 0, 120+30, 56, false  ],
        [ ShapeIndex.Paralellogram1, 0, 150+30, 56, true  ],

        [ ShapeIndex.Paralellogram1, 0, 30 +15, 82, true  ],
        [ ShapeIndex.Paralellogram1, 0, 60 +15, 82, false ],
        [ ShapeIndex.Paralellogram1, 0, 90 +15, 82, false ],
        [ ShapeIndex.Paralellogram1, 0, 120+15, 82, false ],
        [ ShapeIndex.Paralellogram1, 0, 150+15, 82, true  ],

        [ ShapeIndex.Paralellogram1, 0, 30 , 108, true  ],
        [ ShapeIndex.Paralellogram1, 0, 60 , 108, false ],
        [ ShapeIndex.Paralellogram1, 0, 90 , 108, false ],
        [ ShapeIndex.Paralellogram1, 0, 120, 108, false ],
        [ ShapeIndex.Paralellogram1, 0, 150, 108, true  ],
   ],
    [ "#ff0", "#f0f", "#0ff", "#60f" ],
    // [ "#ff0", "#0f0", "#f00", "#0ff" ]
    "asd",
    0, // 0% done
]

const PUZZLE5 =  [
    "n5",
    [
        [ ShapeIndex.Diamond1,   0, 70 + 60*0 + 0    , 30 + 26*0    , true  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*1 + 0    , 30 + 26*0    , true  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*2 + 0    , 30 + 26*0    , true  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*3 + 0    , 30 + 26*0    , true  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*0 + 30    , 30 + 26*2    , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*1 + 30    , 30 + 26*2    , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*2 + 30    , 30 + 26*2    , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*3 + 30    , 30 + 26*2    , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*0 + 0    , 30 + 26*4    , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*1 + 0    , 30 + 26*4    , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*2 + 0    , 30 + 26*4    , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*3 + 0    , 30 + 26*4    , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*0 + 30    , 30 + 26*6   , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*1 + 30    , 30 + 26*6   , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*2 + 30    , 30 + 26*6   , false  ],
        [ ShapeIndex.Diamond1,   0, 70 + 60*3 + 30    , 30 + 26*6   , false  ],

        [ ShapeIndex.Diamond1,  60, 70 + 60*0 + 0 -15, 30 + 26*0 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*1 + 0 -15, 30 + 26*0 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*2 + 0 -15, 30 + 26*0 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*3 + 0 -15, 30 + 26*0 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*0 + 30 -15, 30 + 26*2 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*1 + 30 -15, 30 + 26*2 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*2 + 30 -15, 30 + 26*2 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*3 + 30 -15, 30 + 26*2 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*0 + 0 -15, 30 + 26*4 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*1 + 0 -15, 30 + 26*4 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*2 + 0 -15, 30 + 26*4 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*3 + 0 -15, 30 + 26*4 +26, false  ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*0 + 30 -15, 30 + 26*6 +26, true ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*1 + 30 -15, 30 + 26*6 +26, true ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*2 + 30 -15, 30 + 26*6 +26, true ],
        [ ShapeIndex.Diamond1,  60, 70 + 60*3 + 30 -15, 30 + 26*6 +26, true ],

        [ ShapeIndex.Diamond1, 120, 70 + 60*0 + 0 +15, 30 + 26*0 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*1 + 0 +15, 30 + 26*0 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*2 + 0 +15, 30 + 26*0 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*3 + 0 +15, 30 + 26*0 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*0 + 30 +15, 30 + 26*2 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*1 + 30 +15, 30 + 26*2 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*2 + 30 +15, 30 + 26*2 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*3 + 30 +15, 30 + 26*2 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*0 + 0 +15, 30 + 26*4 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*1 + 0 +15, 30 + 26*4 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*2 + 0 +15, 30 + 26*4 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*3 + 0 +15, 30 + 26*4 +26, false  ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*0 + 30 +15, 30 + 26*6 +26, true ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*1 + 30 +15, 30 + 26*6 +26, true ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*2 + 30 +15, 30 + 26*6 +26, true ],
        [ ShapeIndex.Diamond1, 120, 70 + 60*3 + 30 +15, 30 + 26*6 +26, true ],
    ],
    [ "#ff0", "#f0f", "#f60", "#60f" ],
    // [ "#ff0", "#0f0", "#f00", "#0ff" ]
    "asd",
    0, // 0% done
]
const PUZZLE6 =  [
    "n6",
    [[0,0,52.5,30,false],[0,0,52.5,82,false],[0,0,67.5,56,false],[0,0,67.5,108,false],[0,0,82.5,30,false],[0,0,82.5,82,false],[0,180,52.5,56,false],[0,180,52.5,108,false],[0,180,67.5,30,false],[0,180,67.5,82,false],[0,180,82.5,56,false],[0,180,82.5,108,false],[3,0,30,30,true],[3,0,30,82,false],[3,0,105,56,false],[3,0,105,108,true],[3,60,30,56,false],[3,60,30,108,true],[3,60,105,30,true],[3,60,105,82,false]],
    [ "#f0f", "#f60", "#60f", "#ff0" ],
    "",
    0,
]

const PUZZLE7 = [
    "n7",
    [[5,0,30,134,false],[5,0,60,82,false],[5,0,90,30,true],[5,0,90,134,false],[5,0,120,82,false],[5,0,150,134,false],[5,60,15,160,true],[5,60,45,108,false],[5,60,75,56,false],[5,60,75,160,false],[5,60,105,108,false],[5,60,135,160,false],[5,120,45,160,false],[5,120,75,108,false],[5,120,105,56,false],[5,120,105,160,false],[5,120,135,108,false],[5,120,165,160,true]],
    ["#fff", "#fff", "#f0f", "#0ff"],
    "",
    0,
]

const PUZZLE8 = [
    "n8",
    [[6,0,110,140,false],[6,300,50,36,false],[6,300,50,244,false],[6,300,170,36,false],[6,300,170,244,false],[7,0,50,192,true],[7,0,110,88,false],[7,0,170,192,true],[7,60,35,114,false],[7,60,95,218,false],[7,60,155,114,false],[7,120,35,166,false],[7,120,95,62,false],[7,120,155,166,false],[7,180,50,88,true],[7,180,110,192,false],[7,180,170,88,true],[7,240,65,166,false],[7,240,125,62,false],[7,240,185,166,false],[7,300,65,114,false],[7,300,125,218,false],[7,300,185,114,false]],
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