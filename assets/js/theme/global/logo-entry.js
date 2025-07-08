export default function logoEntry() {
  const wrap = document.querySelector('.header-logoWrap');
  if (!wrap) return;

  // ① fire entry animation once logo is in view (above-the-fold)
  const io = new window.IntersectionObserver(e => {
    if (e[0].isIntersecting) {
      wrap.classList.add('loaded');
      e[0].target.dispatchEvent(new CustomEvent('swmLogoReady'));
      io.disconnect();
    }
  }, { threshold: .6 });
  io.observe(wrap);

  // ② (optional) expose CSS scroll-timeline to JS env
  const setScroll = () => document.documentElement.dataset.scroll = window.scrollY;
  setScroll(); window.addEventListener('scroll', setScroll, { passive: true });
}
