import { generateRandomNumber } from "./World"
import { type DamageModel } from "./Models";

export interface BountyModel {
    finalBossWin: boolean,
    xp: number
}

export interface EnemyModel {
    hp: number,
    damage: DamageModel,
    bounty: BountyModel
};

const level1: EnemyModel = {
    hp: 35,
    damage: { min: 5, max: 8 },
    bounty: {
        finalBossWin: false,
        xp: 50
    }
};

const level2: EnemyModel = {
    hp: 65,
    damage: { min: 10, max: 14 },
    bounty: {
        finalBossWin: false,
        xp: 100
    }
};

const level3: EnemyModel = {
    hp: 95,
    damage: { min: 15, max: 19 },
    bounty: {
        finalBossWin: false,
        xp: 150
    }
};

const boss: EnemyModel = {
    hp: 400,
    damage: { min: 20, max: 25 },
    bounty: {
        finalBossWin: true,
        xp: 0
    }
};

type ENEMYMAP = {
    [key: string]: EnemyModel
}

export const enemies: ENEMYMAP = {
    level1,
    level2,
    level3,
    boss
};

export interface EnemyResponseModel {
    finalBossWin: boolean,
    xp: number,
    damage: number
}

export class Enemy {
    enemyModel: EnemyModel;

    constructor(props: EnemyModel) {
        this.enemyModel = props;
    }

    takeDamage(damage: number): EnemyResponseModel {
        this.enemyModel.hp -= damage;

        if (this.enemyModel.hp <= 0) {
            return {
                finalBossWin: this.enemyModel.bounty.finalBossWin,
                xp: this.enemyModel.bounty.xp,
                damage: 0
            };
        }

        else {
            return {
                finalBossWin: false,
                xp: 0,
                damage: this.getDamage()
            }
        }
    }

    getDamage() {
        return generateRandomNumber(this.enemyModel.damage.min, this.enemyModel.damage.max);
    }

    getInfo() {
        return `Enemy Attack: ${this.enemyModel.damage.min} - ${this.enemyModel.damage.max} Health: ${this.enemyModel.hp}`;
    }
}