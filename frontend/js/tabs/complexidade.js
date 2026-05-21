function initComplexidade() {
  const tab = document.getElementById("tab-complexidade");

  tab.innerHTML = `
    <!-- 4.5 Tabela de Complexidade (Tabela 1 do .docx) -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">📊</span> 4.5 Análise de Complexidade — Tabela 1</h3>
      <p class="intro-text" style="margin-bottom:1.25rem">
        Comparação de tempo e espaço dos três algoritmos (Tabela 1 do trabalho):
      </p>
      <div class="comp-table-wrap">
        <table class="comp-table">
          <thead>
            <tr>
              <th>Algoritmo</th>
              <th>Tempo (Melhor)</th>
              <th>Tempo (Pior)</th>
              <th>Espaço</th>
              <th>Limite prático</th>
            </tr>
          </thead>
          <tbody>
            <tr class="comp-row comp-bf">
              <td><span class="algo-badge badge-bf">Força Bruta</span></td>
              <td class="comp-complexity">$\\Omega(2^n)$</td>
              <td class="comp-complexity">$\\Theta\\!\\left(\\dfrac{4^n}{n^{3/2}}\\right)$</td>
              <td class="comp-complexity">$O(n)$</td>
              <td><span class="limit-tag limit-bad">n ≤ 14</span></td>
            </tr>
            <tr class="comp-row comp-pd">
              <td><span class="algo-badge badge-pd">Programação Dinâmica</span></td>
              <td class="comp-complexity">$\\Theta(n^3)$</td>
              <td class="comp-complexity">$\\Theta(n^3)$</td>
              <td class="comp-complexity">$\\Theta(n^2)$</td>
              <td><span class="limit-tag limit-ok">n ≤ 10.000</span></td>
            </tr>
            <tr class="comp-row comp-memo">
              <td><span class="algo-badge badge-memo">Memoização</span></td>
              <td class="comp-complexity">$O(n^2)$*</td>
              <td class="comp-complexity">$O(n^3)$</td>
              <td class="comp-complexity">$\\Theta(n^2) + O(n)$</td>
              <td><span class="limit-tag limit-ok">n ≤ 10.000</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="intro-text" style="margin-top:0.75rem; font-size:0.8rem; color:var(--muted)">
        * Melhor caso da Memoização: muitos subproblemas já em cache (ex: 2ª chamada com mesmo input).
      </p>
      <div class="info-box" style="margin-top:1rem">
        <div class="info-icon">💡</div>
        <div>
          Embora PD e Memoização sejam ambas $\\Theta(n^3)$, a PD Bottom-Up é consistentemente
          <strong>4–5× mais rápida em Python</strong> — confirmado empiricamente no Benchmark.
          Veja a Seção 6.2 do trabalho para a análise detalhada.
        </div>
      </div>
    </div>

    <!-- Por que Θ(n³) -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">⚡</span> Por Que a PD é $\\Theta(n^3)$?</h3>
      <p class="intro-text" style="margin-bottom:1rem">
        Considere os três laços aninhados do algoritmo MATRIX-CHAIN-ORDER:
      </p>
      <div class="loop-analysis">
        <div class="loop-row">
          <span class="loop-label">Laço externo — comprimento $l$:</span>
          <span class="loop-range">$l = 2, 3, \\ldots, n$ → $n-1$ iterações</span>
        </div>
        <div class="loop-row">
          <span class="loop-label">Laço médio — índice inicial $i$:</span>
          <span class="loop-range">$n - l + 1$ iterações por valor de $l$</span>
        </div>
        <div class="loop-row">
          <span class="loop-label">Laço interno — divisão $k$:</span>
          <span class="loop-range">$l - 1$ iterações por par $(i, j)$</span>
        </div>
      </div>
      <p class="intro-text" style="margin-top:1rem">O total de operações é:</p>
      <div class="formula-block">
        $$\\sum_{l=2}^{n} \\sum_{i=1}^{n-l+1} (l-1)
          = \\sum_{l=2}^{n} (n - l + 1)(l - 1)
          = \\frac{n^3 - n}{6} = \\Theta(n^3)$$
      </div>
    </div>

    <!-- 4.6 Exemplo Resolvido (Tabelas 2 e 3 do .docx) -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">🔍</span> 4.6 Exemplo Resolvido — p = [5, 10, 3, 12, 5, 50, 6]</h3>
      <p class="intro-text" style="margin-bottom:1rem">
        Matrizes: $A_1(5 \\times 10)$, $A_2(10 \\times 3)$, $A_3(3 \\times 12)$,
        $A_4(12 \\times 5)$, $A_5(5 \\times 50)$, $A_6(50 \\times 6)$.
        Custo global ótimo: <strong style="color:var(--accent2)">$m[1,6] = 2.010$</strong>.
      </p>

      <p class="intro-text" style="margin-bottom:0.75rem; font-weight:600">Tabela 2 — Tabela m de custos mínimos:</p>
      <div class="comp-table-wrap" style="margin-bottom:1.5rem">
        <table class="comp-table example-table">
          <thead>
            <tr><th>m[i,j]</th><th>j=1</th><th>j=2</th><th>j=3</th><th>j=4</th><th>j=5</th><th>j=6</th></tr>
          </thead>
          <tbody>
            <tr><td class="row-header">i=1</td><td>0</td><td>150</td><td class="cell-highlight">330</td><td>405</td><td>1.655</td><td class="cell-optimal">2.010</td></tr>
            <tr><td class="row-header">i=2</td><td class="cell-empty">—</td><td>0</td><td>360</td><td class="cell-highlight">330</td><td>2.430</td><td>1.950</td></tr>
            <tr><td class="row-header">i=3</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td>0</td><td>180</td><td class="cell-highlight">930</td><td>1.770</td></tr>
            <tr><td class="row-header">i=4</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td>0</td><td>3.000</td><td class="cell-highlight">1.860</td></tr>
            <tr><td class="row-header">i=5</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td>0</td><td>1.500</td></tr>
            <tr><td class="row-header">i=6</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td>0</td></tr>
          </tbody>
        </table>
      </div>

      <p class="intro-text" style="margin-bottom:0.75rem; font-weight:600">Tabela 3 — Tabela s de pontos de corte ótimos:</p>
      <div class="comp-table-wrap">
        <table class="comp-table example-table">
          <thead>
            <tr><th>s[i,j]</th><th>j=2</th><th>j=3</th><th>j=4</th><th>j=5</th><th>j=6</th></tr>
          </thead>
          <tbody>
            <tr><td class="row-header">i=1</td><td>1</td><td>2</td><td>2</td><td>4</td><td class="cell-optimal">2</td></tr>
            <tr><td class="row-header">i=2</td><td class="cell-empty">—</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
            <tr><td class="row-header">i=3</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td>3</td><td>4</td><td>4</td></tr>
            <tr><td class="row-header">i=4</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td>4</td><td>4</td></tr>
            <tr><td class="row-header">i=5</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td class="cell-empty">—</td><td>5</td></tr>
          </tbody>
        </table>
      </div>
      <div class="info-box" style="margin-top:1rem">
        <div class="info-icon">✅</div>
        <div>
          <strong>Parentização ótima (a partir de s):</strong>
          <code>((A1 × A2) × ((A3 × A4) × (A5 × A6)))</code>
          — custo mínimo: <strong style="color:var(--accent2)">2.010 multiplicações escalares</strong>.
        </div>
      </div>
    </div>

    <!-- Crescimento dos Números de Catalão vs Subproblemas -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">📈</span> Crescimento: Catalão vs Subproblemas Distintos</h3>
      <p class="intro-text" style="margin-bottom:1.25rem">
        A PD reduz exponencialmente o trabalho, resolvendo apenas os $\\Theta(n^2)$
        subproblemas distintos em vez de testar todas as parentizações:
      </p>
      <div class="comp-table-wrap">
        <table class="comp-table" id="catalan-table">
          <thead>
            <tr>
              <th>n (matrizes)</th>
              <th>Parentizações — Catalão $C_{n-1}$</th>
              <th>Subproblemas distintos $\\Theta(n^2)$</th>
              <th>Redução</th>
            </tr>
          </thead>
          <tbody id="catalan-tbody"></tbody>
        </table>
      </div>
    </div>

    <!-- Gráfico de crescimento teórico -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">📉</span> Visualização: Crescimento Assintótico Teórico</h3>
      <p class="intro-text" style="margin-bottom:1.25rem">
        Comparação teórica das três complexidades (escala log Y):
      </p>
      <div style="position:relative; height:320px;">
        <canvas id="growth-chart"></canvas>
      </div>
    </div>

    <!-- Cards de resumo -->
    <div class="approach-grid-3">
      <div class="card approach-summary">
        <div class="approach-icon">💥</div>
        <div class="approach-title">Força Bruta</div>
        <div class="formula-inline">$$\\Omega(2^n) \\;\\text{até}\\; \\Theta\\!\\left(\\frac{4^n}{n^{3/2}}\\right)$$</div>
        <ul class="approach-list">
          <li>Sem cache → recalcula todos os subproblemas</li>
          <li>Cresce como Catalão: $4^n / n^{3/2}$</li>
          <li>Inviável para $n > 14$</li>
          <li>Espaço apenas $O(n)$ (pilha de recursão)</li>
        </ul>
      </div>
      <div class="card approach-summary">
        <div class="approach-icon">🧠</div>
        <div class="approach-title">Memoização</div>
        <div class="formula-inline">$$\\Theta(n^3) \\text{ amortizado}$$</div>
        <ul class="approach-list">
          <li>Cache de $\\Theta(n^2)$ subproblemas</li>
          <li>Top-down: computa só o necessário</li>
          <li>Overhead de frames recursivos em Python</li>
          <li>Overhead de hash lookup no dicionário</li>
          <li>4–5× mais lento que PD na prática</li>
        </ul>
      </div>
      <div class="card approach-summary">
        <div class="approach-icon">⚡</div>
        <div class="approach-title">PD Bottom-Up</div>
        <div class="formula-inline">$$\\Theta(n^3)$$</div>
        <ul class="approach-list">
          <li>Laços iterativos — sem overhead de recursão</li>
          <li>Preenche todos os $\\Theta(n^2)$ subproblemas</li>
          <li>Melhor localidade de cache L1/L2</li>
          <li>Espaço apenas $\\Theta(n^2)$</li>
          <li>Abordagem mais eficiente na prática</li>
        </ul>
      </div>
    </div>
  `;

  // Preenche tabela de Catalão (valores do .docx seção 3.2)
  const catalanRows = [
    { n: 2,  cat: 1,          sub: 1 },
    { n: 3,  cat: 2,          sub: 3 },
    { n: 4,  cat: 5,          sub: 6 },
    { n: 5,  cat: 14,         sub: 10 },
    { n: 6,  cat: 42,         sub: 15 },
    { n: 8,  cat: 429,        sub: 28 },
    { n: 10, cat: 4862,       sub: 45 },
    { n: 12, cat: 58786,      sub: 66 },
    { n: 15, cat: 2674440,    sub: 105 },
    { n: 20, cat: 6e10,       sub: 190 },
  ];

  const tbody = document.getElementById("catalan-tbody");
  catalanRows.forEach(({ n, cat, sub }) => {
    const ratio = cat / sub;
    const ratioStr = ratio >= 1e8 ? (ratio / 1e9).toFixed(1) + "B×" : ratio >= 1e6 ? (ratio / 1e6).toFixed(1) + "M×"
                   : ratio >= 1e3 ? (ratio / 1e3).toFixed(0) + "K×" : Math.round(ratio).toLocaleString("pt-BR") + "×";
    const catStr = cat >= 1e10 ? "≈ 6×10¹⁰" : cat.toLocaleString("pt-BR");
    const tr = document.createElement("tr");
    tr.className = "comp-row";
    tr.innerHTML = `
      <td style="text-align:center;font-weight:600">${n}</td>
      <td style="text-align:right;font-family:var(--mono);color:var(--danger)">${catStr}</td>
      <td style="text-align:right;font-family:var(--mono);color:var(--accent2)">${sub}</td>
      <td style="text-align:right;font-family:var(--mono);color:var(--warn)">${ratioStr}</td>
    `;
    tbody.appendChild(tr);
  });

  // Gráfico de crescimento teórico
  if (typeof Chart !== "undefined") {
    const ns = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const catalan = [1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786, 208012, 742900];
    const cubic   = ns.map(n => Math.round((n ** 3 - n) / 6));
    const quad    = ns.map(n => Math.round(n * (n + 1) / 2));

    const ctx = document.getElementById("growth-chart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ns.map(n => `n=${n}`),
        datasets: [
          {
            label: "Força Bruta — Catalão $C_{n-1}$",
            data: catalan,
            borderColor: "#ff5757",
            backgroundColor: "rgba(255,85,87,0.1)",
            tension: 0.35,
            pointRadius: 4,
          },
          {
            label: "PD/Memo — operações Θ(n³)",
            data: cubic,
            borderColor: "#00d4aa",
            backgroundColor: "rgba(0,212,170,0.1)",
            tension: 0.35,
            pointRadius: 4,
          },
          {
            label: "Subproblemas distintos — Θ(n²)",
            data: quad,
            borderColor: "#6c63ff",
            backgroundColor: "rgba(108,99,255,0.1)",
            tension: 0.35,
            pointRadius: 4,
            borderDash: [5, 3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900 },
        plugins: {
          legend: { labels: { color: "#e8eaf0", font: { family: "'Inter', sans-serif", size: 12 } } },
          tooltip: { backgroundColor: "#1a1d27", borderColor: "#2e3248", borderWidth: 1 },
          title: {
            display: true,
            text: "Crescimento teórico: Força Bruta exponencial vs PD/Memo cúbica (escala log Y)",
            color: "#e8eaf0",
          },
        },
        scales: {
          x: { ticks: { color: "#7a7f9a" }, grid: { color: "#2e3248" } },
          y: {
            type: "logarithmic",
            ticks: { color: "#7a7f9a" },
            grid: { color: "#2e3248" },
            title: { display: true, text: "Operações (escala log)", color: "#7a7f9a" },
          },
        },
      },
    });
  }

  if (typeof renderMathInElement === "function") {
    renderMathInElement(tab, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$",  right: "$",  display: false },
      ],
    });
  }
}
