# MCM — Multiplicação Ótima de Matrizes
**Trabalho Final de PAA · ICEV 2026**
Alunos: Elias Pio | Marcos Valdecy | Bruno Ibiapina | Whuanderson
Professor: Francisco José de Araújo

---

## Como rodar

```bash
# 1. Instalar dependências do backend
pip install -r backend/requirements.txt

# 2. Iniciar o servidor Flask
python3 backend/app.py
# → rodando em http://localhost:5050

# 3. Abrir o frontend no navegador
# Abra o arquivo frontend/index.html diretamente no Chrome/Firefox
# (não é preciso servidor para o frontend)
```

---

## Estrutura do projeto

```
trabalho-chiquinho/
├── CLAUDE.md                     ← este arquivo
├── MCM_Trabalho_Final_Com_Graficos.docx   ← documento do trabalho escrito
│
├── backend/
│   ├── app.py                    ← servidor Flask (API REST)
│   ├── mcm.py                    ← os 3 algoritmos MCM
│   └── requirements.txt          ← flask, flask-cors
│
└── frontend/
    ├── index.html                ← shell da app com abas
    ├── css/
    │   └── styles.css            ← estilos globais e tema escuro
    └── js/
        ├── utils.js              ← callMCM(), formatTime(), parseDims()
        ├── main.js               ← roteamento de abas e inicialização
        └── tabs/
            ├── demo.js           ← ✅ IMPLEMENTADO — demo interativa completa
            ├── introducao.js     ← 🔲 placeholder — seções 1 e 2 do trabalho
            ├── teoria.js         ← 🔲 placeholder — seções 3 e 4 do trabalho
            ├── complexidade.js   ← 🔲 placeholder — seção 4.5 do trabalho
            └── graficos.js       ← ✅ IMPLEMENTADO — 5 gráficos empíricos com Chart.js
```

---

## O que já está pronto

### Backend (`backend/mcm.py`)
- `bottom_up(p)` → PD bottom-up, retorna tabelas `m` e `s`, O(n³)
- `memoization(p)` → memoização top-down, retorna custo e tabela `s`, O(n³)
- `brute_force(p)` → força bruta recursiva, limitada a n ≤ 14
- `get_parenthesis(s, i, j)` → reconstrói a string de parentização ótima
- `run_all(dims)` → executa os 3 algoritmos e mede tempo com `perf_counter`

### Backend (`backend/app.py`)
- `POST /api/mcm` — recebe `{"dims": [10, 30, 5, 60, 10]}`, retorna tempos + tabela m + parentização
- `GET /api/health` — verifica se o servidor está no ar (http://localhost:5050/api/health)

### Frontend — Aba "Demo Interativa" (`js/tabs/demo.js`)
- Botões de preset (4, 6, 10, 12 matrizes)
- Campo livre para inserir dimensões
- Barras de velocidade animadas (Força Bruta / Memoização / PD)
- Razão de velocidade BF vs PD
- Tabela m[i,j] com heatmap de cores
- Parentização ótima e custo mínimo

---

## O que falta implementar

### Aba "Introdução" (`js/tabs/introducao.js`)
Conteúdo: contextualização do problema MCM, exemplo ilustrativo (A₁×A₂×A₃×A₄ com 5 parentizações), motivação.
Fonte: seções 1 e 2 do .docx.

### Aba "Teoria" (`js/tabs/teoria.js`)
Conteúdo: recorrência m[i,j], prova de subestrutura ótima, subproblemas sobrepostos, pseudocódigos.
Sugestão: usar [KaTeX](https://katex.org/) para fórmulas — adicionar ao `<head>` do index.html:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
```
Fonte: seções 3 e 4 do .docx.

### Aba "Complexidade" (`js/tabs/complexidade.js`)
Conteúdo: tabela de complexidade de tempo e espaço dos 3 algoritmos, crescimento dos números de Catalão.
Fonte: seção 4.5 e Tabela 1 do .docx.

### Aba "Gráficos Empíricos" — ✅ Implementada
- Botão "Rodar Benchmark" chama `GET /api/benchmark`
- Backend (`backend/benchmark.py`) roda PD/Memo para n=2..50 e BF para n=2..14, semente=42, 3 repetições por ponto
- 5 gráficos renderizados com Chart.js:
  - G1: Força Bruta com curva de ajuste exponencial
  - G2: PD vs Memoização (µs)
  - G3: Log-log confirmando inclinação ≈ 3
  - G4: Comparação dos 3 em barras (escala log Y)
  - G5: T(n)/n³ convergindo para constante assintótica

---

## Como adicionar conteúdo a uma aba placeholder

Cada aba tem uma função `initXxx()` em `js/tabs/xxx.js` que é chamada automaticamente
na primeira vez que o usuário clica nela. Para adicionar conteúdo:

```js
// js/tabs/introducao.js
function initIntroducao() {
  const tab = document.getElementById("tab-introducao");
  tab.innerHTML = `
    <div class="card">
      <h2>Contextualização</h2>
      <p>...</p>
    </div>
  `;
}
```

Consulte `js/tabs/demo.js` como referência de implementação completa.
As classes CSS disponíveis estão documentadas em `css/styles.css`.

---

## API Reference

### `POST /api/mcm`
**Request:**
```json
{ "dims": [10, 30, 5, 60, 10] }
```
**Response:**
```json
{
  "success": true,
  "results": {
    "n": 4,
    "dims": [10, 30, 5, 60, 10],
    "bottom_up": {
      "time_ns": 12500.0,
      "time_s": 0.0000125,
      "cost": 27500,
      "parenthesis": "((A1 × A2) × (A3 × A4))",
      "m_table": [[...], ...]
    },
    "memoization": { "time_ns": 48000.0, "time_s": 0.000048, "cost": 27500 },
    "brute_force":  { "time_ns": 95000.0, "time_s": 0.000095, "cost": 27500, "skipped": false }
  }
}
```
Se `n > 14`, o campo `brute_force` terá `"skipped": true` e `"reason": "..."`.
