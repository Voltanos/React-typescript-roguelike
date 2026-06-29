export interface TileModel {
    x: number,
    y: number,
    type: string,
    info: string
};

export const EMPTY_TILE: TileModel = {
    x: 0,
    y: 0,
    type: 'WALL',
    info: ''
};

export interface PositionModel {
    x: number,
    y: number
};

export const ZERO_POSITION: PositionModel = {
    x: 0,
    y: 0
};

export interface DamageModel {
    min: number,
    max: number
};

export const DAMAGE_INITIAL_VALUE: DamageModel = {
    min: 0,
    max: 0
};

export interface HeroStatsModel {
    maxHealth: number,
    damage: DamageModel,
    xpToNext: number
}

export interface WeaponModel {
    name: string,
    dmgMod: number
};