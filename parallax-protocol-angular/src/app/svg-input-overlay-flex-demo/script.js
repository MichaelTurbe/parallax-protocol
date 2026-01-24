(function () {
  const btn = document.getElementById('toggleAspect');
  const pill = document.getElementById('aspectState');
  const svg = document.querySelector('svg.overlay');

  // Default is "none" (stretch to exactly match the input's box).
  // Click to switch to "xMidYMid meet" (keeps aspect ratio; may letterbox).
  const states = ['none', 'xMidYMid meet'];
  let i = 0;

  btn.addEventListener('click', () => {
    i = (i + 1) % states.length;
    svg.setAttribute('preserveAspectRatio', states[i]);
    pill.textContent = states[i];
  });
})();
