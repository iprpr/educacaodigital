/**
 * features/jogos/paint-jogo.js
 * Paint — tela inteira, ferramentas na sidebar esquerda
 */

export const META = {
  id: 'paint',
  nome: 'Paint',
  descricao: 'Desenhe e pinte livremente',
  emoji: '🎨',
};

const PALETA = [
  '#000000','#ffffff','#ef4444','#f97316','#eab308','#22c55e',
  '#3b82f6','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f59e0b',
  '#6366f1','#14b8a6','#f43f5e','#a855f7','#0ea5e9','#10b981',
  '#7c3aed','#db2777','#059669','#d97706','#dc2626','#2563eb',
  '#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b','#c084fc',
];

export function render(container) {
  container.innerHTML = `
    <div id="paint-root" style="
      position:fixed; top:0; left:0; width:100vw; height:100vh;
      background:#1a1a2e; display:flex; z-index:100;
    ">
      <style>
        #paint-sidebar {
          width:200px; min-width:200px; background:#0f0f1a;
          border-right:1px solid #2a2a3e;
          display:flex; flex-direction:column;
          overflow-y:auto; padding:.6rem .5rem; gap:.3rem;
        }
        #paint-sidebar h3 {
          font-size:.65rem; text-transform:uppercase; letter-spacing:.1em;
          color:#444; margin:.6rem .3rem .2rem;
        }
        .pt-btn {
          display:flex; align-items:center; gap:.5rem;
          padding:.45rem .7rem; border-radius:.5rem;
          border:none; background:transparent; color:#888;
          cursor:pointer; font-size:.82rem; width:100%;
          text-align:left; transition:.15s;
        }
        .pt-btn:hover { background:#1a1a2e; color:#fff; }
        .pt-btn.ativo { background:#1e3a5f; color:#38bdf8; }
        .pt-btn .ti { font-size:1rem; width:1.3rem; text-align:center; }
        .pt-sep { height:1px; background:#2a2a3e; margin:.2rem 0; }
        .pt-tamanhos { display:flex; gap:.3rem; flex-wrap:wrap; padding:.2rem .3rem; }
        .pt-tam {
          border:2px solid #2a2a3e; background:transparent;
          border-radius:50%; cursor:pointer; transition:.15s;
          display:flex; align-items:center; justify-content:center;
        }
        .pt-tam.ativo { border-color:#38bdf8; }
        .pt-cor-atual {
          width:34px; height:34px; border-radius:.4rem;
          border:2px solid #555; cursor:pointer; margin:.2rem .3rem;
          flex-shrink:0;
        }
        .pt-paleta { display:flex; flex-wrap:wrap; gap:3px; padding:.2rem .3rem; }
        .pt-cor {
          width:21px; height:21px; border-radius:3px;
          border:2px solid transparent; cursor:pointer; transition:.1s;
        }
        .pt-cor:hover { transform:scale(1.2); border-color:#fff; }
        .pt-cor.ativo { border-color:#fff; transform:scale(1.15); }
        #paint-area {
          flex:1; display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden; background:#2a2a3e;
        }
        #paint-topbar {
          position:absolute; top:0; left:0; right:0; height:34px;
          background:rgba(15,15,26,.95); border-bottom:1px solid #2a2a3e;
          display:flex; align-items:center; gap:.5rem; padding:0 .75rem; z-index:5;
        }
        #paint-topbar span { font-size:.75rem; color:#555; }
        .pt-top-btn {
          padding:.18rem .65rem; border-radius:.3rem; border:1px solid #2a2a3e;
          background:transparent; color:#888; cursor:pointer; font-size:.75rem; transition:.15s;
        }
        .pt-top-btn:hover { background:#1a1a2e; color:#fff; }
        #paint-fechar {
          margin-left:auto; padding:.18rem .65rem; border-radius:.3rem;
          border:1px solid #ef444440; background:transparent;
          color:#ef4444; cursor:pointer; font-size:.75rem;
        }
        #paint-fechar:hover { background:#ef444415; }
        #paint-canvas {
          display:block; background:#fff;
          box-shadow:0 4px 32px rgba(0,0,0,.5);
          margin-top:34px; cursor:crosshair; touch-action:none;
        }
        #paint-modal {
          position:fixed; inset:0; background:rgba(0,0,0,.7);
          display:flex; align-items:center; justify-content:center; z-index:200;
        }
        #paint-modal.oculto { display:none; }
        .pm-box {
          background:#1a1a2e; border:1px solid #2a2a3e; border-radius:1rem;
          padding:1.5rem; min-width:260px; text-align:center;
        }
        .pm-box h3 { color:#38bdf8; margin-bottom:1rem; font-size:1rem; }
        .pm-box input {
          width:100%; padding:.45rem .7rem; border-radius:.5rem;
          border:1px solid #2a2a3e; background:#0f0f1a; color:#fff;
          font-size:.9rem; margin-bottom:.75rem; box-sizing:border-box;
        }
        .pm-btns { display:flex; gap:.5rem; justify-content:center; }
        .pm-btns button { padding:.35rem .9rem; border-radius:.4rem; border:none; cursor:pointer; font-size:.88rem; }
        .pm-ok { background:#38bdf8; color:#000; font-weight:700; }
        .pm-cancel { background:#2a2a3e; color:#aaa; }
      </style>

      <!-- SIDEBAR -->
      <div id="paint-sidebar">
        <h3>Ferramentas</h3>
        <button class="pt-btn ativo" data-tool="pincel"><span class="ti">🖌️</span>Pincel</button>
        <button class="pt-btn" data-tool="borracha"><span class="ti">🧹</span>Borracha</button>
        <button class="pt-btn" data-tool="balde"><span class="ti">🪣</span>Preencher</button>
        <button class="pt-btn" data-tool="linha"><span class="ti">📏</span>Linha</button>
        <button class="pt-btn" data-tool="retangulo"><span class="ti">⬜</span>Retângulo</button>
        <button class="pt-btn" data-tool="circulo"><span class="ti">⭕</span>Círculo</button>

        <div class="pt-sep"></div>
        <h3>Espessura</h3>
        <div class="pt-tamanhos" id="pt-tamanhos"></div>

        <div class="pt-sep"></div>
        <h3>Cor</h3>
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="pt-cor-atual" id="pt-cor-atual"></div>
          <input type="color" id="pt-picker" style="width:34px;height:34px;border:none;background:none;cursor:pointer;padding:0"/>
        </div>
        <div class="pt-paleta" id="pt-paleta"></div>
      </div>

      <!-- ÁREA DO CANVAS -->
      <div id="paint-area">
        <div id="paint-topbar">
          <button class="pt-top-btn" id="pt-desfazer">↩ Desfazer</button>
          <button class="pt-top-btn" id="pt-limpar" style="color:#f59e0b;border-color:#f59e0b40">🗑 Limpar</button>
          <button class="pt-top-btn" id="pt-salvar">💾 Salvar</button>
          <button id="paint-fechar">✕ Fechar</button>
        </div>
        <canvas id="paint-canvas"></canvas>
      </div>

      <!-- Modal salvar -->
      <div id="paint-modal" class="oculto">
        <div class="pm-box">
          <h3>💾 Salvar desenho</h3>
          <input type="text" id="pt-nome" placeholder="meu-desenho" value="meu-desenho"/>
          <div class="pm-btns">
            <button class="pm-cancel" id="pm-cancel">Cancelar</button>
            <button class="pm-ok" id="pm-ok">Salvar PNG</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(container) {
  const canvas = container.querySelector('#paint-canvas');
  const ctx    = canvas.getContext('2d');

  let ferramenta = 'pincel';
  let cor        = '#000000';
  let espessura  = 6;
  let desenhando = false;
  let startX, startY, snap;
  let undo = [];

  // ── DIMENSIONAR ──
  function dimensionar() {
    const area = container.querySelector('#paint-area');
    const W = area.clientWidth;
    const H = area.clientHeight - 34;
    const lado = Math.min(W - 24, H - 24, 1000);
    const imgData = canvas.width ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
    canvas.width  = lado;
    canvas.height = lado;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, lado, lado);
    if (imgData) ctx.putImageData(imgData, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
  dimensionar();
  window.addEventListener('resize', dimensionar);

  // ── FERRAMENTAS ──
  container.querySelectorAll('[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      ferramenta = btn.dataset.tool;
      container.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
    });
  });

  // ── ESPESSURAS ──
  const tamanhos = [2, 4, 6, 10, 16, 24];
  const elTams = container.querySelector('#pt-tamanhos');
  tamanhos.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'pt-tam' + (t === espessura ? ' ativo' : '');
    const s = t + 10;
    btn.style.cssText = `width:${s}px;height:${s}px`;
    btn.innerHTML = `<span style="width:${t}px;height:${t}px;border-radius:50%;background:#fff;display:block"></span>`;
    btn.title = t + 'px';
    btn.addEventListener('click', () => {
      espessura = t;
      elTams.querySelectorAll('.pt-tam').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
    });
    elTams.appendChild(btn);
  });

  // ── PALETA ──
  const elCorAtual = container.querySelector('#pt-cor-atual');
  const picker     = container.querySelector('#pt-picker');
  const elPaleta   = container.querySelector('#pt-paleta');

  function setCor(c) {
    cor = c;
    elCorAtual.style.background = c;
    picker.value = c;
    elPaleta.querySelectorAll('.pt-cor').forEach(b => b.classList.toggle('ativo', b.dataset.c === c));
  }

  PALETA.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'pt-cor';
    btn.dataset.c = c;
    btn.style.background = c;
    btn.title = c;
    btn.addEventListener('click', () => setCor(c));
    elPaleta.appendChild(btn);
  });
  setCor('#000000');
  picker.addEventListener('input', () => setCor(picker.value));

  // ── UNDO ──
  function salvarEstado() {
    undo.push(canvas.toDataURL());
    if (undo.length > 25) undo.shift();
  }
  salvarEstado();

  container.querySelector('#pt-desfazer').addEventListener('click', () => {
    if (undo.length > 1) {
      undo.pop();
      const img = new Image();
      img.src = undo[undo.length - 1];
      img.onload = () => { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img, 0, 0); };
    }
  });

  // ── LIMPAR ──
  container.querySelector('#pt-limpar').addEventListener('click', () => {
    if (!confirm('Limpar tudo?')) return;
    salvarEstado();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  // ── SALVAR ──
  container.querySelector('#pt-salvar').addEventListener('click', () => {
    container.querySelector('#paint-modal').classList.remove('oculto');
    const inp = container.querySelector('#pt-nome');
    inp.focus(); inp.select();
  });
  container.querySelector('#pm-cancel').addEventListener('click', () => {
    container.querySelector('#paint-modal').classList.add('oculto');
  });
  container.querySelector('#pm-ok').addEventListener('click', () => {
    const nome = container.querySelector('#pt-nome').value.trim() || 'meu-desenho';
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = nome + '.png';
    a.click();
    container.querySelector('#paint-modal').classList.add('oculto');
  });

  // ── FECHAR ──
  container.querySelector('#paint-fechar').addEventListener('click', () => {
    container.querySelector('#paint-root').remove();
    window.removeEventListener('resize', dimensionar);
  });

  // ── FLOOD FILL ──
  function floodFill(x, y, novaCor) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    const idx = (y * canvas.width + x) * 4;
    const r0=d[idx], g0=d[idx+1], b0=d[idx+2];
    const [nr,ng,nb] = hexRgb(novaCor);
    if (r0===nr && g0===ng && b0===nb) return;
    const stack = [[x,y]];
    const seen = new Uint8Array(canvas.width * canvas.height);
    while (stack.length) {
      const [cx,cy] = stack.pop();
      if (cx<0||cy<0||cx>=canvas.width||cy>=canvas.height) continue;
      const si = cy*canvas.width+cx;
      if (seen[si]) continue;
      const i = si*4;
      if (Math.abs(d[i]-r0)>30||Math.abs(d[i+1]-g0)>30||Math.abs(d[i+2]-b0)>30) continue;
      seen[si]=1;
      d[i]=nr; d[i+1]=ng; d[i+2]=nb; d[i+3]=255;
      stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function hexRgb(hex) {
    return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  }

  // ── CANVAS EVENTS ──
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width;
    const sy = canvas.height / r.height;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: Math.floor((cx - r.left) * sx), y: Math.floor((cy - r.top) * sy) };
  }

  canvas.addEventListener('mousedown',  e => iniciar(e));
  canvas.addEventListener('mousemove',  e => mover(e));
  canvas.addEventListener('mouseup',    () => parar());
  canvas.addEventListener('mouseleave', () => parar());
  canvas.addEventListener('touchstart', e => { e.preventDefault(); iniciar(e); }, {passive:false});
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); mover(e); }, {passive:false});
  canvas.addEventListener('touchend',   e => { e.preventDefault(); parar(); }, {passive:false});

  function iniciar(e) {
    const {x,y} = pos(e);
    if (ferramenta === 'balde') { salvarEstado(); floodFill(x, y, cor); return; }
    desenhando = true;
    startX = x; startY = y;
    salvarEstado();
    snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = ferramenta === 'borracha' ? '#ffffff' : cor;
    ctx.lineWidth   = ferramenta === 'borracha' ? espessura * 3 : espessura;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function mover(e) {
    if (!desenhando) return;
    const {x,y} = pos(e);
    if (ferramenta === 'pincel' || ferramenta === 'borracha') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.putImageData(snap, 0, 0);
      ctx.strokeStyle = cor;
      ctx.lineWidth = espessura;
      ctx.beginPath();
      if (ferramenta === 'linha') {
        ctx.moveTo(startX, startY); ctx.lineTo(x, y); ctx.stroke();
      } else if (ferramenta === 'retangulo') {
        ctx.strokeRect(startX, startY, x-startX, y-startY);
      } else if (ferramenta === 'circulo') {
        const rx = Math.abs(x-startX)/2, ry = Math.abs(y-startY)/2;
        ctx.ellipse(startX+(x-startX)/2, startY+(y-startY)/2, rx||1, ry||1, 0, 0, Math.PI*2);
        ctx.stroke();
      }
    }
  }

  function parar() {
    desenhando = false;
    ctx.beginPath();
  }
}
