function drawRibbon(context, width, height, progress, offsetX, offsetY) {
  context.clearRect(0, 0, width, height);

  const light = context.createLinearGradient(0, height, width, height * 0.18);
  light.addColorStop(0, 'rgba(202, 232, 189, 0)');
  light.addColorStop(0.25, 'rgba(203, 237, 195, .42)');
  light.addColorStop(0.63, 'rgba(240, 204, 139, .86)');
  light.addColorStop(0.89, 'rgba(255, 230, 178, .7)');
  light.addColorStop(1, 'rgba(255, 235, 192, 0)');
  context.strokeStyle = light;

  for (let strand = 0; strand < 5; strand += 1) {
    context.beginPath();
    context.lineWidth = strand === 2 ? 1.4 : 0.6;
    context.globalAlpha = strand === 2 ? 1 : 0.54;
    for (let point = 0; point <= 34; point += 1) {
      const t = point / 34 * progress;
      const spread = (strand - 2) * height * 0.035 * Math.sin(t * Math.PI);
      const x = width * (-0.08 + t * 1.19) + offsetX * (t - 0.18);
      const y = height * (0.79 - t * 0.52 + Math.sin(t * 3.88) * 0.235) + spread + offsetY * Math.sin(t * 2.6);
      if (point === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }
  context.globalAlpha = 1;
}

export function installCinemaMotion(stage, canvas) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let started = null;
  let visible = true;
  let width = 0;
  let height = 0;
  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;

  function requestDraw() {
    if (!frame && visible && !preference.matches) frame = window.requestAnimationFrame(draw);
  }

  function draw(time) {
    frame = 0;
    if (!visible || preference.matches || !width || !height) return;

    started ??= time;
    x += (targetX - x) * 0.15;
    y += (targetY - y) * 0.15;

    const progress = Math.min((time - started) / 1450, 1);
    const eased = 1 - (1 - progress) ** 3;
    drawRibbon(context, width, height, eased, x * 22, y * 25);
    stage.style.setProperty('--depth-x', (x * 10).toFixed(2) + 'px');
    stage.style.setProperty('--depth-y', (y * 8).toFixed(2) + 'px');

    if (progress < 1 || Math.abs(targetX - x) + Math.abs(targetY - y) > 0.002) requestDraw();
  }

  function resize() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    requestDraw();
  }

  function steer(event) {
    if (!visible || preference.matches) return;
    const rect = stage.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    requestDraw();
  }

  function reset() {
    targetX = 0;
    targetY = 0;
    requestDraw();
  }

  function updatePreference() {
    if (!preference.matches) {
      requestDraw();
      return;
    }
    window.cancelAnimationFrame(frame);
    frame = 0;
    x = 0;
    y = 0;
    reset();
    stage.style.removeProperty('--depth-x');
    stage.style.removeProperty('--depth-y');
    context.clearRect(0, 0, width, height);
  }

  const sizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  if (sizeObserver) sizeObserver.observe(stage);
  else window.addEventListener('resize', resize);
  const visibilityObserver = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestDraw();
      else reset();
    })
    : null;
  visibilityObserver?.observe(stage);
  stage.addEventListener('pointermove', steer);
  stage.addEventListener('pointerleave', reset);
  stage.addEventListener('pointercancel', reset);
  stage.addEventListener('pointerup', reset);
  preference.addEventListener('change', updatePreference);
  resize();

  return () => {
    window.cancelAnimationFrame(frame);
    sizeObserver?.disconnect();
    visibilityObserver?.disconnect();
    if (!sizeObserver) window.removeEventListener('resize', resize);
    stage.removeEventListener('pointermove', steer);
    stage.removeEventListener('pointerleave', reset);
    stage.removeEventListener('pointercancel', reset);
    stage.removeEventListener('pointerup', reset);
    preference.removeEventListener('change', updatePreference);
  };
}
