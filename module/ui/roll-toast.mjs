const CONTAINER_ID = 'pp-roll-toast-container';
const DURATION_MS = 4500;

function getOrCreateContainer() {
    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
        container = document.createElement('div');
        container.id = CONTAINER_ID;
        document.body.appendChild(container);
    }
    return container;
}

function dismiss(toast) {
    toast.classList.remove('pp-roll-toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

export function showRollToast(message) {
    if (!game.user.isGM) return;
    if (!message.rolls?.length) return;

    const speaker = message.speaker?.alias ?? 'Unknown';
    const flavor = message.flavor ?? '';
    const total = message.rolls[0].total;

    const toast = document.createElement('div');
    toast.className = 'pp-roll-toast';
    toast.innerHTML = `
        <div class="pp-roll-toast__speaker">${speaker}</div>
        ${flavor ? `<div class="pp-roll-toast__flavor">${flavor}</div>` : ''}
        <div class="pp-roll-toast__total">${total}</div>
    `;

    const container = getOrCreateContainer();
    container.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('pp-roll-toast--visible'));
    });

    const timer = setTimeout(() => dismiss(toast), DURATION_MS);
    toast.addEventListener('click', () => { clearTimeout(timer); dismiss(toast); });
}
