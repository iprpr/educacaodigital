/**
 * features/jogos/index.js
 * Registro central de jogos.
 * Para adicionar um novo jogo: importar e registrar aqui.
 */

import * as ExemploJogo    from './exemplo-jogo.js';
import * as DigitacaoJogo  from './digitacao-jogo.js';
import * as CacaPalavras   from './caca-palavras.js';
import * as MemoriaPre3    from './memoria-pre3.js';
import * as Memoria1Ano    from './memoria-1ano.js';
import * as Arrastar3Ano   from './arrastar-3ano.js';
import * as PalavrasCruzadas from './palavras-cruzadas.js';
import * as QuizInformatica  from './quiz-informatica.js';

/**
 * Catálogo de jogos registrados.
 * Cada entrada segue o contrato: { id, nome, descricao, emoji, modulo }
 * O módulo deve exportar: render(container) e init(container)
 */
export const JOGOS = [
  {
    id: 'memoria-pre3',
    nome: 'Memória — Dispositivos',
    descricao: 'Pré 3 · Encontre os pares de dispositivos!',
    emoji: '🧠',
    modulo: MemoriaPre3,
  },
  {
    id: 'memoria-1ano',
    nome: 'Memória — Computador',
    descricao: '1º Ano · Partes do computador',
    emoji: '💻',
    modulo: Memoria1Ano,
  },
  {
    id: 'arrastar-3ano',
    nome: 'Arrastar e Soltar',
    descricao: '3º Ano · Software, Hardware e Internet',
    emoji: '🖱️',
    modulo: Arrastar3Ano,
  },
  {
    id: 'caca-palavras',
    nome: 'Caça-Palavras',
    descricao: '5 níveis do Infantil ao Expert',
    emoji: '🔤',
    modulo: CacaPalavras,
  },
  {
    id: 'digitacao',
    nome: 'Velocidade de Digitação',
    descricao: 'Teste sua velocidade no teclado',
    emoji: '⌨️',
    modulo: DigitacaoJogo,
  },
  {
    id: 'palavras-cruzadas',
    nome: 'Palavras Cruzadas',
    descricao: 'Informática · 3 níveis de dificuldade',
    emoji: '✏️',
    modulo: PalavrasCruzadas,
  },
  {
    id: 'quiz-informatica',
    nome: 'Quiz de Informática',
    descricao: '4 categorias · Hardware, Software, Internet e Segurança',
    emoji: '🧠',
    modulo: QuizInformatica,
  },
  {
    id: 'exemplo',
    nome: 'Jogo Exemplo',
    descricao: 'Template base para novos jogos',
    emoji: '🧩',
    modulo: ExemploJogo,
  },
];

/**
 * Busca um jogo pelo ID.
 * @param {string} id
 * @returns {Object|null}
 */
export function buscarJogo(id) {
  return JOGOS.find(j => j.id === id) ?? null;
}