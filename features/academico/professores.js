/**
 * INTEGRAÇÃO EM features/academico/professores.js
 * 
 * Adicione esta função ao arquivo existente
 * Ela mostra a presença do dia no painel de professor
 */

// No topo do arquivo, adicione import:
import { obterPresencaDia } from '../../modules/check-in-simples.js';

// ─────────────────────────────────────────────────────────────────────────────
// NOVA SEÇÃO: PRESENÇA DO DIA
// ─────────────────────────────────────────────────────────────────────────────

export async function renderPresencaCheckIn(container, professorId) {
  container.innerHTML = '';

  // Data de hoje
  const hoje = new Date().toISOString().split('T')[0];

  // Título
  const title = document.createElement('h2');
  title.textContent = '📱 Check-in de Presença';
  title.style.marginBottom = '1rem';
  container.appendChild(title);

  // Botão para gerar QR
  const btnGerarQR = document.createElement('button');
  btnGerarQR.className = 'btn btn--principal';
  btnGerarQR.textContent = '📱 Ir para Check-in';
  btnGerarQR.style.marginBottom = '1.5rem';
  btnGerarQR.onclick = () => window.location.href = '/check-in';
  container.appendChild(btnGerarQR);

  // Carregando presença
  const loading = document.createElement('p');
  loading.textContent = 'Carregando presença...';
  loading.style.color = '#999';
  container.appendChild(loading);

  // Busca presença de hoje
  const presenca = await obterPresencaDia(hoje);

  if (presenca.erro) {
    loading.textContent = `Erro: ${presenca.erro}`;
    loading.style.color = '#f00';
    return;
  }

  // Remove loading
  loading.remove();

  if (!presenca || presenca.length === 0) {
    const vazio = document.createElement('p');
    vazio.textContent = 'Nenhuma presença registrada ainda';
    vazio.style.color = '#999';
    vazio.style.padding = '2rem';
    vazio.style.textAlign = 'center';
    container.appendChild(vazio);
    return;
  }

  // Tabela de presença
  const tabela = document.createElement('table');
  tabela.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  `;

  // Header
  const header = document.createElement('thead');
  header.innerHTML = `
    <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb;">
      <th style="padding: 0.75rem; text-align: left;">Aluno</th>
      <th style="padding: 0.75rem; text-align: center;">Status</th>
      <th style="padding: 0.75rem; text-align: right;">Horário</th>
    </tr>
  `;
  tabela.appendChild(header);

  // Body
  const body = document.createElement('tbody');
  presenca.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #e5e7eb';

    const nome = p.usuarios?.nome || 'Desconhecido';
    const status = p.presenca ? '✅ Presente' : '❌ Ausente';
    const statusColor = p.presenca ? '#10b981' : '#ef4444';
    const horario = p.timestamp 
      ? new Date(p.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : '—';

    tr.innerHTML = `
      <td style="padding: 0.75rem; font-weight: 500;">${nome}</td>
      <td style="padding: 0.75rem; text-align: center; color: ${statusColor}; font-weight: 600;">${status}</td>
      <td style="padding: 0.75rem; text-align: right; color: #666;">${horario}</td>
    `;

    body.appendChild(tr);
  });

  tabela.appendChild(body);
  container.appendChild(tabela);

  // Resumo
  const total = presenca.length;
  const presentes = presenca.filter(p => p.presenca).length;
  const ausentes = total - presentes;

  const resumo = document.createElement('div');
  resumo.style.cssText = `
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
    display: flex;
    gap: 1rem;
    justify-content: space-around;
    text-align: center;
  `;

  resumo.innerHTML = `
    <div>
      <div style="font-size: 1.5rem; font-weight: 700; color: #10b981;">${presentes}</div>
      <div style="font-size: 0.85rem; color: #666;">Presentes</div>
    </div>
    <div>
      <div style="font-size: 1.5rem; font-weight: 700; color: #ef4444;">${ausentes}</div>
      <div style="font-size: 0.85rem; color: #666;">Ausentes</div>
    </div>
    <div>
      <div style="font-size: 1.5rem; font-weight: 700; color: #667eea;">${total}</div>
      <div style="font-size: 0.85rem; color: #666;">Total</div>
    </div>
  `;

  container.appendChild(resumo);

  // Botão exportar CSV (opcional)
  const btnExportar = document.createElement('button');
  btnExportar.className = 'btn btn--neutro';
  btnExportar.textContent = '📊 Exportar CSV';
  btnExportar.style.marginTop = '1rem';
  btnExportar.onclick = () => exportarPresencaCSV(presenca);
  container.appendChild(btnExportar);
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: EXPORTAR CSV
// ─────────────────────────────────────────────────────────────────────────────

function exportarPresencaCSV(presenca) {
  const headers = ['Nome', 'Email', 'Status', 'Horário'];
  const rows = presenca.map(p => [
    p.usuarios?.nome || '?',
    p.usuarios?.email || '?',
    p.presenca ? 'Presente' : 'Ausente',
    p.timestamp ? new Date(p.timestamp).toLocaleString('pt-BR') : '—',
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `presenca-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

// ═════════════════════════════════════════════════════════════════════════════════
// COMO USAR:
//
// 1. No seu renderProfessores() existente, adicione uma seção/tab para check-in
// 2. Quando usuário clicar em "Presença", chame:
//
//    renderPresencaCheckIn(container, usuario.id);
//
// 3. Pronto! Vai mostrar tabela de presença do dia
//
// Exemplo de integração em uma tab:
//
//    <div id="tab-presenca">
//      <!-- renderPresencaCheckIn preenche aqui -->
//    </div>
//
//    document.getElementById('tab-presenca').addEventListener('click', async () => {
//      const container = document.getElementById('presenca-conteudo');
//      await renderPresencaCheckIn(container, usuario.id);
//    });
// ═════════════════════════════════════════════════════════════════════════════════
