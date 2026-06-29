import { type TileDto } from "../DTOs";
import {
    TileColors,
    VISION_RADIUS,
    TileLetter
} from "../World";

export function Tile(tileDto: TileDto) {
    const dto = tileDto.dto;
    const tile = dto.map.getTileByID(dto.id);

    type divStyle = {
        left: number,
        bottom: number,
        width: number,
        height: number,
        position: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed',
        backgroundColor: string,
        color: string,
        zIndex: number
    };

    const lightStyle: divStyle = {
        left: (tile.x - dto.cameraX) * dto.tileSize,
        bottom: (tile.y - dto.cameraY) * dto.tileSize,
        width: dto.tileSize,
        height: dto.tileSize,
        position: 'absolute',
        backgroundColor: TileColors[tile.type],
        color: 'white',
        zIndex: 1
    }

    const darkStyle = Object.assign({},
        lightStyle,
        { backgroundColor: 'black'},
        { zIndex: 4 },
        { color: 'black' }
    );

    const diff = { x: tile.x - dto.heroPosition.x, y: tile.y - dto.heroPosition.y };
    const visible = (Math.sqrt(diff.x * diff.x + diff.y * diff.y)) <= VISION_RADIUS;
    const style = (visible) ? lightStyle : darkStyle;
    const tileLetter: string = TileLetter[tile.type];

    return (<div style={style}>{tileLetter}</div>)
}