import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from mcm import run_all
from benchmark import run_benchmark

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)


@app.route("/api/mcm", methods=["POST"])
def mcm_route():
    data = request.get_json()
    if not data or "dims" not in data:
        return jsonify({"error": "Campo 'dims' obrigatório"}), 400

    dims = data["dims"]

    if not isinstance(dims, list) or len(dims) < 2:
        return jsonify({"error": "Mínimo de 2 dimensões necessárias"}), 400

    if len(dims) > 21:
        return jsonify({"error": "Máximo de 20 matrizes (21 dimensões)"}), 400

    if any(not isinstance(d, (int, float)) or d <= 0 for d in dims):
        return jsonify({"error": "Todas as dimensões devem ser inteiros positivos"}), 400

    try:
        results = run_all([int(d) for d in dims])
        return jsonify({"success": True, "results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/benchmark", methods=["GET"])
def benchmark_route():
    try:
        data = run_benchmark()
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    target = os.path.join(FRONTEND_DIR, path)
    if path and os.path.isfile(target):
        return send_from_directory(FRONTEND_DIR, path)
    return send_from_directory(FRONTEND_DIR, "index.html")


if __name__ == "__main__":
    print("\n  MCM — Multiplicação Ótima de Matrizes")
    print("  Acesse: http://localhost:5050\n")
    app.run(debug=True, port=5050)
