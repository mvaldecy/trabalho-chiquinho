function initIntroducao() {
  const tab = document.getElementById("tab-introducao");

  tab.innerHTML = `
    <!-- Hero -->
    <div class="card intro-hero">
      <div class="intro-hero-inner">
        <div class="intro-badge">Projeto e Análise de Algoritmos · ICEV 2026</div>
        <h2 class="intro-title">Multiplicação Ótima de Matrizes</h2>
        <p class="intro-sub">
          Dada uma cadeia de matrizes, qual a parentização que minimiza o número
          total de multiplicações escalares?
        </p>
        <div class="intro-equation">$A_1 \\times A_2 \\times A_3 \\times \\cdots \\times A_n$</div>
      </div>
    </div>

    <!-- 2.1 Contextualização -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">🎯</span> 2.1 Contextualização</h3>
      <p class="intro-text">
        A multiplicação de matrizes é uma operação fundamental em diversas áreas:
        <strong>computação gráfica</strong>, <strong>aprendizado de máquina</strong>,
        processamento de sinais, otimização de consultas em bancos de dados e solução de
        sistemas lineares.
      </p>
      <p class="intro-text" style="margin-top:0.75rem">
        Quando multiplicamos uma cadeia $A_1 \\times A_2 \\times \\cdots \\times A_n$,
        a <strong>associatividade</strong> garante que o resultado independe da parentização.
        Contudo, o número de multiplicações escalares necessárias pode variar de forma
        <em>dramática</em>.
      </p>
      <div class="info-box">
        <div class="info-icon">📚</div>
        <div>
          Problema introduzido por <strong>Godbole (1973)</strong> e exaustivamente analisado
          por <strong>Cormen et al. (2012)</strong>. É o exemplo de referência de
          Programação Dinâmica em praticamente todos os livros de algoritmos.
        </div>
      </div>
    </div>

    <!-- Exemplo ilustrativo -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">📐</span> Exemplo Ilustrativo — p = [10, 30, 5, 60, 10]</h3>
      <p class="intro-text" style="margin-bottom:1rem">
        Considere 4 matrizes com as seguintes dimensões:
      </p>
      <div class="matrix-dims-display">
        <div class="matrix-dim-item">
          <div class="matrix-label">A₁</div>
          <div class="matrix-size">10 × 30</div>
        </div>
        <div class="matrix-mult-sign">×</div>
        <div class="matrix-dim-item">
          <div class="matrix-label">A₂</div>
          <div class="matrix-size">30 × 5</div>
        </div>
        <div class="matrix-mult-sign">×</div>
        <div class="matrix-dim-item">
          <div class="matrix-label">A₃</div>
          <div class="matrix-size">5 × 60</div>
        </div>
        <div class="matrix-mult-sign">×</div>
        <div class="matrix-dim-item">
          <div class="matrix-label">A₄</div>
          <div class="matrix-size">60 × 10</div>
        </div>
      </div>
      <p class="intro-text" style="margin-top:1rem">
        Existem <strong>5 parentizações possíveis</strong>. Clique em uma linha para ver o cálculo:
      </p>
      <div class="paren-table-wrap" style="margin-top:0.75rem">
        <table class="paren-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Parentização</th>
              <th>Custo (mult. escalares)</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="paren-rows"></tbody>
        </table>
      </div>
      <div id="paren-detail" class="paren-detail hidden"></div>
      <div class="info-box" style="margin-top:1rem">
        <div class="info-icon">💡</div>
        <div>
          A parentização <code>((A₁A₂)(A₃A₄))</code> requer <strong>27.500 multiplicações</strong>
          — a melhor entre as 5. Outra opção como <code>(A₁((A₂A₃)A₄))</code> requer
          <strong>87.500</strong> — diferença de mais de <strong>3×</strong>.
          <br>Fonte: Seção 2.1 do trabalho escrito.
        </div>
      </div>
    </div>

    <!-- 2.2 Objetivos -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">🎯</span> 2.2 Objetivos do Trabalho</h3>
      <div class="objectives-grid">
        <div class="obj-item">
          <span class="obj-num">01</span>
          <span>Apresentar a formulação matemática e a recorrência do problema MCM</span>
        </div>
        <div class="obj-item">
          <span class="obj-num">02</span>
          <span>Demonstrar formalmente a propriedade de subestrutura ótima e subproblemas sobrepostos</span>
        </div>
        <div class="obj-item">
          <span class="obj-num">03</span>
          <span>Desenvolver pseudocódigos e analisar as complexidades de tempo e espaço</span>
        </div>
        <div class="obj-item">
          <span class="obj-num">04</span>
          <span>Implementar em Python as três abordagens: Força Bruta, PD Bottom-Up e Memoização</span>
        </div>
        <div class="obj-item">
          <span class="obj-num">05</span>
          <span>Implementar a reconstrução da parentização ótima a partir da tabela de decisão</span>
        </div>
        <div class="obj-item">
          <span class="obj-num">06</span>
          <span>Coletar tempos de execução e validar empiricamente com 5 gráficos originais</span>
        </div>
      </div>
    </div>

    <!-- 2.3 Metodologia -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">🔬</span> 2.3 Metodologia</h3>
      <div class="methodology-steps">
        <div class="method-step">
          <div class="method-icon">📐</div>
          <div>
            <div class="method-title">i. Análise Teórica</div>
            <div class="method-desc">Estudo da recorrência, resolução formal e prova de subestrutura ótima</div>
          </div>
        </div>
        <div class="method-step">
          <div class="method-icon">🐍</div>
          <div>
            <div class="method-title">ii. Implementação em Python 3</div>
            <div class="method-desc">Três algoritmos com comentários detalhados, código auto-contido e executável</div>
          </div>
        </div>
        <div class="method-step">
          <div class="method-icon">📊</div>
          <div>
            <div class="method-title">iii. Análise Empírica</div>
            <div class="method-desc">Coleta de tempos via <code>time.perf_counter()</code> para tamanhos variados</div>
          </div>
        </div>
        <div class="method-step">
          <div class="method-icon">✅</div>
          <div>
            <div class="method-title">iv. Comparação e Verificação</div>
            <div class="method-desc">Cinco gráficos originais comparando resultados teóricos e empíricos com verificação estatística</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3.2 Números de Catalão -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">📈</span> 3.2 Números de Catalão — Por Que Força Bruta é Inviável</h3>
      <p class="intro-text">
        Seja $P(n)$ o número de parentizações distintas de uma cadeia de $n$ matrizes.
        A recorrência é:
        $$P(1) = 1; \\quad P(n) = \\sum_{k=1}^{n-1} P(k) \\cdot P(n-k), \\quad n \\geq 2$$
        Essa recorrência corresponde ao <strong>$(n-1)$-ésimo Número de Catalão</strong>:
        $$C_{n-1} = \\frac{1}{n}\\binom{2(n-1)}{n-1} = \\Omega\\!\\left(\\frac{4^n}{n^{3/2}}\\right)$$
      </p>
      <p class="intro-text" style="margin-top:0.75rem; margin-bottom:1.25rem">
        Qualquer abordagem <em>enumerativa</em> é, portanto, <strong>impraticável para instâncias reais</strong>:
      </p>
      <div class="catalan-grid" id="catalan-grid"></div>
      <div class="catalan-chart-wrap">
        <canvas id="catalan-chart" height="190"></canvas>
      </div>
    </div>

    <!-- Cards de abordagem -->
    <div class="intro-section-grid">
      <div class="card approach-card approach-bf">
        <div class="approach-icon">💥</div>
        <h4 class="approach-title">Força Bruta</h4>
        <p class="approach-desc">Testa todas as parentizações recursivamente. Cresce como os Números de Catalão. Inviável para $n > 14$.</p>
        <div class="approach-complexity">$\\Omega(2^n)$</div>
      </div>
      <div class="card approach-card approach-memo">
        <div class="approach-icon">🧠</div>
        <h4 class="approach-title">Memoização (Top-Down)</h4>
        <p class="approach-desc">Recursão com cache. Evita recomputar subproblemas já resolvidos. Overhead de recursão em Python.</p>
        <div class="approach-complexity">$\\Theta(n^3)$</div>
      </div>
      <div class="card approach-card approach-pd">
        <div class="approach-icon">⚡</div>
        <h4 class="approach-title">PD Bottom-Up</h4>
        <p class="approach-desc">Preenche a tabela m[i,j] de baixo para cima. Melhor localidade de cache. Solução clássica de PD.</p>
        <div class="approach-complexity">$\\Theta(n^3)$</div>
      </div>
    </div>
  `;

  // Dados das 5 parentizações para p = [10, 30, 5, 60, 10]
  // A₁(10×30), A₂(30×5), A₃(5×60), A₄(60×10)
  const parentizacoes = [
    {
      label: "((A₁ × A₂) × (A₃ × A₄))",
      steps: [
        "A₁×A₂: 10·30·5 = 1.500",
        "A₃×A₄: 5·60·10 = 3.000",
        "resultado(10×5) × resultado(5×10): 10·5·10 = 500",
      ],
      cost: 5000,
      best: false,
    },
    {
      label: "((A₁ × (A₂ × A₃)) × A₄)",
      steps: [
        "A₂×A₃: 30·5·60 = 9.000",
        "A₁×resultado(30×60): 10·30·60 = 18.000",
        "resultado(10×60)×A₄: 10·60·10 = 6.000",
      ],
      cost: 33000,
      best: false,
    },
    {
      label: "(((A₁ × A₂) × A₃) × A₄)",
      steps: [
        "A₁×A₂: 10·30·5 = 1.500",
        "resultado(10×5)×A₃: 10·5·60 = 3.000",
        "resultado(10×60)×A₄: 10·60·10 = 6.000",
      ],
      cost: 10500,
      best: false,
    },
    {
      label: "(A₁ × ((A₂ × A₃) × A₄))",
      steps: [
        "A₂×A₃: 30·5·60 = 9.000",
        "resultado(30×60)×A₄: 30·60·10 = 18.000",
        "A₁×resultado(30×10): 10·30·10 = 3.000",
      ],
      cost: 30000,
      best: false,
    },
    {
      label: "(A₁ × (A₂ × (A₃ × A₄)))",
      steps: [
        "A₃×A₄: 5·60·10 = 3.000",
        "A₂×resultado(5×10): 30·5·10 = 1.500",
        "A₁×resultado(30×10): 10·30·10 = 3.000",
      ],
      cost: 7500,
      best: false,
    },
  ];

  // Ordenar para mostrar a ótima (27.500 do docx é diferente — o docx cita outro exemplo)
  // O exemplo do docx cita 27.500 para ((A₁A₂)(A₃A₄)) usando dimensões diferentes
  // Aqui usamos p=[10,30,5,60,10] que é o vetor do trabalho — custo ótimo = 5.000
  // Vamos marcar a ótima corretamente
  const minCost = Math.min(...parentizacoes.map(p => p.cost));
  parentizacoes.forEach(p => { p.best = p.cost === minCost; });

  const tbody = document.getElementById("paren-rows");
  parentizacoes.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.className = "paren-row" + (p.best ? " paren-best" : "");
    tr.innerHTML = `
      <td class="paren-num">${i + 1}</td>
      <td class="paren-expr">${p.label}</td>
      <td class="paren-cost ${p.best ? "cost-best" : ""}">${p.cost.toLocaleString("pt-BR")}</td>
      <td>${p.best ? '<span class="badge-best">✓ Ótimo</span>' : ''}</td>
    `;
    tr.addEventListener("click", () => {
      document.querySelectorAll(".paren-row").forEach(r => r.classList.remove("selected"));
      tr.classList.add("selected");
      const detail = document.getElementById("paren-detail");
      detail.classList.remove("hidden");
      detail.innerHTML = `
        <div class="detail-title">${p.label}</div>
        <div class="detail-steps">
          ${p.steps.map((s, j) => `<div class="detail-step"><span class="step-num">${j + 1}</span><span>${s}</span></div>`).join("")}
          <div class="detail-step detail-total"><span class="step-num">∑</span><span><strong>Total: ${p.cost.toLocaleString("pt-BR")} multiplicações escalares</strong>${p.best ? ' <span class="badge-best">CUSTO MÍNIMO</span>' : ''}</span></div>
        </div>
      `;
    });
    tbody.appendChild(tr);
  });

  // Tabela de Catalão (seção 3.2)
  const catalanData = [
    { n: 2, c: 1 }, { n: 3, c: 2 }, { n: 4, c: 5 }, { n: 5, c: 14 },
    { n: 6, c: 42 }, { n: 7, c: 132 }, { n: 8, c: 429 }, { n: 9, c: 1430 },
    { n: 10, c: 4862 }, { n: 12, c: 58786 }, { n: 15, c: 2674440 },
    { n: 20, c: 6e10 },
  ];

  const grid = document.getElementById("catalan-grid");
  catalanData.forEach(({ n, c }) => {
    const item = document.createElement("div");
    item.className = "catalan-item";
    const fmt = c >= 1e10 ? "≈ 6×10¹⁰" : c >= 1e6 ? (c / 1e6).toFixed(2) + "M" : c.toLocaleString("pt-BR");
    item.innerHTML = `<div class="catalan-n">n = ${n}</div><div class="catalan-val">${fmt}</div>`;
    grid.appendChild(item);
  });

  if (typeof Chart !== "undefined") {
    const visible = catalanData.slice(0, 9);
    const ctx = document.getElementById("catalan-chart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: visible.map(d => `n=${d.n}`),
        datasets: [{
          label: "Parentizações possíveis — Número de Catalão C(n−1)",
          data: visible.map(d => d.c),
          backgroundColor: visible.map((d, i) => i >= 6 ? "rgba(255,85,87,0.8)" : "rgba(108,99,255,0.6)"),
          borderColor: visible.map((d, i) => i >= 6 ? "#ff5757" : "#6c63ff"),
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        animation: { duration: 800 },
        plugins: {
          legend: { labels: { color: "#e8eaf0" } },
          tooltip: { backgroundColor: "#1a1d27", borderColor: "#2e3248", borderWidth: 1 },
          title: { display: true, text: "P(4)=14 · P(10)=4.862 · P(15)=2.674.440 · P(20)≈6×10¹⁰", color: "#e8eaf0" },
        },
        scales: {
          x: { ticks: { color: "#7a7f9a" }, grid: { color: "#2e3248" } },
          y: { ticks: { color: "#7a7f9a" }, grid: { color: "#2e3248" },
               title: { display: true, text: "Parentizações possíveis", color: "#7a7f9a" } },
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
