// app/composables/useCanvasTemplates.js
// Definição central dos 4 modelos de canvas colaborativo.
// Usado pelo seletor do professor (Fase 1) e pelo board do aluno (Fase 2).
//
// Estrutura de cada modelo:
//   key   -> identificador salvo em activities.canvas_template
//   name  -> nome exibido
//   icon  -> emoji/ícone
//   desc  -> descrição curta para o professor
//   cols  -> nº de colunas no grid (desktop). Mobile cai pra 1.
//   axes  -> (opcional) rótulos dos eixos, usado na Matriz Esforço x Impacto
//   zones -> blocos do canvas. Cada zona:
//              id    -> chave salva em canvas_postits.zone
//              title -> título do bloco
//              hint  -> dica/explicação
//              color -> cor de destaque (usa as CSS vars do projeto)

export const CANVAS_TEMPLATES = {
  empatia: {
    key: 'empatia',
    name: 'Mapa da Empatia',
    icon: '🧠',
    desc: 'Entenda profundamente a pessoa: o que ela pensa, sente, vê, ouve, fala e faz.',
    cols: 3,
    zones: [
      { id: 'pensa_sente', title: 'Pensa e Sente', hint: 'O que realmente importa, preocupações, sonhos e aspirações', color: 'var(--col-i)' },
      { id: 've',          title: 'Vê',            hint: 'O ambiente, amigos, o que o mercado oferece a ela', color: 'var(--col-a)' },
      { id: 'ouve',        title: 'Ouve',          hint: 'O que dizem os amigos, o chefe, as pessoas influentes', color: 'var(--col-s)' },
      { id: 'fala_faz',    title: 'Fala e Faz',    hint: 'Atitude em público, aparência, comportamento', color: 'var(--col-e)' },
      { id: 'dores',       title: 'Dores',         hint: 'Medos, frustrações e obstáculos', color: 'var(--col-r)' },
      { id: 'ganhos',      title: 'Ganhos',        hint: 'Desejos, necessidades e o que é sucesso pra ela', color: 'var(--col-c)' },
    ],
  },

  esforco_impacto: {
    key: 'esforco_impacto',
    name: 'Matriz Esforço × Impacto',
    icon: '🎯',
    desc: 'Priorize ideias cruzando o esforço necessário com o impacto gerado.',
    cols: 2,
    axes: {
      x: { left: 'Baixo esforço', right: 'Alto esforço' },
      y: { top: 'Alto impacto', bottom: 'Baixo impacto' },
    },
    zones: [
      { id: 'ganhos_rapidos', title: 'Ganhos Rápidos', hint: 'Alto impacto • Baixo esforço — faça primeiro!', color: 'var(--col-s)' },
      { id: 'grandes_apostas', title: 'Grandes Apostas', hint: 'Alto impacto • Alto esforço — planeje bem', color: 'var(--col-i)' },
      { id: 'preenchimento',  title: 'Preenchimento',   hint: 'Baixo impacto • Baixo esforço — se sobrar tempo', color: 'var(--col-c)' },
      { id: 'repensar',       title: 'Repensar',        hint: 'Baixo impacto • Alto esforço — evite ou descarte', color: 'var(--col-r)' },
    ],
  },

  raci: {
    key: 'raci',
    name: 'Matriz RACI',
    icon: '👥',
    desc: 'Defina papéis e responsabilidades do time em cada tarefa.',
    cols: 2,
    zones: [
      { id: 'responsavel', title: 'R · Responsável', hint: 'Quem executa a tarefa (põe a mão na massa)', color: 'var(--col-s)' },
      { id: 'aprovador',   title: 'A · Aprovador',   hint: 'Quem responde pelo resultado e aprova', color: 'var(--col-r)' },
      { id: 'consultado',  title: 'C · Consultado',  hint: 'Quem dá opinião antes da decisão', color: 'var(--col-i)' },
      { id: 'informado',   title: 'I · Informado',   hint: 'Quem precisa ser avisado do andamento', color: 'var(--col-c)' },
    ],
  },

  pitch: {
    key: 'pitch',
    name: 'Pitch Canvas',
    icon: '🚀',
    desc: 'Estruture a apresentação da ideia: do problema ao pedido final.',
    cols: 3,
    zones: [
      { id: 'problema',  title: 'Problema',          hint: 'Qual dor real vocês resolvem?', color: 'var(--col-r)' },
      { id: 'solucao',   title: 'Solução',           hint: 'O que vocês criaram pra resolver', color: 'var(--col-s)' },
      { id: 'diferencial', title: 'Diferencial',     hint: 'O que torna a ideia única e melhor', color: 'var(--col-a)' },
      { id: 'publico',   title: 'Público-alvo',      hint: 'Para quem é? Quem se beneficia?', color: 'var(--col-i)' },
      { id: 'receita',   title: 'Modelo de Receita', hint: 'Como a ideia se sustenta / gera valor', color: 'var(--col-e)' },
      { id: 'pedido',    title: 'Pedido',            hint: 'O que vocês pedem ao público no final?', color: 'var(--col-c)' },
    ],
  },
}

// Lista ordenada para renderizar o seletor
export const CANVAS_TEMPLATE_LIST = Object.values(CANVAS_TEMPLATES)

// Helper para buscar um modelo pela key (com fallback seguro)
export function getCanvasTemplate(key) {
  return CANVAS_TEMPLATES[key] || null
}

// Cores de post-it disponíveis (mapeadas pro CSS no board)
export const POSTIT_COLORS = ['yellow', 'pink', 'cyan', 'green', 'purple']
