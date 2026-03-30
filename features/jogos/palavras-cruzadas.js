/**
 * features/jogos/palavras-cruzadas.js
 * Palavras Cruzadas de Informática.
 * Múltiplos níveis (Fácil → Expert) com temas de informática.
 * Suporte a teclado físico, teclado virtual mobile e navegação por setas.
 */

// ── NÍVEIS ────────────────────────────────────────────────────────────────────

const NIVEIS = [
  {
    id: 'facil',
    nome: 'Fácil',
    emoji: '🟢',
    cor: '#34d399',
    descricao: 'Palavras básicas de informática',
    palavras: [
      { palavra: 'MOUSE',    dica: 'Dispositivo de apontamento', dir: 'H', linha: 0, col: 0 },
      { palavra: 'MONITOR',  dica: 'Tela do computador',         dir: 'V', linha: 0, col: 4 },
      { palavra: 'TECLADO',  dica: 'Usado para digitar',         dir: 'H', linha: 2, col: 1 },
      { palavra: 'REDE',     dica: 'Conecta computadores',       dir: 'V', linha: 2, col: 7 },
      { palavra: 'INTERNET', dica: 'Rede mundial de computadores', dir: 'H', linha: 5, col: 0 },
      { palavra: 'ARQUIVO',  dica: 'Documento salvo no computador', dir: 'V', linha: 3, col: 1 },
    ],
  },
  {
    id: 'medio',
    nome: 'Médio',
    emoji: '🟡',
    cor: '#fbbf24',
    descricao: 'Hardware, software e conceitos',
    palavras: [
      { palavra: 'PROCESSADOR', dica: 'Cérebro do computador (sigla: CPU)', dir: 'H', linha: 0, col: 0 },
      { palavra: 'MEMORIA',     dica: 'Armazena dados temporariamente (RAM)', dir: 'V', linha: 0, col: 5 },
      { palavra: 'HARDWARE',    dica: 'Parte física do computador',           dir: 'H', linha: 3, col: 0 },
      { palavra: 'SOFTWARE',    dica: 'Parte lógica, os programas',           dir: 'V', linha: 1, col: 8 },
      { palavra: 'DISCO',       dica: 'Armazena dados permanentemente (HD)',  dir: 'H', linha: 6, col: 2 },
      { palavra: 'PLACA',       dica: 'Componente principal: ___ mãe',        dir: 'V', linha: 3, col: 3 },
      { palavra: 'PORTA',       dica: 'Entrada para periféricos (USB)',        dir: 'H', linha: 8, col: 0 },
    ],
  },
  {
    id: 'dificil',
    nome: 'Difícil',
    emoji: '🔴',
    cor: '#f87171',
    descricao: 'Redes, segurança e sistemas',
    palavras: [
      { palavra: 'PROTOCOLO',  dica: 'Conjunto de regras de comunicação',       dir: 'H', linha: 0, col: 0 },
      { palavra: 'FIREWALL',   dica: 'Barreira de proteção de rede',            dir: 'V', linha: 0, col: 4 },
      { palavra: 'SERVIDOR',   dica: 'Computador que fornece serviços',         dir: 'H', linha: 3, col: 1 },
      { palavra: 'VIRUS',      dica: 'Programa malicioso',                      dir: 'V', linha: 2, col: 9 },
      { palavra: 'ALGORITMO',  dica: 'Sequência de passos para resolver problema', dir: 'H', linha: 6, col: 0 },
      { palavra: 'BACKUP',     dica: 'Cópia de segurança dos dados',            dir: 'V', linha: 4, col: 3 },
      { palavra: 'DOWNLOAD',   dica: 'Baixar arquivo da internet',              dir: 'H', linha: 9, col: 1 },
      { palavra: 'SISTEMA',    dica: 'Windows e Linux são ___ operacionais',    dir: 'V', linha: 0, col: 0 },
    ],
  },
];

// ── ESTADO DO JOGO ────────────────────────────────────────────────────────────

let estado = {
  nivel: null,
  grade: [],         // char[][] — letras colocadas pelo jogador
  solucao: [],       // char[][] — gabarito
  celulasValidas: new Set(), // "linha,col" das células que fazem parte do cruzadinha
  palavrasOk: new Set(),
  palavraSelecionada: null,
  celulaFoco: null,  // { linha, col }
};

// ── DIMENSÕES DA GRADE ─────────────────────────────────────────────────────────

function calcularDimensoes(palavras) {
  let maxLinha = 0, maxCol = 0;
  for (const p of palavras) {
    if (p.dir === 'H') {
      maxLinha = Math.max(maxLinha, p.linha);
      maxCol   = Math.max(maxCol,   p.col + p.palavra.length - 1);
    } else {
      maxLinha = Math.max(maxLinha, p.linha + p.palavra.length - 1);
      maxCol   = Math.max(maxCol,   p.col);
    }
  }
  return { linhas: maxLinha + 1, colunas: maxCol + 1 };
}

// ── INICIALIZAR GRADE ─────────────────────────────────────────────────────────

function inicializarGrade(nivel) {
  const { linhas, colunas } = calcularDimensoes(nivel.palavras);

  // Grade de solução (gabarito)
  const solucao = Array.from({ length: linhas }, () => Array(colunas).fill(''));
  // Grade do jogador (começa vazia)
  const grade   = Array.from({ length: linhas }, () => Array(colunas).fill(''));
  const validas = new Set();

  for (const p of nivel.palavras) {
    for (let i = 0; i < p.palavra.length; i++) {
      const l = p.dir === 'H' ? p.linha     : p.linha + i;
      const c = p.dir === 'H' ? p.col + i   : p.col;
      solucao[l][c] = p.palavra[i];
      validas.add(`${l},${c}`);
    }
  }

  return { solucao, grade, validas, linhas, colunas };
}

// ── NUMERAÇÃO DAS CÉLULAS (para dicas) ───────────────────────────────────────

function calcularNumeros(palavras) {
  // Associa um número a cada início de palavra
  const nums = {};
  const sorted = [...palavras].sort((a, b) => a.linha - b.linha || a.col - b.col);
  let n = 1;
  for (const p of sorted) {
    const key = `${p.linha},${p.col}`;
    if (!nums[key]) nums[key] = n++;
  }
  return nums;
}

// ── VERIFICAR PALAVRA ─────────────────────────────────────────────────────────

function verificarPalavras() {
  const ok = new Set();
  for (const p of estado.nivel.palavras) {
    let correta = true;
    for (let i = 0; i < p.palavra.length; i++) {
      const l = p.dir === 'H' ? p.linha     : p.linha + i;
      const c = p.dir === 'H' ? p.col + i   : p.col;
      if (estado.grade[l][c] !== p.palavra[i]) { correta = false; break; }
    }
    if (correta) ok.add(p.palavra);
  }
  estado.palavrasOk = ok;
  return ok;
}

// ── RENDER PRINCIPAL ──────────────────────────────────────────────────────────

export function render(container) {
  container.innerHTML = `
    <div class="jogo-area" id="pc-root">
      <div class="page-header">
        <span class="page-header__eyebrow">Jogo</span>
        <h1 class="page-header__titulo">✏️ Palavras Cruzadas</h1>
        <p class="page-header__desc">Preencha as palavras de informática. Clique em uma célula e comece a digitar.</p>
      </div>

      <!-- Seleção de nível -->
      <div id="pc-tela-nivel">
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:2rem;">
          ${NIVEIS.map(n => `
            <button class="btn btn--ghost pc-btn-nivel" data-nivel="${n.id}"
              style="border-color:${n.cor}33; color:${n.cor}; font-size:0.9rem; padding:0.6rem 1.2rem;">
              ${n.emoji} ${n.nome}
            </button>
          `).join('')}
        </div>
        <div class="card card--destaque" style="text-align:center; padding:3rem 2rem;">
          <div style="font-size:3.5rem; margin-bottom:1rem">✏️</div>
          <h2 style="font-family:var(--font-display); color:var(--primary); margin-bottom:0.5rem">Selecione um nível</h2>
          <p style="color:var(--text-2); font-size:0.9rem;">Escolha a dificuldade acima para começar.</p>
        </div>
      </div>

      <!-- Área do jogo -->
      <div id="pc-tela-jogo" style="display:none;">
        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.25rem;">
          <button class="btn btn--ghost btn--sm" id="pc-btn-voltar-nivel">← Níveis</button>
          <span id="pc-nivel-nome" style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-3); text-transform:uppercase; letter-spacing:0.1em;"></span>
          <span style="flex:1"></span>
          <span id="pc-progresso" style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-2);"></span>
          <button class="btn btn--ghost btn--sm" id="pc-btn-revelar">💡 Revelar</button>
        </div>

        <div style="display:grid; grid-template-columns:1fr; gap:1.5rem;">
          <!-- Grade -->
          <div id="pc-grade-wrap" style="overflow-x:auto;">
            <div id="pc-grade" style="display:inline-grid; gap:3px; user-select:none;"></div>
          </div>

          <!-- Dicas -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-3); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.6rem;">→ Horizontal</div>
              <div id="pc-dicas-h" style="display:flex; flex-direction:column; gap:0.4rem;"></div>
            </div>
            <div>
              <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-3); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.6rem;">↓ Vertical</div>
              <div id="pc-dicas-v" style="display:flex; flex-direction:column; gap:0.4rem;"></div>
            </div>
          </div>
        </div>

        <!-- Vitória -->
        <div id="pc-vitoria" style="display:none; text-align:center; padding:3rem 1rem;">
          <div style="font-size:3.5rem; margin-bottom:1rem;">🎉</div>
          <h2 style="font-family:var(--font-display); font-size:2rem; font-weight:800; color:var(--text); margin-bottom:0.5rem;">Parabéns!</h2>
          <p style="color:var(--text-2); margin-bottom:2rem;">Você completou o nível <strong id="pc-vitoria-nivel"></strong>!</p>
          <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn--primary" id="pc-btn-jogar-novamente">🔄 Jogar Novamente</button>
            <button class="btn btn--ghost" id="pc-btn-outro-nivel">📋 Outro Nível</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── INIT ──────────────────────────────────────────────────────────────────────

export function init(container) {
  // Bind: botões de nível
  container.querySelectorAll('.pc-btn-nivel').forEach(btn => {
    btn.addEventListener('click', () => {
      const nivelId = btn.dataset.nivel;
      const nivel = NIVEIS.find(n => n.id === nivelId);
      iniciarJogo(nivel, container);
    });
  });
}

// ── INICIAR JOGO ──────────────────────────────────────────────────────────────

function iniciarJogo(nivel, container) {
  const { solucao, grade, validas, linhas, colunas } = inicializarGrade(nivel);

  estado = {
    nivel,
    grade,
    solucao,
    celulasValidas: validas,
    palavrasOk: new Set(),
    palavraSelecionada: null,
    celulaFoco: null,
    linhas,
    colunas,
  };

  // Troca tela
  container.querySelector('#pc-tela-nivel').style.display = 'none';
  const telaJogo = container.querySelector('#pc-tela-jogo');
  telaJogo.style.display = '';
  container.querySelector('#pc-vitoria').style.display = 'none';
  container.querySelector('#pc-nivel-nome').textContent = `${nivel.emoji} ${nivel.nome} — ${nivel.descricao}`;

  renderGrade(container);
  renderDicas(container);
  atualizarProgresso(container);

  // Bind: botão voltar
  container.querySelector('#pc-btn-voltar-nivel').onclick = () => {
    container.querySelector('#pc-tela-nivel').style.display = '';
    telaJogo.style.display = 'none';
    document.removeEventListener('keydown', _keyHandler);
  };

  // Bind: revelar
  container.querySelector('#pc-btn-revelar').onclick = () => revelarTudo(container);

  // Bind: vitória
  container.querySelector('#pc-btn-jogar-novamente').onclick = () => iniciarJogo(nivel, container);
  container.querySelector('#pc-btn-outro-nivel').onclick = () => {
    container.querySelector('#pc-tela-nivel').style.display = '';
    telaJogo.style.display = 'none';
    document.removeEventListener('keydown', _keyHandler);
  };

  // Teclado físico
  document.removeEventListener('keydown', _keyHandler);
  _keyHandlerRef = (e) => _keyHandler(e, container);
  document.addEventListener('keydown', _keyHandlerRef);
}

let _keyHandlerRef = null;

// ── RENDER DA GRADE ───────────────────────────────────────────────────────────

function renderGrade(container) {
  const gradeEl = container.querySelector('#pc-grade');
  const { linhas, colunas, solucao, grade, celulasValidas } = estado;
  const nums = calcularNumeros(estado.nivel.palavras);

  gradeEl.style.gridTemplateColumns = `repeat(${colunas}, 2.2rem)`;
  gradeEl.innerHTML = '';

  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < colunas; c++) {
      const key = `${l},${c}`;
      const cel = document.createElement('div');

      if (!celulasValidas.has(key)) {
        // Célula bloqueada (fundo escuro)
        cel.style.cssText = `
          width:2.2rem; height:2.2rem; background:var(--bg);
          border-radius:3px;
        `;
      } else {
        const num = nums[key];
        const preenchida = grade[l][c] !== '';
        const correta = preenchida && grade[l][c] === solucao[l][c];
        const isFoco  = estado.celulaFoco?.linha === l && estado.celulaFoco?.col === c;

        cel.dataset.linha = l;
        cel.dataset.col   = c;
        cel.className = 'pc-celula';
        cel.tabIndex  = 0;
        cel.style.cssText = `
          width:2.2rem; height:2.2rem; position:relative;
          background:${isFoco ? 'var(--primary-dim)' : 'var(--bg-2)'};
          border:1.5px solid ${isFoco ? 'var(--primary)' : correta ? '#22c55e' : 'var(--border)'};
          border-radius:3px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          font-family:var(--font-display); font-weight:700;
          font-size:0.85rem; text-transform:uppercase;
          color:${correta ? '#4ade80' : 'var(--text)'};
          transition:background 0.12s, border-color 0.12s;
        `;

        // Número da pista (canto superior esquerdo)
        if (num) {
          const numEl = document.createElement('span');
          numEl.textContent = num;
          numEl.style.cssText = `
            position:absolute; top:1px; left:2px;
            font-size:0.45rem; font-family:var(--font-mono);
            color:var(--text-3); line-height:1;
          `;
          cel.appendChild(numEl);
        }

        // Letra do jogador
        if (grade[l][c]) {
          const letra = document.createElement('span');
          letra.textContent = grade[l][c];
          cel.appendChild(letra);
        }

        // Clique
        cel.addEventListener('click', () => focarCelula(l, c, container));
        cel.addEventListener('touchend', (e) => { e.preventDefault(); focarCelula(l, c, container); });
      }

      gradeEl.appendChild(cel);
    }
  }
}

// ── FOCO ──────────────────────────────────────────────────────────────────────

function focarCelula(linha, col, container) {
  if (!estado.celulasValidas.has(`${linha},${col}`)) return;
  estado.celulaFoco = { linha, col };
  renderGrade(container);

  // Destaca a dica correspondente
  destacarDicaAtiva(linha, col, container);
}

function destacarDicaAtiva(linha, col, container) {
  container.querySelectorAll('.pc-dica-item').forEach(d => {
    d.style.background = '';
    d.style.borderColor = '';
  });
  // Encontra palavras que passam por essa célula
  for (const p of estado.nivel.palavras) {
    let pertence = false;
    for (let i = 0; i < p.palavra.length; i++) {
      const l = p.dir === 'H' ? p.linha     : p.linha + i;
      const c = p.dir === 'H' ? p.col + i   : p.col;
      if (l === linha && c === col) { pertence = true; break; }
    }
    if (pertence) {
      const el = container.querySelector(`[data-dica="${p.palavra}"]`);
      if (el) {
        el.style.background = 'var(--primary-dim)';
        el.style.borderColor = 'var(--primary)';
      }
    }
  }
}

// ── DICAS ─────────────────────────────────────────────────────────────────────

function renderDicas(container) {
  const nums = calcularNumeros(estado.nivel.palavras);
  const dicasH = container.querySelector('#pc-dicas-h');
  const dicasV = container.querySelector('#pc-dicas-v');
  dicasH.innerHTML = '';
  dicasV.innerHTML = '';

  const sorted = [...estado.nivel.palavras].sort((a, b) => {
    const na = nums[`${a.linha},${a.col}`] || 99;
    const nb = nums[`${b.linha},${b.col}`] || 99;
    return na - nb;
  });

  for (const p of sorted) {
    const num = nums[`${p.linha},${p.col}`];
    const ok  = estado.palavrasOk.has(p.palavra);
    const el  = document.createElement('div');
    el.className = 'pc-dica-item';
    el.dataset.dica = p.palavra;
    el.style.cssText = `
      padding:0.4rem 0.6rem; border-radius:6px;
      border:1px solid var(--border);
      font-size:0.82rem; color:${ok ? '#4ade80' : 'var(--text-2)'};
      cursor:pointer; transition:background 0.15s, border-color 0.15s;
      ${ok ? 'text-decoration:line-through; opacity:0.6;' : ''}
    `;
    el.innerHTML = `<span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--primary);">${num}.</span> ${p.dica}`;

    // Clicar na dica foca a primeira célula
    el.addEventListener('click', () => focarCelula(p.linha, p.col, container));

    (p.dir === 'H' ? dicasH : dicasV).appendChild(el);
  }
}

// ── TECLADO ───────────────────────────────────────────────────────────────────

function _keyHandler(e, container) {
  if (!estado.celulaFoco) return;
  const { linha, col } = estado.celulaFoco;

  // Setas — navegação
  const setas = { ArrowRight: [0,1], ArrowLeft: [0,-1], ArrowDown: [1,0], ArrowUp: [-1,0] };
  if (setas[e.key]) {
    e.preventDefault();
    const [dl, dc] = setas[e.key];
    moverFoco(linha + dl, col + dc, container);
    return;
  }

  // Backspace — apaga
  if (e.key === 'Backspace') {
    e.preventDefault();
    estado.grade[linha][col] = '';
    verificarPalavras();
    renderGrade(container);
    renderDicas(container);
    atualizarProgresso(container);
    return;
  }

  // Letra
  const letra = e.key.toUpperCase();
  if (/^[A-ZÁÉÍÓÚÀÃÕÂÊÎÔÛÇ]$/.test(letra)) {
    e.preventDefault();
    estado.grade[linha][col] = letra;
    verificarPalavras();
    renderGrade(container);
    renderDicas(container);
    atualizarProgresso(container);
    // Avança automaticamente para próxima célula
    avancarFocoAuto(linha, col, container);
    verificarVitoria(container);
  }
}

function moverFoco(novaLinha, novaCol, container) {
  if (
    novaLinha >= 0 && novaLinha < estado.linhas &&
    novaCol   >= 0 && novaCol   < estado.colunas &&
    estado.celulasValidas.has(`${novaLinha},${novaCol}`)
  ) {
    focarCelula(novaLinha, novaCol, container);
  }
}

function avancarFocoAuto(linha, col, container) {
  // Tenta avançar horizontal primeiro, depois vertical
  const tentativas = [[0,1],[1,0],[0,-1],[-1,0]];
  for (const [dl, dc] of tentativas) {
    const nl = linha + dl, nc = col + dc;
    if (
      nl >= 0 && nl < estado.linhas &&
      nc >= 0 && nc < estado.colunas &&
      estado.celulasValidas.has(`${nl},${nc}`)
    ) {
      focarCelula(nl, nc, container);
      return;
    }
  }
}

// ── PROGRESSO ─────────────────────────────────────────────────────────────────

function atualizarProgresso(container) {
  const total = estado.nivel.palavras.length;
  const ok    = estado.palavrasOk.size;
  container.querySelector('#pc-progresso').textContent = `${ok}/${total} palavras`;
}

// ── REVELAR TUDO ──────────────────────────────────────────────────────────────

function revelarTudo(container) {
  if (!confirm('Revelar todas as respostas?')) return;
  const { linhas, colunas, solucao, grade, celulasValidas } = estado;
  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < colunas; c++) {
      if (celulasValidas.has(`${l},${c}`)) grade[l][c] = solucao[l][c];
    }
  }
  verificarPalavras();
  renderGrade(container);
  renderDicas(container);
  atualizarProgresso(container);
}

// ── VERIFICAR VITÓRIA ─────────────────────────────────────────────────────────

function verificarVitoria(container) {
  if (estado.palavrasOk.size === estado.nivel.palavras.length) {
    setTimeout(() => {
      container.querySelector('#pc-vitoria').style.display = '';
      container.querySelector('#pc-vitoria-nivel').textContent = `${estado.nivel.emoji} ${estado.nivel.nome}`;
      document.removeEventListener('keydown', _keyHandlerRef);
    }, 300);
  }
}
