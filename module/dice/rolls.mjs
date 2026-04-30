function resolveRollFormula(mode = "normal", includeBonus = false) {
    const base = mode === "advantage" ? "3d10kh2" : mode === "disadvantage" ? "3d10kl2" : "2d10";
    return includeBonus ? `${base} + @bonus` : base;
}

function modeLabel(mode = "normal") {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

const SKILL_TO_CLASSIFICATION = {
    meleeWeapons: 'melee',
    martialArts: 'melee',
    firearmsSmall: 'smallArms',
    firearmsLong: 'longArms',
    firearmsHeavy: 'heavyArms',
    grenades: 'grenade',
};

function buildSkillDamageButtons(actor, skillKey) {
    const classification = SKILL_TO_CLASSIFICATION[skillKey];
    if (!classification) return '';

    const weapons = actor.items.filter(i => i.type === 'weapon' && i.system.classification === classification);
    if (!weapons.length) return '';

    const actorUuid = escapeHtml(actor.uuid);
    const buttons = weapons.flatMap(weapon => {
        const weaponId = escapeHtml(weapon.id);
        const weaponName = escapeHtml(weapon.name);
        const btns = [`<button type="button" class="parallax-chat-button" data-parallax-chat-action="rollWeaponDamage" data-actor-uuid="${actorUuid}" data-weapon-id="${weaponId}" data-damage-mode="single">${weaponName} Dmg</button>`];
        if (String(weapon.system.damageAutomatic ?? '').trim()) {
            btns.push(`<button type="button" class="parallax-chat-button" data-parallax-chat-action="rollWeaponDamage" data-actor-uuid="${actorUuid}" data-weapon-id="${weaponId}" data-damage-mode="automatic">${weaponName} Auto Dmg</button>`);
        }
        return btns;
    });

    return `<div class="parallax-chat-actions">${buttons.join(' ')}</div>`;
}

function buildAttackFlavor(actor, weapon, mode, attackBonus, linkedSkill) {
    const actorUuid = escapeHtml(actor.uuid);
    const weaponId = escapeHtml(weapon.id);
    const weaponName = escapeHtml(weapon.name);
    const skillLabel = escapeHtml(linkedSkill?.label ?? weapon.system.linkedSkill ?? "Weapon Skill");
    const classification = weapon.system.classification;

    const guidance = classification === "melee"
        ? "Opposed by Evasion or Deflection. Unaware targets are hit automatically."
        : "Opposed by Evasion if the target is aware. Unaware targets are attacked as a skill check with advantage.";

    const damageButtons = [`<button type="button" class="parallax-chat-button" data-parallax-chat-action="rollWeaponDamage" data-actor-uuid="${actorUuid}" data-weapon-id="${weaponId}" data-damage-mode="single">Roll Damage</button>`];

    if (String(weapon.system.damageAutomatic ?? "").trim()) {
        damageButtons.push(`<button type="button" class="parallax-chat-button" data-parallax-chat-action="rollWeaponDamage" data-actor-uuid="${actorUuid}" data-weapon-id="${weaponId}" data-damage-mode="automatic">Roll Auto Damage</button>`);
    }

    return `
        <div class="parallax-chat-card">
            <div><strong>${weaponName} Attack</strong></div>
            <div>${skillLabel} • ${modeLabel(mode)} • Attack Bonus ${attackBonus}</div>
            <div class="parallax-chat-note">${escapeHtml(guidance)}</div>
            <div class="parallax-chat-actions">${damageButtons.join(" ")}</div>
        </div>
    `;
}

function buildDamageFlavor(weapon, damageMode, formula, damageType, strBonusApplied) {
    const label = damageMode === "automatic" ? "Auto Damage" : "Damage";
    const suffix = strBonusApplied ? ` + STR` : "";

    return `
        <div class="parallax-chat-card">
            <div><strong>${escapeHtml(weapon.name)} ${label}</strong></div>
            <div>${escapeHtml(formula)}${suffix} • ${escapeHtml(damageType)}</div>
        </div>
    `;
}

export async function rollSkillCheck(actor, skillKey, mode = "normal") {
    const skill = actor.system.skills[skillKey];
    if (!skill) return;

    const target = Number(skill.target ?? 20);
    const label = skill.label ?? skillKey;

    const roll = await new Roll(resolveRollFormula(mode)).evaluate();
    const total = roll.total;
    const success = total >= target;
    const damageButtons = buildSkillDamageButtons(actor, skillKey);

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `
            <div class="parallax-chat-card">
                <div>${label} Check (${modeLabel(mode)}) — target ${target} — ${success ? 'Success' : 'Failure'}</div>
                ${damageButtons}
            </div>`,
    });
}

export async function rollSkillContest(actor, skillKey, mode = "normal") {
    const skill = actor.system.skills[skillKey];
    if (!skill) return;

    const bonus = Number(skill.totalBonus ?? skill.bonus ?? 0);
    const label = skill.label ?? skillKey;

    const roll = await new Roll(resolveRollFormula(mode, true), { bonus }).evaluate();
    const damageButtons = buildSkillDamageButtons(actor, skillKey);

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `
            <div class="parallax-chat-card">
                <div>${label} Contest (${modeLabel(mode)}) — total bonus ${bonus}</div>
                ${damageButtons}
            </div>`,
    });
}

export async function rollSave(actor, saveKey, mode = "normal") {
    const save = actor?.system?.saves?.[saveKey];
    if (!save) return;

    const roll = await new Roll(resolveRollFormula(mode)).evaluate();
    const total = roll.total;
    const success = total >= save.target;
    const speaker = actor instanceof Actor ? ChatMessage.getSpeaker({ actor }) : ChatMessage.getSpeaker();
    const actorPrefix = actor?.name ? `${actor.name} — ` : "";

    await roll.toMessage({
        speaker,
        flavor: `${actorPrefix}${save.label} Save (${modeLabel(mode)}) — target ${save.target} — ${success ? "Success" : "Failure"}`,
    });
}

export async function rollInitiative(actor, isStatblock = false, mode = "normal") {
    const awareness = isStatblock
        ? actor.system.skills?.awareness
        : actor.system.skills?.awareness;

    const target = Number(awareness?.target ?? 20);
    const bonus = Number(awareness?.totalBonus ?? awareness?.bonus ?? actor.system.combat?.initiativeBonus ?? actor.system.defenses?.initiativeBonus ?? 0);

    const roll = await new Roll(resolveRollFormula(mode)).evaluate();
    const total = roll.total;
    const success = total >= target;

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `Initiative / Awareness Check (${modeLabel(mode)}) — target ${target} — ${success ? "Success" : "Failure"}`,
    });
}

export async function rollWeaponAttackContest(actor, weapon, mode = "normal") {
    const linkedSkill = actor.system.skills?.[weapon.system.linkedSkill];
    const skillBonus = linkedSkill?.totalBonus ?? 0;
    const manual = Number(weapon.system.manualAttackBonus ?? 0);
    const attackBonus = weapon.system.attackBonusMode === "manual" ? manual : skillBonus;

    const roll = await new Roll(resolveRollFormula(mode, true), { bonus: attackBonus }).evaluate();

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: buildAttackFlavor(actor, weapon, mode, attackBonus, linkedSkill),
    });
}

export async function rollWeaponAttackCheck(actor, weapon, mode = "normal") {
    const linkedSkill = actor.system.skills?.[weapon.system.linkedSkill];
    const skillBonus = linkedSkill?.totalBonus ?? 0;
    const manual = Number(weapon.system.manualAttackBonus ?? 0);
    const attackBonus = weapon.system.attackBonusMode === "manual" ? manual : skillBonus;
    const target = 20 - attackBonus;
    const skillLabel = linkedSkill?.label ?? weapon.system.linkedSkill ?? "Weapon Skill";

    const roll = await new Roll(resolveRollFormula(mode)).evaluate();
    const total = roll.total;
    const success = total >= target;

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `${weapon.name} Attack Check (${skillLabel}, ${modeLabel(mode)}) — target ${target} — ${success ? "Success" : "Failure"}`,
    });
}

export async function rollWeaponAttack(actor, weapon, mode = "normal") {
    return rollWeaponAttackContest(actor, weapon, mode);
}

export async function rollHitDie(actor) {
    const hitDie = Number(actor.system.identity?.hitDie ?? 8);
    const die = Math.max(1, Math.trunc(Number.isFinite(hitDie) ? hitDie : 8));
    const roll = await new Roll(`1d${die}`).evaluate();

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `${actor.name} Hit Die — d${die}`,
    });
}

export async function rollWeaponDamage(actor, weapon, damageMode = "single") {
    const mode = damageMode === "automatic" ? "automatic" : "single";
    const baseFormula = mode === "automatic"
        ? String(weapon.system.damageAutomatic ?? "").trim()
        : String(weapon.system.damageSingle ?? "").trim();

    if (!baseFormula) {
        ui.notifications?.warn(`No ${mode === "automatic" ? "automatic " : ""}damage formula is set for ${weapon.name}.`);
        return;
    }

    const isMelee = weapon.system.classification === "melee";
    const strBonus = Number(actor.system.stats?.str?.value ?? 0);
    const strBonusApplied = isMelee && mode === "single" && strBonus !== 0;
    const formula = strBonusApplied ? `${baseFormula} + @str` : baseFormula;

    const roll = await new Roll(formula, { str: strBonus }).evaluate();
    const damageType = weapon.system.damageType ?? "";

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: buildDamageFlavor(weapon, mode, formula, damageType, strBonusApplied),
    });
}
