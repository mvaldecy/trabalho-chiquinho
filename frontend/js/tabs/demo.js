const PRESETS = [
  { label: "4 matrizes (do trabalho)", dims: [10, 30, 5, 60, 10] },
  { label: "6 matrizes (exemplo)", dims: [5, 10, 3, 12, 5, 50, 6] },
  { label: "10 matrizes", dims: [30, 35, 15, 5, 10, 20, 25, 30, 35, 15, 5] },
  { label: "12 matrizes (stress)", dims: [10, 20, 30, 40, 30, 20, 10, 15, 25, 35, 45, 20, 10] },
];

function initDemo() {
  const presetsEl  = document.getElementById("demo-presets");
  const inputEl    = document.getElementById("demo-input");
  const btnRun     = document.getElementById("demo-run");
  const errorEl    = document.getElementById("demo-error");
  const dimsInfo   = document.getElementById("demo-dims-info");

  // Renderiza botões de preset
  PRESETS.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "preset-btn";
    btn.textContent = p.label;
    btn.addEventListener("click", () => {
      inputEl.value = p.dims.join("  ");
      updateDimsInfo(p.dims);
      errorEl.textContent = "";
    });
    presetsEl.appendChild(btn);
  });

  inputEl.addEventListener("input", () => {
    const dims = parseDims(inputEl.value);
    updateDimsInfo(dims);
    errorEl.textContent = "";
  });

  btnRun.addEventListener("click", runDemo);

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runDemo();
  });

  function updateDimsInfo(dims) {
    if (!dims || dims.length < 2) {
      dimsInfo.textContent = dims ? "Mínimo de 2 dimensões" : "Dimensões inválidas";
      return;
    }
    const n = dims.length - 1;
    dimsInfo.textContent = `${n} matr${n === 1 ? "iz" : "izes"} — dimensões: ${dims.map((d, i) => i < dims.length - 1 ? `A${i+1}(${d}×${dims[i+1]})` : "").filter(Boolean).join(", ")}`;
  }

  async function runDemo() {
    const dims = parseDims(inputEl.value);
    if (!dims || dims.length < 2) {
      errorEl.textContent = "Insira pelo menos 2 dimensões inteiras positivas separadas por espaço.";
      return;
    }
    if (dims.length > 21) {
      errorEl.textContent = "Máximo de 20 matrizes (21 dimensões).";
      return;
    }

    errorEl.textContent = "";
    btnRun.disabled = true;
    showLoading();

    try {
      const results = await callMCM(dims);
      renderResults(results);
    } catch (err) {
      errorEl.textContent = `Erro: ${err.message}. Verifique se o servidor Flask está rodando (python backend/app.py).`;
      showIdle();
    } finally {
      btnRun.disabled = false;
    }
  }
}

function showLoading() {
  setSpeedContent(`<div class="state-idle"><div class="spinner"></div><span>Executando algoritmos...</span></div>`);
  setTableContent(`<div class="state-idle"><div class="spinner"></div></div>`);
  setResultContent(`<div class="state-idle">Aguardando...</div>`);
}

function showIdle() {
  setSpeedContent(`<div class="state-idle">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <span>Configure as dimensões e clique em Executar</span>
  </div>`);
  setTableContent(`<div class="state-idle"><span>Tabela m[i,j] aparece aqui</span></div>`);
  setResultContent(`<div class="state-idle"><span>Resultado aparece aqui</span></div>`);
}

function renderResults(r) {
  renderSpeedBars(r);
  renderMTable(r.bottom_up.m_table, r.n);
  renderResult(r);
}

function renderSpeedBars(r) {
  const times = [
    r.brute_force.skipped ? null : r.brute_force.time_ns,
    r.memoization.time_ns,
    r.bottom_up.time_ns,
  ];
  const validTimes = times.filter((t) => t !== null);
  const maxTime = Math.max(...validTimes, 1);

  const algos = [
    { key: "brute_force", label: "Força Bruta",        cls: "bar-bf",   data: r.brute_force },
    { key: "memoization", label: "Memoização (top-down)", cls: "bar-memo", data: r.memoization },
    { key: "bottom_up",   label: "PD Bottom-Up",        cls: "bar-pd",   data: r.bottom_up },
  ];

  let html = '<div class="speed-bars">';
  algos.forEach(({ label, cls, data }) => {
    const pct = data.skipped ? 0 : Math.max((data.time_ns / maxTime) * 100, 2);
    const timeStr = data.skipped
      ? `<span style="color:var(--danger);font-size:0.75rem">${data.reason}</span>`
      : `<span class="algo-time">${formatTime(data.time_ns)}</span>`;

    html += `
      <div class="speed-item">
        <div class="speed-label">
          <span class="algo-name">${label}</span>
          ${timeStr}
        </div>
        <div class="bar-track">
          ${data.skipped
            ? `<div class="bar-skipped">n > 14 — omitida</div>`
            : `<div class="bar-fill ${cls}" style="width:${pct}%"></div>`
          }
        </div>
      </div>`;
  });
  html += "</div>";

  // Razão BF / PD
  if (!r.brute_force.skipped && r.bottom_up.time_ns > 0) {
    const ratio = (r.brute_force.time_ns / r.bottom_up.time_ns).toFixed(0);
    html += `<div style="margin-top:1rem;font-size:0.8rem;color:var(--muted)">
      A Força Bruta foi <strong style="color:var(--danger)">${ratio}×</strong> mais lenta que a PD Bottom-Up.
    </div>`;
  }

  setSpeedContent(html);
}

function renderMTable(mTable, n) {
  if (!mTable) { setTableContent("—"); return; }

  let html = '<div class="m-table-wrap"><table class="m-table"><thead><tr><th></th>';
  for (let j = 1; j <= n; j++) html += `<th>j=${j}</th>`;
  html += "</tr></thead><tbody>";

  // Calcula max para heatmap
  let maxVal = 0;
  mTable.forEach((row) => row.forEach((v) => { if (v && v > maxVal) maxVal = v; }));

  for (let i = 0; i < n; i++) {
    html += `<tr><th>i=${i + 1}</th>`;
    for (let j = 0; j < n; j++) {
      const v = mTable[i][j];
      if (v === null) {
        html += `<td class="empty">·</td>`;
      } else if (v === 0) {
        html += `<td class="zero">0</td>`;
      } else {
        const intensity = maxVal > 0 ? v / maxVal : 0;
        const alpha = (0.1 + intensity * 0.55).toFixed(2);
        html += `<td style="background:rgba(108,99,255,${alpha})">${formatNumber(v)}</td>`;
      }
    }
    html += "</tr>";
  }
  html += "</tbody></table></div>";
  setTableContent(html);
}

function renderResult(r) {
  const cost = r.bottom_up.cost;
  const paren = r.bottom_up.parenthesis;
  const n = r.n;

  const html = `
    <div class="result-box">
      <div class="label">Custo mínimo de multiplicações escalares</div>
      <div class="result-cost">${formatNumber(cost)}</div>
    </div>
    <div class="result-box" style="margin-top:0.75rem">
      <div class="label">Parentização ótima (${n} matr${n===1?"iz":"izes"})</div>
      <div class="result-paren">${paren}</div>
    </div>`;
  setResultContent(html);
}

// Helpers para injetar HTML nas seções
function setSpeedContent(html)  { document.getElementById("speed-section").innerHTML  = html; }
function setTableContent(html)  { document.getElementById("table-section").innerHTML  = html; }
function setResultContent(html) { document.getElementById("result-section").innerHTML = html; }
