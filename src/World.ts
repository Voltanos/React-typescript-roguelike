import './Map.css';

import {
    type HeroStatsModel
} from './Models';

export const cols: number = 200;
export const rows: number = 100;
export const WALKABLE: string = 'WALKABLE';
export const WALL: string = 'WALL';
export const HERO_SPEED: number = 25;
export const VISION_RADIUS: number = 4;
export const HEAL_AMOUNT: number = 10;

export const TileType = {
    WALKABLE: 'WALKABLE',
    WALL: 'WALL',
    EXIT_PORTAL: 'EXIT_PORTAL',
    RETURN_PORTAL: 'RETURN_PORTAL',
    HEALTH_PICKUP: 'HEALTH_PICKUP',
    ENEMY: 'ENEMY',
    WEAPON: 'WEAPON'
};

type TILECOLORSMAP = {
    [key: string]: string
}

export const TileColors: TILECOLORSMAP = {
    WALKABLE: 'white',
    WALL: 'grey',
    EXIT_PORTAL: 'purple',
    RETURN_PORTAL: 'purple',
    HEALTH_PICKUP: 'green',
    ENEMY: 'red',
    WEAPON: 'yellow'
}

export const TileLetter: TILECOLORSMAP = {
    WALKABLE: '.',
    WALL: '#',
    EXIT_PORTAL: '>',
    RETURN_PORTAL: '<',
    HEALTH_PICKUP: '!',
    ENEMY: 'T',
    WEAPON: '!'
}

export const getHeroStats = (level: number): HeroStatsModel => ({
    maxHealth: 100 + (50 * level),
    damage: { min: 10 + (5 * level), max: 12 + (5 * level) },
    xpToNext: 450 * (level + 1)
});

export function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}