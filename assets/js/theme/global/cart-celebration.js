export default function cartCelebration () {
  const tpl = `
    <div class="cartCelebration">
      <svg viewBox="0 0 150 150" aria-hidden="true">
        <use href="{{cdn '/img/swm-logo.svg'}}#logo"/>
        <circle id="halo" cx="75" cy="75" r="75"/>
      </svg>
      <span class="spore"></span><span class="spore"></span><span class="spore"></span>
    </div>`;

  const node = document.createRange().createContextualFragment(tpl);
  document.body.append(node);
  setTimeout(()=>node.firstChild.remove(), 800); // clean up
}
