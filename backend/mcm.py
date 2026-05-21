import time
import sys
from math import inf


def bottom_up(p):
    n = len(p) - 1
    m = [[0] * (n + 1) for _ in range(n + 1)]
    s = [[0] * (n + 1) for _ in range(n + 1)]

    for length in range(2, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            m[i][j] = inf
            for k in range(i, j):
                cost = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j]
                if cost < m[i][j]:
                    m[i][j] = cost
                    s[i][j] = k

    return m, s


def get_parenthesis(s, i, j):
    if i == j:
        return f"A{i}"
    k = s[i][j]
    left = get_parenthesis(s, i, k)
    right = get_parenthesis(s, k + 1, j)
    return f"({left} × {right})"


def _memo_helper(p, i, j, memo, s):
    if i == j:
        return 0
    if (i, j) in memo:
        return memo[(i, j)]
    memo[(i, j)] = inf
    for k in range(i, j):
        cost = _memo_helper(p, i, k, memo, s) + _memo_helper(p, k + 1, j, memo, s) + p[i - 1] * p[k] * p[j]
        if cost < memo[(i, j)]:
            memo[(i, j)] = cost
            s[i][j] = k
    return memo[(i, j)]


def memoization(p):
    n = len(p) - 1
    memo = {}
    s = [[0] * (n + 1) for _ in range(n + 1)]
    sys.setrecursionlimit(10000)
    cost = _memo_helper(p, 1, n, memo, s)
    return cost, s


def _brute_force_helper(p, i, j):
    if i == j:
        return 0
    min_val = inf
    for k in range(i, j):
        cost = _brute_force_helper(p, i, k) + _brute_force_helper(p, k + 1, j) + p[i - 1] * p[k] * p[j]
        if cost < min_val:
            min_val = cost
    return min_val


def brute_force(p):
    n = len(p) - 1
    return _brute_force_helper(p, 1, n)


def run_all(dims):
    p = dims
    n = len(p) - 1
    results = {}

    # PD Bottom-Up
    start = time.perf_counter()
    m, s = bottom_up(p)
    elapsed_pd = time.perf_counter() - start
    optimal_cost = m[1][n]
    parenthesis = get_parenthesis(s, 1, n)

    m_table = []
    for i in range(1, n + 1):
        row = []
        for j in range(1, n + 1):
            row.append(m[i][j] if i <= j else None)
        m_table.append(row)

    results["bottom_up"] = {
        "time_ns": elapsed_pd * 1e9,
        "time_s": elapsed_pd,
        "cost": optimal_cost,
        "parenthesis": parenthesis,
        "m_table": m_table,
    }

    # Memoização
    start = time.perf_counter()
    cost_memo, _ = memoization(p)
    elapsed_memo = time.perf_counter() - start

    results["memoization"] = {
        "time_ns": elapsed_memo * 1e9,
        "time_s": elapsed_memo,
        "cost": cost_memo,
    }

    # Força Bruta (limitada a n <= 14)
    MAX_BF = 14
    if n <= MAX_BF:
        start = time.perf_counter()
        cost_bf = brute_force(p)
        elapsed_bf = time.perf_counter() - start
        results["brute_force"] = {
            "time_ns": elapsed_bf * 1e9,
            "time_s": elapsed_bf,
            "cost": cost_bf,
            "skipped": False,
        }
    else:
        results["brute_force"] = {
            "time_ns": None,
            "time_s": None,
            "cost": None,
            "skipped": True,
            "reason": f"n={n} > {MAX_BF}: força bruta omitida para não travar",
        }

    results["n"] = n
    results["dims"] = p
    return results
