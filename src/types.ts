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

enum TransitionState {
    Finished = 0,
    EnteringPuzzle,
    EnteringPuzzle2,
    PuzzleActive,
    LeavingPuzzle,
    UpdateMainScreen,
    MainScreen,
    ResettingPuzzle,
}