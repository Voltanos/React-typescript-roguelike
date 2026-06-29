import { useReducer } from "react";
import {
    Level,
    init
} from "../Levels";
import { FISTS } from "../Weapon";
import { Enemy } from "../Enemy";
import {
    type PositionModel,
    type DamageModel,
    type WeaponModel,
    type TileModel,
    ZERO_POSITION,
    DAMAGE_INITIAL_VALUE,

} from "../Models";
import {
    TileType,
    HEAL_AMOUNT,
    getHeroStats
} from '../World';

export interface HeroState {
    position: PositionModel,
    health: number,
    maxHealth: number,
    damage: DamageModel,
    xpToNext: number,
    weaponDamage: DamageModel,
    xp: number,
    level: number,
    weapon: WeaponModel
};

export const HERO_INITIAL_STATE: HeroState = {
    position: ZERO_POSITION,
    health: 0,
    maxHealth: 0,
    damage: DAMAGE_INITIAL_VALUE,
    xpToNext: 0,
    weaponDamage: DAMAGE_INITIAL_VALUE,
    xp: 0,
    level: 0,
    weapon: { name: '', dmgMod: 0 }
}

export interface HUDState {
    tileInfo: string
};

export interface WorldState {
    levels: Level[],
    activeLevel: number,
    hero: HeroState,
    hud: HUDState,
    showEndGameModal: boolean,
    win: boolean
};

export const WORLD_INITIAL_STATE: WorldState = {
    levels: [],
    activeLevel: 0,
    hero: HERO_INITIAL_STATE,
    hud: { tileInfo: '' },
    showEndGameModal: false,
    win: false
};

type WorldAction =
    | { type: 'INTERACT', payload: { position: PositionModel } }
    | { type: 'INITIALIZE' }
    | { type: 'HIDE_END_GAME' };

function worldReducer(state: WorldState = WORLD_INITIAL_STATE, action: WorldAction): WorldState {
    switch (action.type) {
        case 'INTERACT': {
            const position = state.hero.position;
            const newPosition = {
                x: position.x + action.payload.position.x,
                y: position.y + action.payload.position.y
            };
            const tile = state.levels[state.activeLevel]
                .getTile(newPosition.x, newPosition.y);

            return interactWithTile(tile, state);
        }

        case 'INITIALIZE': {
            return initialize(state);
        }

        case 'HIDE_END_GAME': {
            return Object.assign({}, state, { showEndGameModal: false });
        }

        default: {
            return state;
        }
    }
}

// NOTE:  Helper functions.
function interactWithTile(tile: TileModel, state: WorldState): WorldState {
    switch (tile.type) {
        case TileType.WALKABLE: {
            return Object.assign({}, state, {
                hero: Object.assign({}, state.hero, {
                    position: {
                        x: tile.x,
                        y: tile.y
                    }
                }),
                hud: Object.assign({}, state.hud, {
                    tileInfo: tile.info
                })
            });
        }

        case TileType.EXIT_PORTAL: {
            const newActive: number = state.activeLevel + 1;
            return Object.assign({}, state, {
                activeLevel: newActive
            },
                {
                    hero: Object.assign({}, state.hero, {
                        position: state.levels[newActive].startPosition
                    })
                });
        }

        case TileType.RETURN_PORTAL: {
            const newActive: number = state.activeLevel - 1;
            return Object.assign({}, state, {
                activeLevel: newActive
            },
                {
                    hero: Object.assign({}, state.hero, {
                        position: state.levels[newActive].startPosition
                    })
                });
        }

        case TileType.HEALTH_PICKUP: {
            const levelsClone = Object.assign({}, state.levels);
            levelsClone[state.activeLevel].destroyTile(tile.x, tile.y);

            return Object.assign({}, state, {
                hero: Object.assign({}, state.hero, {
                    position: {
                        x: tile.x,
                        y: tile.y
                    },
                    health: Math.min(
                        state.hero.health +
                        state.hero.maxHealth / HEAL_AMOUNT,
                        state.hero.maxHealth)
                }),
                levels: Object.assign({}, state.levels, levelsClone),
                hud: Object.assign({}, state.hud, {
                    tileInfo: tile.info
                })
            });
        }

        case TileType.ENEMY: {
            const enemyId = `${tile.x} ${tile.y}`;
            const levelsClone = Object.assign({}, state.levels);
            const enemyModel = levelsClone[state.activeLevel].enemies[enemyId];
            const enemy = new Enemy(enemyModel);
            const dmg = state.hero.weaponDamage;
            const t = Math.random();
            const res = enemy.takeDamage(Math.round((1 - t) * dmg.min + t * dmg.max));

            if (res.xp > 0 && res.damage === 0) {
                if (!res.finalBossWin) {//(res['bounty'] !== 'win') {
                    levelsClone[state.activeLevel].destroyEnemy(enemyId);
                    return Object.assign({}, state, {
                        hero: Object.assign({}, state.hero, addXP(state.hero, res.xp), {
                            position: {
                                x: tile.x,
                                y: tile.y
                            }
                        }),
                        levels: Object.assign({}, state.levels, levelsClone),
                        hud: Object.assign({}, state.hud, {
                            tileInfo: tile.info
                        })
                    });
                }

                else {
                    return initialize(state, 'WIN');
                }
            }

            else if (res.damage > 0 && res.xp === 0) {
                const health = state.hero.health - res.damage;
                if (health <= 0) {
                    return initialize(state, 'LOSE');
                }

                else {
                    const currentTile = levelsClone[state.activeLevel]
                        .getTile(state.hero.position.x, state.hero.position.y);

                    return Object.assign({}, state, {
                        hero: Object.assign({}, state.hero, {
                            health: health
                        })
                    }, {
                        levels: Object.assign({}, state.levels, levelsClone),
                        hud: Object.assign({}, state.hud, {
                            tileInfo: currentTile.info
                        })
                    });
                }
            }

            return state;
        }

        case TileType.WEAPON: {
            const weaponId = `${tile.x} ${tile.y}`;
            const levelsClone = Object.assign({}, state.levels);
            const weaponModel = levelsClone[state.activeLevel].weapons[weaponId];
            levelsClone[state.activeLevel].destroyWeaponn(weaponId);

            return Object.assign({}, state, {
                hero: Object.assign({}, state.hero, {
                    weapon: weaponModel,
                    weaponDamage: {
                        min: Math.round(state.hero.damage.min * weaponModel.dmgMod),
                        max: Math.round(state.hero.damage.max * weaponModel.dmgMod)
                    },
                    position: {
                        x: tile.x,
                        y: tile.y
                    }
                })
            }, {
                levels: levelsClone
            });
        }

        default: {
            return state;
        }
    }
}

function addXP(state: HeroState, bounty: number): HeroState {
    const currentXP = state.xp;
    const xpToNext = state.xpToNext;
    const currentLevel = state.level;

    if (currentXP + bounty >= xpToNext) {
        const nextStats = getHeroStats(currentLevel + 1);

        return Object.assign({}, state, {
            damage: nextStats.damage,
            weaponDamage: {
                min: Math.round(nextStats.damage.min * state.weapon.dmgMod),
                max: Math.round(nextStats.damage.max * state.weapon.dmgMod)
            },
            health: nextStats.maxHealth,
            maxHealth: nextStats.maxHealth,
            xpToNext: nextStats.xpToNext,
            level: currentLevel + 1,
            xp: currentXP + bounty - xpToNext
        });
    }

    else {
        return Object.assign({}, state, {
            xp: currentXP + bounty
        });
    }
}

function initialize(state: WorldState, endGameStatus: string = 'FIRST_RUN'): WorldState {
    const levels = init();
    const win = (endGameStatus === 'WIN');
    const show = (endGameStatus !== 'FIRST_RUN');
    const heroStats = getHeroStats(0);
    const hero: HeroState = {
        position: levels[0].startPosition,
        health: heroStats.maxHealth,
        maxHealth: heroStats.maxHealth,
        damage: heroStats.damage,
        xpToNext: heroStats.xpToNext,
        weaponDamage: {
            min: heroStats.damage.min,
            max: heroStats.damage.max
        },
        xp: 0,
        level: 0,
        weapon: FISTS
    }

    return Object.assign({}, state, {
        levels: levels,
        activeLevel: 0,
        hero: hero,
        hud: {
            tileInfo: ''
        },
        showEndGameModal: show,
        win: win
    });
}

export class WorldStateManager {
    #state: WorldState;
    #dispatch: React.ActionDispatch<[WorldAction]>;

    constructor(
        state: WorldState,
        dispatch: React.ActionDispatch<[WorldAction]>
    ) {
        this.#state = state;
        this.#dispatch = dispatch;
    }

    public get state(): WorldState {
        return this.#state;
    }

    public interact(position: PositionModel) {
        this.#dispatch({ type: 'INTERACT', payload: { position } });
    }

    public initialize() {
        this.#dispatch({ type: 'INITIALIZE' });
    }

    public hideEndGame() {
        this.#dispatch({ type: 'HIDE_END_GAME' });
    }
}

export function useWorldStateManager(): WorldStateManager {
    const [state, dispatch] = useReducer(worldReducer, WORLD_INITIAL_STATE);
    const manager: WorldStateManager = new WorldStateManager(state, dispatch);
    return manager;
}