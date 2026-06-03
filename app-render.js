
/* ============================================
   类型 1：scenes_creative（激励点 2）
   ============================================ */
function renderScenesCreative(fund){
  let html = "";
  if(fund.pool){
    html += `<div class="pool-tag">本月资金池<span class="num" data-path="fund.pool">${esc(fund.pool)}</span></div>`;
  }
  html += `<div class="subsection">
    <div class="subsection-title"><span class="stag">A</span>常规投放激励</div>
    <div class="subsection-desc">机构在生活服务、交通出行、城市地标等线下场景完成点位投放，按场景类型 × 投放规模 × 投放周期获得对应激励。</div>
    <div class="fund-table scenes">
      <div class="fund-table-row head">
        <div>场景类型</div>
        <div>具体点位</div>
        <div style="text-align:right">一线 / 新一线城市</div>
        <div style="text-align:right">其它城市</div>
      </div>
      ${(fund.scenes||[]).map((sc,sIdx)=>
        sc.tiers.map((t,tIdx)=>`
          <div class="fund-table-row">
            <div class="col scene-col" data-label="场景">
              ${tIdx===0 ? `<div data-path="fund.scenes.${sIdx}.name">${esc(sc.name)}</div>` : ""}
              <div style="font-size:13px;font-weight:400;color:var(--text-muted);margin-top:${tIdx===0?'4px':'0'}" data-path="fund.scenes.${sIdx}.tiers.${tIdx}.req">${esc(t.req)}</div>
            </div>
            <div class="col scene-points-col" data-label="点位">
              ${tIdx===0 ? `<span data-path="fund.scenes.${sIdx}.points">${esc(sc.points)}</span>` : `<span style="color:var(--text-muted)">同上</span>`}
            </div>
            <div class="col reward-col" data-label="一线 / 新一线" data-path="fund.scenes.${sIdx}.tiers.${tIdx}.p1">${esc(t.p1||"—")}</div>
            <div class="col reward-col alt" data-label="其它城市" data-path="fund.scenes.${sIdx}.tiers.${tIdx}.p2">${esc(t.p2||"—")}</div>
          </div>
        `).join("")
      ).join("")}
    </div>
  </div>`;

  html += `<div class="subsection">
    <div class="subsection-title"><span class="stag b">B</span>创意提案激励</div>
    <div class="subsection-desc">机构自主策划具备传播力的线下公益活动，让公益从"被看见"走向"被讨论"。</div>
    <div class="pool-tag" style="background:#fef3e9;color:#ff7d00;border-color:#ffd9b3">单方案激励金<span class="num" data-path="fund.creative.amount">${esc(fund.creative.amount)}</span></div>
    <div class="creative-grid">
      ${(fund.creative.items||[]).map((it,idx)=>`
        <div class="creative-item">
          <div class="form" data-path="fund.creative.items.${idx}.form">${esc(it.form)}</div>
          <div class="case" data-path="fund.creative.items.${idx}.desc">${esc(it.desc)}</div>
        </div>
      `).join("")}
    </div>
  </div>`;

  if(fund.applyRule){
    html += `<div class="collapse-block" data-collapse>
      <div class="collapse-head">
        <div class="collapse-title"><span class="stag">规则</span>${esc(fund.applyRule.title)}</div>
        <span class="collapse-arrow">▼</span>
      </div>
      <div class="collapse-body">
        <ul class="list" style="margin-top:0">
          ${fund.applyRule.items.map((item,i)=>`
            <li><strong data-path="fund.applyRule.items.${i}.label">${esc(item.label)}</strong><span data-path="fund.applyRule.items.${i}.req">${esc(item.req)}</span></li>
          `).join("")}
        </ul>
      </div>
    </div>`;
  }

  if(fund.guide){
    const g = fund.guide;
    html += `<div class="collapse-block" data-collapse>
      <div class="collapse-head">
        <div class="collapse-title"><span class="stag">指南</span>${esc(g.title)}</div>
        <span class="collapse-arrow">▼</span>
      </div>
      <div class="collapse-body">
        <div class="callout">
          <div class="callout-title" data-path="fund.guide.material.title">${esc(g.material.title)}</div>
          下载地址：<a href="${esc(g.material.url)}" target="_blank" data-path="fund.guide.material.url">${esc(g.material.url)}</a><br>
          设计参考路径：<span data-path="fund.guide.material.path">${esc(g.material.path)}</span><br>
          ⚠️ <span data-path="fund.guide.material.warning">${esc(g.material.warning)}</span>
        </div>
        <div class="note">
          <div class="note-title">投放画面需满足以下要求</div>
          <ul>${g.requirements.map((r,i)=>`<li data-path="fund.guide.requirements.${i}">✅ ${esc(r)}</li>`).join("")}</ul>
        </div>
        <div class="steps">
          ${g.steps.map((s,i)=>`
            <div class="step">
              <div class="step-num">${i+1}</div>
              <div class="step-body">
                <div class="step-title" data-path="fund.guide.steps.${i}.title">${esc(s.title)}</div>
                <div class="step-detail" data-path="fund.guide.steps.${i}.detail">${esc(s.detail)}</div>
                <a href="${esc(s.link)}" target="_blank" class="step-link">🔗 ${esc(s.linkText)}</a>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>`;
  }
  return html;
}

/* 类型 2：ladder（激励点 3） */
function renderLadderOnly(fund){
  let html = "";
  if(fund.pool) html += `<div class="pool-tag">本月资金池<span class="num" data-path="fund.pool">${esc(fund.pool)}</span></div>`;
  if(fund.desc) html += `<p style="font-size:15px;margin:8px 0 14px;color:var(--text-secondary)" data-path="fund.desc">${esc(fund.desc)}</p>`;
  html += renderLadderTable(fund);
  if(fund.notes) html += renderCollapseNote("调整说明", fund.notes, "fund.notes");
  if(fund.stats) html += renderCollapseStats(fund.stats, "fund.stats");
  return html;
}

/* 类型 3：ladder_with_pool（激励点 4） */
function renderLadderWithPool(fund){
  let html = "";
  if(fund.pool) html += `<div class="pool-tag">本月资金池<span class="num" data-path="fund.pool">${esc(fund.pool)}</span></div>`;
  if(fund.desc) html += `<p style="font-size:15px;margin:8px 0 14px;color:var(--text-secondary)" data-path="fund.desc">${esc(fund.desc)}</p>`;
  html += renderLadderTable(fund);
  if(fund.bonus){
    html += `<div class="callout" style="margin-top:14px"><div class="callout-title">微信支付加成激励</div><span data-path="fund.bonus">${fund.bonus}</span></div>`;
  }
  if(fund.notes) html += renderCollapseNote("调整说明", fund.notes, "fund.notes");
  if(fund.stats) html += renderCollapseStats(fund.stats, "fund.stats");
  return html;
}

function renderLadderTable(fund){
  return `
    <div class="fund-table ladder">
      <div class="fund-table-row head">
        <div data-path="fund.headers.threshold">${esc(fund.headers?.threshold||"档位")}</div>
        <div style="text-align:right" data-path="fund.headers.reward">${esc(fund.headers?.reward||"激励金")}</div>
      </div>
      ${(fund.ladder||[]).map((l,i)=>`
        <div class="fund-table-row">
          <div class="col" data-label="档位" data-path="fund.ladder.${i}.threshold">${esc(l.threshold)}</div>
          <div class="col reward-col" data-label="激励金" data-path="fund.ladder.${i}.reward">${esc(l.reward)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

/* 类型 4：donation_matrix（激励点 5）—— 老项目 + 新项目合并到 A */
function renderDonationMatrix(fund){
  const L = fund.legacy, M = fund.monthly;
  let html = "";
  if(fund.pool) html += `<div class="pool-tag">本月资金池<span class="num" data-path="fund.pool">${esc(fund.pool)}</span></div>`;

  // 兼容老结构：如果 L 里没有 oldProject 子对象，就把 L 自身视为老项目
  const oldP = L.oldProject || L;
  const oldHeaders = oldP.headers || ["指标1","指标2","激励金"];
  const oldRows = oldP.rows || [];

  html += `<div class="subsection">
    <div class="subsection-title"><span class="stag">A</span><span data-path="fund.legacy.title">${esc(L.title)}</span></div>
    <div class="subsection-desc" data-path="fund.legacy.desc">${esc(L.desc||"")}</div>

    <h5 style="font-size:16px;font-weight:600;margin:18px 0 6px;color:var(--text)">
      <span data-path="fund.legacy.oldProject.title">${esc(oldP.title||"老项目（上线时长满 6 个月）")}</span>
    </h5>
    <p style="font-size:14px;color:var(--text-secondary);margin:0 0 12px" data-path="fund.legacy.oldProject.desc">${oldP.desc||""}</p>
    <div class="fund-table matrix">
      <div class="fund-table-row head">
        <div data-path="fund.legacy.oldProject.headers.0">${esc(oldHeaders[0])}</div>
        <div data-path="fund.legacy.oldProject.headers.1">${esc(oldHeaders[1])}</div>
        <div style="text-align:right" data-path="fund.legacy.oldProject.headers.2">${esc(oldHeaders[2])}</div>
      </div>
      ${oldRows.map((r,i)=>`
        <div class="fund-table-row">
          <div class="col" data-label="${esc(oldHeaders[0])}" data-path="fund.legacy.oldProject.rows.${i}.c1">${esc(r.c1)}</div>
          <div class="col" data-label="${esc(oldHeaders[1])}" data-path="fund.legacy.oldProject.rows.${i}.c2">${esc(r.c2)}</div>
          <div class="col reward-col" data-label="激励金" data-path="fund.legacy.oldProject.rows.${i}.reward">${esc(r.reward)}</div>
        </div>
      `).join("")}
    </div>

    <h5 style="font-size:16px;font-weight:600;margin:24px 0 6px;color:var(--text)">
      <span data-path="fund.legacy.newProject.title">${esc(L.newProject?.title||"新项目（上线时长未满 6 个月）")}</span>
    </h5>
    <p style="font-size:14px;color:var(--text-secondary);margin:0 0 8px" data-path="fund.legacy.newProject.desc">${L.newProject?.desc||""}</p>

    ${L.note ? `<div class="note" style="margin-top:14px"><div class="note-title">说明</div><span data-path="fund.legacy.note">${esc(L.note)}</span></div>` : ""}
  </div>`;

  // B. 月捐
  html += `<div class="subsection">
    <div class="subsection-title"><span class="stag b">B</span><span data-path="fund.monthly.title">${esc(M.title)}</span></div>
    <div class="subsection-desc" data-path="fund.monthly.desc">${M.desc}</div>
    <div class="fund-table matrix">
      <div class="fund-table-row head">
        <div data-path="fund.monthly.headers.0">${esc(M.headers[0])}</div>
        <div data-path="fund.monthly.headers.1">${esc(M.headers[1])}</div>
        <div style="text-align:right" data-path="fund.monthly.headers.2">${esc(M.headers[2])}</div>
      </div>
      ${(M.rows||[]).map((r,i)=>`
        <div class="fund-table-row">
          <div class="col" data-label="${esc(M.headers[0])}" data-path="fund.monthly.rows.${i}.c1">${esc(r.c1)}</div>
          <div class="col" data-label="${esc(M.headers[1])}" data-path="fund.monthly.rows.${i}.c2">${esc(r.c2)}</div>
          <div class="col reward-col" data-label="激励金" data-path="fund.monthly.rows.${i}.reward">${esc(r.reward)}</div>
        </div>
      `).join("")}
    </div>
    <div class="callout" style="margin-top:12px">
      <div class="callout-title" data-path="fund.monthly.bonus.title">${esc(M.bonus.title)}</div>
      <span data-path="fund.monthly.bonus.desc">${M.bonus.desc}</span>
    </div>
  </div>`;

  if(fund.stats) html += renderCollapseStats(fund.stats, "fund.stats");
  return html;
}

/* 类型 5：score_matrix（激励点 6） */
function renderScoreMatrix(fund){
  const dims = fund.dimensions || [];
  const gw = fund.gateway || {title:"激励准入", items:[]};
  const tot = fund.totalScore || {};
  const rw = fund.rewards || {gongmu:[], feigongmu:[]};

  let html = "";
  if(fund.pool) html += `<div class="pool-tag">本月资金池<span class="num" data-path="fund.pool">${esc(fund.pool)}</span></div>`;
  if(fund.desc) html += `<p style="font-size:15px;margin:8px 0 14px;color:var(--text-secondary)" data-path="fund.desc">${esc(fund.desc)}</p>`;

  html += `<div class="subsection">
    <div class="subsection-title"><span class="stag">准入</span><span data-path="fund.gateway.title">${esc(gw.title)}</span></div>
    <div class="merged-score">
      <div class="merged-score-row head">
        <div>准入要求</div><div>得分逻辑</div><div></div>
        <div>公募机构</div><div>非公募机构</div>
      </div>
      ${gw.items.map((it,i)=>`
        <div class="merged-score-row">
          <div class="dim-cell" data-path="fund.gateway.items.${i}.req">${esc(it.req)}</div>
          <div class="logic-cell" data-path="fund.gateway.items.${i}.logic" style="grid-column:span 2">${esc(it.logic)}</div>
          <div class="score-cell" data-label="公募" data-path="fund.gateway.items.${i}.gongmu">${esc(it.gongmu)}</div>
          <div class="score-cell" data-label="非公募" data-path="fund.gateway.items.${i}.feigongmu">${esc(it.feigongmu)}</div>
        </div>
      `).join("")}
    </div>
  </div>`;

  html += `<div class="subsection">
    <div class="subsection-title"><span class="stag">评分</span>评分维度（合计 ${esc(tot.gongmu||"—")} / ${esc(tot.feigongmu||"—")}）</div>
    <div class="merged-score">
      <div class="merged-score-row head">
        <div>评分维度</div><div>评分项</div><div>得分逻辑</div><div>公募</div><div>非公募</div>
      </div>
      ${dims.map((dim, di)=>{
        return dim.metrics.map((m, mi)=>`
          <div class="merged-score-row">
            <div class="dim-cell">
              ${mi===0 ? `
                <span data-path="fund.dimensions.${di}.name">${esc(dim.name)}</span>
                <span class="dim-max">满分 <span data-path="fund.dimensions.${di}.maxScore">${esc(dim.maxScore)}</span> 分</span>
              ` : ""}
            </div>
            <div class="item-cell" data-path="fund.dimensions.${di}.metrics.${mi}.item">${esc(m.item)}</div>
            <div class="logic-cell" data-path="fund.dimensions.${di}.metrics.${mi}.logic">${formatLogic(m.logic)}</div>
            <div class="score-cell" data-label="公募" data-path="fund.dimensions.${di}.metrics.${mi}.gongmu">${esc(m.gongmu)}</div>
            <div class="score-cell" data-label="非公募" data-path="fund.dimensions.${di}.metrics.${mi}.feigongmu">${esc(m.feigongmu)}</div>
          </div>
        `).join("");
      }).join("")}
    </div>
  </div>`;

  html += `<div class="subsection">
    <div class="subsection-title"><span class="stag">分档</span>激励金分档</div>
    <div class="reward-cols">
      <div class="reward-col gongmu">
        <div class="reward-col-head">公募机构</div>
        ${(rw.gongmu||[]).map((r,i)=>`
          <div class="reward-row">
            <span class="range" data-path="fund.rewards.gongmu.${i}.range">${esc(r.range)}</span>
            <span class="reward" data-path="fund.rewards.gongmu.${i}.reward">${esc(r.reward)}</span>
          </div>
        `).join("")}
      </div>
      <div class="reward-col feigongmu">
        <div class="reward-col-head">非公募机构</div>
        ${(rw.feigongmu||[]).map((r,i)=>`
          <div class="reward-row">
            <span class="range" data-path="fund.rewards.feigongmu.${i}.range">${esc(r.range)}</span>
            <span class="reward" data-path="fund.rewards.feigongmu.${i}.reward">${esc(r.reward)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  </div>`;
  return html;
}

function formatLogic(s){
  if(!s) return "";
  return esc(s).split(/[；;]/).filter(x=>x.trim()).map(x=>`<span class="ll">${x.trim()}</span>`).join("");
}

/* 类型 6：content_creator（激励点 1） */
function renderContentCreator(fund){
  const O = fund.orgIncentive || {};
  const C = fund.creatorIncentive || {};
  let html = "";

  html += `<div class="subsection">
    <div class="subsection-title"><span class="stag">A</span><span data-path="fund.orgIncentive.title">${esc(O.title)}</span></div>
    ${O.pool ? `<div class="pool-tag">本月资金池<span class="num" data-path="fund.orgIncentive.pool">${esc(O.pool)}</span></div>` : ""}
    <div class="cc-block">
      <div class="cc-row">
        <div class="cc-row-label">参与方式</div>
        <div class="cc-row-content" data-path="fund.orgIncentive.joinDesc">${esc(O.joinDesc||"")}</div>
      </div>
      <div class="cc-row">
        <div class="cc-row-label">激励规则</div>
        <div class="cc-row-content" data-path="fund.orgIncentive.ruleDesc">${O.ruleDesc||""}</div>
      </div>
    </div>
    <div class="condition-list">
      ${(O.conditions||[]).map((c,i)=>`
        <div class="condition-item">
          <div class="condition-label" data-path="fund.orgIncentive.conditions.${i}.label">${esc(c.label)}</div>
          <div class="condition-req" data-path="fund.orgIncentive.conditions.${i}.req">${esc(c.req)}</div>
        </div>
      `).join("")}
    </div>
    <div class="fund-highlight">
      <span class="label">激励金</span>单机构最高可获 <strong data-path="fund.orgIncentive.reward">${esc(O.reward||"—")}</strong> 激励金支持
    </div>
  </div>`;

  html += `<div class="subsection">
    <div class="subsection-title"><span class="stag b">B</span><span data-path="fund.creatorIncentive.title">${esc(C.title)}</span></div>
    <div class="subsection-desc" data-path="fund.creatorIncentive.desc">${esc(C.desc||"")}</div>
    ${(C.scenes||[]).map((sc, si)=>`
      <div class="subsection" style="margin:14px 0">
        <h5 style="font-size:16px;font-weight:600;margin:0 0 10px;color:var(--text)" data-path="fund.creatorIncentive.scenes.${si}.name">${esc(sc.name)}</h5>
        ${sc.pool ? `<div class="pool-tag" style="margin-bottom:10px">流量池<span class="num" data-path="fund.creatorIncentive.scenes.${si}.pool">${esc(sc.pool)}</span></div>` : ""}
        <div class="cc-block">
          <div class="cc-row">
            <div class="cc-row-label">参与形式</div>
            <div class="cc-row-content" data-path="fund.creatorIncentive.scenes.${si}.joinDesc">${esc(sc.joinDesc||"")}</div>
          </div>
          <div class="cc-row">
            <div class="cc-row-label">激励规则</div>
            <div class="cc-row-content" data-path="fund.creatorIncentive.scenes.${si}.ruleDesc">${esc(sc.ruleDesc||"")}</div>
          </div>
        </div>
        <div class="fan-tier-grid">
          ${(sc.tiers||[]).map((t,ti)=>`
            <div class="fan-tier">
              <div class="fan-tier-level" data-path="fund.creatorIncentive.scenes.${si}.tiers.${ti}.fans">${esc(t.fans)}</div>
              <div class="fan-tier-reward" data-path="fund.creatorIncentive.scenes.${si}.tiers.${ti}.reward">${esc(t.reward)}</div>
            </div>
          `).join("")}
        </div>
        ${sc.bonus ? `<div class="callout" style="margin-top:12px"><div class="callout-title">特别激励</div><span data-path="fund.creatorIncentive.scenes.${si}.bonus">${sc.bonus}</span></div>` : ""}
        ${sc.note ? `<div class="note" style="margin-top:10px"><div class="note-title">说明</div><span data-path="fund.creatorIncentive.scenes.${si}.note">${esc(sc.note)}</span></div>` : ""}
      </div>
    `).join("")}
  </div>`;
  return html;
}

/* 折叠版：调整说明 / 统计说明 */
function renderCollapseNote(title, items, basePath){
  if(!items || !items.length) return "";
  return `<div class="collapse-block" data-collapse>
    <div class="collapse-head">
      <div class="collapse-title"><span class="stag">说明</span>${esc(title)}</div>
      <span class="collapse-arrow">▼</span>
    </div>
    <div class="collapse-body">
      <ul class="list" style="margin-top:0">
        ${items.map((n,i)=>`<li data-path="${basePath}.${i}">${esc(n)}</li>`).join("")}
      </ul>
    </div>
  </div>`;
}
function renderCollapseStats(stats, basePath){
  if(!stats || !stats.items || !stats.items.length) return "";
  return `<div class="collapse-block" data-collapse>
    <div class="collapse-head">
      <div class="collapse-title"><span class="stag">统计</span><span data-path="${basePath}.title">${esc(stats.title||"统计说明")}</span></div>
      <span class="collapse-arrow">▼</span>
    </div>
    <div class="collapse-body">
      <ul class="list" style="margin-top:0">
        ${stats.items.map((n,i)=>`<li data-path="${basePath}.items.${i}">${esc(n)}</li>`).join("")}
      </ul>
    </div>
  </div>`;
}

/* 启动 */
render();
