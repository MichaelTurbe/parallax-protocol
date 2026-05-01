import { rollWeaponDamage, rollDefenseContest } from '../dice/rolls.mjs';

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

export function attachChatButtonListeners(root) {
    root.querySelectorAll('[data-parallax-chat-action]').forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const el = event.currentTarget;
            const action = el.dataset.parallaxChatAction;

            if (action === 'rollWeaponDamage') {
                const actor = await fromUuid(el.dataset.actorUuid);
                const weapon = actor?.items?.get?.(el.dataset.weaponId);

                if (!actor || !weapon) {
                    ui.notifications?.warn('Could not find the actor or weapon for this damage roll.');
                    return;
                }

                await rollWeaponDamage(
                    actor,
                    weapon,
                    el.dataset.damageMode ?? 'single',
                    el.dataset.defenderUuid ?? null,
                    el.dataset.damageClass ?? null
                );
                return;
            }

            if (action === 'rollDefenseContest') {
                const defenderActor = await fromUuid(el.dataset.defenderUuid);
                if (!defenderActor) {
                    ui.notifications?.warn('Could not find the defender.');
                    return;
                }

                await rollDefenseContest(
                    defenderActor,
                    el.dataset.skillKey,
                    'normal',
                    Number(el.dataset.attackerTotal),
                    el.dataset.actorUuid,
                    el.dataset.weaponId,
                    el.dataset.damageClass ?? 'kinetic'
                );
                return;
            }

            if (action === 'applyDamage') {
                const defender = await fromUuid(el.dataset.defenderUuid);
                if (!defender) {
                    ui.notifications?.warn('Could not find the defender to apply damage.');
                    return;
                }

                const amount = Number(el.dataset.damageAmount ?? 0);
                const currentHp = Number(defender.system.hp?.value ?? 0);
                const newHp = Math.max(0, currentHp - amount);
                await defender.update({ 'system.hp.value': newHp });

                const downMsg = newHp === 0 ? ' — <strong>DOWN!</strong>' : '';
                await ChatMessage.create({
                    content: `<div class="parallax-chat-card">${escapeHtml(defender.name)} takes ${amount} damage (${currentHp} → ${newHp} HP)${downMsg}</div>`,
                    speaker: ChatMessage.getSpeaker(),
                });
                return;
            }
        });
    });
}
