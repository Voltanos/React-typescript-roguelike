import {
    type StateManagerDto
} from "../DTOs/index";
import type { Level } from "../Levels";
import { Tile } from "./Tile";
import { Hero } from "./Hero";

export function Map(stateManagerDto: StateManagerDto) {
    const cameraState = stateManagerDto.managers.cameraStateManager.state;
    const worldState = stateManagerDto.managers.worldStateManager.state;
    const style = {
        width: (cameraState.width * cameraState.tileSize),
        height: (cameraState.height * cameraState.tileSize),
        top: (cameraState.top * cameraState.tileSize)
    };

    const activeLevel: Level = worldState.levels[worldState.activeLevel];

    const playerXPosition = worldState.hero.position.x - cameraState.width / 2;
    const playerYPosition = worldState.hero.position.y - cameraState.height / 2;

    let startX: number;
    let startY: number;
    
    if (activeLevel.cols - worldState.hero.position.x < cameraState.width / 2) {
        startX = activeLevel.cols - cameraState.width;
    }

    else if (worldState.hero.position.x - cameraState.width / 2 < 0) {
        startX = 0;
    }

    else {
        startX = playerXPosition;
    }

    if (activeLevel.rows - worldState.hero.position.y < cameraState.height / 2) {
        startY = activeLevel.rows - cameraState.height;
    }

    else if (worldState.hero.position.y - cameraState.height / 2 < 0) {
        startY = 0;
    }

    else {
        startY = playerYPosition;
    }

    startX = Math.round(startX);
    startY = Math.round(startY);

    const tileComps = activeLevel
        .getTileRect(startX, startY, cameraState.width, cameraState.height)
        .map((tile) => {
            const id: string = `${tile.x} ${tile.y}`;
            return (<Tile
                        key={id}
                        dto={{
                            heroPosition: worldState.hero.position,
                            key: id,
                            id: id,
                            cameraX: startX,
                            cameraY: startY,
                            map: activeLevel,
                            tileSize: cameraState.tileSize
                        }} />
            )
        });

    return (
        <div style={{ width: style.width, height: style.height, top: style.top, position: 'relative' }}>
            {tileComps}
            <Hero
                dto={{
                    position: worldState.hero.position,
                    tileSize: cameraState.tileSize,
                    cameraX: startX,
                    cameraY: startY
                }} />
        </div>
    )
}