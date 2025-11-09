import DamageReduction from '../types/damage-reduction.ts';

export default class DamageReductionService {
    getBlankDamageReductionInstance() {
        return new DamageReduction(0, 0, 0, 0);
    }
}
