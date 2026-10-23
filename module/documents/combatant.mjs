// Initiative is 2d10 + Awareness total skill bonus (rulebook 0.9.6.2, p. 38).
export class ParallaxCombatant extends Combatant {
    getInitiativeRoll(formula) {
        const actor = this.actor;
        if (!actor) return super.getInitiativeRoll('2d10');

        let bonus;
        if (['npc', 'robot', 'creature'].includes(actor.type)) {
            bonus = Number(actor.system.defenses?.initiativeBonus ?? 0);
        } else {
            bonus = Number(actor.system.combat?.initiativeBonus ?? 0);
        }

        return new Roll(bonus !== 0 ? '2d10 + @bonus' : '2d10', { bonus });
    }
}
