import TileGenerationBehavior from "./TileGenerationBehavior";

export default [

    // 0
    {
        score: 100,
        timer: 0,
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
        timer: 120,
        behavior: TileGenerationBehavior.EasyWin
    },

    // 4
    {
        score: 400,
        timer: 300,
        behavior: TileGenerationBehavior.EasyWin
    },

    // 5
    {
        score: 1000,
        timer: 300,
        behavior: TileGenerationBehavior.Hard
    },
];