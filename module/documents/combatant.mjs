export class ParallaxCombatant extends Combatant {
    getInitiativeRoll(formula) {
        const actor = this.actor;
        if (!actor) return super.getInitiativeRoll('1d20');

        let bonus;
        if (['npc', 'robot', 'creature'].includes(actor.type)) {
            bonus = Number(actor.system.defenses?.initiativeBonus ?? 0);
        } else {
            bonus = Number(actor.system.combat?.initiativeBonus ?? 0);
        }

        return new Roll(bonus !== 0 ? `1d20 + ${bonus}` : '1d20');
    }
}
