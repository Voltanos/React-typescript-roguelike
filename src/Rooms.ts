import { TileType } from "./World";

export const width: number = 15;
export const height: number = 15;

export class Room {
    tiles: string[][];

    constructor() {
        this.tiles = this.makeEmptyRoom();
    }

    addWall(x: number, y: number, width: number, height: number) {
        for (let i = y; i < y + height; i += 1) {
            for (let j = x; j < x + width; j += 1) {
                this.tiles[i][j] = TileType.WALL;
            }
        }
    }

    makeEmptyRoom() {
        const tiles: string[][] = new Array(height);

        for (let i = 0; i < height; i += 1) {
            tiles[i] = new Array(width);

            for (let j = 0; j < width; j += 1) {
                tiles[i][j] = TileType.WALKABLE
            }
        }

        return tiles;
    }
}

const rooms: Room[] = [];

rooms.push(new Room());
rooms[0].addWall(3, 6, 10, 2);

rooms.push(new Room());
rooms[1].addWall(4, 6, 8, 3);
rooms[1].addWall(6, 4, 3, 8);

rooms.push(new Room());
rooms[2].addWall(5, 5, 5, 5);

rooms.push(new Room());
rooms[3].addWall(3, 3, 4, 10);
rooms[3].addWall(9, 3, 4, 10);

rooms.push(new Room());
rooms[4].addWall(3, 10, 6, 3);
rooms[4].addWall(7, 3, 6, 3);

rooms.push(new Room());
export { rooms };