/**
 * modules/api.js
 * Busca conteúdos do Supabase (tabela: conteudos)
 */

import { supabase } from './supabase.js';

const _cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

export async function buscarConteudos(forcarRecarregar = false) {
  const cacheKey = 'conteudos';
  const cached = _cache.get(cacheKey);
  if (!forcarRecarregar && cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.dados;
  }

  const { data, error } = await supabase
    .from('conteudos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const dados = (data || []).filter(_estaAtivo);
  _cache.set(cacheKey, { dados, ts: Date.now() });
  return dados;
}

export async function publicarConteudo(dados) {
  const { error } = await supabase.from('conteudos').insert([dados]);
  if (error) throw new Error(error.message);
  limparCache();
}

export async function removerConteudo(id) {
  const { error } = await supabase.from('conteudos').delete().eq('id', id);
  if (error) throw new Error(error.message);
  limparCache();
}

function _estaAtivo(item) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (item.data_de_publicacao) {
    const inicio = new Date(item.data_de_publicacao);
    if (!isNaN(inicio) && inicio > hoje) return false;
  }
  if (item.data_de_encerramento) {
    const fim = new Date(item.data_de_encerramento);
    if (!isNaN(fim) && fim < hoje) return false;
  }
  return true;
}

export function filtrarPorProfessor(conteudos, professor) {
  if (!professor) return conteudos;
  return conteudos.filter(c => c.professor?.toLowerCase() === professor.toLowerCase());
}

export function filtrarPorTipo(conteudos, tipo) {
  if (!tipo) return conteudos;
  return conteudos.filter(c => c.tipo === tipo);
}

export function filtrarPorTurma(conteudos, turma) {
  if (!turma) return conteudos;
  return conteudos.filter(c => c.turma?.toLowerCase() === turma.toLowerCase());
}

export function listarProfessores(conteudos) {
  return [...new Set(conteudos.map(c => c.professor).filter(Boolean))].sort();
}

export function listarTurmas(conteudos) {
  return [...new Set(conteudos.map(c => c.turma).filter(Boolean))].sort();
}

export function limparCache() {
  _cache.clear();
}
