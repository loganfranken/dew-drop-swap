import LevelManifest from "./LevelManifest";
import TileGenerationBehavior from "./TileGenerationBehavior";
import Tile from "./Tile";

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
        behavior: TileGenerationBehavior.EasyWin,
        handler: (state) => {
            if(state.tileGrid.TileGenerationBehavior !== TileGenerationBehavior.Hard && state.score > (LevelManifest[state.level]/2))
            {
                state.tileGrid.tileGenerationBehavior = TileGenerationBehavior.Hard;
            }
        }
    },

    // 5
    {
        score: 1000,
        timer: 300,
        behavior: TileGenerationBehavior.Hard
    },

    // 6
    {
        score: 1000,
        timer: 300,
        behavior: TileGenerationBehavior.Hard
    },

    // 7
    {
        score: 1000,
        timer: 300,
        behavior: TileGenerationBehavior.EasyWin
    },

    // 8
    {
        score: 1000,
        timer: 300,
        behavior: TileGenerationBehavior.None
    }
];