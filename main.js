/**
 * main.js
 * Entrada principal do SPA RPR Academy.
 * Inicializa módulos, registra rotas e gerencia transições.
 */

import { getEstado, setEstado } from './modules/state.js';
import { inicializarRouter, registrarRota, navegar } from './modules/router.js';
import { renderProfessores } from './features/academico/professores.js';
import { renderAlunos } from './features/academico/alunos.js';
import { JOGOS, buscarJogo } from './features/jogos/index.js';
import { login, logout, restaurarSessao } from './modules/auth.js';

// ── ELEMENTOS DOM — declarados aqui, atribuídos no DOMContentLoaded ───────────
let elTelaInicial, elApp, elSidebarNav, elSidebarTag, elConteudoView;
let btnVoltar, elRodape, btnJogos, btnAcademico;

// ── INICIALIZAÇÃO ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Captura elementos após o DOM estar pronto
  elTelaInicial  = document.getElementById('tela-inicial');
  elApp          = document.getElementById('app');
  elSidebarNav   = document.getElementById('sidebar-nav');
  elSidebarTag   = document.getElementById('sidebar-modo-tag');
  elConteudoView = document.getElementById('conteudo-view');
  btnVoltar      = document.getElementById('btn-voltar');
  elRodape       = document.querySelector('.rodape-fixo');
  btnJogos       = document.getElementById('btn-jogos');
  btnAcademico   = document.getElementById('btn-academico');

  inicializarRouter(elConteudoView);
  _registrarRotas();
  _bindBotoesInicio();
  _bindBotaoVoltar();

  // Restaura sessão persistente
  const perfil = await restaurarSessao();
  if (perfil) {
    _atualizarBotaoAcademico(perfil);
  }
});

// ── ROTAS ──────────────────────────────────────────────────────────────────────
function _registrarRotas() {
  // ── Acadêmico
  registrarRota('professores', async (container) => {
    await renderProfessores(container);
  });

  registrarRota('alunos', (container) => {
    renderAlunos(container);
  });

  // ── Jogos: listagem geral
  registrarRota('jogos-home', (container) => {
    _renderJogosHome(container);
  });

  // ── Jogos: cada jogo registrado
  JOGOS.forEach(jogo => {
    registrarRota(`jogo-${jogo.id}`, (container) => {
      jogo.modulo.render(container);
      jogo.modulo.init(container);
    });
  });
}

// ── TRANSIÇÃO: INÍCIO → APP ────────────────────────────────────────────────────
function _ativarModo(modo) {
  setEstado({ modo, tela: modo });

  // Animação de saída da tela inicial
  elTelaInicial.classList.add('saindo');

  setTimeout(() => {
    elTelaInicial.style.display = 'none';
    elApp.style.display = '';          // restaura display antes de remover oculto
    elApp.classList.remove('app--oculto');
    elApp.classList.add('entrando');
    setTimeout(() => elApp.classList.remove('entrando'), 400);

    // No desktop, desloca o rodapé para alinhar com o conteúdo (após a sidebar).
    // No mobile, o CSS cuida disso com left: 0 !important — não sobrepomos.
    if (window.innerWidth > 768) {
      elRodape.style.left = 'var(--sidebar-w)';
    }
    _construirSidebar(modo);

    // Navega para rota padrão do modo
    if (modo === 'jogos') {
      navegar('jogos-home');
    } else {
      navegar('professores');
    }
  }, 350);
}

// ── TRANSIÇÃO: APP → INÍCIO ────────────────────────────────────────────────────
function _voltarInicio() {
  setEstado({ modo: null, tela: 'inicial', sidebarAtiva: null });

  // 1) Fade-out suave do app (0.35s), depois troca as telas
  elApp.style.opacity = '0';
  elApp.style.transition = 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)';

  setTimeout(() => {
    // 2) Esconde o app após o fade terminar
    elApp.style.display = 'none';
    elApp.style.opacity = '';
    elApp.style.transition = '';
    elApp.classList.add('app--oculto');

    elRodape.style.left = '0';

    // 3) Reexibe a tela inicial com animação de entrada
    elTelaInicial.style.display = '';
    elTelaInicial.classList.remove('saindo');

    // Força reflow para reativar a animação CSS
    elTelaInicial.style.animation = 'none';
    elTelaInicial.querySelector('.tela-inicial__content').style.animation = 'none';
    elTelaInicial.offsetHeight; // trigger reflow
    elTelaInicial.style.animation = '';
    elTelaInicial.querySelector('.tela-inicial__content').style.animation = '';
  }, 350);
}

// ── SIDEBAR ────────────────────────────────────────────────────────────────────
function _construirSidebar(modo) {
  elSidebarTag.textContent = modo === 'jogos' ? 'Modo: Jogos' : 'Modo: Acadêmico';

  if (modo === 'jogos') {
    _construirSidebarJogos();
  } else {
    _construirSidebarAcademico();
  }
}

function _construirSidebarJogos() {
  const itens = [
    { id: 'jogos-home', icon: '🏠', label: 'Todos os Jogos' },
    ...JOGOS.map(j => ({
      id: `jogo-${j.id}`,
      icon: j.emoji,
      label: j.nome,
    })),
  ];

  elSidebarNav.innerHTML = itens.map(item => `
    <div class="sidebar__item" data-rota="${item.id}">
      <span class="sidebar__item-icon">${item.icon}</span>
      <span class="sidebar__item-label">${item.label}</span>
    </div>
  `).join('');

  _bindSidebarNav();
}

function _construirSidebarAcademico() {
  const { usuario } = getEstado();
  const isProfOuAdmin = usuario?.tipo === 'professor' || usuario?.tipo === 'admin';

  elSidebarNav.innerHTML = `
    <div class="sidebar__secao-titulo">Área</div>
    ${isProfOuAdmin ? `
    <div class="sidebar__item" data-rota="professores">
      <span class="sidebar__item-icon">👩‍🏫</span>
      <span class="sidebar__item-label">Professor</span>
    </div>` : ''}
    <div class="sidebar__item" data-rota="alunos">
      <span class="sidebar__item-icon">🎒</span>
      <span class="sidebar__item-label">Alunos</span>
    </div>
    <div class="sidebar__secao-titulo" style="margin-top:auto">Conta</div>
    <div class="sidebar__item sidebar__item--usuario">
      <span class="sidebar__item-icon">👤</span>
      <span class="sidebar__item-label">${usuario?.nome || ''}</span>
    </div>
    <div class="sidebar__item sidebar__item--sair" id="btn-logout">
      <span class="sidebar__item-icon">🚪</span>
      <span class="sidebar__item-label">Sair</span>
    </div>
  `;

  _bindSidebarNav();

  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await logout();
    const sub = btnAcademico?.querySelector('.btn__sub');
    if (sub) sub.textContent = 'Conteúdos e materiais';
    _voltarInicio();
  });
}

function _bindSidebarNav() {
  elSidebarNav.querySelectorAll('.sidebar__item').forEach(el => {
    el.addEventListener('click', () => {
      const rota = el.dataset.rota;
      _ativarItemSidebar(rota);
      navegar(rota);
    });
  });
}

function _ativarItemSidebar(rotaId) {
  elSidebarNav.querySelectorAll('.sidebar__item').forEach(el => {
    el.classList.toggle('ativo', el.dataset.rota === rotaId);
  });
}

// ── JOGOS HOME ─────────────────────────────────────────────────────────────────
function _renderJogosHome(container) {
  const jogosHTML = JOGOS.map(jogo => `
    <div class="jogo-card" data-jogo-id="${jogo.id}" role="button" tabindex="0">
      <span class="jogo-card__emoji">${jogo.emoji}</span>
      <span class="jogo-card__nome">${jogo.nome}</span>
      <span class="jogo-card__desc">${jogo.descricao}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div>
      <div class="page-header">
        <span class="page-header__eyebrow">Jogos</span>
        <h1 class="page-header__titulo">Jogos Disponíveis</h1>
        <p class="page-header__desc">Selecione um jogo para jogar. Novos jogos são adicionados constantemente.</p>
      </div>
      <div class="jogos-grid">
        ${jogosHTML}
      </div>
    </div>
  `;

  // Ativa item correto na sidebar
  _ativarItemSidebar('jogos-home');

  // Clique nos cards de jogos
  container.querySelectorAll('.jogo-card').forEach(card => {
    const abrirJogo = () => {
      const id = card.dataset.jogoId;
      const rota = `jogo-${id}`;
      _ativarItemSidebar(rota);
      navegar(rota);
    };
    card.addEventListener('click', abrirJogo);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') abrirJogo();
    });
  });
}

function _bindBotoesInicio() {
  btnJogos?.addEventListener('click', () => _ativarModo('jogos'));
  btnAcademico?.addEventListener('click', () => {
    const { usuario } = getEstado();
    if (!usuario) {
      _abrirModalLogin();
    } else {
      _entrarAcademico(usuario);
    }
  });
}

/** Atualiza label do botão acadêmico após sessão restaurada */
function _atualizarBotaoAcademico(perfil) {
  if (!btnAcademico) return;
  const sub = btnAcademico.querySelector('.btn__sub');
  if (sub) sub.textContent = `Olá, ${perfil.nome.split(' ')[0]}`;
}

/** Entra no modo acadêmico roteando por tipo */
function _entrarAcademico(usuario) {
  _ativarModo('academico');
  // rota padrão por tipo
  setTimeout(() => {
    if (usuario.tipo === 'professor' || usuario.tipo === 'admin') {
      navegar('professores');
    } else {
      navegar('alunos');
    }
  }, 400); // aguarda animação de transição
}

/** Modal de login estilizado */
function _abrirModalLogin() {
  // Cria overlay
  const overlay = document.createElement('div');
  overlay.id = 'modal-login-overlay';
  overlay.innerHTML = `
    <div class="modal-login">
      <button class="modal-login__fechar" id="modal-fechar">✕</button>
      <div class="modal-login__logo">
        <span class="modal-login__sigla">RPR</span>
        <span class="modal-login__nome">Área Acadêmica</span>
      </div>
      <p class="modal-login__desc">Acesse com seu cadastro aprovado</p>

      <div class="modal-login__campo">
        <label>E-mail</label>
        <input id="ml-email" type="email" placeholder="seu@email.com" autocomplete="email" />
      </div>
      <div class="modal-login__campo">
        <label>Senha</label>
        <input id="ml-senha" type="password" placeholder="••••••••" autocomplete="current-password" />
      </div>

      <div id="ml-erro" class="modal-login__erro oculto"></div>

      <button class="modal-login__btn" id="ml-entrar">Entrar</button>

      <p class="modal-login__rodape">
        Não tem conta?
        <a href="/cadastro" class="modal-login__link">Cadastre-se</a>
      </p>
    </div>
  `;
  document.body.appendChild(overlay);

  // Anima entrada
  requestAnimationFrame(() => overlay.classList.add('ativo'));

  const fechar = () => {
    overlay.classList.remove('ativo');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.addEventListener('click', e => { if (e.target === overlay) fechar(); });
  document.getElementById('modal-fechar').addEventListener('click', fechar);

  const btnEntrar = document.getElementById('ml-entrar');
  const elErro    = document.getElementById('ml-erro');

  btnEntrar.addEventListener('click', async () => {
    const email = document.getElementById('ml-email').value.trim();
    const senha = document.getElementById('ml-senha').value;

    if (!email || !senha) {
      _mostrarErroModal(elErro, 'Preencha e-mail e senha.');
      return;
    }

    btnEntrar.disabled = true;
    btnEntrar.textContent = 'Entrando…';

    const resultado = await login(email, senha);

    if (resultado.erro) {
      _mostrarErroModal(elErro, resultado.erro);
      btnEntrar.disabled = false;
      btnEntrar.textContent = 'Entrar';
      return;
    }

    const perfil = resultado.perfil;
    _atualizarBotaoAcademico(perfil);
    fechar();
    _entrarAcademico(perfil);
  });

  // Enter submete
  [document.getElementById('ml-email'), document.getElementById('ml-senha')]
    .forEach(el => el.addEventListener('keydown', e => {
      if (e.key === 'Enter') btnEntrar.click();
    }));
}

function _mostrarErroModal(el, msg) {
  el.textContent = msg;
  el.classList.remove('oculto');
}

function _bindBotaoVoltar() {
  btnVoltar?.addEventListener('click', _voltarInicio);
}



