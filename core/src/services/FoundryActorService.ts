import type Actor from '../types/actor.ts';
import type Attack from '../types/attack.ts';
import type { SkillName } from '../types/skill-name.ts';
import { SkillNames } from '../types/skill-name.ts';
import Skill from '../types/skill.ts';
import { writeFile } from 'node:fs/promises';

export default class FoundryActorService {
    hp = 0;
    constructor(private actor: Actor) {
        this.hp = (this.actor.hitDie.diceNumber / 2 + this.actor.hitDie.bonus) * this.actor.level;
    }

    getTotalSkillBonusIfSkillExists(skillName: SkillName) {
        const actorSKill = this.actor.skills.find(
            (actorSkill) => actorSkill.skill.name === skillName
        );
        if (actorSKill) {
            return actorSKill.totalSkillBonus;
        } else {
            return 0;
        }
    }

    async outputJson() {
        const json = `{
            "name": "${this.actor.name}",
            "type": "character",
            "folder": null,
            "img": "icons/svg/mystery-man.svg",
            "system": {
                "biography": "",
                "health": {
                    "value": ${this.hp},
                    "min": 0,
                    "max": ${this.hp}
                },
                "power": {
                    "value": 30,
                    "min": 0,
                    "max": 30
                },
                "attributes": {
                    "StatBonuses": {
                        "STR": {
                            "value": 0,
                            "label": "Strength",
                            "dtype": "Number",
                            "group": "StatBonuses"
                        },
                        "DEX": {
                            "value": 0,
                            "label": "Dexterity",
                            "dtype": "Number",
                            "group": "StatBonuses"
                        },
                        "CON": {
                            "value": 0,
                            "label": "Constitution",
                            "dtype": "Number",
                            "group": "StatBonuses"
                        },
                        "INT": {
                            "value": 0,
                            "label": "Intelligence",
                            "dtype": "Number",
                            "group": "StatBonuses"
                        },
                        "WIS": {
                            "value": 0,
                            "label": "Wisdom",
                            "dtype": "Number",
                            "group": "StatBonuses"
                        },
                        "CHA": {
                            "value": 0,
                            "label": "Wisdom",
                            "dtype": "Number",
                            "group": "StatBonuses"
                        }
                    },
                    "Skills": {
                        "LongArms": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.FirearmsLong)},
                            "label": "Long Arms",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "MeleeWeapons": {
                            "value":  ${this.getTotalSkillBonusIfSkillExists(SkillNames.MeleeWeapons)},
                            "label": "Melee Weapons",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "SmallArms": {
                            "value":  ${this.getTotalSkillBonusIfSkillExists(SkillNames.FirearmsSmall)},
                            "label": "Small Arms",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Grenades": {
                            "value":  ${this.getTotalSkillBonusIfSkillExists(SkillNames.Grenades)},
                            "label": "Grenades",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Gunnery": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Gunnery)},
                            "label": "Gunnery",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "HeavyWeapons": {
                            "value":  ${this.getTotalSkillBonusIfSkillExists(SkillNames.FirearmsHeavy)},
                            "label": "Heavy Weapons",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Chemistry": {
                            "value":  ${this.getTotalSkillBonusIfSkillExists(SkillNames.Chemistry)},
                            "label": "Chemistry",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Computers": {
                            "value":  ${this.getTotalSkillBonusIfSkillExists(SkillNames.Computers)},
                            "label": "Computers",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Cultures": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Cultures)},
                            "label": "Cultures",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Engineering": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Engineering)},
                            "label": "Engineering",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Medicine": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Medicine)},
                            "label": "Medicine",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Acrobatics": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Acrobatics)},
                            "label": "Acrobatics",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Athletics": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Athletics)},
                            "label": "Athletics",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "GroundVehicles": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.GroundVehicles)},
                            "label": "Ground Vehicles",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Survival": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Survival)},
                            "label": "Survival",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Bureaucracy": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Bureaucracy)},
                            "label": "Bureaucracy",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Interrogation": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Interrogation)},
                            "label": "Interrogation",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Stealth": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Stealth)},
                            "label": "Stealth",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Trading": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Trading)},
                            "label": "Trading",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Deflection": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Deflection)},
                            "label": "Deflection",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "Evasion": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Evasion)},
                            "label": "Evasion",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "StreetSmarts": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.Streetsmarts)},
                            "label": "Street Smarts",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "StarshipPiloting": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.StarshipPiloting)},
                            "label": "Starship Piloting",
                            "dtype": "Number",
                            "group": "Skills"
                        },
                        "AircraftPiloting": {
                            "value": ${this.getTotalSkillBonusIfSkillExists(SkillNames.AircraftPilot)},
                            "label": "Aircraft Piloting",
                            "dtype": "Number",
                            "group": "Skills"
                        }
                    },
                    "Combat": {
                        "KDR": {
                            "value": ${this.actor.kineticDamageReduction.total},
                            "label": "Kinetic Damage Resistance",
                            "dtype": "Number",
                            "group": "Combat"
                        },
                        "EDR": {
                            "value": ${this.actor.energyDamageReduction.total},
                            "label": "Energy Damage Resistance",
                            "dtype": "Number",
                            "group": "Combat"
                        }
                    },
                    "SavingThrows": {
                        "Allergy": {
                            "value": 0,
                            "label": "Allergy",
                            "dtype": "Number",
                            "group": "SavingThrows"
                        },
                        "Gas": {
                            "value": 0,
                            "label": "Gas",
                            "dtype": "Number",
                            "group": "SavingThrows"
                        },
                        "Poison": {
                            "value": 0,
                            "label": "Poison",
                            "dtype": "Number",
                            "group": "SavingThrows"
                        },
                        "Stun": {
                            "value": 0,
                            "label": "Stun",
                            "dtype": "Number",
                            "group": "SavingThrows"
                        },
                        "Radiation": {
                            "value": 0,
                            "label": "Radiation",
                            "dtype": "Number",
                            "group": "SavingThrows"
                        }
                    }
                },
                "groups": {
                    "StatBonuses": {
                        "key": "StatBonuses",
                        "label": "Stat Bonuses",
                        "dtype": "Number"
                    },
                    "Skills": {
                        "key": "Skills",
                        "label": "Total Skill Bonuses",
                        "dtype": "Number"
                    },
                    "Combat": {
                        "key": "Combat",
                        "label": "",
                        "dtype": "String"
                    },
                    "SavingThrows": {
                        "key": "SavingThrows",
                        "label": "Saving Throws",
                        "dtype": "Number"
                    }
                }
            },
            "prototypeToken": {
                "name": "${this.actor.name}",
                "displayName": 0,
                "actorLink": true,
                "width": 1,
                "height": 1,
                "texture": {
                    "src": "icons/svg/mystery-man.svg",
                    "anchorY": 0.5,
                    "offsetX": 0,
                    "offsetY": 0,
                    "fit": "contain",
                    "scaleX": 1,
                    "scaleY": 1,
                    "rotation": 0,
                    "tint": "#ffffff",
                    "alphaThreshold": 0.75
                },
                "lockRotation": true,
                "rotation": 0,
                "alpha": 1,
                "disposition": -1,
                "displayBars": 30,
                "bar1": {
                    "attribute": "health"
                },
                "bar2": {
                    "attribute": "power"
                },
                "light": {
                    "negative": false,
                    "priority": 0,
                    "alpha": 0.5,
                    "angle": 360,
                    "bright": 0,
                    "color": null,
                    "coloration": 1,
                    "dim": 0,
                    "attenuation": 0.5,
                    "luminosity": 0.5,
                    "saturation": 0,
                    "contrast": 0,
                    "shadows": 0,
                    "animation": {
                        "type": null,
                        "speed": 5,
                        "intensity": 5,
                        "reverse": false
                    },
                    "darkness": {
                        "min": 0,
                        "max": 1
                    }
                },
                "sight": {
                    "enabled": true,
                    "range": 0,
                    "angle": 360,
                    "visionMode": "basic",
                    "color": null,
                    "attenuation": 0.1,
                    "brightness": 0,
                    "saturation": 0,
                    "contrast": 0
                },
                "detectionModes": [],
                "occludable": {
                    "radius": 0
                },
                "ring": {
                    "enabled": false,
                    "colors": {
                        "ring": null,
                        "background": null
                    },
                    "effects": 0,
                    "subject": {
                        "scale": 1,
                        "texture": null
                    }
                },
                "turnMarker": {
                    "mode": 1,
                    "animation": null,
                    "src": null,
                    "disposition": false
                },
                "movementAction": null,
                "flags": {},
                "randomImg": false,
                "appendNumber": false,
                "prependAdjective": false
            },
            "items": [
                ${this.getAttacksAsItems()}
            ],
            "effects": [],
            "flags": {},
            "_stats": {
                "coreVersion": "13.347",
                "systemId": "worldbuilding",
                "systemVersion": "0.8.2",
                "createdTime": 1758588861236,
                "modifiedTime": 1761087144910,
                "lastModifiedBy": "43ZsAUIqWWCyHqBS",
                "exportSource": {
                    "worldId": "parallax-protocol",
                    "uuid": "Actor.ifoo73yesGJtiocL",
                    "coreVersion": "13.347",
                    "systemId": "worldbuilding",
                    "systemVersion": "0.8.2"
                }
            }
        }
        `;
        console.log(json);
        return this.writeStringToFile(
            `/Users/michaelturbe/Downloads/${this.actor.name}.json`,
            json
        );
    }

    getAttacksAsItems(): string {
        let finalOutput = '';
        this.actor.attacks?.forEach((attack) => {
            if (finalOutput !== '') {
                finalOutput += ',';
            }
            finalOutput += this.getJsonForAttack(this.actor, attack);
        });
        return finalOutput;
    }

    getSkillNameForAttack(attack: Attack): string {
        if (attack.associatedSkill.skill.name == SkillNames.FirearmsSmall) {
            return 'Small Arms';
        } else if (attack.associatedSkill.skill.name == SkillNames.FirearmsLong) {
            return 'Long Arms';
        } else if (attack.associatedSkill.skill.name == SkillNames.FirearmsHeavy) {
            return 'Heavy Arms';
        } else {
            return attack.associatedSkill.skill.name;
        }
    }

    getJsonForAttack(actor: Actor, attack: Attack): string {
        const itemJson = `{
                    "name": "${attack.weapon.name}",
                    "type": "item",
                    "_id": "8GlF4KTMFDuYYAwL",
                    "img": "icons/creatures/claws/claw-curved-jagged-gray.webp",
                    "system": {
                        "description": "",
                        "quantity": 1,
                        "weight": 0,
                        "attributes": {
                            "ApplicableSkill": {
                                "value": "${this.getSkillNameForAttack(attack)}",
                                "label": "Applicable Skill",
                                "dtype": "String",
                                "group": ""
                            },
                            "DamageRoll": {
                                "value": "${this.getDamageRollForAttack(attack)}",
                                "label": "Damage Roll",
                                "dtype": "Formula",
                                "group": ""
                            },
                            "DamageType": {
                                "value": "${attack.weapon.primaryDamageType}(${attack.weapon.primarySubDamageType})",
                                "label": "Damage Type",
                                "dtype": "String",
                                "group": ""
                            }
                        },
                        "groups": {}
                    },
                    "effects": [],
                    "folder": null,
                    "sort": 0,
                    "flags": {},
                    "_stats": {
                        "coreVersion": "13.347",
                        "systemId": "worldbuilding",
                        "systemVersion": "0.8.2",
                        "lastModifiedBy": null
                    }
                }`;
        return itemJson;
    }

    getDamageRollForAttack(attack: Attack) {
        let bonus = '';
        if (
            attack.associatedSkill.skill.name === SkillNames.MeleeWeapons ||
            attack.associatedSkill.skill.name === SkillNames.MartialArts
        ) {
            bonus = ` + @StatBonuses.STR`;
        }
        return `${attack.weapon.damage.diceNumber}${attack.weapon.damage.dieType} ${bonus}`;
    }

    /**
     * Writes a string to a file.
     *
     * @param filePath - The full path of the file to write
     * @param contents - The string contents to write into the file
     */
    async writeStringToFile(filePath: string, contents: string): Promise<void> {
        await writeFile(filePath, contents, 'utf8');
    }
}
