# MOBILE BEAN — 移动咖啡车 · 商业模式与扩张路径

> 移动车是矛，固定店是旗，种植舱和烘焙中心是粮仓。

A static, bilingual (中文 / EN) strategy site that presents the go-to-market model for
aeroponic specialty coffee: **mobile carts as the first customer-acquisition engine and
franchise expansion unit; a very small number of flagship stores as brand anchor,
experience centre and regional hub.**

## Pages

| Page | Content |
|---|---|
| `index.html` | Overview — premise (bean supply is solved), three-layer model (spear / flag / granary), mobile-vs-fixed comparison, verdict |
| `mobile-cart.html` | Why carts come first, what's on board, pitch strategy with efficiency chart, first-12-months execution list |
| `flagship.html` | The three fatal weaknesses of cart-only, the store's five roles, 80–120 sqm format split, non-negotiables |
| `roadmap.html` | 3 phases (0–12 / 12–24 / 24+ months), unit build-out charts, entry gates between phases |
| `economics.html` | Interactive unit-economics calculator, payback curve, monthly P&L, scenarios, HQ profit mix |
| `franchise.html` | Who invests what, HQ's four control points, franchisee profile, support system, risk table |

## Stack

- Multi-page static HTML, no build step
- Shared `assets/css/style.css` (X.com dark theme: `#000` bg, `#1d9bf0` accent)
- `assets/js/i18n.js` — EN/中文 toggle (`<span class="en">` / `<span class="zh">` pairs, persisted in `localStorage`)
- `assets/js/chrome.js` — floating nav + hover dropdowns, footer injection, scroll reveal
- `assets/js/charts.js` — ECharts 5 (jsDelivr) + interactive payback calculator

## Core numbers (base case)

- Cart capital: ¥150k–250k · 80–120 cups/day · 65%+ gross margin · payback 8–14 months
- Phase 1: 3–5 direct carts → Phase 2: 1 flagship (80–120 sqm) → Phase 3: 10–20 carts/city + 1 grow pod & roastery per city
- Franchisees invest in carts only; HQ controls bean, roast, mini-programme, brand; profit comes from the supply chain, not franchise fees

## Run locally

Open `index.html` directly, or:

```bash
python -m http.server 8899
# http://127.0.0.1:8899/index.html
```

---
© MOBILE BEAN · NAPELL BIO — erik.wong@napell.bio
