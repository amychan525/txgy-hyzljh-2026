/**
 * 2026年全年行业助力计划（一期）参与细则 - 渲染层
 * 数据驱动：依赖 window.PLAN_DATA
 */

const D = window.PLAN_DATA;
const $ = (sel) => document.querySelector(sel);

/* ============== 公共工具 ============== */

function escHtml(s) {
  if (s === undefined || s === null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// 把换行转 <br>，保留普通文本；同时支持内嵌荧光笔 token：{{hl:xxx}} → <span class="hl-mark">xxx</span>，以及内嵌链接 token：{{link:url|text}} → <a href="url" target="_blank" rel="noopener">text</a>，以及双星号加粗 **text** → <strong>text</strong>
// 注意先 escHtml 再做 token 还原，token 内文字也已被 escHtml 过，所以是安全的
function nl2br(s) {
  return escHtml(s)
    .replace(/\{\{hl:([\s\S]+?)\}\}/g, '<span class="hl-mark">$1</span>')
    .replace(/\{\{link:([^|]+?)\|([\s\S]+?)\}\}/g, '<a href="$1" target="_blank" rel="noopener">$2</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// 仅用于标题/表头：escHtml + 荧光笔 token，但不做换行处理
function titleHtml(s) {
  return escHtml(s).replace(/\{\{hl:([\s\S]+?)\}\}/g, '<span class="hl-mark">$1</span>');
}

// 折叠/展开
window.toggleSection = function (id) {
  const el = document.getElementById(id);
  if (!el) return;
  const card = el.closest('.section-card');
  el.classList.toggle('collapsed');
  if (card) card.classList.toggle('expanded');
};

// 通用 折叠卡片（升级说明等）
window.toggleInline = function (btn) {
  const card = btn.closest('.upgrade-card');
  if (!card) return;
  card.classList.toggle('expanded');
  const body = card.querySelector('.upgrade-body');
  const icon = card.querySelector('.upgrade-toggle-icon');
  if (body) body.classList.toggle('open');
  if (icon) icon.textContent = card.classList.contains('expanded') ? '收起' : '展开详情';
};

// 通用 折叠卡片（激励要点 / 参与流程 / 其它）
window.toggleCollapse = function (btn) {
  const card = btn.closest('.collapse-card');
  if (!card) return;
  card.classList.toggle('collapsed');
  const icon = card.querySelector('.collapse-toggle-icon');
  if (icon) icon.textContent = card.classList.contains('collapsed') ? '展开' : '收起';
};

/* ============== 渲染：背景/准入/如何参与 ============== */

function renderBackground() {
  const bg = D.background;
  const html = `
    <div class="bg-block">
      ${bg.intro.map(p => `<p class="bg-para">${nl2br(p)}</p>`).join('')}
    </div>
  `;
  $('#background-content').innerHTML = html;
}

function renderRequirements() {
  const bg = D.background;
  const orgItems = bg.orgRequirements.map(t => `<li>${nl2br(t)}</li>`).join('');
  const projItems = bg.projectRequirements.map(t => `<li>${nl2br(t)}</li>`).join('');
  const types = bg.incentiveTypes.map(t => `
    <div class="type-card">
      <div class="type-name">${escHtml(t.name)}</div>
      <div class="type-goal">目标：${nl2br(t.goal)}</div>
      <div class="type-points">${t.points.map(p => {
        const mt = p.match(/激励点(\d+)/);
        const pid = mt ? `point${mt[1]}` : '';
        return pid
          ? `<span class="type-tag clickable" data-jump-point="${pid}" title="点击跳转到该激励点的当月规则">${escHtml(p)}</span>`
          : `<span class="type-tag">${escHtml(p)}</span>`;
      }).join('')}</div>
      ${t.extraNote ? `<div class="type-extra">${nl2br(t.extraNote)}</div>` : ''}
    </div>
  `).join('');

  $('#requirements-content').innerHTML = `
    <h3 class="sub-h3">1. 机构基础准入</h3>
    <ul class="bullet-list">${orgItems}</ul>
    <h3 class="sub-h3">2. 项目基础准入</h3>
    <ul class="bullet-list">${projItems}</ul>
    <h3 class="sub-h3">3. 激励类型与方向</h3>
    <div class="type-list">${types}</div>
  `;

  // 绑定：点击「激励点N、xxx」标签 → 切换到对应激励点 tab + 滚动到月度激励规则
  $('#requirements-content').querySelectorAll('.type-tag.clickable').forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = tag.dataset.jumpPoint;
      if (!pid || !D.incentivePoints[pid]) return;
      jumpToPoint(pid);
    });
  });
}

/* 跳转到指定激励点的当月规则区 */
function jumpToPoint(pid) {
  state.pointId = pid;
  // 同步 tab 高亮
  const inner = $('#point-tabs-inner');
  if (inner) {
    inner.querySelectorAll('.point-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.id === pid);
    });
  }
  renderMain();
  // 滚动到月度规则标题（让用户能同时看到月份选择 + 当前激励点）
  const heading = document.querySelector('.rules-heading');
  if (heading) {
    setTimeout(() => {
      window.scrollTo({ top: heading.offsetTop - 16, behavior: 'smooth' });
    }, 80);
  }
}

function renderHowto() {
  const h = D.background.howToParticipate;
  const steps = h.steps.map(s => `
    <div class="howto-step">
      <div class="howto-num">${escHtml(s.num)}</div>
      <div class="howto-body">
        <div class="howto-title">${escHtml(s.title)}</div>
        <div class="howto-desc">${nl2br(s.desc)}</div>
      </div>
    </div>
  `).join('');
  const tips = (h.tips || []).map(t => `<li>${nl2br(t)}</li>`).join('');

  $('#howto-content').innerHTML = `
    <p class="howto-intro">${nl2br(h.intro)}</p>
    <div class="howto-steps">${steps}</div>
    ${tips ? `<div class="howto-tips"><div class="tips-title">温馨提示</div><ul>${tips}</ul></div>` : ''}
  `;
}

/* ============== 渲染：激励点 Tab ============== */

function renderTabs() {
  const points = Object.values(D.incentivePoints);
  const inner = $('#point-tabs-inner');
  inner.innerHTML = points.map((p, i) => `
    <button class="point-tab ${i === 0 ? 'active' : ''}" data-id="${p.id}">
      <span class="tab-idx">${i + 1}</span>
      <span class="tab-text">${escHtml(p.shortName)}</span>
    </button>
  `).join('');

  inner.querySelectorAll('.point-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      inner.querySelectorAll('.point-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.pointId = btn.dataset.id;
      renderMain();
    });
  });
}

/* ============== 渲染：表格（含 highlightCols 多列 + 自动 rowspan） ============== */

function renderTable(tbl) {
  if (!tbl || !tbl.rows || !tbl.rows.length) return '';
  const headers = tbl.headers || [];
  const high = new Set((tbl.highlightCols || []).map(Number));
  const rows = tbl.rows;
  const cols = headers.length;

  // 1) colspan 合并：highlightCols 范围内，若某 cell 为空且左侧同属 highlightCols 且非空 → 跨列合并
  //    用于"一线/新一线城市 + 其它城市"两列共享一个金额的场景。
  const colspan = rows.map(() => new Array(cols).fill(1));
  const skip = rows.map(() => new Array(cols).fill(false));
  for (let r = 0; r < rows.length; r++) {
    for (let c = cols - 1; c >= 1; c--) {
      if (skip[r][c]) continue;
      if (rows[r][c] === '' && high.has(c) && high.has(c - 1) && rows[r][c - 1] !== '') {
        // 找到左侧"颠点"（未被 skip 的真实起点）
        let left = c - 1;
        while (left > 0 && skip[r][left]) left--;
        skip[r][c] = true;
        colspan[r][left] = (colspan[r][left] || 1) + 1;
      }
    }
  }

  // 2) 计算 rowspan（每列独立处理；被 skip 的 cell 不参与）
  const span = []; // span[r][c] = number; -1 表示被合并的位置
  for (let r = 0; r < rows.length; r++) {
    span.push(new Array(cols).fill(1));
  }
  // Pass 1: 相邻相同合并（包括 hl 列；当相邻行金额完全相同时合并 rowspan，让"内容一样"自动合并）
  for (let c = 0; c < cols; c++) {
    let r = 0;
    while (r < rows.length) {
      if (skip[r][c]) { r++; continue; }
      let k = r + 1;
      while (k < rows.length && !skip[k][c] && rows[k][c] === rows[r][c] && rows[r][c] !== '') {
        k++;
      }
      if (k - r > 1) {
        span[r][c] = k - r;
        for (let i = r + 1; i < k; i++) span[i][c] = -1;
      }
      r = k > r + 1 ? k : r + 1;
    }
  }
  // Pass 2: 空 cell 向上合并到最近的非空 rowspan 起点（不再跳过 hl 列：让"激励机制"等列的空字符串也能向上合并；跳过被 skip 的 cell 即可）
  for (let c = 0; c < cols; c++) {
    for (let r = 1; r < rows.length; r++) {
      if (span[r][c] === -1 || skip[r][c]) continue;
      if (rows[r][c] === '') {
        let p = r - 1;
        while (p >= 0 && (span[p][c] === -1 || skip[p][c])) p--;
        if (p >= 0 && rows[p][c] !== '') {
          span[p][c] = r - p + 1;
          span[r][c] = -1;
        }
      }
    }
  }

  const thead = `<thead><tr>${headers.map(h => `<th>${nl2br(h)}</th>`).join('')}</tr></thead>`;
  const tbody = '<tbody>' + rows.map((row, r) => {
    const tds = row.map((cell, c) => {
      if (skip[r][c]) return '';
      const s = span[r][c];
      if (s === -1) return '';
      const cls = high.has(c) ? ' class="hl"' : '';
      const rs = s > 1 ? ` rowspan="${s}"` : '';
      const cs = (colspan[r][c] || 1) > 1 ? ` colspan="${colspan[r][c]}"` : '';
      return `<td${cls}${rs}${cs}>${nl2br(cell)}</td>`;
    }).join('');
    return `<tr>${tds}</tr>`;
  }).join('') + '</tbody>';

  return `<div class="table-wrap"><table class="data-table">${thead}${tbody}</table></div>`;
}

/* ============== 工具：渲染 specialNotes 支持荧光笔标注 ============== */
function renderSpecialNoteItem(n) {
  if (n && typeof n === 'object' && typeof n.text === 'string') {
    const inner = nl2br(n.text);
    return n.highlight ? `<li><span class="hl-mark">${inner}</span></li>` : `<li>${inner}</li>`;
  }
  return `<li>${nl2br(n)}</li>`;
}

/* ============== 渲染：池子 badge ============== */

function poolBadge(text, type) {
  if (!text) return '';
  const cls = type === 'flow' ? 'pool-badge flow' : 'pool-badge fund';
  const label = type === 'flow' ? '流量池' : '资金池';
  // text 已是"X月资金池：Y"或"X月流量池：Y"形式，提取数值部分
  const m = text.match(/[:：](.+)$/);
  const value = m ? m[1].trim() : text;
  // 资金池：把"先到先得，拨完即止"放进 badge 框内（紧跟金额后）
  const innerTip = (type !== 'flow') ? `<span class="pool-fund-tip">先到先得，拨完即止</span>` : '';
  return `<span class="${cls}"><span class="pool-label">${label}</span><span class="pool-val">${escHtml(value)}</span>${innerTip}</span>`;
}

/* ============== 渲染：6月 / 7月 upgrade 折叠卡片 ============== */

function renderUpgrade(up, monthNum) {
  if (!up) return '';
  const tagText = monthNum === 7 ? '7月参与指引' : (up.tag || `${monthNum}月升级`);
  const supports = (up.supports || []).map(s => `
    <div class="up-support">
      <div class="up-support-name">${escHtml(s.name)}</div>
      <div class="up-support-desc">${nl2br(s.desc)}</div>
    </div>
  `).join('');
  return `
    <div class="upgrade-card expanded">
      <div class="upgrade-head">
        <div class="upgrade-title">
          <span class="upgrade-tag">${escHtml(tagText)}</span>
          <span class="upgrade-headline">多维支持体系</span>
        </div>
        <button type="button" class="upgrade-toggle" onclick="toggleInline(this)">
          <span class="upgrade-toggle-icon">收起</span>
        </button>
      </div>
      <div class="upgrade-body open">
        <p class="upgrade-summary">${nl2br(up.summary)}</p>
        <div class="upgrade-supports">${supports}</div>
      </div>
    </div>
  `;
}

/* ============== 渲染：参与流程 / 参与方式（通用折叠卡） ============== */

function renderParticipation(p, opts) {
  if (!p) return '';
  const collapsed = !!(opts && opts.collapsed);
  const cardCls = 'participation-block collapse-card' + (collapsed ? ' collapsed' : '');
  const btnText = collapsed ? '展开' : '收起';

  let inner = '';
  if (p.steps && p.steps.length) {
    const steps = p.steps.map(s => {
      const links = (s.links || []).filter(l => l && l.label).map(l => {
        if (l.url) return `<a class="step-link" href="${escHtml(l.url)}" target="_blank" rel="noopener">${escHtml(l.label)}</a>`;
        return `<span class="step-link disabled">${escHtml(l.label)}</span>`;
      }).join('');
      return `
        <div class="proc-step">
          <div class="proc-num">${escHtml(s.num)}</div>
          <div class="proc-body">
            <div class="proc-title">${escHtml(s.title)}</div>
            <div class="proc-desc">${nl2br(s.desc)}</div>
            ${links ? `<div class="proc-links">${links}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
    inner = `<div class="proc-steps">${steps}</div>`;
  } else if (p.link) {
    // 单链接型（如创意提案申请表）
    inner = `
      <div class="proc-link-only">
        ${p.intro ? `<p class="proc-intro">${nl2br(p.intro)}</p>` : ''}
        <a class="step-link" href="${escHtml(p.link.url)}" target="_blank" rel="noopener">${escHtml(p.link.label)}</a>
      </div>
    `;
  }

  return `
    <div class="${cardCls}">
      <div class="block-head">
        <span class="block-title">${escHtml(p.title || '参与流程')}</span>
        <button type="button" class="collapse-toggle" onclick="toggleCollapse(this)">
          <span class="collapse-toggle-icon">${btnText}</span>
        </button>
      </div>
      <div class="collapse-body">${inner}</div>
    </div>
  `;
}

/* ============== 渲染：激励准入（点4 / 点5） ============== */

function renderEntryRequirement(req) {
  if (!req) return '';
  const items = (req.items || []).map(t => `<li>${nl2br(t)}</li>`).join('');
  return `
    <div class="entry-req-card collapse-card">
      <div class="block-head">
        <span class="block-title">激励准入</span>
        <button type="button" class="collapse-toggle" onclick="toggleCollapse(this)">
          <span class="collapse-toggle-icon">收起</span>
        </button>
      </div>
      <div class="collapse-body">
        ${req.intro ? `<p class="entry-req-intro">${nl2br(req.intro)}</p>` : ''}
        ${items ? `<ul class="entry-req-list">${items}</ul>` : ''}
      </div>
    </div>
  `;
}

/* ============== 渲染：激励点6 - 评分卡片可视化 ============== */

function renderEntryAndTiers(sec) {
  let html = '';
  if (sec.entry) {
    const conds = sec.entry.conditions.map(c => `<li>${nl2br(c)}</li>`).join('');
    const noteHtml = sec.entry.note ? `<div class="entry-note" style="margin-top: 8px; color: var(--text-soft); font-size: 13px; line-height: 1.5; padding-top: 4px; border-top: 1px dashed var(--border);">${nl2br(sec.entry.note)}</div>` : '';
    html += `
      <div class="entry-card">
        <div class="entry-head">激励准入（${escHtml(sec.entry.required || '需同时符合')}）</div>
        <ul class="entry-list">${conds}</ul>
        ${noteHtml}
      </div>
    `;
  }
  if (sec.tiers && sec.tiers.length) {
    const tiers = sec.tiers.map(t => `
      <div class="tier-row">
        <div class="tier-range">${titleHtml(t.range)}</div>
        <div class="tier-amount">${titleHtml(t.amount)}</div>
      </div>
    `).join('');
    html += `<div class="tier-card"><div class="tier-head">分档激励</div><div class="tier-body">${tiers}</div></div>`;
  }
  return html;
}

function renderDimensions(sec) {
  if (!sec.dimensions || !sec.dimensions.length) return '';
  // 6月使用满分制可视化
  if (sec.scoringCard) {
    const dims = sec.dimensions.map(d => {
      const items = d.items.map(it => `
        <tr>
          <td class="dim-label">${nl2br(it.label)}</td>
          <td class="dim-rule">${nl2br(it.scoring || '')}</td>
          <td class="dim-full">${escHtml(String(it.fullScore))}</td>
        </tr>
      `).join('');
      return `
        <div class="dim-card">
          <div class="dim-head">
            <span class="dim-name">${escHtml(d.name)}</span>
            <span class="dim-total">${escHtml(String(d.totalScore))}<span class="dim-unit">分</span></span>
          </div>
          <table class="dim-table">
            <thead><tr><th>统计维度</th><th>评分规则</th><th>满分</th></tr></thead>
            <tbody>${items}</tbody>
          </table>
        </div>
      `;
    }).join('');
    return `<div class="dim-list">${dims}</div>`;
  }
  // 1-5月维度只列名称与统计项
  const dims = sec.dimensions.map(d => {
    const items = (d.items || []).map(it => `<span class="dim-tag">${escHtml(it.label)}</span>`).join('');
    return `
      <div class="dim-simple">
        <div class="dim-simple-name">${escHtml(d.name)}</div>
        <div class="dim-simple-items">${items}</div>
      </div>
    `;
  }).join('');
  return `<div class="dim-simple-list">${dims}</div>`;
}

/* ============== 渲染：激励点 section ============== */

function renderSection(sec) {
  const isOrgPoint = !!sec.orgType; // point6 标记
  const head = `
    <div class="sec-head">
      <div class="sec-title-line">
        <span class="sec-title">${titleHtml(sec.title)}</span>
        ${sec.subPool ? poolBadge(sec.subPool, sec.poolType) : ''}
      </div>
    </div>
  `;
  const intro = sec.intro ? `<p class="sec-intro">${nl2br(sec.intro)}</p>` : '';
  const methodLinkHtml = sec.methodLink
    ? `
      ${sec.methodLink.preText ? `<div class="method-link-pretext" style="color: var(--primary); margin-bottom: 8px; font-size: 13px;">${nl2br(sec.methodLink.preText)}</div>` : ''}
      <a class="method-link" href="${escHtml(sec.methodLink.url)}" target="_blank" rel="noopener">${escHtml(sec.methodLink.label)}</a>
    `
    : '';
  const method = sec.method
    ? `<div class="kv-row"><span class="kv-k">参与方法</span><span class="kv-v">${nl2br(sec.method)}${methodLinkHtml ? `<div class="method-link-row">${methodLinkHtml}</div>` : ''}</span></div>`
    : (methodLinkHtml ? `<div class="kv-row"><span class="kv-k">参与方法</span><span class="kv-v"><div class="method-link-row">${methodLinkHtml}</div></span></div>` : '');
  const reward = sec.reward ? `<div class="kv-row"><span class="kv-k">激励规则</span><span class="kv-v">${nl2br(sec.reward)}</span></div>` : '';

  let body = '';
  if (isOrgPoint) {
    body += renderEntryAndTiers(sec);
    body += renderDimensions(sec);
  } else {
    body += renderTable(sec.table);
  }

  const notes = (sec.notes || []).length
    ? `<ul class="notes-list">${sec.notes.map(n => `<li>${nl2br(n)}</li>`).join('')}</ul>` : '';
  const specials = (sec.specialNotes || []).length
    ? `<div class="special-notes"><div class="special-title">特别说明</div><ul>${sec.specialNotes.map(renderSpecialNoteItem).join('')}</ul></div>` : '';
  const extra = sec.extra ? `<div class="extra-block">${nl2br(sec.extra)}</div>` : '';
  // section 内嵌的"参与流程 / 参与方式"，默认收起
  const secParticipation = sec.participation ? renderParticipation(sec.participation, { collapsed: true }) : '';

  // 子区段（如 1.A 的项目挂链/好事形式 / 5.A 老项目/新项目）
  let subs = '';
  if (sec.subsections && sec.subsections.length) {
    subs = sec.subsections.map(ss => {
      const subHead = `
        <div class="sub-head">
          <span class="sub-title">${titleHtml(ss.title)}</span>
          ${ss.subPool ? poolBadge(ss.subPool, ss.poolType) : ''}
        </div>
      `;
      const subIntro = ss.intro ? `<p class="sec-intro">${nl2br(ss.intro)}</p>` : '';
      const subMethodLinkHtml = ss.methodLink
        ? `
          ${ss.methodLink.preText ? `<div class="method-link-pretext" style="color: var(--primary); margin-bottom: 8px; font-size: 13px;">${nl2br(ss.methodLink.preText)}</div>` : ''}
          <a class="method-link" href="${escHtml(ss.methodLink.url)}" target="_blank" rel="noopener">${escHtml(ss.methodLink.label)}</a>
        `
        : '';
      const subMethod = ss.method
        ? `<div class="kv-row"><span class="kv-k">参与方法</span><span class="kv-v">${nl2br(ss.method)}${subMethodLinkHtml ? `<div class="method-link-row">${subMethodLinkHtml}</div>` : ''}</span></div>`
        : (subMethodLinkHtml ? `<div class="kv-row"><span class="kv-k">参与方法</span><span class="kv-v"><div class="method-link-row">${subMethodLinkHtml}</div></span></div>` : '');
      const subGuideLinkHtml = ss.guideLink
        ? `<a class="method-link" href="${escHtml(ss.guideLink.url)}" target="_blank" rel="noopener">${escHtml(ss.guideLink.label)}</a>`
        : '';
      const subGuide = ss.guide
        ? `<div class="kv-row"><span class="kv-k">参与指引</span><span class="kv-v">${nl2br(ss.guide)}${subGuideLinkHtml ? `<div class="method-link-row">${subGuideLinkHtml}</div>` : ''}</span></div>`
        : (subGuideLinkHtml ? `<div class="kv-row"><span class="kv-k">参与指引</span><span class="kv-v"><div class="method-link-row">${subGuideLinkHtml}</div></span></div>` : '');
      const subReward = ss.reward ? `<div class="kv-row"><span class="kv-k">激励规则</span><span class="kv-v">${nl2br(ss.reward)}</span></div>` : '';
      const subTable = renderTable(ss.table);
      const subNotes = (ss.notes || []).length
        ? `<ul class="notes-list">${ss.notes.map(n => `<li>${nl2br(n)}</li>`).join('')}</ul>` : '';
      const subSpecials = (ss.specialNotes || []).length
        ? `<div class="special-notes"><div class="special-title">特别说明</div><ul>${ss.specialNotes.map(renderSpecialNoteItem).join('')}</ul></div>` : '';
      return `<div class="sub-section">${subHead}${subIntro}${subMethod}${subGuide}${subReward}${subTable}${subNotes}${subSpecials}</div>`;
    }).join('');
  }

  return `<div class="rule-section">${head}${intro}${method}${reward}${body}${subs}${notes}${extra}${specials}${secParticipation}</div>`;
}

/* ============== 渲染：单激励点的某月 ============== */

function renderPointMonth(point, month) {
  const m = point.months[month];
  if (!m) return `<div class="empty">本月暂无规则</div>`;

  // 激励点介绍（6字段，默认收起）
  const overview = (point.overview || []).map(o => `
    <div class="ov-row">
      <div class="ov-k">${escHtml(o.label)}</div>
      <div class="ov-v">${nl2br(o.value)}</div>
    </div>
  `).join('');
  const overviewHtml = `
    <div class="overview-card collapse-card collapsed">
      <div class="overview-head">
        <span>激励点介绍</span>
        <button type="button" class="collapse-toggle" onclick="toggleCollapse(this)">
          <span class="collapse-toggle-icon">展开</span>
        </button>
      </div>
      <div class="collapse-body">
        <div class="overview-body">${overview}</div>
      </div>
    </div>
  `;

  // 激励准入（点4 / 点5：默认展开支持收起）
  const entryReqHtml = point.entryRequirement ? renderEntryRequirement(point.entryRequirement) : '';

  // 特殊处理：point2 6月及之后，把顶层参与流程注入到 A 段（sections[0]）内部，默认收起
  let participationInjected = false;
  if (point.id === 'point2' && Number(month) >= 6 && m.sections && m.sections[0] && point.participation) {
    if (!m.sections[0].participation) m.sections[0].participation = point.participation;
    participationInjected = true;
  }

  // 顶层参与流程（仅 point2 配置；6月已注入到 section 则跳过）
  // 1-5 月：默认收起（用户要求"参与流程位置移到激励下面 + 默认收起、支持展开"）
  const participationHtml = (point.participation && !participationInjected)
    ? renderParticipation(point.participation, { collapsed: true })
    : '';

  // 升级说明（6月/7月）
  const upgradeHtml = m.upgrade ? renderUpgrade(m.upgrade, month) : '';

  // sections
  const secsHtml = (m.sections || []).map(renderSection).join('');

  // formula（点5）
  const formulaHtml = m.formula ? `<div class="formula-card"><span class="formula-label">激励金计算公式</span><span class="formula-text">${nl2br(m.formula)}</span></div>` : '';

  // 顺序说明：
  //   ① 激励点介绍（默认收起）
  //   ② 激励准入（point4/5 才有；放在介绍下方，因这是固定规则；默认展开支持收起）
  //   ③ 月度标题栏
  //   ④ 6月升级说明 → 月度规则 sections → 公式
  //   ⑤ 顶层参与流程（仅 point2 1-5月；放在激励规则下方，默认收起）
  return `
    <div class="point-month">
      ${overviewHtml}
      ${entryReqHtml}
      <div class="month-title-bar">${escHtml(m.title)}</div>
      ${upgradeHtml}
      ${secsHtml}
      ${formulaHtml}
      ${participationHtml}
    </div>
  `;
}

/* ============== 渲染：附录 / 资金拨付 / 名词 ============== */

function renderAppendix() {
  const a = D.appendix;
  if (!a) return;
  const cards = a.items.map(it => `
    <div class="ap-card">
      <div class="ap-head"><span class="ap-idx">${escHtml(String(it.idx))}</span><span class="ap-type">${escHtml(it.type)}</span></div>
      <div class="ap-row"><span class="ap-k">描述</span><span class="ap-v">${nl2br(it.desc)}</span></div>
      <div class="ap-row"><span class="ap-k">产品类型</span><span class="ap-v">${nl2br(it.product)}</span></div>
      <div class="ap-row"><span class="ap-k">参与指引</span><span class="ap-v">${nl2br(it.guide)}</span></div>
      <div class="ap-row"><span class="ap-k">相关案例</span><span class="ap-v">${nl2br(it.cases)}</span></div>
      <div class="ap-row"><span class="ap-k">数据统计</span><span class="ap-v">${nl2br(it.statRange)}</span></div>
    </div>
  `).join('');
  $('#appendix-content').innerHTML = `
    <p class="ap-updated">${escHtml(a.updated)}</p>
    <ul class="bullet-list small">${a.notes.map(n => `<li>${nl2br(n)}</li>`).join('')}</ul>
    <div class="ap-grid">${cards}</div>
    <div class="ap-common">
      <div class="ap-common-title">公共剔除数据</div>
      <ul>${a.commonExclude.map(c => `<li>${escHtml(c)}</li>`).join('')}</ul>
    </div>
  `;
}

function renderFunding() {
  const f = D.fundingRules;
  if (!f) return;
  const secs = f.sections.map(s => `
    <div class="fund-block">
      <div class="fund-block-title">${escHtml(s.title)}</div>
      <ul>${s.items.map(i => `<li>${nl2br(i)}</li>`).join('')}</ul>
    </div>
  `).join('');
  const sup = f.supervision;
  const supHtml = `
    <div class="fund-block">
      <div class="fund-block-title">${escHtml(sup.title)}</div>
      <p>${nl2br(sup.intro)}</p>
      <p>${nl2br(sup.lawIntro)}</p>
      <ol>${sup.violations.map(v => `<li>${nl2br(v)}</li>`).join('')}</ol>
      <p>${nl2br(sup.penaltyIntro)}</p>
      <ol>${sup.penalties.map(v => `<li>${nl2br(v)}</li>`).join('')}</ol>
      <div class="contact-block">${sup.contact.map(c => `<p>${nl2br(c)}</p>`).join('')}</div>
    </div>
  `;
  $('#funding-content').innerHTML = secs + supHtml;
}

function renderGlossary() {
  const g = D.glossary;
  if (!g) return;
  $('#glossary-content').innerHTML = g.map(t => `
    <div class="gloss-row">
      <div class="gloss-term">${escHtml(t.term)}</div>
      <div class="gloss-def">${nl2br(t.def)}</div>
    </div>
  `).join('');
}

/* ============== 主区域：状态与切换 ============== */

const state = {
  month: D.meta.currentMonth || 6,
  pointId: 'point1'
};

function renderMain() {
  const point = D.incentivePoints[state.pointId];
  if (!point) return;
  $('#main-content').innerHTML = `
    <div class="point-header">
      <div class="point-name">${escHtml(point.name)}</div>
    </div>
    ${renderPointMonth(point, state.month)}
  `;
  // 滚动到顶部
  window.scrollTo({ top: $('#point-tabs').offsetTop - 60, behavior: 'smooth' });
}

function bindMonthNav() {
  document.querySelectorAll('.month-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.month-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.month = Number(btn.dataset.month);
      renderMain();
    });
  });
}

/* ============== 入口 ============== */

document.addEventListener('DOMContentLoaded', () => {
  renderBackground();
  renderRequirements();
  renderHowto();
  renderTabs();
  bindMonthNav();
  renderMain();
  renderAppendix();
  renderFunding();
  renderGlossary();
});
