#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo ""
echo "  MCM — Multiplicação Ótima de Matrizes"
echo "  Instalando dependências..."
pip3 install -r backend/requirements.txt -q

echo "  Abrindo navegador em http://localhost:5050"
# Abre o navegador em segundo plano (funciona no Linux com xdg-open)
(sleep 2 && xdg-open http://localhost:5050 2>/dev/null || true) &

echo "  Iniciando servidor..."
echo ""
cd backend
python3 app.py
