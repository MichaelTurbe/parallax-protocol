function getSkillFormula(mode) {
    if (mode === "advantage") return "3d10kh2";
    if (mode === "disadvantage") return "3d10kl2";
    return "2d10";
}

export async function rollSkillCheck(actor, skillKey, mode = "normal") {
    const skill = actor.system.skills[skillKey];
    if (!skill) return;

    const roll = await new Roll(getSkillFormula(mode)).evaluate();
    const total = roll.total;
    const success = total >= skill.target;

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `${skill.label} Check (${mode}) — target ${skill.target} — ${success ? "Success" : "Failure"}`,
    });
}

export async function rollSkillContest(actor, skillKey, mode = "normal") {
    const skill = actor.system.skills[skillKey];
    if (!skill) return;

    const roll = await new Roll(`${getSkillFormula(mode)} + @bonus`, { bonus: skill.totalBonus }).evaluate();

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `${skill.label} Contest (${mode}) — total bonus ${skill.totalBonus}`,
    });
}

export async function rollSave(actor, saveKey, mode = "normal") {
    const save = actor.system.saves[saveKey];
    if (!save) return;

    const roll = await new Roll(getSkillFormula(mode)).evaluate();
    const total = roll.total;
    const success = total >= save.target;

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `${save.label} Save (${mode}) — target ${save.target} — ${success ? "Success" : "Failure"}`,
    });
}

export async function rollInitiative(actor) {
    const roll = await new Roll("1d20 + @bonus", {
        bonus: actor.system.combat.initiativeBonus,
    }).evaluate();

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `Initiative — awareness bonus ${actor.system.combat.initiativeBonus}`,
    });
}

export async function rollWeaponAttack(actor, weapon, mode = "normal") {
    const linkedSkill = actor.system.skills?.[weapon.system.linkedSkill];
    const skillBonus = linkedSkill?.totalBonus ?? 0;
    const manual = Number(weapon.system.manualAttackBonus ?? 0);
    const attackBonus = weapon.system.attackBonusMode === "manual" ? manual : skillBonus;

    const roll = await new Roll(`${getSkillFormula(mode)} + @bonus`, { bonus: attackBonus }).evaluate();

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `${weapon.name} Attack (${mode}) — bonus ${attackBonus}`,
    });
}
