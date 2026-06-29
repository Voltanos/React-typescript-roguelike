import type { PositionModel } from "../Models"

export interface HeroDto {
    dto: {
        position: PositionModel,
        tileSize: number,
        cameraX: number,
        cameraY: number
    }
}