const API_BASE = "";

async function callMCM(dims) {
  const res = await fetch(`${API_BASE}/api/mcm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dims }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro desconhecido");
  return data.results;
}

function formatTime(ns) {
  if (ns === null || ns === undefined) return "—";
  if (ns < 1000) return `${ns.toFixed(1)} ns`;
  if (ns < 1e6) return `${(ns / 1000).toFixed(2)} µs`;
  if (ns < 1e9) return `${(ns / 1e6).toFixed(2)} ms`;
  return `${(ns / 1e9).toFixed(3)} s`;
}

function formatNumber(n) {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("pt-BR");
}

function parseDims(str) {
  const parts = str.trim().split(/[\s,]+/).map(Number);
  if (parts.some(isNaN) || parts.some((x) => x <= 0)) return null;
  return parts;
}
