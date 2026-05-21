function initTeoria() {
  const tab = document.getElementById("tab-teoria");

  tab.innerHTML = `
    <!-- 3.1 Propriedades da Multiplicação de Matrizes -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">🔢</span> 3.1 Propriedades da Multiplicação de Matrizes</h3>
      <p class="intro-text">
        A multiplicação de duas matrizes $A$ ($p \\times q$) e $B$ ($q \\times r$) produz
        $C$ ($p \\times r$) com custo <strong>$p \\cdot q \\cdot r$ multiplicações escalares</strong>.
        Propriedades essenciais:
      </p>
      <div class="properties-grid">
        <div class="prop-item">
          <div class="prop-label">✅ Associatividade</div>
          <div class="prop-formula">$(AB)C = A(BC)$</div>
          <div class="prop-desc">Permite reordenar parentizações sem alterar o resultado. É a propriedade que fundamenta o MCM.</div>
        </div>
        <div class="prop-item">
          <div class="prop-label">❌ Comutatividade</div>
          <div class="prop-formula">$AB \\neq BA$ (em geral)</div>
          <div class="prop-desc">A ordem das matrizes não pode ser alterada.</div>
        </div>
        <div class="prop-item">
          <div class="prop-label">✅ Distributividade</div>
          <div class="prop-formula">$A(B + C) = AB + AC$</div>
          <div class="prop-desc">Propriedade usada em simplificações algébricas.</div>
        </div>
      </div>
    </div>

    <!-- 4.1 Formulação e Recorrência -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">📐</span> 4.1 Formulação e Recorrência m[i, j]</h3>
      <p class="intro-text" style="margin-bottom:0.85rem">
        Dada $\\langle A_1, \\ldots, A_n \\rangle$ com $A_i$ de dimensão $p_{i-1} \\times p_i$,
        definimos $m[i,j]$ como o <strong>custo mínimo</strong> de computar $A_i A_{i+1} \\cdots A_j$.
        A recorrência é:
      </p>
      <div class="recurrence-block">
        <div class="recurrence-case">
          <div class="recurrence-cond">se $i = j$:</div>
          <div class="recurrence-formula">$$m[i,j] = 0$$</div>
        </div>
        <div class="recurrence-case">
          <div class="recurrence-cond">se $i &lt; j$:</div>
          <div class="recurrence-formula">
            $$m[i,j] = \\min_{i \\le k &lt; j} \\Big\\{ m[i,k] + m[k+1,j] + p_{i-1} \\cdot p_k \\cdot p_j \\Big\\}$$
          </div>
        </div>
      </div>
      <div class="teoria-explain">
        <div class="explain-item">
          <code>m[i,k]</code>
          <span>Custo de computar o produto $A_i \\cdots A_k$ (subproblema esquerdo)</span>
        </div>
        <div class="explain-item">
          <code>m[k+1,j]</code>
          <span>Custo de computar o produto $A_{k+1} \\cdots A_j$ (subproblema direito)</span>
        </div>
        <div class="explain-item">
          <span class="formula-code">$p_{i-1} \\cdot p_k \\cdot p_j$</span>
          <span>Custo de multiplicar os dois resultados intermediários na divisão $k$</span>
        </div>
      </div>
      <p class="intro-text" style="margin-top:1rem">
        A tabela auxiliar $s[i,j]$ armazena o $k$ ótimo, permitindo <strong>reconstruir a parentização</strong>
        após o preenchimento das tabelas.
      </p>
    </div>

    <!-- 4.2 Prova de Subestrutura Ótima -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">🏗️</span> 4.2 Prova da Subestrutura Ótima</h3>
      <p class="intro-text">
        O problema MCM satisfaz a propriedade de <strong>subestrutura ótima</strong>
        — condição fundamental para aplicação de Programação Dinâmica.
      </p>
      <div class="theorem-box">
        <div class="theorem-label">Teorema (Cormen et al., 2012)</div>
        <p>
          Qualquer sub-parentização de uma solução ótima é também ótima.
          Suponha que a parentização ótima de $A_i A_{i+1} \\cdots A_j$ se divide em
          $(A_i \\cdots A_k)(A_{k+1} \\cdots A_j)$ com custo:
          $$C = m[i,k] + m[k+1,j] + p_{i-1} \\cdot p_k \\cdot p_j$$
        </p>
      </div>
      <p class="intro-text" style="margin-top:0.85rem">
        <strong>Prova por contradição:</strong> se $m[i,k]$ não fosse ótimo, existiria
        $m'[i,k] &lt; m[i,k]$, resultando em $C' &lt; C$ — contradição com a otimalidade
        de $C$. Logo, ambos os sub-produtos devem ser ótimos. $\\square$
      </p>
    </div>

    <!-- 4.3 Subproblemas Sobrepostos -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">🔄</span> 4.3 Subproblemas Sobrepostos</h3>
      <p class="intro-text">
        O MCM exibe <strong>subproblemas sobrepostos</strong>: $m[2,4]$ é necessário
        tanto para calcular $m[1,5]$ (com $k=4$) quanto para $m[2,6]$ (com $k=4$).
        Em uma recursão ingênua, $m[2,4]$ seria recomputado <em>múltiplas vezes</em>.
      </p>
      <p class="intro-text" style="margin-top:0.6rem">
        O número total de subproblemas distintos é $\\Theta(n^2)$.
        A PD elimina o retrabalho armazenando cada resultado exatamente uma vez.
      </p>
      <div class="overlap-visual" id="overlap-visual"></div>
    </div>

    <!-- 4.4 Pseudocódigos -->
    <div class="pseudocode-grid">

      <div class="card">
        <h3 class="card-section-title"><span class="card-icon">💻</span> PD Bottom-Up — MATRIX-CHAIN-ORDER</h3>
        <pre class="pseudocode"><span class="kw">MATRIX-CHAIN-ORDER</span>(p, n):
  <span class="kw">para</span> i = 1 <span class="kw">até</span> n:  m[i][i] = 0

  <span class="kw">para</span> l = 2 <span class="kw">até</span> n:             <span class="cmt">// l = compr. da subcadeia</span>
    <span class="kw">para</span> i = 1 <span class="kw">até</span> n - l + 1:
      j = i + l - 1
      m[i][j] = ∞

      <span class="kw">para</span> k = i <span class="kw">até</span> j - 1:   <span class="cmt">// testa cada divisão</span>
        q = m[i][k] + m[k+1][j]
            + p[i-1]·p[k]·p[j]
        <span class="kw">se</span> q &lt; m[i][j]:
          m[i][j] = q
          s[i][j] = k

  <span class="kw">retorna</span> m, s</pre>
        <div class="complexity-tag">Tempo: $\\Theta(n^3)$ &nbsp;|&nbsp; Espaço: $\\Theta(n^2)$</div>
      </div>

      <div class="card">
        <h3 class="card-section-title"><span class="card-icon">🧠</span> Memoização (Top-Down) — LOOKUP-CHAIN</h3>
        <pre class="pseudocode"><span class="kw">LOOKUP-CHAIN</span>(p, memo, i, j):
  <span class="kw">se</span> memo[i][j] &lt; ∞:
    <span class="kw">retorna</span> memo[i][j]   <span class="cmt">// já calculado</span>

  <span class="kw">se</span> i == j:
    memo[i][j] = 0
  <span class="kw">senão</span>:
    <span class="kw">para</span> k = i <span class="kw">até</span> j - 1:
      q = LOOKUP-CHAIN(p, memo, i, k)
        + LOOKUP-CHAIN(p, memo, k+1, j)
        + p[i-1]·p[k]·p[j]
      <span class="kw">se</span> q &lt; memo[i][j]:
        memo[i][j] = q

  <span class="kw">retorna</span> memo[i][j]</pre>
        <div class="complexity-tag">Tempo: $O(n^3)$ &nbsp;|&nbsp; Espaço: $\\Theta(n^2)$ + pilha $O(n)$</div>
      </div>

    </div>

    <!-- Reconstrução -->
    <div class="card">
      <h3 class="card-section-title"><span class="card-icon">🔍</span> Reconstrução — PRINT-OPTIMAL-PARENS</h3>
      <p class="intro-text" style="margin-bottom:1rem">
        A tabela $s[i,j]$ armazena o índice $k$ da divisão ótima.
        Percorremos recursivamente para montar a parentização:
      </p>
      <pre class="pseudocode"><span class="kw">PRINT-OPTIMAL-PARENS</span>(s, i, j):
  <span class="kw">se</span> i == j:
    imprimir 'A' + i
  <span class="kw">senão</span>:
    imprimir '('
    PRINT-OPTIMAL-PARENS(s, i, s[i][j])
    PRINT-OPTIMAL-PARENS(s, s[i][j]+1, j)
    imprimir ')'</pre>
      <div class="info-box" style="margin-top:1rem">
        <div class="info-icon">💡</div>
        <div>
          Para $p = [5, 10, 3, 12, 5, 50, 6]$, a saída é
          <code>((A1 × A2) × ((A3 × A4) × (A5 × A6)))</code>
          — custo mínimo de <strong style="color:var(--accent2)">2.010 multiplicações</strong>.
          Veja o Exemplo Resolvido na seção Complexidade!
        </div>
      </div>
    </div>
  `;

  // Gera visual de subproblemas sobrepostos (n=4)
  const visual = document.getElementById("overlap-visual");
  if (visual) {
    const n = 4;
    let html = `<p class="intro-text" style="margin-bottom:0.75rem;margin-top:1rem">
      Grade de subproblemas $m[i,j]$ para $n = 4$ — em <span style="color:var(--warn)">laranja</span>: células compartilhadas entre múltiplos cálculos superiores:
    </p>`;
    html += `<div class="overlap-grid" style="grid-template-columns: repeat(${n + 1}, 1fr)">`;
    html += `<div class="ov-cell ov-header"></div>`;
    for (let j = 1; j <= n; j++) html += `<div class="ov-cell ov-header">j=${j}</div>`;
    for (let i = 1; i <= n; i++) {
      html += `<div class="ov-cell ov-header">i=${i}</div>`;
      for (let j = 1; j <= n; j++) {
        if (j < i) {
          html += `<div class="ov-cell ov-empty">—</div>`;
        } else if (i === j) {
          html += `<div class="ov-cell ov-diag" title="m[${i},${j}] = 0">0</div>`;
        } else {
          // Células que são subproblemas sobrepostos (usadas por >1 cálculo)
          const shared = (i > 1 && j < n) || (i === 2 && j === 4) || (i === 1 && j === 3);
          html += `<div class="ov-cell ${shared ? 'ov-shared' : 'ov-normal'}" title="m[${i},${j}]">m[${i},${j}]</div>`;
        }
      }
    }
    html += `</div>`;
    visual.innerHTML = html;
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
