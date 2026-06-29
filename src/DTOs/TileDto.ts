import type { Level } from "../Levels"
import type { PositionModel } from "../Models"

export interface TileDto {
    dto: {
        heroPosition: PositionModel,
        key: string,
        id: string,
        cameraX: number,
        cameraY: number,
        map: Level,
        tileSize: number
    }
};