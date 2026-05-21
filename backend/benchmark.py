import random
import time
from mcm import bottom_up, memoization, brute_force

MAX_BF  = 14
MAX_N   = 50
MIN_N   = 5      # abaixo de n=5 o tempo é menor que resolução do timer
DIM_LO  = 5
DIM_HI  = 100
SEED    = 42


def _reps(n):
    """Mais repetições para n pequeno, onde o ruído domina."""
    if n < 10:  return 80
    if n < 20:  return 30
    if n < 35:  return 10
    return 5


def _dims(n, rng):
    return [rng.randint(DIM_LO, DIM_HI) for _ in range(n + 1)]


def _measure(fn, p):
    """Mínimo de N execuções — mínimo elimina ruído do SO melhor que média."""
    reps = _reps(len(p) - 1)
    best = float("inf")
    for _ in range(reps):
        t0 = time.perf_counter()
        fn(p)
        best = min(best, time.perf_counter() - t0)
    return best * 1e9   # nanosegundos


def _warmup():
    """Aquece o interpretador Python para evitar pico na primeira medição."""
    p = [10, 20, 30, 40, 50, 30, 20]
    for _ in range(10):
        bottom_up(p)
        memoization(p)
        brute_force(p)


def run_benchmark():
    _warmup()

    rng = random.Random(SEED)

    ns_all = list(range(MIN_N, MAX_N + 1))
    ns_bf  = list(range(MIN_N, MAX_BF + 1))

    dims_map = {n: _dims(n, rng) for n in ns_all}

    pd_times   = []
    memo_times = []
    bf_times   = []

    for n in ns_all:
        p = dims_map[n]
        pd_times.append({
            "n": n,
            "time_ns": _measure(lambda q: bottom_up(q), p),
        })
        memo_times.append({
            "n": n,
            "time_ns": _measure(lambda q: memoization(q), p),
        })

    for n in ns_bf:
        p = dims_map[n]
        bf_times.append({
            "n": n,
            "time_ns": _measure(lambda q: brute_force(q), p),
        })

    return {
        "pd":   pd_times,
        "memo": memo_times,
        "bf":   bf_times,
        "config": {
            "min_n":  MIN_N,
            "max_n":  MAX_N,
            "max_bf": MAX_BF,
            "seed":   SEED,
        },
    }
