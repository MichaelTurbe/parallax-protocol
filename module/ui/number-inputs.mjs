// Browsers step a focused number input when the mouse wheel turns over it, which silently changes values while
// the user is just trying to scroll the sheet. Inside Parallax windows, swallow the wheel on number inputs and
// scroll the nearest scrollable container instead. Typing and the arrow keys still change the value.
export function disableNumberInputWheel() {
    document.addEventListener("wheel", (event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || input.type !== "number") return;
        if (!input.closest(".parallax")) return;

        event.preventDefault();
        findScrollContainer(input)?.scrollBy({ top: event.deltaY, left: event.deltaX });
    }, { capture: true, passive: false });
}

function findScrollContainer(element) {
    for (let node = element.parentElement; node; node = node.parentElement) {
        const { overflowY } = getComputedStyle(node);
        if (["auto", "scroll"].includes(overflowY) && node.scrollHeight > node.clientHeight) return node;
    }
    return null;
}
