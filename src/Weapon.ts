export interface WeaponModel {
    name: string,
    dmgMod: number
};

export const FISTS: WeaponModel = {
    name: 'Fists',
    dmgMod: 1
};

const Dagger: WeaponModel = {
    name: 'Dagger',
    dmgMod: 1.2
};

const ShortSword: WeaponModel = {
    name: 'Short Sword',
    dmgMod: 1.4
};

const LongSword: WeaponModel = {
    name: 'Long Sword',
    dmgMod: 1.6
};

type WEAPONMAP = {
    [key: string]: WeaponModel
};

export const weapons: WEAPONMAP = {
    FISTS,
    Dagger,
    ShortSword,
    LongSword
};

export class Weapon {
    weaponModel: WeaponModel;

    constructor(props: WeaponModel) {
        this.weaponModel = props;
    }
}