const CHART_DEFAULTS = {
  responsive: true,
  animation: { duration: 600 },
  plugins: {
    legend: { labels: { color: "#e8eaf0", font: { family: "'Inter', sans-serif", size: 12 } } },
    tooltip: { backgroundColor: "#1a1d27", borderColor: "#2e3248", borderWidth: 1 },
  },
  scales: {
    x: {
      ticks: { color: "#7a7f9a" },
      grid:  { color: "#2e3248" },
      title: { display: true, color: "#7a7f9a", font: { size: 11 } },
    },
    y: {
      ticks: { color: "#7a7f9a" },
      grid:  { color: "#2e3248" },
      title: { display: true, color: "#7a7f9a", font: { size: 11 } },
    },
  },
};

function mergeDeep(base, extra) {
  const out = { ...base };
  for (const k of Object.keys(extra)) {
    if (extra[k] && typeof extra[k] === "object" && !Array.isArray(extra[k])) {
      out[k] = mergeDeep(base[k] || {}, extra[k]);
    } else {
      out[k] = extra[k];
    }
  }
  return out;
}

const COLOR = {
  pd:   "#00d4aa",
  memo: "#ffb347",
  bf:   "#ff5757",
  fit:  "rgba(255,85,87,0.4)",
  grid: "#2e3248",
};

let _charts = [];

function destroyCharts() {
  _charts.forEach((c) => c.destroy());
  _charts = [];
}

function makeChart(id, type, data, extraOpts = {}) {
  const ctx = document.getElementById(id).getContext("2d");
  const chart = new Chart(ctx, { type, data, options: mergeDeep(CHART_DEFAULTS, extraOpts) });
  _charts.push(chart);
  return chart;
}

// ── Gráfico 1: Força Bruta vs PD/Memo — mesmo range n=5..14 ───────────────
function drawG1(bf, pd, memo) {
  const ns      = bf.map((d) => d.n);
  const bfTimes = bf.map((d) => d.time_ns / 1e3);   // µs
  const pdSub   = pd.filter((d) => d.n <= 14).map((d) => d.time_ns / 1e3);
  const moSub   = memo.filter((d) => d.n <= 14).map((d) => d.time_ns / 1e3);

  // Curva de ajuste exponencial para BF: c * k^n
  const logY  = bfTimes.map(Math.log);
  const meanN = ns.reduce((a, b) => a + b) / ns.length;
  const meanL = logY.reduce((a, b) => a + b) / logY.length;
  const num   = ns.reduce((s, n, i) => s + (n - meanN) * (logY[i] - meanL), 0);
  const den   = ns.reduce((s, n) => s + (n - meanN) ** 2, 0);
  const slope = num / den;
  const base  = Math.exp(slope);
  const c     = Math.exp(meanL - slope * meanN);
  const fit   = ns.map((n) => c * Math.pow(base, n));

  makeChart("g1", "line", {
    labels: ns,
    datasets: [
      { label: "Força Bruta",           data: bfTimes, borderColor: COLOR.bf,   backgroundColor: "rgba(255,85,87,0.12)", tension: 0.3, pointRadius: 4 },
      { label: `Ajuste c·${base.toFixed(2)}ⁿ`, data: fit, borderColor: COLOR.fit, borderDash: [6, 3], pointRadius: 0, tension: 0.4 },
      { label: "PD Bottom-Up",          data: pdSub,   borderColor: COLOR.pd,   backgroundColor: "rgba(0,212,170,0.1)",  tension: 0.3, pointRadius: 3 },
      { label: "Memoização",            data: moSub,   borderColor: COLOR.memo, backgroundColor: "rgba(255,179,71,0.1)", tension: 0.3, pointRadius: 3, borderDash: [4, 2] },
    ],
  }, {
    plugins: { title: { display: true, text: "Gráfico 1 — Força Bruta vs PD/Memo (n = 5 até 14)", color: "#e8eaf0" } },
    scales: {
      x: { title: { display: true, text: "n — quantidade de matrizes na cadeia" } },
      y: { title: { display: true, text: "Tempo (µs)" } },
    },
  });
}

// ── Gráfico 2: PD vs Memoização em escala maior — n=5..50 ─────────────────
function drawG2(pd, memo) {
  const ns = pd.map((d) => d.n);
  makeChart("g2", "line", {
    labels: ns,
    datasets: [
      { label: "PD Bottom-Up",          data: pd.map((d)   => d.time_ns / 1e3), borderColor: COLOR.pd,   backgroundColor: "rgba(0,212,170,0.1)", tension: 0.3, pointRadius: 2 },
      { label: "Memoização (top-down)", data: memo.map((d) => d.time_ns / 1e3), borderColor: COLOR.memo, backgroundColor: "rgba(255,179,71,0.1)", tension: 0.3, pointRadius: 2 },
    ],
  }, {
    plugins: { title: { display: true, text: "Gráfico 2 — PD vs Memoização: ambas O(n³), escala n = 5 até 50", color: "#e8eaf0" } },
    scales: {
      x: { title: { display: true, text: "n — quantidade de matrizes na cadeia" } },
      y: { title: { display: true, text: "Tempo (µs)" } },
    },
  });
}

// ── Gráfico 3: Log-Log — verificação Θ(n³) ────────────────────────────────
function drawG3(pd, memo) {
  const ns      = pd.map((d) => d.n);
  const logNs   = ns.map((n) => Math.log10(n));
  const logPD   = pd.map((d)   => Math.log10(Math.max(d.time_ns, 1)));
  const logMemo = memo.map((d) => Math.log10(Math.max(d.time_ns, 1)));

  // Linha de referência com inclinação 3
  const x0 = logNs[0];
  const y0 = logPD[0];
  const ref = logNs.map((lx) => y0 + 3 * (lx - x0));

  makeChart("g3", "line", {
    labels: logNs.map((v) => v.toFixed(2)),
    datasets: [
      { label: "PD (log-log)",    data: logPD,   borderColor: COLOR.pd,   tension: 0.2, pointRadius: 2 },
      { label: "Memo (log-log)",  data: logMemo, borderColor: COLOR.memo, tension: 0.2, pointRadius: 2, borderDash: [4, 2] },
      { label: "Inclinação = 3", data: ref,     borderColor: "#6c63ff",  pointRadius: 0, borderDash: [8, 4], tension: 0 },
    ],
  }, {
    plugins: { title: { display: true, text: "Gráfico 3 — Escala Log-Log: Verificação de Θ(n³)", color: "#e8eaf0" } },
    scales: {
      x: { title: { text: "log₁₀(n)" } },
      y: { title: { text: "log₁₀(tempo ns)" } },
    },
  });
}

// ── Gráfico 4: Comparação dos 3 algoritmos (n ≤ 14) ───────────────────────
function drawG4(pd, memo, bf) {
  const ns    = bf.map((d) => d.n);
  const pdSub = pd.filter((d) => d.n <= 14);
  const moSub = memo.filter((d) => d.n <= 14);

  makeChart("g4", "bar", {
    labels: ns,
    datasets: [
      { label: "PD Bottom-Up",         data: pdSub.map((d) => d.time_ns / 1e3), backgroundColor: "rgba(0,212,170,0.7)" },
      { label: "Memoização",           data: moSub.map((d) => d.time_ns / 1e3), backgroundColor: "rgba(255,179,71,0.7)" },
      { label: "Força Bruta",          data: bf.map((d)    => d.time_ns / 1e3), backgroundColor: "rgba(255,85,87,0.7)"  },
    ],
  }, {
    plugins: {
      title: { display: true, text: "Gráfico 4 — Comparação dos 3 Algoritmos (n ≤ 14)", color: "#e8eaf0" },
      legend: { labels: { color: "#e8eaf0" } },
    },
    scales: {
      x: { title: { display: true, text: "n — quantidade de matrizes na cadeia (BF limitado a n ≤ 14)" }, ticks: { color: "#7a7f9a" }, grid: { color: "#2e3248" } },
      y: { type: "logarithmic", title: { display: true, text: "Tempo em µs — escala logarítmica (cada divisória = 10×)" }, ticks: { color: "#7a7f9a" }, grid: { color: "#2e3248" } },
    },
  });
}

// ── Gráfico 5: T(n)/n³ — constante assintótica ────────────────────────────
function drawG5(pd) {
  const ns    = pd.map((d) => d.n);
  const ratio = pd.map((d) => d.time_ns / (d.n ** 3));

  const mean = ratio.slice(-20).reduce((a, b) => a + b) / 20;

  makeChart("g5", "line", {
    labels: ns,
    datasets: [
      { label: "T(n)/n³ — PD", data: ratio, borderColor: COLOR.pd, backgroundColor: "rgba(0,212,170,0.1)", tension: 0.3, pointRadius: 2 },
      { label: `Constante ≈ ${mean.toFixed(1)} ns`, data: ns.map(() => mean), borderColor: "#6c63ff", borderDash: [6, 3], pointRadius: 0 },
    ],
  }, {
    plugins: { title: { display: true, text: "Gráfico 5 — T(n)/n³: Convergência para Constante Assintótica", color: "#e8eaf0" } },
    scales: {
      x: { title: { display: true, text: "n — quantidade de matrizes na cadeia" } },
      y: { title: { display: true, text: "T(n) ÷ n³ (ns por operação) — converge para constante se Θ(n³)" } },
    },
  });
}

// ── Inicialização da aba ───────────────────────────────────────────────────
function initGraficos() {
  const tab = document.getElementById("tab-graficos");
  tab.innerHTML = `
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
      <button id="btn-benchmark" class="btn-primary">Rodar Benchmark</button>
      <span id="bench-status" style="font-size:0.85rem;color:var(--muted)">
        G1: os 3 algoritmos até n=14 &nbsp;|&nbsp; G2: PD e Memo até n=50 &nbsp;|&nbsp; G3–G5: escala e constante assintótica. Pode levar ~20s.
      </span>
    </div>
    <div id="bench-error" class="error-msg"></div>

    <div id="charts-grid" style="display:none;">
      <div style="display:flex;flex-direction:column;gap:1.5rem;">
        <div class="card"><canvas id="g1" style="max-height:340px;"></canvas></div>
        <div class="card"><canvas id="g2" style="max-height:340px;"></canvas></div>
        <div class="card"><canvas id="g3" style="max-height:340px;"></canvas></div>
        <div class="card"><canvas id="g4" style="max-height:340px;"></canvas></div>
        <div class="card"><canvas id="g5" style="max-height:340px;"></canvas></div>
      </div>
    </div>
  `;

  document.getElementById("btn-benchmark").addEventListener("click", runBenchmark);
}

async function runBenchmark() {
  const btn    = document.getElementById("btn-benchmark");
  const status = document.getElementById("bench-status");
  const errEl  = document.getElementById("bench-error");
  const grid   = document.getElementById("charts-grid");

  btn.disabled = true;
  errEl.textContent = "";
  status.innerHTML = '<span style="color:var(--accent)">Rodando benchmark... pode levar alguns segundos ⏳</span>';

  destroyCharts();
  grid.style.display = "none";

  try {
    const res  = await fetch("/api/benchmark");
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro no servidor");

    const { pd, memo, bf } = json.data;

    grid.style.display = "block";
    drawG1(bf, pd, memo);
    drawG2(pd, memo);
    drawG3(pd, memo);
    drawG4(pd, memo, bf);
    drawG5(pd);

    const cfg = json.data.config;
    status.innerHTML = `<span style="color:var(--accent2)">✓ Concluído</span> &nbsp;—&nbsp; semente ${cfg.seed} &nbsp;|&nbsp; PD/Memo n=${cfg.min_n}..${cfg.max_n} &nbsp;|&nbsp; BF n=${cfg.min_n}..${cfg.max_bf}`;
  } catch (err) {
    errEl.textContent = `Erro: ${err.message}. Verifique se o servidor está rodando (./run.sh).`;
    status.textContent = "";
  } finally {
    btn.disabled = false;
  }
}
