import { PARALLAX } from "../config.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

const CORE_SKILL_KEYS = ["awareness", "deflection", "evasion"];

// ── Skill name → key lookup ───────────────────────────────────────────────────

const _skillNormMap = {};

function _normalize(name) {
    return String(name).toLowerCase().replace(/[\s\-']/g, "");
}

function _buildSkillMap() {
    if (Object.keys(_skillNormMap).length) return;
    for (const [key, skill] of Object.entries(PARALLAX.skills)) {
        _skillNormMap[_normalize(skill.label)] = key;
    }
}

function findSkillKey(rawName) {
    _buildSkillMap();
    return _skillNormMap[_normalize(rawName)] ?? null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseIntOrDefault(str, def = 0) {
    const n = parseInt(str, 10);
    return Number.isFinite(n) ? n : def;
}

// ── Parser ────────────────────────────────────────────────────────────────────

/*
 * Parses plain-text stat block format from the Parallax Protocol game book.
 *
 * Expected shape (fields may appear in any order after line 1):
 *
 *   NAME HIT DIE: D8, LEVEL: 1
 *   Optional description prose.
 *   WEAPON NAME [xN]: +BONUS FORMULA kinetic|energy (T)
 *   EVASION: +N  DEFLECTION: +N
 *   KINETIC DR: N  ENERGY DR: N
 *   SIZE: X  SPEED: N
 *   SAVING THROW TARGET: N
 *   SKILLS: name +bonus/target, name +bonus/target, ...
 */
export function parseStatblockText(rawText) {
    const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

    const result = {
        name: "New Statblock",
        hitDie: "D8",
        level: 1,
        size: "M",
        speed: 30,
        kineticDr: 0,
        energyDr: 0,
        evasionBonus: 0,
        deflectionBonus: 0,
        saveTarget: "-",
        descriptionLines: [],
        skills: {},
        weapons: [],
    };

    if (!lines.length) return result;

    // ── Line 1: NAME HIT DIE: D8, LEVEL: 1 ───────────────────────────────────
    const headerMatch = lines[0].match(/^(.+?)\s+HIT DIE:\s*(\S+?),?\s*LEVEL:\s*(\d+)/i);
    if (headerMatch) {
        result.name = headerMatch[1].trim();
        result.hitDie = headerMatch[2].toUpperCase();
        result.level = parseIntOrDefault(headerMatch[3], 1);
    } else {
        result.name = lines[0];
    }

    // ── Remaining lines ───────────────────────────────────────────────────────
    let inSkills = false;
    let skillsBuffer = "";
    let foundDataLine = false;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        // Skill section continuation: collect wrapped lines
        if (inSkills) {
            // Stop if a new keyword section starts
            if (/^[A-Z][A-Z\s]+:/.test(line) && !/\+\d+\/\d+/.test(line)) {
                inSkills = false;
            } else {
                skillsBuffer += " " + line;
                continue;
            }
        }

        // SAVING THROW TARGET: 17
        const saveMatch = line.match(/SAVING THROW TARGET:\s*(\d+)/i);
        if (saveMatch) {
            result.saveTarget = saveMatch[1];
            foundDataLine = true;
            continue;
        }

        // SKILLS: acrobatics +5/15, athletics +3/17, ...
        const skillsLineMatch = line.match(/^SKILLS:\s*(.+)/i);
        if (skillsLineMatch) {
            inSkills = true;
            skillsBuffer = skillsLineMatch[1];
            foundDataLine = true;
            continue;
        }

        // EVASION: +N  and/or  DEFLECTION: +N  (often on same line)
        {
            let hit = false;
            const em = line.match(/EVASION:\s*\+?(-?\d+)/i);
            const dm = line.match(/DEFLECTION:\s*\+?(-?\d+)/i);
            if (em) { result.evasionBonus = parseIntOrDefault(em[1]); hit = true; foundDataLine = true; }
            if (dm) { result.deflectionBonus = parseIntOrDefault(dm[1]); hit = true; foundDataLine = true; }
            if (hit) continue;
        }

        // KINETIC DR: N  and/or  ENERGY DR: N
        {
            let hit = false;
            const km = line.match(/KINETIC DR:\s*(\d+)/i);
            const em = line.match(/ENERGY DR:\s*(\d+)/i);
            if (km) { result.kineticDr = parseIntOrDefault(km[1]); hit = true; foundDataLine = true; }
            if (em) { result.energyDr = parseIntOrDefault(em[1]); hit = true; foundDataLine = true; }
            if (hit) continue;
        }

        // SIZE: X  and/or  SPEED: N
        {
            let hit = false;
            const sm = line.match(/SIZE:\s*(\S+)/i);
            const spd = line.match(/SPEED:\s*(\d+)/i);
            if (sm) { result.size = sm[1].replace(/[,;]$/, "").toUpperCase(); hit = true; foundDataLine = true; }
            if (spd) { result.speed = parseIntOrDefault(spd[1], 30); hit = true; foundDataLine = true; }
            if (hit) continue;
        }

        // Weapon: NAME [xN]: +BONUS[,] FORMULA (kinetic|energy) (TYPE_LETTER)
        // e.g.  "CLAWS x2: +4 1d6 kinetic (S)"
        //       "CLAWS x2: +7, 1d8 kinetic (S)"   ← comma variant
        //       "HEAVY LASER RIFLE: +6 2d8+2 energy (E)"
        const weaponMatch = line.match(
            /^([A-Z][A-Z0-9\s'\-/]+?)(?:\s+x\d+)?:\s*\+(\d+),?\s+(\d+d\d+(?:[+\-]\d+)?)\s+(kinetic|energy)\s+\(([A-Za-z])\)/i
        );
        if (weaponMatch) {
            const wName = weaponMatch[1].trim();
            const attackBonus = parseIntOrDefault(weaponMatch[2]);
            const damageSingle = weaponMatch[3].toLowerCase();
            const damageClass = weaponMatch[4].toLowerCase();
            const damageType = weaponMatch[5].toLowerCase();

            const upper = wName.toUpperCase();
            const isRanged = /PISTOL|RIFLE|GUN|LASER|PLASMA|BLASTER|CANNON|CARBINE|SHOT|BURST|BEAM/.test(upper);

            result.weapons.push({
                name: toTitleCase(wName),
                classification: isRanged ? "smallArms" : "melee",
                linkedSkill: isRanged ? "firearmsSmall" : "meleeWeapons",
                attackBonusMode: "manual",
                manualAttackBonus: attackBonus,
                damageClass,
                damageSingle,
                damageType,
            });
            foundDataLine = true;
            continue;
        }

        // Anything before the first recognized data line is description prose
        if (!foundDataLine) {
            result.descriptionLines.push(line);
        }
    }

    // ── Parse skills buffer ───────────────────────────────────────────────────
    if (skillsBuffer.trim()) {
        for (const entry of skillsBuffer.split(",").map((s) => s.trim()).filter(Boolean)) {
            const m = entry.match(/^(.+?)\s+\+(\d+)\/(\d+)$/);
            if (!m) continue;
            const key = findSkillKey(m[1].trim());
            if (!key) continue;
            result.skills[key] = {
                label: PARALLAX.skills[key]?.label ?? toTitleCase(m[1].trim()),
                bonus: parseIntOrDefault(m[2]),
                target: parseIntOrDefault(m[3]),
                isCore: CORE_SKILL_KEYS.includes(key),
            };
        }
    }

    // ── Ensure all three core skills are present ──────────────────────────────
    if (!result.skills.evasion) {
        result.skills.evasion = {
            label: PARALLAX.skills.evasion.label,
            bonus: result.evasionBonus,
            target: 20 - result.evasionBonus,
            isCore: true,
        };
    }
    if (!result.skills.deflection) {
        result.skills.deflection = {
            label: PARALLAX.skills.deflection.label,
            bonus: result.deflectionBonus,
            target: 20 - result.deflectionBonus,
            isCore: true,
        };
    }
    if (!result.skills.awareness) {
        result.skills.awareness = {
            label: PARALLAX.skills.awareness.label,
            bonus: 0,
            target: 20,
            isCore: true,
        };
    }

    return result;
}

// ── Application ───────────────────────────────────────────────────────────────

export class StatblockImporter extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        ...super.DEFAULT_OPTIONS,
        id: "statblock-importer",
        classes: ["parallax", "sheet", "statblock-importer"],
        tag: "form",
        window: {
            ...super.DEFAULT_OPTIONS.window,
            title: "Import Stat Block",
            resizable: false,
        },
        position: {
            ...super.DEFAULT_OPTIONS.position,
            width: 520,
            height: "auto",
        },
        form: {
            ...super.DEFAULT_OPTIONS.form,
            submitOnChange: false,
            closeOnSubmit: false,
        },
    };

    static PARTS = {
        body: {
            template: "systems/parallax-protocol/templates/apps/statblock-importer.hbs",
        },
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        return {
            ...context,
            actorTypes: { creature: "Creature", npc: "NPC", robot: "Robot" },
        };
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        htmlElement.querySelectorAll("[data-pp-action]").forEach((el) => {
            el.addEventListener("click", (event) => this._onClickAction(event, el));
        });
    }

    async _onClickAction(event, target) {
        event.preventDefault();
        event.stopPropagation();

        const action = target.dataset.ppAction;

        if (action === "cancel") return this.close();

        if (action === "import") {
            const root = this.element instanceof HTMLElement ? this.element : this.element?.[0];
            const text = root?.querySelector("textarea[name='statblockText']")?.value?.trim() ?? "";
            const actorType = root?.querySelector("select[name='actorType']")?.value ?? "creature";

            if (!text) {
                ui.notifications?.warn("Paste a stat block before importing.");
                return;
            }

            const parsed = parseStatblockText(text);
            await this._createActor(parsed, actorType);
            return this.close();
        }
    }

    async _createActor(parsed, actorType) {
        const skillsData = {};
        for (const [key, skill] of Object.entries(parsed.skills)) {
            skillsData[key] = {
                label: skill.label,
                bonus: skill.bonus,
                target: skill.target,
                isCore: skill.isCore ?? false,
            };
        }

        const actorData = {
            name: parsed.name,
            type: actorType,
            system: {
                summary: {
                    kindLabel: "",
                    level: parsed.level,
                    hitDie: parsed.hitDie,
                    size: parsed.size,
                    speed: parsed.speed,
                    saveTarget: parsed.saveTarget,
                },
                hp: { value: 0, max: 0 },
                defenses: {
                    kineticDr: parsed.kineticDr,
                    energyDr: parsed.energyDr,
                },
                skills: skillsData,
                description: parsed.descriptionLines.join(" "),
                notes: "",
            },
        };

        const actor = await Actor.create(actorData);
        if (!actor) {
            ui.notifications?.error("Failed to create actor.");
            return;
        }

        if (parsed.weapons.length) {
            await actor.createEmbeddedDocuments(
                "Item",
                parsed.weapons.map((w) => ({
                    name: w.name,
                    type: "weapon",
                    system: {
                        classification: w.classification,
                        linkedSkill: w.linkedSkill,
                        attackBonusMode: w.attackBonusMode,
                        manualAttackBonus: w.manualAttackBonus,
                        damageClass: w.damageClass,
                        damageSingle: w.damageSingle,
                        damageType: w.damageType,
                    },
                }))
            );
        }

        ui.notifications?.info(`Imported "${parsed.name}" as ${actorType}.`);
        actor.sheet?.render(true);
    }
}
