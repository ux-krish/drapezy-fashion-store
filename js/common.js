const lenis = new Lenis({
  smooth: true,
  lerp: 0.08, // Adjust this value to slow down or speed up the scroll
  wheelMultiplier: 1,
  infinite: false
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);