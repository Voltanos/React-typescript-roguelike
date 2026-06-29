import {
    Room,
    rooms,
    width as RoomWidth,
    height as RoomHeight
} from "./Rooms";
import {
    type TileModel,
    type PositionModel,
    ZERO_POSITION,
    EMPTY_TILE
} from "./Models";
import {
    TileType,
    HEAL_AMOUNT,
} from "./World";
import {
    type EnemyModel,
    enemies,
    Enemy
} from "./Enemy";
import {
    type WeaponModel,
    weapons,
    Weapon
} from "./Weapon";

type ENEMYTILE = {
    [key: string]: EnemyModel
};

type WEAPONTILE = {
    [key: string]: WeaponModel
}

export interface NeighbourModel {
    outer: TileModel[],
    inner: TileModel[]
}

export class Level {
    index: number;
    cols: number;
    rows: number;
    tileMap: string[][];
    tiles: TileModel[];
    roomWalkablePositions: PositionModel[] = [];
    startPosition: PositionModel = Object.assign({}, ZERO_POSITION);
    exitPortalPosition: PositionModel = Object.assign({}, ZERO_POSITION);
    enemies: ENEMYTILE = {};
    weapons: WEAPONTILE = {};

    constructor(cols: number, rows: number, index: number) {
        this.index = index;
        this.cols = cols;
        this.rows = rows;
        this.tileMap = new Array(rows);

        for (let i = 0; i < rows; i += 1) {
            this.tileMap[i] = new Array(cols);

            for (let j = 0; j < cols; j += 1) {
                this.tileMap[i][j] = TileType.WALL;
            }
        }

        this.tiles = new Array(rows * cols);
    }

    addRoom(room: Room, x: number, y: number) {
        for (let i = y; i < RoomHeight + y; i += 1) {
            for (let j = x; j < RoomWidth + x; j += 1) {
                const tileType: string = room.tiles[i - y][j - x];
                this.tileMap[i][j] = tileType;

                if (tileType === TileType.WALKABLE) {
                    this.roomWalkablePositions.push({ x: j, y: i });
                }
            }
        }
    }

    addPaths(points: PositionModel[]) {
        for (let i = 0; i < points.length - 1; i += 1) {
            this.addPath(points[i], points[i + 1]);
        }
    }

    addPath(start: PositionModel, end: PositionModel) {
        if (start.x === end.x) {
            let s = start.y;
            let e = end.y;

            if (start.y > end.y) {
                s = end.y;
                e = start.y;
            }

            for (let i = s; i <= e; i += 1) {
                this.tileMap[i][start.x] = TileType.WALKABLE;
            }
        }

        else if (start.y === end.y) {
            let s = start.x;
            let e = end.x;

            if (start.x > end.x) {
                s = end.x;
                e = start.x;
            }

            for (let i = s; i <= e; i += 1) {
                this.tileMap[start.y][i] = TileType.WALKABLE;
            }
        }
    }

    getTile(x: number, y: number): TileModel {
        if (x > this.cols - 1 ||
            y > this.rows - 1 ||
            x < 0 ||
            y < 0
        ) {
            return EMPTY_TILE;
        }

        return this.tiles[y * this.cols + x];
    }

    getTileByID(id: string): TileModel {
        const split = id.split(' ');
        const x = parseInt(split[0], 10);
        const y = parseInt(split[1], 10);

        return this.getTile(x, y);
    }

    getTileRect(x: number, y: number, width: number, height: number): TileModel[] {
        const tiles2d: TileModel[][] = new Array(this.rows);

        // Make a sane 2D array first.
        for (let i = 0; i < this.rows; i += 1) {
            tiles2d[i] = new Array(this.cols);

            for (let j = 0; j < this.cols; j += 1) {
                tiles2d[i][j] = this.tiles[i * this.cols + j];
            }
        }

        // Now copy a rect.
        const rect: TileModel[][] = new Array(height);
        for (let i = 0; i < height; i += 1) {
            rect[i] = new Array(width);

            for (let j = 0; j < width; j += 1) {
                const tile: TileModel = tiles2d[i + y][j + x];

                if (!tile) {
                    continue;
                }

                rect[i][j] = tile;
            }
        }

        // Flatten the rect.
        const reduceRect: TileModel[] = rect.reduce((a, b) => {
            return a.concat(b);
        });

        return reduceRect;
    }

    init() {
        for (let i = 0; i < this.rows; i += 1) {
            for (let j = 0; j < this.cols; j += 1) {
                this.tiles[i * this.cols + j] = this.createTile(j, i, this.tileMap[i][j]);
            }
        }

        this.setStartPosition();
    }

    createTile(x: number, y: number, tileType: string): TileModel {
        return {
            x: x,
            y: y,
            type: tileType,
            info: ''
        };
    }

    setStartPosition() {
        this.startPosition = this.getRandomWalkablePosition();
    }

    setReturnPortal() {
        const tile: TileModel = this.tiles[this.startPosition.y * this.cols + this.startPosition.x];
        tile.type = TileType.RETURN_PORTAL;
        this.setInfoTiles(tile, `Back to level ${this.index}.`);
    }

    setExitPortal() {
        this.exitPortalPosition = this.getRandomWalkablePosition();
        const tile: TileModel = this.tiles[this.exitPortalPosition.y * this.cols + this.exitPortalPosition.x];
        tile.type = TileType.EXIT_PORTAL;
        this.setInfoTiles(tile, `Portal to level ${this.index + 2}.`);
    }

    setHealthPickups(count: number) {
        for (let i = 0; i < count; i += 1) {
            const pos: PositionModel = this.getRandomWalkablePosition();
            const tile: TileModel = this.tiles[pos.y * this.cols + pos.x];
            tile.type = TileType.HEALTH_PICKUP;
            this.setInfoTiles(tile, `Health + ${HEAL_AMOUNT}%`);
        }
    }

    setEnemy(enemyLevel: string) {
        const enemy: Enemy = new Enemy(enemies[enemyLevel]);
        if (enemyLevel !== 'boss') {
            const position: PositionModel = this.getRandomWalkablePosition();
            this.setEnemyTile(position, enemy);
        }

        else {
            const positions = this.getBossTiles();
            positions.forEach((position) => {
                this.setEnemyTile(position, enemy);
            })
        }
    }

    setEnemyTile(position: PositionModel, enemy: Enemy) {
        if (!this.tiles[position.y * this.cols + position.x]) {
            // NOTE:  Debugging code?
            console.log(position);
        }

        const tile: TileModel = this.tiles[position.y * this.cols + position.x];
        tile.type = TileType.ENEMY;
        this.setInfoTiles(tile, enemy.getInfo());
        this.enemies[`${position.x} ${position.y}`] = enemy.enemyModel;
    }

    setEnemies(enemyLevel: string, count: number) {
        for (let i = 0; i < count; i += 1) {
            this.setEnemy(enemyLevel);
        }
    }

    destroyEnemy(id: string) {
        const pos: PositionModel = this.getPositionFromId(id);
        this.tiles[pos.y * this.cols + pos.x].type = TileType.WALKABLE;
        this.removeInfoTiles(this.tiles[pos.y * this.cols + pos.x]);
        delete this.enemies[id];
    }

    // TODO:  Merge with setEnemy?
    setWeapon(weaponName: string) {
        const weapon: Weapon = new Weapon(weapons[weaponName]);
        const position = this.getRandomWalkablePosition();
        const tile: TileModel = this.tiles[position.y * this.cols + position.x];
        tile.type = TileType.WEAPON;
        this.setInfoTiles(tile, `${weapon.weaponModel.name}`);
        this.weapons[`${position.x} ${position.y}`] = weapon.weaponModel;
    }

    // TODO:  Merge destroyWeapon and destroyEnemy?
    destroyWeaponn(id: string) {
        const pos: PositionModel = this.getPositionFromId(id);
        this.tiles[pos.y * this.cols + pos.x].type = TileType.WALKABLE;
        this.removeInfoTiles(this.tiles[pos.y * this.cols + pos.x]);
        delete this.weapons[id];
    }

    setInfoTiles(tile: TileModel, info: string) {
        const neighbours: NeighbourModel = this.getTileNeighbours(tile);

        neighbours.inner.forEach((neighbour) => {
            if (this.reserveWalkablePosition(neighbour)) {
                this.tiles[neighbour.y * this.cols + neighbour.x].info = info;
            }
        });

        neighbours.outer.forEach((neighbour) => {
            this.reserveWalkablePosition(neighbour);
        });
    }

    destroyTile(x: number, y: number) {
        const tile: TileModel = this.tiles[y * this.cols + x];
        tile.type = TileType.WALKABLE;
        this.removeInfoTiles(tile);
    }

    removeInfoTiles(tile: TileModel) {
        const neighbours: NeighbourModel = this.getTileNeighbours(tile);

        neighbours.inner.forEach((neighbour) => {
            const index: number = neighbour.y * this.cols + neighbour.x;

            if (this.tiles[index]) {
                this.tiles[index].info = '';
                this.roomWalkablePositions.push({ x: neighbour.x, y: neighbour.y });
            }
        });

        neighbours.outer.forEach((neighbour) => {
            const index: number = neighbour.y * this.cols + neighbour.x;

            if (this.tiles[index]) {
                this.roomWalkablePositions.push({ x: neighbour.x, y: neighbour.y });
            }
        })
    }

    getTileNeighbours(tile: TileModel): NeighbourModel {
        return {
            outer: [
                { x: tile.x - 2, y: tile.y, type: TileType.WALKABLE, info: '' },
                { x: tile.x, y: tile.y - 2, type: TileType.WALKABLE, info: '' },
                { x: tile.x, y: tile.y + 2, type: TileType.WALKABLE, info: '' },
                { x: tile.x + 2, y: tile.y, type: TileType.WALKABLE, info: '' },
                { x: tile.x + 1, y: tile.y + 2, type: TileType.WALKABLE, info: '' },
                { x: tile.x + 1, y: tile.y - 2, type: TileType.WALKABLE, info: '' },
                { x: tile.x - 1, y: tile.y - 2, type: TileType.WALKABLE, info: '' },
                { x: tile.x - 1, y: tile.y + 2, type: TileType.WALKABLE, info: '' }
            ],
            inner: [
                { x: tile.x - 1, y: tile.y, type: TileType.WALKABLE, info: '' },
                { x: tile.x, y: tile.y - 1, type: TileType.WALKABLE, info: '' },
                { x: tile.x, y: tile.y + 1, type: TileType.WALKABLE, info: '' },
                { x: tile.x + 1, y: tile.y, type: TileType.WALKABLE, info: '' },
                { x: tile.x + 1, y: tile.y + 1, type: TileType.WALKABLE, info: '' },
                { x: tile.x + 1, y: tile.y - 1, type: TileType.WALKABLE, info: '' },
                { x: tile.x - 1, y: tile.y - 1, type: TileType.WALKABLE, info: '' },
                { x: tile.x - 1, y: tile.y + 1, type: TileType.WALKABLE, info: '' }
            ]
        };
    }

    getRandomWalkablePosition(): PositionModel {
        const rand: number = Math.floor(Math.random() * this.roomWalkablePositions.length);
        return this.roomWalkablePositions.splice(rand, 1)[0];
    }

    /*
        Pick a random position from a collection positions such that position
        has 3 free positions on the right, bottom, and bottom right.
    */
    getBossTiles(): PositionModel[] {
        const bossPositions: PositionModel[][] = this.roomWalkablePositions
            .filter((p) => {
                const tiles = [
                    { x: p.x + 1, y: p.y },
                    { x: p.x + 1, y: p.y + 1 },
                    { x: p.x, y: p.y + 1 }
                ];
                let allFree: boolean = true;

                for (let i = 0; i < 3; i += 1) {
                    const tile: TileModel = this.tiles[tiles[i].y * this.cols + tiles[i].x];
                    if (!tile || tile.type !== TileType.WALKABLE) {
                        allFree = false;
                        break;
                    }
                }

                return (allFree);
            })
            .map((p) => [
                { x: p.x, y: p.y },
                { x: p.x + 1, y: p.y },
                { x: p.x + 1, y: p.y + 1 },
                { x: p.x, y: p.y + 1 }
            ]);

        const rand: number = Math.round(Math.random() * bossPositions.length);
        this.roomWalkablePositions = this.roomWalkablePositions.filter((p) => {
            let unused: boolean = true;

            bossPositions[rand].forEach((pos) => {
                if (pos.x === p.x && pos.y === p.y) {
                    unused = false;
                }
            })

            return unused;
        });

        return bossPositions[rand];
    }

    getPositionFromId(id: string) {
        const idSplit: string[] = id.split(' ');
        return { x: parseInt(idSplit[0], 10), y: parseInt(idSplit[1], 10) };
    }

    reserveWalkablePosition(tile: TileModel) {
        if (this.tiles[tile.y * this.cols + tile.x]) {
            this.roomWalkablePositions = this.roomWalkablePositions
                .filter((item) => {
                    return (item.x !== tile.x || item.y !== tile.y);
                });
            return true;
        }

        else {
            return false;
        }
    }
}

export function init(): Level[] {
    const levels: Level[] = [];

    levels.push(new Level(40, 40, 0));
    levels[0].addRoom(rooms[0], 3, 20);
    levels[0].addRoom(rooms[3], 20, 23);
    levels[0].addRoom(rooms[1], 15, 0);
    levels[0].addPaths([
        { x: 13, y: 20 },
        { x: 13, y: 7 },
        { x: 15, y: 7 }
    ]);
    levels[0].addPaths([
        { x: 23, y: 15 },
        { x: 23, y: 23 }
    ]);
    levels[0].init();
    levels[0].setHealthPickups(10);
    levels[0].setEnemies('level1', 10);
    levels[0].setWeapon('Dagger');
    levels[0].setExitPortal();

    levels.push(new Level(60, 60, 1));
    levels[1].addRoom(rooms[2], 23, 23);
    levels[1].addRoom(rooms[0], 5, 5);
    levels[1].addRoom(rooms[1], 5, 40);
    levels[1].addRoom(rooms[4], 40, 40);
    levels[1].addRoom(rooms[3], 40, 5);
    levels[1].addPaths([
        { x: 23, y: 25 },
        { x: 23, y: 18 },
        { x: 20, y: 18 }
    ]);
    levels[1].addPaths([
        { x: 23, y: 35 },
        { x: 18, y: 35 },
        { x: 18, y: 40 }
    ]);
    levels[1].addPaths([
        { x: 38, y: 30 },
        { x: 45, y: 30 },
        { x: 45, y: 40 }
    ]);
    levels[1].addPaths([
        { x: 38, y: 26 },
        { x: 46, y: 26 },
        { x: 46, y: 20 }
    ]);
    levels[1].init();
    levels[1].setHealthPickups(10);
    levels[1].setEnemies('level2', 10);
    levels[1].setWeapon('ShortSword');
    levels[1].setReturnPortal();
    levels[1].setExitPortal();

    levels.push(new Level(60, 60, 2));
    levels[2].addRoom(rooms[0], 0, 45);
    levels[2].addRoom(rooms[1], 20, 45);
    levels[2].addRoom(rooms[2], 40, 45);
    levels[2].addRoom(rooms[3], 10, 25);
    levels[2].addRoom(rooms[4], 30, 25);
    levels[2].addRoom(rooms[5], 45, 0);
    levels[2].addPaths([
        { x: 15, y: 52 },
        { x: 20, y: 52 }
    ]);
    levels[2].addPaths([
        { x: 35, y: 52 },
        { x: 40, y: 52 }
    ]);
    levels[2].addPaths([
        { x: 12, y: 45 },
        { x: 12, y: 40 }
    ]);
    levels[2].addPaths([
        { x: 25, y: 28 },
        { x: 30, y: 28 }
    ]);
    levels[2].addPaths([
        { x: 45, y: 30 },
        { x: 50, y: 30 },
        { x: 50, y: 45 }
    ]);
    levels[2].addPaths([
        { x: 38, y: 25 },
        { x: 38, y: 8 },
        { x: 45, y: 8 }
    ]);
    levels[2].init();
    levels[2].setEnemy('boss');
    levels[2].setHealthPickups(10);
    levels[2].setEnemies('level3', 10);
    levels[2].setWeapon('LongSword');
    levels[2].setReturnPortal();

    return levels;
}