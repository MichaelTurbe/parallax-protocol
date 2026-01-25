import type { DieType } from '../types/die-type.js';
import { DiceTypes } from '../types/die-type.js';

export default class DiceFormulaService {
    convertNumberToDiceType(value: number): DieType {
        switch (value) {
            case 4:
                return DiceTypes.d4;
                break;
            case 6:
                return DiceTypes.d6;
                break;
            case 8:
                return DiceTypes.d8;
                break;
            case 10:
                return DiceTypes.d10;
                break;
            case 12:
                return DiceTypes.d12;
                break;
            case 20:
                return DiceTypes.d20;
                break;
            default:
                console.log(`THAT IS NOT A VALID DICE TYPE; RETURNING D8`);
                return DiceTypes.d8;
                break;
        }
    }
}
