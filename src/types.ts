type SvgInHtml = HTMLElement & SVGSVGElement
enum GameState {
    Initializing = 0,
    MainScreen,
    PuzzleActive,
}

enum PuzzleState {
    StoppedUnfinished = 0,
    StoppedFinished,
//    Running,
    PickFirstPiece,
    PickSecondPiece,
}

enum PuzzleDataIndex {
    Pieces = 0,
    Colors,
    Hint,
    StartingSolvedProgress,
}
