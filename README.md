# MCM — Multiplicação Ótima de Matrizes

**Trabalho Final de PAA · ICEV 2026**
Alunos: Elias Pio | Marcos Valdecy | Whuanderson
Professor: Francisco José de Araújo

---

## Como rodar

### Opção 1 — Script direto (requer Python 3)

```bash
./run.sh
```

Instala as dependências, inicia o servidor e abre o navegador em `http://localhost:5050`.

### Opção 2 — Docker (recomendado para apresentação)

```bash
docker build -t mcm-app .
docker run -p 5050:5050 mcm-app
```

Depois abra `http://localhost:5050` no navegador.

---

## O que é isso

Uma aplicação web interativa para demonstrar o problema da **Multiplicação Ótima de Matrizes (MCM)** na apresentação.

- Digite as dimensões das matrizes (ou use os exemplos prontos)
- Clique **Executar** e veja ao vivo a diferença de velocidade entre Força Bruta, Memoização e PD Bottom-Up
- Veja a tabela m[i,j] e a parentização ótima
- Aba **Benchmark**: roda os 3 algoritmos para vários tamanhos de n e exibe 5 gráficos empíricos

---

## Para o próximo participante

Leia o **[CLAUDE.md](CLAUDE.md)** — explica a estrutura completa, o que já está implementado e como adicionar conteúdo nas abas placeholder (Introdução, Teoria, Complexidade).
