import type { DamageType } from './damage-type.ts';
import type { EnergyDamageType } from './energy-damage-type.ts';
import type { KineticDamageType } from './kinetic-damage-types.ts';
import Weapon from './weapon.ts';

export default class RangedWeapon extends Weapon {
    constructor(
        name: string,
        primaryDamageType: DamageType,
        primarySubDamageType: KineticDamageType | EnergyDamageType,
        bulk: number = 0,
        price: number = 0
    ) {
        super(name, primaryDamageType, primarySubDamageType, bulk, price);
    }

    // get singleShotOrSprayDamage() :
}
