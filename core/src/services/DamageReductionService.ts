import DamageReduction from '../types/damage-reduction.js';

export default class DamageReductionService {
    getBlankDamageReductionInstance() {
        return new DamageReduction(0, 0, 0, 0);
    }
}
