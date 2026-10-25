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

function getActorDR(actor, damageClass) {
    if (actor.type === 'character') {
        const key = damageClass === 'energy' ? 'energy' : 'kinetic';
        return Number(actor.system.armorSummary?.total?.[key] ?? 0);
    }
    const key = damageClass === 'energy' ? 'energyDr' : 'kineticDr';
    return Number(actor.system.defenses?.[key] ?? 0);
}

function getSkillBonus(actor, skillKey) {
    const skill = actor.system.skills?.[skillKey];
    return Number(skill?.totalBonus ?? skill?.bonus ?? 0);
}

// Damage buttons for a weapon: single-shot always, plus burst when the weapon has a burst formula. With a defender,
// the resulting damage card subtracts the defender's DR and offers to apply the damage.
function buildWeaponDamageButtons(actor, weapon, { defenderUuid = null, damageClass = null, namePrefix = false } = {}) {
    const hasBurst = Boolean(String(weapon.system.damageAutomatic ?? '').trim());
    const prefix = namePrefix ? `${escapeHtml(weapon.name)} ` : '';
    const modes = hasBurst
        ? [['single', 'Single-Shot Damage'], ['automatic', 'Burst Damage']]
        : [['single', namePrefix ? 'Damage' : 'Roll Damage']];
    const defenderAttrs = defenderUuid
        ? ` data-defender-uuid="${escapeHtml(defenderUuid)}" data-damage-class="${escapeHtml(damageClass ?? weapon.system.damageClass ?? 'kinetic')}"`
        : '';

    return modes.map(([mode, label]) => `<button type="button" class="parallax-chat-button" data-parallax-chat-action="rollWeaponDamage"`
        + ` data-actor-uuid="${escapeHtml(actor.uuid)}" data-weapon-id="${escapeHtml(weapon.id)}" data-damage-mode="${mode}"${defenderAttrs}>`
        + `${prefix}${label}</button>`).join(' ');
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

    const buttons = weapons.map(weapon => buildWeaponDamageButtons(actor, weapon, { namePrefix: true }));
    return `<div class="parallax-chat-actions">${buttons.join(' ')}</div>`;
}

function buildAttackFlavor(actor, weapon, mode, attackBonus, linkedSkill, attackerTotal, defenderActor) {
    const actorUuid = escapeHtml(actor.uuid);
    const weaponId = escapeHtml(weapon.id);
    const weaponName = escapeHtml(weapon.name);
    const skillLabel = escapeHtml(linkedSkill?.label ?? weapon.system.linkedSkill ?? "Weapon Skill");
    const classification = weapon.system.classification;
    const damageClass = escapeHtml(weapon.system.damageClass ?? 'kinetic');

    const guidance = classification === "melee"
        ? "Opposed by Evasion or Deflection. Unaware targets are hit automatically."
        : "Opposed by Evasion if the target is aware. Unaware targets are attacked as a skill check with advantage.";

    let actionsSection;

    if (defenderActor) {
        const defUuid = escapeHtml(defenderActor.uuid);
        const defName = escapeHtml(defenderActor.name);
        const escapedTotal = escapeHtml(String(attackerTotal));

        if (classification === 'melee') {
            const evasionBonus = getSkillBonus(defenderActor, 'evasion');
            const deflectionBonus = getSkillBonus(defenderActor, 'deflection');
            actionsSection = `
                <div class="parallax-chat-defender">
                    <span class="parallax-chat-defender-label">${defName} defends:</span>
                    <button type="button" class="parallax-chat-button" data-parallax-chat-action="rollDefenseContest"
                        data-defender-uuid="${defUuid}" data-skill-key="evasion"
                        data-attacker-total="${escapedTotal}" data-actor-uuid="${actorUuid}"
                        data-weapon-id="${weaponId}" data-damage-class="${damageClass}">
                        Evasion (+${evasionBonus})
                    </button>
                    <button type="button" class="parallax-chat-button" data-parallax-chat-action="rollDefenseContest"
                        data-defender-uuid="${defUuid}" data-skill-key="deflection"
                        data-attacker-total="${escapedTotal}" data-actor-uuid="${actorUuid}"
                        data-weapon-id="${weaponId}" data-damage-class="${damageClass}">
                        Deflection (+${deflectionBonus})
                    </button>
                </div>`;
        } else {
            const evasionBonus = getSkillBonus(defenderActor, 'evasion');
            actionsSection = `
                <div class="parallax-chat-defender">
                    <span class="parallax-chat-defender-label">${defName} defends:</span>
                    <button type="button" class="parallax-chat-button" data-parallax-chat-action="rollDefenseContest"
                        data-defender-uuid="${defUuid}" data-skill-key="evasion"
                        data-attacker-total="${escapedTotal}" data-actor-uuid="${actorUuid}"
                        data-weapon-id="${weaponId}" data-damage-class="${damageClass}">
                        Evasion (+${evasionBonus})
                    </button>
                </div>`;
        }
    } else {
        actionsSection = `<div class="parallax-chat-actions">${buildWeaponDamageButtons(actor, weapon)}</div>`;
    }

    return `
        <div class="parallax-chat-card">
            <div><strong>${weaponName} Attack</strong></div>
            <div>${skillLabel} • ${modeLabel(mode)} • Attack Bonus ${attackBonus}</div>
            <div class="parallax-chat-note">${escapeHtml(guidance)}</div>
            ${actionsSection}
        </div>
    `;
}

function buildDamageFlavor(weapon, damageMode, formula, damageType, strBonusApplied, drSection = '', applySection = '') {
    const label = damageMode === "automatic" ? "Burst Damage" : "Damage";
    const suffix = strBonusApplied ? ` + STR` : "";

    return `
        <div class="parallax-chat-card">
            <div><strong>${escapeHtml(weapon.name)} ${label}</strong></div>
            <div>${escapeHtml(formula)}${suffix} • ${escapeHtml(damageType)}</div>
            ${drSection}
            ${applySection}
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
    const damageButtons = success ? buildSkillDamageButtons(actor, skillKey) : '';

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

// Initiative is 2d10 + Awareness total skill bonus. When the actor has exactly one combatant in the active
// combat, the result is written to the tracker; otherwise (not in combat, or several unlinked tokens of the
// same actor) it is only posted to chat.
export async function rollInitiative(actor, isStatblock = false, mode = "normal") {
    const bonus = isStatblock
        ? Number(actor.system.defenses?.initiativeBonus ?? 0)
        : Number(actor.system.combat?.initiativeBonus ?? 0);

    const roll = await new Roll(resolveRollFormula(mode, true), { bonus }).evaluate();

    const combatants = game.combat?.getCombatantsByActor(actor) ?? [];
    const combatant = combatants.length === 1 ? combatants[0] : null;
    if (combatant) await combatant.update({ initiative: roll.total });

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `Initiative (${modeLabel(mode)}) — Awareness +${bonus}${combatant ? " — set in combat tracker" : ""}`,
    });
}

export async function rollWeaponAttackContest(actor, weapon, mode = "normal") {
    const linkedSkill = actor.system.skills?.[weapon.system.linkedSkill];
    const skillBonus = linkedSkill?.totalBonus ?? 0;
    const manual = Number(weapon.system.manualAttackBonus ?? 0);
    const attackBonus = weapon.system.attackBonusMode === "manual" ? manual : skillBonus;

    const roll = await new Roll(resolveRollFormula(mode, true), { bonus: attackBonus }).evaluate();

    const targets = game.user?.targets ?? new Set();
    const targetToken = targets.size > 0 ? targets.values().next().value : null;
    const defenderActor = targetToken?.actor ?? null;

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: buildAttackFlavor(actor, weapon, mode, attackBonus, linkedSkill, roll.total, defenderActor),
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

    const actionsSection = success
        ? `<div class="parallax-chat-actions">${buildWeaponDamageButtons(actor, weapon)}</div>`
        : '';

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `
            <div class="parallax-chat-card">
                <div><strong>${escapeHtml(weapon.name)} Attack Check</strong></div>
                <div>${escapeHtml(skillLabel)} • ${modeLabel(mode)} • target ${target} — ${success ? 'Success' : 'Failure'}</div>
                ${actionsSection}
            </div>`,
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

export async function rollDefenseContest(defenderActor, skillKey, mode, attackerTotal, attackerActorUuid, weaponId, damageClass) {
    const bonus = getSkillBonus(defenderActor, skillKey);
    const skill = defenderActor.system.skills?.[skillKey];
    const skillLabel = skill?.label ?? skillKey;

    const roll = await new Roll(resolveRollFormula(mode, true), { bonus }).evaluate();
    const defTotal = roll.total;
    const attackerWins = attackerTotal > defTotal;

    let resultSection;
    if (attackerWins) {
        const attacker = await fromUuid(attackerActorUuid);
        const weapon = attacker?.items?.get(weaponId);
        const damageButtons = weapon
            ? buildWeaponDamageButtons(attacker, weapon, { defenderUuid: defenderActor.uuid, damageClass })
            : '';
        resultSection = `
            <div class="parallax-chat-result parallax-chat-result--hit">HIT</div>
            <div class="parallax-chat-actions">${damageButtons}</div>`;
    } else {
        resultSection = `<div class="parallax-chat-result parallax-chat-result--miss">MISS</div>`;
    }

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: defenderActor }),
        flavor: `
            <div class="parallax-chat-card">
                <div><strong>${escapeHtml(defenderActor.name)}</strong> — ${escapeHtml(skillLabel)} (${modeLabel(mode)}) — bonus +${bonus}</div>
                <div class="parallax-chat-contest-summary">Attacker: ${attackerTotal} vs Defender: ${defTotal} — ${attackerWins ? 'Attacker wins' : 'Defender wins (tie goes to defender)'}</div>
                ${resultSection}
            </div>`,
    });
}

export async function rollWeaponDamage(actor, weapon, damageMode = "single", defenderUuid = null, damageClass = null) {
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

    let drSection = '';
    let applySection = '';

    if (defenderUuid) {
        const defender = await fromUuid(defenderUuid);
        if (defender) {
            const effectiveClass = damageClass ?? weapon.system.damageClass ?? 'kinetic';
            const dr = getActorDR(defender, effectiveClass);
            const rawDamage = roll.total;
            const netDamage = Math.max(0, rawDamage - dr);
            const drLabel = effectiveClass === 'energy' ? 'Energy DR' : 'Kinetic DR';

            drSection = `<div class="parallax-chat-dr-calc">${rawDamage} − ${dr} ${drLabel} = <strong>${netDamage} damage</strong></div>`;
            applySection = `<div class="parallax-chat-actions">
                <button type="button" class="parallax-chat-button" data-parallax-chat-action="applyDamage"
                    data-defender-uuid="${escapeHtml(defenderUuid)}" data-damage-amount="${netDamage}">
                    Apply ${netDamage} to ${escapeHtml(defender.name)}
                </button>
            </div>`;
        }
    }

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: buildDamageFlavor(weapon, mode, formula, damageType, strBonusApplied, drSection, applySection),
    });
}
