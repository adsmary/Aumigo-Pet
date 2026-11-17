// ===== Aumigo Pet — script.js (carrossel constante + revelações suaves) =====
(() => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Orçamento ---------- */
  const ids = ['pet', 'porte', 'serv'], out = $('#price');
  let bumpTimer;
  const calc = () => {
    out.textContent = 'R$ ' + ids.reduce((s, i) => s + Number($('#' + i).value), 0);
    out.classList.add('bump');
    clearTimeout(bumpTimer);
    bumpTimer = setTimeout(() => out.classList.remove('bump'), 250);
  };
  ids.forEach(i => $('#' + i).addEventListener('change', calc));

  /* ---------- Carrossel (faixa amarela): velocidade constante, independente do scroll ---------- */
  const words = ['Banho', 'Tosa', 'Escovação', 'Hidratação', 'Carinho', 'Cuidado'];
  const mq = $('#mq');
  mq.innerHTML = Array(12).fill(words.join(' 🐾 ') + ' 🐾 ').join('');

  const SPEED = 60; // pixels por segundo — mais alto = mais rápido
  const measure = () => {
    const half = mq.scrollWidth / 2;
    if (half) mq.style.animationDuration = (half / SPEED) + 's';
  };
  measure();
  document.fonts?.ready.then(measure);
  let mt; addEventListener('resize', () => { clearTimeout(mt); mt = setTimeout(measure, 200); });

  /* ---------- Conteúdo se revelando (GSAP + ScrollTrigger) ---------- */
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn('Aumigo: GSAP/ScrollTrigger não carregaram (confira a internet e a ordem dos scripts).');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Títulos: letra por letra, disparando uma vez ao entrar na tela (sem scrub)
  const splitChars = el => {
    const txt = el.textContent.trim();
    el.setAttribute('aria-label', txt);
    el.innerHTML = txt.split(/\s+/).map(w =>
      `<span class="rw" aria-hidden="true">${[...w].map(c => `<span class="ru">${c}</span>`).join('')}</span>`
    ).join(' ');
    return $$('.ru', el);
  };
  $$('h2').forEach(el => {
    gsap.from(splitChars(el), {
      opacity: 0, y: 28, duration: 0.8, ease: 'power3.out', stagger: 0.025, clearProps: 'all',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  // Blocos (grid de preocupações, passos, CTA, texto do orçamento...): sobem e aparecem em sequência
  const blocks = $$('[data-sl]:not(h2):not(.card)');
  gsap.set(blocks, { opacity: 0, y: 36 });
  ScrollTrigger.batch(blocks, {
    start: 'top 90%',
    once: true,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, overwrite: true,
      clearProps: 'transform,opacity'
    })
  });

  // Cards de serviço: revelam com máscara, uma vez só
  $$('.card').forEach((card, i) => {
    gsap.from(card, {
      clipPath: 'inset(100% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut',
      delay: (i % 4) * 0.12, clearProps: 'clipPath',
      scrollTrigger: { trigger: card, start: 'top 88%', once: true }
    });
  });

  // Foto do banho: revela com máscara
  const foto = $('.feature img');
  if (foto) {
    gsap.fromTo(foto, { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath',
      scrollTrigger: { trigger: '.feature', start: 'top 80%', once: true }
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 200); });
})();