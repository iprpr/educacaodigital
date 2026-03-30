/**
 * mobile-menu.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Sistema de navegação mobile para o RPR Academy.
 * Inspirado no ChatGPT mobile: sidebar como drawer com swipe, overlay e estado.
 *
 * ⚠️  Este módulo só age em telas ≤ 768px.
 *     Em desktop não faz absolutamente nada (isMobile() sempre retorna false).
 *
 * Dependências: nenhuma (vanilla JS puro, sem frameworks).
 * Integração: carregado após main.js via <script type="module"> no index.html.
 * ──────────────────────────────────────────────────────────────────────────────
 */

// ── CONSTANTES ────────────────────────────────────────────────────────────────

/** Breakpoint mobile (deve bater com o max-width do CSS). */
const MOBILE_BREAKPOINT = 768;

/**
 * Distância mínima (px) de swipe horizontal para abrir/fechar o menu.
 * Abaixo disso o gesto é ignorado (evita conflito com scroll vertical).
 */
const SWIPE_THRESHOLD = 50;

/**
 * Largura máxima da "zona de swipe" na borda esquerda da tela (px).
 * Só dentro desta faixa um swipe para a direita abre o menu.
 */
const SWIPE_EDGE_ZONE = 30;

/**
 * Proporção máxima do deslocamento vertical em relação ao horizontal
 * para considerar o gesto como swipe horizontal (evita interferir no scroll).
 */
const SWIPE_ANGLE_RATIO = 1.5;

// ── ESTADO ────────────────────────────────────────────────────────────────────

/** Controle de toque para detecção de swipe. */
const touch = {
  startX: 0,
  startY: 0,
  currentX: 0,
  isTracking: false, // está rastreando um gesto válido?
};

// ── SELETORES DOM ─────────────────────────────────────────────────────────────

/** Retorna os elementos DOM necessários (chamado em tempo de execução, não no topo). */
function getEls() {
  return {
    app:         document.getElementById('app'),
    sidebar:     document.getElementById('sidebar'),
    overlay:     document.getElementById('mobile-overlay'),
    hamburguer:  document.getElementById('btn-hamburguer'),
  };
}

// ── GUARDS ────────────────────────────────────────────────────────────────────

/** Retorna true apenas quando a janela está no breakpoint mobile. */
function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

/** Retorna true se o app está visível (não está com a classe app--oculto). */
function isAppVisivel() {
  const { app } = getEls();
  return app && !app.classList.contains('app--oculto');
}

// ── ESTADO DO MENU ────────────────────────────────────────────────────────────

/** Verifica se o menu está atualmente aberto. */
function isMenuAberto() {
  const { app } = getEls();
  return app?.classList.contains('menu-open') ?? false;
}

/**
 * Abre o menu lateral.
 * Adiciona .menu-open ao #app → CSS cuida do resto (drawer + overlay).
 */
function abrirMenu() {
  if (!isMobile() || !isAppVisivel()) return;

  const { app, hamburguer } = getEls();
  app.classList.add('menu-open');
  hamburguer?.setAttribute('aria-expanded', 'true');

  // Impede scroll do body enquanto menu está aberto
  document.body.style.overflow = 'hidden';
}

/**
 * Fecha o menu lateral.
 * Remove .menu-open do #app → CSS reverte drawer + overlay.
 */
function fecharMenu() {
  const { app, hamburguer } = getEls();
  app.classList.remove('menu-open');
  hamburguer?.setAttribute('aria-expanded', 'false');

  // Restaura scroll
  document.body.style.overflow = '';
}

/**
 * Alterna o estado do menu (abrir ↔ fechar).
 */
function toggleMenu() {
  isMenuAberto() ? fecharMenu() : abrirMenu();
}

// ── SWIPE DETECTION ───────────────────────────────────────────────────────────

/**
 * touchstart — registra ponto inicial do toque.
 * Só inicia rastreamento se o toque começou dentro da "zona de borda" esquerda
 * (para abrir) OU se o menu já está aberto (para fechar com swipe contrário).
 */
function onTouchStart(e) {
  if (!isMobile()) return;

  const t = e.touches[0];
  touch.startX    = t.clientX;
  touch.startY    = t.clientY;
  touch.currentX  = t.clientX;
  touch.isTracking = false;

  // Inicia rastreamento se:
  // a) toque começou na zona de borda (para abrir) OU
  // b) menu já está aberto (para fechar)
  if (touch.startX <= SWIPE_EDGE_ZONE || isMenuAberto()) {
    touch.isTracking = true;
  }
}

/**
 * touchmove — rastreia posição do dedo enquanto se move.
 * Cancela o rastreamento se o gesto for mais vertical do que horizontal
 * (usuário provavelmente está scrollando, não swipando o menu).
 */
function onTouchMove(e) {
  if (!isMobile() || !touch.isTracking) return;

  const t = e.touches[0];
  touch.currentX = t.clientX;

  const deltaX = Math.abs(t.clientX - touch.startX);
  const deltaY = Math.abs(t.clientY - touch.startY);

  // Se movimento vertical for muito maior que horizontal → cancela
  if (deltaY > deltaX * SWIPE_ANGLE_RATIO) {
    touch.isTracking = false;
    return;
  }

  // Previne scroll da página apenas durante swipe horizontal confirmado
  // Só previne se o gesto for claramente horizontal
  if (deltaX > 10 && deltaX > deltaY) {
    e.preventDefault();
  }
}

/**
 * touchend — avalia o gesto concluído e age.
 * - Swipe para a direita na borda → abre o menu
 * - Swipe para a esquerda com menu aberto → fecha o menu
 */
function onTouchEnd() {
  if (!isMobile() || !touch.isTracking) return;

  const deltaX = touch.currentX - touch.startX;
  const absX   = Math.abs(deltaX);

  // Distância mínima atingida?
  if (absX >= SWIPE_THRESHOLD) {
    if (deltaX > 0 && !isMenuAberto()) {
      // → Swipe direita: abre o menu
      abrirMenu();
    } else if (deltaX < 0 && isMenuAberto()) {
      // ← Swipe esquerda: fecha o menu
      fecharMenu();
    }
  }

  // Reseta estado de rastreamento
  touch.isTracking = false;
}

// ── FECHAR AO CLICAR EM ITEM DA SIDEBAR ──────────────────────────────────────

/**
 * Monitora cliques nos itens de navegação da sidebar.
 * Usa delegação de evento no elemento sidebar (funciona para itens adicionados
 * dinamicamente pelo main.js após a construção do menu).
 */
function bindSidebarNavClick() {
  const { sidebar } = getEls();
  if (!sidebar) return;

  sidebar.addEventListener('click', (e) => {
    // Só age no mobile
    if (!isMobile()) return;

    // Fecha se clicou em um item de navegação
    const item = e.target.closest('.sidebar__item');
    if (item) {
      fecharMenu();
    }
  });
}

// ── FECHAR COM ESC ────────────────────────────────────────────────────────────

function onKeyDown(e) {
  if (e.key === 'Escape' && isMenuAberto()) {
    fecharMenu();
  }
}

// ── RESIZE: LIMPA ESTADO SE VOLTOU AO DESKTOP ─────────────────────────────────

/**
 * Se o usuário redimensionar a janela para desktop com o menu aberto,
 * remove o estado para não deixar overflow:hidden no body.
 */
function onResize() {
  if (!isMobile() && isMenuAberto()) {
    fecharMenu();
  }
}

// ── INICIALIZAÇÃO ─────────────────────────────────────────────────────────────

/**
 * Registra todos os event listeners do sistema mobile.
 * Chamado uma vez ao carregar o módulo.
 */
function inicializar() {
  const { overlay, hamburguer } = getEls();

  // Botão hambúrguer → toggle menu
  hamburguer?.addEventListener('click', toggleMenu);

  // Overlay → fecha ao clicar fora
  overlay?.addEventListener('click', fecharMenu);

  // Swipe na área de conteúdo
  // passive: false necessário em touchmove para poder chamar preventDefault
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove',  onTouchMove,  { passive: false });
  document.addEventListener('touchend',   onTouchEnd,   { passive: true });

  // Fechar com ESC (acessibilidade)
  document.addEventListener('keydown', onKeyDown);

  // Limpar estado ao redimensionar para desktop
  window.addEventListener('resize', onResize, { passive: true });

  // Delegação de clique nos itens da sidebar
  bindSidebarNavClick();
}

// ── EXECUÇÃO ──────────────────────────────────────────────────────────────────

// Aguarda o DOM estar pronto antes de inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}

// Exporta funções para uso externo se necessário (ex: main.js fechar ao navegar)
export { abrirMenu, fecharMenu, isMenuAberto };
