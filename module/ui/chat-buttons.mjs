import { rollWeaponDamage } from '../dice/rolls.mjs';

export function attachChatButtonListeners(root) {
    root.querySelectorAll('[data-parallax-chat-action]').forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const el = event.currentTarget;
            const action = el.dataset.parallaxChatAction;
            if (action !== 'rollWeaponDamage') return;

            const actor = await fromUuid(el.dataset.actorUuid);
            const weapon = actor?.items?.get?.(el.dataset.weaponId);

            if (!actor || !weapon) {
                ui.notifications?.warn('Could not find the actor or weapon for this damage roll.');
                return;
            }

            await rollWeaponDamage(actor, weapon, el.dataset.damageMode ?? 'single');
        });
    });
}
