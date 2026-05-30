// app/utils/activityReport.js
// Geração do relatório imprimível (PDF via janela do navegador).
// Fica num util .js para não passar pelo parser de macro das páginas.
import { getCanvasTemplate } from '~/composables/useCanvasTemplates'

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

function zoneTitle(templateKey, zoneId) {
  const t = getCanvasTemplate(templateKey)
  return t?.zones.find(z => z.id === zoneId)?.title || zoneId
}

export function openActivityReport(payload) {
  const {
    activity, participants = [], completedIds = [], canvasList = [],
    ranking = [], contributorsCount = 0, avgPerContributor = 0, notes = [],
  } = payload

  // agrupa post-its por aluno
  const byStudent = {}
  participants.forEach(p => {
    byStudent[p.id] = {
      name: p.name || 'Aluno',
      riasec: p.riasec_profile || '-',
      completed: completedIds.includes(p.id),
      total: 0,
      canvases: {},
    }
  })
  notes.forEach(n => {
    const s = byStudent[n.author_id]
    if (!s) return
    s.total++
    ;(s.canvases[n.template] ||= []).push({ zone: n.zone, content: n.content })
  })

  const dateStr = new Date().toLocaleDateString('pt-BR')
  const seq = canvasList

  const headCanvas = seq.map(c => '<th>' + escapeHtml(c.name) + '</th>').join('')

  const rowsRanking = ranking.map((r, i) => {
    const cells = seq.map(c => '<td style="text-align:center">' + (r.byCanvas[c.key] || 0) + '</td>').join('')
    return '<tr>'
      + '<td>' + (i + 1) + '</td>'
      + '<td>' + escapeHtml(r.name || 'Aluno') + ' <small>(' + escapeHtml(r.riasec_profile || '-') + ')</small></td>'
      + cells
      + '<td style="text-align:center;font-weight:700">' + r.total + '</td>'
      + '<td style="text-align:center">' + (completedIds.includes(r.id) ? '✓' : '—') + '</td>'
      + '</tr>'
  }).join('')

  const studentBlocks = Object.values(byStudent).map(s => {
    const canvasBlocks = seq.filter(c => s.canvases[c.key]?.length).map(c => {
      const items = s.canvases[c.key].map(it =>
        '<div class="note"><span class="note-zone">' + escapeHtml(zoneTitle(c.key, it.zone)) + '</span>'
        + '<p>' + (escapeHtml(it.content) || '<i>(vazio)</i>') + '</p></div>'
      ).join('')
      return '<div class="canvas-block"><h4>' + escapeHtml(c.icon) + ' ' + escapeHtml(c.name) + '</h4>' + items + '</div>'
    }).join('')
    const body = canvasBlocks || '<p class="muted">Sem post-its.</p>'
    return '<section class="student"><div class="student-head">'
      + '<strong>' + escapeHtml(s.name) + '</strong>'
      + '<span class="tag">' + escapeHtml(s.riasec) + '</span>'
      + '<span class="tag ' + (s.completed ? 'ok' : '') + '">' + (s.completed ? 'Concluiu ✓' : 'Não concluiu') + '</span>'
      + '<span class="tag">' + s.total + ' post-its</span>'
      + '</div>' + body + '</section>'
  }).join('')

  const css = `
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; margin: 32px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 20px; }
    .summary { display: flex; gap: 10px; flex-wrap: wrap; margin: 16px 0 24px; }
    .summary .box { border: 1px solid #ddd; border-radius: 8px; padding: 10px 16px; }
    .summary .num { font-size: 20px; font-weight: 800; }
    .summary .lbl { font-size: 11px; color: #666; text-transform: uppercase; }
    h2 { font-size: 15px; border-bottom: 2px solid #333; padding-bottom: 6px; margin: 28px 0 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
    th { background: #f3f3f3; font-size: 11px; }
    small { color: #888; }
    .student { border: 1px solid #e0e0e0; border-radius: 8px; padding: 14px; margin-bottom: 14px; page-break-inside: avoid; }
    .student-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
    .student-head strong { font-size: 15px; }
    .tag { font-size: 11px; background: #eee; border-radius: 999px; padding: 2px 10px; color: #444; }
    .tag.ok { background: #d6f5e6; color: #0a7a4f; }
    .canvas-block { margin: 10px 0; }
    .canvas-block h4 { margin: 0 0 6px; font-size: 13px; color: #333; }
    .note { border-left: 3px solid #f5c948; background: #fafafa; padding: 6px 10px; margin: 4px 0; border-radius: 4px; }
    .note-zone { font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: .5px; }
    .note p { margin: 2px 0 0; font-size: 13px; white-space: pre-wrap; }
    .muted { color: #999; font-size: 13px; }
    @media print { body { margin: 12mm; } .student { border-color: #ccc; } }
  `
  const styleTag = '<' + 'style>' + css + '<' + '/style>'

  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
    + '<title>Relatorio - ' + escapeHtml(activity.title) + '</title>'
    + styleTag + '</head><body>'
    + '<h1>' + escapeHtml(activity.title) + '</h1>'
    + '<div class="meta">Turma: ' + escapeHtml(activity.classes?.name || '-') + ' • Gerado em ' + dateStr + '</div>'
    + '<p>' + escapeHtml(activity.description || '') + '</p>'
    + '<div class="summary">'
    + '<div class="box"><div class="num">' + completedIds.length + '/' + participants.length + '</div><div class="lbl">Concluiram</div></div>'
    + '<div class="box"><div class="num">' + contributorsCount + '/' + participants.length + '</div><div class="lbl">Colaboraram</div></div>'
    + '<div class="box"><div class="num">' + notes.length + '</div><div class="lbl">Post-its</div></div>'
    + '<div class="box"><div class="num">' + avgPerContributor + '</div><div class="lbl">Media/aluno</div></div>'
    + '</div>'
    + '<h2>Ranking de colaboracao</h2>'
    + '<table><thead><tr><th>#</th><th>Aluno</th>' + headCanvas + '<th>Total</th><th>Concluiu</th></tr></thead>'
    + '<tbody>' + (rowsRanking || '<tr><td colspan="9">Sem dados</td></tr>') + '</tbody></table>'
    + '<h2>Respostas por aluno</h2>'
    + (studentBlocks || '<p class="muted">Sem participantes.</p>')
    + '</body></html>'

  const w = window.open('', '_blank')
  if (!w) {
    alert('Libere os pop-ups do navegador para gerar o PDF.')
    return
  }
  w.document.write(html)
  w.document.close()
  w.onload = () => { w.focus(); w.print() }
}
