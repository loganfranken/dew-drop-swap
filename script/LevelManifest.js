import TileGenerationBehavior from "./TileGenerationBehavior";

export default [

    // 0
    {
        score: 100,
        behavior: TileGenerationBehavior.None
    },

    // 1
    {
        score: 200,
        timer: 120,
        behavior: TileGenerationBehavior.None
    },

    // 2
    {
        score: 300,
        timer: 30,
        behavior: TileGenerationBehavior.Hard
    },

    // 3
    {
        score: 300,
        timer: 10,
        behavior: TileGenerationBehavior.EasyWin
    },

    // 4
    {
        score: 400,
        timer: 10,
        behavior: TileGenerationBehavior.EasyWin
    },

    // 5
    {
        score: 500,
        timer: 120,
        behavior: TileGenerationBehavior.Hard
    },

    // 6
    {
        score: 100,
        timer: 60,
        behavior: TileGenerationBehavior.None,
        blockMatching: true
    },

    // 7
    {
        score: 30,
        timer: 40,
        behavior: TileGenerationBehavior.PreSet,
        blockMatching: true
    },

    // 8
    {
        score: 1000,
        timer: 300,
        behavior: TileGenerationBehavior.None
    }
];