/**
 * features/jogos/quiz-informatica.js
 * Quiz de Conhecimentos em Informática.
 * 4 categorias temáticas, 10 questões por rodada (embaralhadas),
 * sistema de pontos, streak, feedback visual por resposta.
 */

// ── BANCO DE QUESTÕES ─────────────────────────────────────────────────────────

const CATEGORIAS = [
  {
    id: 'hardware',
    nome: 'Hardware',
    emoji: '🖥️',
    cor: '#38bdf8',
    questoes: [
      {
        pergunta: 'Qual componente é considerado o "cérebro" do computador?',
        opcoes: ['HD', 'RAM', 'CPU', 'GPU'],
        correta: 2,
      },
      {
        pergunta: 'O que significa a sigla RAM?',
        opcoes: ['Rede de Acesso Móvel', 'Memória de Acesso Aleatório', 'Registro de Armazenamento Múltiplo', 'Recurso de Alta Memória'],
        correta: 1,
      },
      {
        pergunta: 'Qual dispositivo armazena dados permanentemente mesmo sem energia?',
        opcoes: ['RAM', 'Cache', 'HD/SSD', 'Memória Virtual'],
        correta: 2,
      },
      {
        pergunta: 'A placa-mãe serve para:',
        opcoes: ['Armazenar arquivos', 'Conectar todos os componentes do PC', 'Processar gráficos', 'Fornecer energia'],
        correta: 1,
      },
      {
        pergunta: 'O que é um periférico de entrada?',
        opcoes: ['Monitor', 'Impressora', 'Teclado', 'Caixa de som'],
        correta: 2,
      },
      {
        pergunta: 'SSD é mais rápido que HD porque:',
        opcoes: ['Usa mais energia', 'Não tem partes mecânicas móveis', 'É maior', 'Conecta por Wi-Fi'],
        correta: 1,
      },
      {
        pergunta: 'Qual porta é mais comum para conectar dispositivos modernos?',
        opcoes: ['PS/2', 'Paralela', 'Serial', 'USB'],
        correta: 3,
      },
      {
        pergunta: 'A fonte de alimentação converte:',
        opcoes: ['Digital para analógico', 'Corrente alternada em contínua', 'Dados em imagem', 'Som em eletricidade'],
        correta: 1,
      },
      {
        pergunta: 'GPU é responsável principalmente por:',
        opcoes: ['Processar sons', 'Processar gráficos e imagens', 'Gerenciar a rede', 'Executar o sistema operacional'],
        correta: 1,
      },
      {
        pergunta: 'O que é um driver?',
        opcoes: ['Tipo de cabo', 'Software que permite o SO usar um hardware', 'Ferramenta de formatação', 'Parte da placa-mãe'],
        correta: 1,
      },
    ],
  },
  {
    id: 'software',
    nome: 'Software',
    emoji: '💾',
    cor: '#818cf8',
    questoes: [
      {
        pergunta: 'Qual é a função do sistema operacional?',
        opcoes: ['Processar textos', 'Gerenciar hardware e software do computador', 'Navegar na internet', 'Editar fotos'],
        correta: 1,
      },
      {
        pergunta: 'Um software livre significa que:',
        opcoes: ['É gratuito', 'Pode ser usado, estudado, modificado e distribuído livremente', 'Não tem vírus', 'Funciona offline'],
        correta: 1,
      },
      {
        pergunta: 'Qual desses é um sistema operacional?',
        opcoes: ['Word', 'Photoshop', 'Linux', 'Chrome'],
        correta: 2,
      },
      {
        pergunta: 'O que faz um antivírus?',
        opcoes: ['Acelera o computador', 'Detecta e remove programas maliciosos', 'Organiza arquivos', 'Conecta à internet'],
        correta: 1,
      },
      {
        pergunta: 'Qual extensão indica um arquivo executável no Windows?',
        opcoes: ['.jpg', '.pdf', '.exe', '.mp3'],
        correta: 2,
      },
      {
        pergunta: 'O que é um backup?',
        opcoes: ['Tipo de vírus', 'Cópia de segurança dos dados', 'Programa de compressão', 'Tipo de conexão'],
        correta: 1,
      },
      {
        pergunta: 'Software proprietário é aquele:',
        opcoes: ['Sem custo', 'Com código aberto', 'Com código fechado e licença restrita', 'Desenvolvido pelo governo'],
        correta: 2,
      },
      {
        pergunta: 'Um arquivo .zip é:',
        opcoes: ['Arquivo de vídeo', 'Arquivo compactado', 'Arquivo de sistema', 'Arquivo de imagem'],
        correta: 1,
      },
      {
        pergunta: 'Qual ferramenta serve para criar planilhas?',
        opcoes: ['Word / Writer', 'Excel / Calc', 'PowerPoint / Impress', 'Notepad / Gedit'],
        correta: 1,
      },
      {
        pergunta: 'O que é um bug?',
        opcoes: ['Atualização de software', 'Erro ou falha em um programa', 'Tipo de vírus', 'Extensão de arquivo'],
        correta: 1,
      },
    ],
  },
  {
    id: 'internet',
    nome: 'Internet',
    emoji: '🌐',
    cor: '#34d399',
    questoes: [
      {
        pergunta: 'O que significa HTTP?',
        opcoes: ['Hipertexto de Transferência de Protocolo', 'Protocolo de Transferência de Hipertexto', 'Rede de Alta Tecnologia', 'Protocolo de Rede Privada'],
        correta: 1,
      },
      {
        pergunta: 'O que é um navegador (browser)?',
        opcoes: ['Provedor de internet', 'Software para acessar páginas web', 'Tipo de servidor', 'Protocolo de rede'],
        correta: 1,
      },
      {
        pergunta: 'O que significa URL?',
        opcoes: ['Usuário de Rede Local', 'Localizador Uniforme de Recursos', 'Linguagem Universal de Rede', 'Recurso Universal de Login'],
        correta: 1,
      },
      {
        pergunta: 'O HTTPS é mais seguro que HTTP porque:',
        opcoes: ['É mais rápido', 'Criptografa os dados transmitidos', 'Usa menos banda', 'Não precisa de senha'],
        correta: 1,
      },
      {
        pergunta: 'O que é phishing?',
        opcoes: ['Tipo de firewall', 'Golpe para roubar dados pessoais', 'Protocolo de rede', 'Software de segurança'],
        correta: 1,
      },
      {
        pergunta: 'Um endereço IP serve para:',
        opcoes: ['Armazenar senhas', 'Identificar dispositivos na rede', 'Comprimir arquivos', 'Formatar discos'],
        correta: 1,
      },
      {
        pergunta: 'Wi-Fi é:',
        opcoes: ['Um cabo de rede', 'Tecnologia de rede sem fio', 'Tipo de modem', 'Protocolo de segurança'],
        correta: 1,
      },
      {
        pergunta: 'O que faz um firewall?',
        opcoes: ['Aumenta a velocidade da internet', 'Bloqueia acessos não autorizados à rede', 'Comprime arquivos', 'Acelera downloads'],
        correta: 1,
      },
      {
        pergunta: 'Cloud (nuvem) significa armazenar dados:',
        opcoes: ['No próprio computador', 'Em servidores remotos via internet', 'Em pen drives', 'Em DVDs'],
        correta: 1,
      },
      {
        pergunta: 'O que é um servidor?',
        opcoes: ['Computador que fornece serviços para outros na rede', 'Tipo de cabo', 'Programa de edição', 'Dispositivo de entrada'],
        correta: 0,
      },
    ],
  },
  {
    id: 'seguranca',
    nome: 'Segurança',
    emoji: '🔒',
    cor: '#fbbf24',
    questoes: [
      {
        pergunta: 'Uma senha forte deve ter:',
        opcoes: ['Só letras minúsculas', 'Nome e data de nascimento', 'Letras, números e símbolos misturados', 'Menos de 6 caracteres'],
        correta: 2,
      },
      {
        pergunta: 'O que é autenticação de dois fatores (2FA)?',
        opcoes: ['Duas senhas iguais', 'Segunda verificação além da senha', 'Dois antivírus instalados', 'Login com dois usuários'],
        correta: 1,
      },
      {
        pergunta: 'Ransomware é um tipo de malware que:',
        opcoes: ['Exibe propagandas', 'Sequestra arquivos e pede resgate', 'Rouba contatos', 'Deixa o PC lento'],
        correta: 1,
      },
      {
        pergunta: 'Para proteger dados pessoais online é recomendado:',
        opcoes: ['Usar a mesma senha em tudo', 'Compartilhar senha com amigos', 'Usar senhas únicas e gerenciadores', 'Desativar o antivírus'],
        correta: 2,
      },
      {
        pergunta: 'Um certificado digital serve para:',
        opcoes: ['Guardar fotos', 'Comprovar identidade digital com segurança', 'Aumentar velocidade', 'Bloquear sites'],
        correta: 1,
      },
      {
        pergunta: 'Engenharia social é:',
        opcoes: ['Curso de tecnologia', 'Manipulação de pessoas para obter informações', 'Software de segurança', 'Tipo de rede'],
        correta: 1,
      },
      {
        pergunta: 'Ao usar Wi-Fi público é recomendado:',
        opcoes: ['Fazer compras online', 'Acessar o banco normalmente', 'Evitar dados sensíveis ou usar VPN', 'Desligar o antivírus'],
        correta: 2,
      },
      {
        pergunta: 'O que é criptografia?',
        opcoes: ['Compressão de arquivos', 'Codificação de dados para proteger informações', 'Tipo de vírus', 'Formato de imagem'],
        correta: 1,
      },
      {
        pergunta: 'Spyware é um programa que:',
        opcoes: ['Acelera o computador', 'Monitora e rouba informações do usuário', 'Protege contra vírus', 'Organiza arquivos'],
        correta: 1,
      },
      {
        pergunta: 'Atualizar o sistema operacional é importante porque:',
        opcoes: ['Deixa o PC mais bonito', 'Corrige falhas e vulnerabilidades de segurança', 'Aumenta o armazenamento', 'Muda a interface'],
        correta: 1,
      },
    ],
  },
];

// ── ESTADO ────────────────────────────────────────────────────────────────────

let estado = {
  categoria: null,
  questoes: [],       // questões embaralhadas da rodada
  indice: 0,
  pontos: 0,
  streak: 0,
  maxStreak: 0,
  respondidas: 0,
  respondeuAtual: false,
};

// ── UTILS ─────────────────────────────────────────────────────────────────────

function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── RENDER ────────────────────────────────────────────────────────────────────

export function render(container) {
  container.innerHTML = `
    <div class="jogo-area" id="quiz-root">
      <div class="page-header">
        <span class="page-header__eyebrow">Jogo</span>
        <h1 class="page-header__titulo">🧠 Quiz de Informática</h1>
        <p class="page-header__desc">10 perguntas por rodada. Escolha uma categoria e teste seus conhecimentos!</p>
      </div>

      <!-- Tela de seleção de categoria -->
      <div id="quiz-tela-cat">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
          ${CATEGORIAS.map(cat => `
            <button class="card quiz-btn-cat" data-cat="${cat.id}" style="
              cursor:pointer; text-align:left; padding:1.5rem;
              border-color:${cat.cor}33;
              transition:border-color 0.2s, transform 0.2s;
            ">
              <div style="font-size:2.5rem; margin-bottom:0.75rem">${cat.emoji}</div>
              <div style="font-family:var(--font-display); font-weight:700; font-size:1.1rem; color:var(--text); margin-bottom:0.25rem">${cat.nome}</div>
              <div style="font-size:0.8rem; color:var(--text-3)">${cat.questoes.length} questões</div>
            </button>
          `).join('')}
        </div>
        <div style="margin-top:1.5rem;">
          <button class="btn btn--primary" id="quiz-btn-aleatorio" style="gap:0.5rem;">
            🎲 Modo Aleatório (todas as categorias)
          </button>
        </div>
      </div>

      <!-- Tela do quiz -->
      <div id="quiz-tela-jogo" style="display:none; max-width:680px;">

        <!-- Header da rodada -->
        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.5rem;">
          <button class="btn btn--ghost btn--sm" id="quiz-btn-sair">← Categorias</button>
          <span id="quiz-cat-nome" style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-3); text-transform:uppercase; letter-spacing:0.1em;"></span>
          <span style="flex:1"></span>
          <!-- Streak -->
          <span id="quiz-streak" style="font-family:var(--font-mono); font-size:0.8rem; color:var(--warning);"></span>
          <!-- Pontos -->
          <span id="quiz-pontos-topo" style="font-family:var(--font-mono); font-size:0.8rem; color:var(--primary);"></span>
        </div>

        <!-- Barra de progresso -->
        <div style="background:var(--bg-2); border-radius:4px; height:4px; margin-bottom:1.5rem; overflow:hidden;">
          <div id="quiz-barra" style="height:100%; background:var(--primary); border-radius:4px; transition:width 0.4s ease;"></div>
        </div>

        <!-- Questão -->
        <div id="quiz-questao-wrap" class="card" style="padding:1.5rem; margin-bottom:1rem;">
          <div id="quiz-numero" style="font-family:var(--font-mono); font-size:0.7rem; color:var(--primary); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.75rem;"></div>
          <p id="quiz-pergunta" style="font-size:1.05rem; font-weight:500; color:var(--text); line-height:1.65; margin-bottom:1.5rem;"></p>
          <div id="quiz-opcoes" style="display:flex; flex-direction:column; gap:0.5rem;"></div>
        </div>

        <!-- Feedback -->
        <div id="quiz-feedback" style="display:none; padding:0.75rem 1rem; border-radius:8px; margin-bottom:1rem; font-size:0.9rem; line-height:1.5;"></div>

        <!-- Botão próxima -->
        <button class="btn btn--primary" id="quiz-btn-proxima" style="display:none; width:100%; justify-content:center;">
          Próxima →
        </button>
      </div>

      <!-- Tela de resultado final -->
      <div id="quiz-tela-resultado" style="display:none; max-width:500px; text-align:center; padding:2rem 1rem;">
        <div id="quiz-resultado-emoji" style="font-size:4rem; margin-bottom:1rem;"></div>
        <h2 style="font-family:var(--font-display); font-size:2rem; font-weight:800; color:var(--text); margin-bottom:0.5rem;" id="quiz-resultado-titulo"></h2>
        <p style="color:var(--text-2); margin-bottom:2rem;" id="quiz-resultado-desc"></p>

        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-bottom:2rem;">
          <div class="card" style="padding:1rem; text-align:center;">
            <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:800; color:var(--primary);" id="quiz-res-pontos"></div>
            <div style="font-size:0.75rem; color:var(--text-3); text-transform:uppercase; letter-spacing:0.05em; margin-top:0.25rem;">Pontos</div>
          </div>
          <div class="card" style="padding:1rem; text-align:center;">
            <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:800; color:var(--success);" id="quiz-res-acertos"></div>
            <div style="font-size:0.75rem; color:var(--text-3); text-transform:uppercase; letter-spacing:0.05em; margin-top:0.25rem;">Acertos</div>
          </div>
          <div class="card" style="padding:1rem; text-align:center;">
            <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:800; color:var(--warning);" id="quiz-res-streak"></div>
            <div style="font-size:0.75rem; color:var(--text-3); text-transform:uppercase; letter-spacing:0.05em; margin-top:0.25rem;">Streak</div>
          </div>
        </div>

        <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
          <button class="btn btn--primary" id="quiz-btn-repetir">🔄 Repetir</button>
          <button class="btn btn--ghost" id="quiz-btn-outras">📋 Categorias</button>
        </div>
      </div>
    </div>
  `;
}

// ── INIT ──────────────────────────────────────────────────────────────────────

export function init(container) {
  // Categorias
  container.querySelectorAll('.quiz-btn-cat').forEach(btn => {
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'translateY(-2px)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    btn.addEventListener('click', () => {
      const cat = CATEGORIAS.find(c => c.id === btn.dataset.cat);
      iniciarQuiz(cat, container);
    });
  });

  // Aleatório
  container.querySelector('#quiz-btn-aleatorio').addEventListener('click', () => {
    // Junta todas as questões de todas as categorias e sorteia 10
    const todas = CATEGORIAS.flatMap(c => c.questoes.map(q => ({ ...q, _cat: c.nome })));
    const catFake = {
      id: 'aleatorio',
      nome: 'Aleatório 🎲',
      emoji: '🎲',
      cor: '#818cf8',
      questoes: embaralhar(todas).slice(0, 10),
    };
    iniciarQuiz(catFake, container);
  });
}

// ── INICIAR QUIZ ──────────────────────────────────────────────────────────────

function iniciarQuiz(categoria, container) {
  estado = {
    categoria,
    questoes: embaralhar(categoria.questoes).slice(0, 10),
    indice: 0,
    pontos: 0,
    streak: 0,
    maxStreak: 0,
    respondidas: 0,
    respondeuAtual: false,
    acertos: 0,
  };

  container.querySelector('#quiz-tela-cat').style.display = 'none';
  container.querySelector('#quiz-tela-resultado').style.display = 'none';
  const telaJogo = container.querySelector('#quiz-tela-jogo');
  telaJogo.style.display = '';

  container.querySelector('#quiz-cat-nome').textContent = `${categoria.emoji || ''} ${categoria.nome}`;

  // Bind: sair
  container.querySelector('#quiz-btn-sair').onclick = () => {
    container.querySelector('#quiz-tela-cat').style.display = '';
    telaJogo.style.display = 'none';
  };

  // Bind: próxima
  container.querySelector('#quiz-btn-proxima').onclick = () => avancarQuestao(container);

  mostrarQuestao(container);
}

// ── MOSTRAR QUESTÃO ───────────────────────────────────────────────────────────

function mostrarQuestao(container) {
  const { questoes, indice } = estado;
  const q = questoes[indice];
  const total = questoes.length;

  // Progresso
  container.querySelector('#quiz-barra').style.width = `${(indice / total) * 100}%`;
  container.querySelector('#quiz-numero').textContent = `Questão ${indice + 1} de ${total}`;
  container.querySelector('#quiz-pergunta').textContent = q.pergunta;
  container.querySelector('#quiz-pontos-topo').textContent = `⭐ ${estado.pontos} pts`;
  container.querySelector('#quiz-streak').textContent = estado.streak >= 2 ? `🔥 ${estado.streak}x` : '';

  // Opções
  const opcoesEl = container.querySelector('#quiz-opcoes');
  opcoesEl.innerHTML = '';
  q.opcoes.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'alternativa';
    btn.innerHTML = `
      <span class="alternativa__letra">${['A','B','C','D'][i]}</span>
      ${op}
    `;
    btn.addEventListener('click', () => {
      if (estado.respondeuAtual) return;
      responder(i, container);
    });
    opcoesEl.appendChild(btn);
  });

  // Reseta feedback e botão
  const feedback = container.querySelector('#quiz-feedback');
  feedback.style.display = 'none';
  container.querySelector('#quiz-btn-proxima').style.display = 'none';
  estado.respondeuAtual = false;
}

// ── RESPONDER ─────────────────────────────────────────────────────────────────

function responder(opcaoIdx, container) {
  estado.respondeuAtual = true;
  const q = estado.questoes[estado.indice];
  const correta = opcaoIdx === q.correta;

  // Pontuação: acerto base = 10pts, bônus de streak
  if (correta) {
    estado.streak++;
    estado.maxStreak = Math.max(estado.maxStreak, estado.streak);
    const bonus = Math.min(estado.streak - 1, 5) * 2;
    estado.pontos += 10 + bonus;
    estado.acertos++;
  } else {
    estado.streak = 0;
  }

  // Atualiza streak e pontos no topo
  container.querySelector('#quiz-pontos-topo').textContent = `⭐ ${estado.pontos} pts`;
  container.querySelector('#quiz-streak').textContent = estado.streak >= 2 ? `🔥 ${estado.streak}x` : '';

  // Colore as opções
  const btns = container.querySelectorAll('.alternativa');
  btns.forEach((btn, i) => {
    btn.style.pointerEvents = 'none';
    if (i === q.correta) {
      btn.classList.add('correta');
    } else if (i === opcaoIdx && !correta) {
      btn.classList.add('incorreta');
    }
  });

  // Feedback
  const feedback = container.querySelector('#quiz-feedback');
  feedback.style.display = '';
  if (correta) {
    const bonus = Math.min(estado.streak - 1, 5) * 2;
    feedback.style.background = '#22c55e18';
    feedback.style.border = '1px solid #22c55e44';
    feedback.style.color = '#4ade80';
    feedback.innerHTML = `✅ <strong>Correto!</strong>${bonus > 0 ? ` +${bonus} bônus de streak 🔥` : ''}`;
  } else {
    feedback.style.background = 'rgba(248,113,113,0.08)';
    feedback.style.border = '1px solid rgba(248,113,113,0.3)';
    feedback.style.color = 'var(--danger)';
    feedback.innerHTML = `❌ <strong>Errado.</strong> A resposta correta era: <strong>${q.opcoes[q.correta]}</strong>`;
  }

  // Botão próxima ou resultado
  const btnProxima = container.querySelector('#quiz-btn-proxima');
  btnProxima.style.display = '';
  const isUltima = estado.indice >= estado.questoes.length - 1;
  btnProxima.textContent = isUltima ? 'Ver Resultado 🏁' : 'Próxima →';
}

// ── AVANÇAR ───────────────────────────────────────────────────────────────────

function avancarQuestao(container) {
  estado.indice++;
  if (estado.indice >= estado.questoes.length) {
    mostrarResultado(container);
  } else {
    mostrarQuestao(container);
  }
}

// ── RESULTADO FINAL ───────────────────────────────────────────────────────────

function mostrarResultado(container) {
  container.querySelector('#quiz-tela-jogo').style.display = 'none';
  const telaRes = container.querySelector('#quiz-tela-resultado');
  telaRes.style.display = '';

  const total   = estado.questoes.length;
  const acertos = estado.acertos;
  const pct     = Math.round((acertos / total) * 100);

  // Emoji e mensagem baseados no desempenho
  let emoji, titulo, desc;
  if (pct === 100) {
    emoji = '🏆'; titulo = 'Perfeito!'; desc = 'Nota 100! Você mandou muito bem!';
  } else if (pct >= 80) {
    emoji = '🎉'; titulo = 'Excelente!'; desc = 'Ótimo desempenho, quase perfeito!';
  } else if (pct >= 60) {
    emoji = '👍'; titulo = 'Bom trabalho!'; desc = 'Você está no caminho certo!';
  } else if (pct >= 40) {
    emoji = '📚'; titulo = 'Continue estudando!'; desc = 'Revise o conteúdo e tente novamente!';
  } else {
    emoji = '💪'; titulo = 'Não desista!'; desc = 'A prática leva à perfeição!';
  }

  container.querySelector('#quiz-resultado-emoji').textContent = emoji;
  container.querySelector('#quiz-resultado-titulo').textContent = titulo;
  container.querySelector('#quiz-resultado-desc').textContent   = `${desc} (${acertos}/${total} — ${pct}%)`;
  container.querySelector('#quiz-res-pontos').textContent   = estado.pontos;
  container.querySelector('#quiz-res-acertos').textContent  = `${acertos}/${total}`;
  container.querySelector('#quiz-res-streak').textContent   = estado.maxStreak;

  // Barra final
  container.querySelector('#quiz-barra').style.width = '100%';

  // Bind botões do resultado
  container.querySelector('#quiz-btn-repetir').onclick = () => iniciarQuiz(estado.categoria, container);
  container.querySelector('#quiz-btn-outras').onclick  = () => {
    telaRes.style.display = 'none';
    container.querySelector('#quiz-tela-cat').style.display = '';
  };
}
