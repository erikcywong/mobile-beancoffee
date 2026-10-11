/* charts.js — ECharts 5 dark-theme builders + payback calculator
   Labels switch with html[data-lang]; charts re-render on 'langchange' */
(function () {
  var C = {
    accent: '#1d9bf0', up: '#00ba7c', warn: '#ffd400', down: '#f4212e',
    purple: '#7856ff', teal: '#7ad3ff', muted: '#71767b', line: '#1f2226', text: '#e7e9ea'
  };

  function L(zh, en) { return (window.MB_LANG && window.MB_LANG() === 'en') ? en : zh; }
  function has(id) { return !!document.getElementById(id); }
  function reg(id) {
    var el = document.getElementById(id);
    if (!el || !window.echarts) return null;
    return window.echarts.getInstanceByDom(el);
  }

  function base(extra) {
    return Object.assign({
      textStyle: { fontFamily: 'Inter, -apple-system, "Segoe UI", "PingFang SC", sans-serif', color: C.muted },
      grid: { left: 8, right: 16, top: 42, bottom: 8, containLabel: true },
      tooltip: {
        backgroundColor: '#16181c', borderColor: '#2f3336', borderWidth: 1,
        textStyle: { color: C.text, fontSize: 12.5 }, padding: [10, 12],
        extraCssText: 'border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.6);'
      },
      legend: {
        top: 0, left: 0, itemGap: 16, icon: 'roundRect', itemWidth: 10, itemHeight: 10,
        textStyle: { color: C.muted, fontSize: 12 }
      }
    }, extra || {});
  }

  var AXIS = {
    axisLine: { lineStyle: { color: C.line } },
    axisTick: { show: false },
    axisLabel: { color: C.muted, fontSize: 11.5 },
    splitLine: { lineStyle: { color: C.line, type: 'dashed' } }
  };

  function catAxis(data, extra) { return Object.assign({ type: 'category', data: data, boundaryGap: true, axisLine: AXIS.axisLine, axisTick: AXIS.axisTick, axisLabel: AXIS.axisLabel }, extra || {}); }
  function valAxis(extra) { return Object.assign({ type: 'value', axisLine: { show: false }, axisTick: { show: false }, axisLabel: AXIS.axisLabel, splitLine: AXIS.splitLine }, extra || {}); }

  /* ---------- 1. fleet growth (roadmap) ---------- */
  function fleet() {
    var el = document.getElementById('chart-fleet'); if (!el) return;
    var ch = window.echarts.init(el, null, { renderer: 'canvas' });
    ch.setOption(base({
      tooltip: Object.assign(base().tooltip, { trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(255,255,255,.04)' } } }),
      legend: Object.assign(base().legend, { data: [L('直营移动车', 'Direct carts'), L('加盟移动车', 'Franchise carts'), L('旗舰店', 'Flagship stores')] }),
      grid: { left: 8, right: 20, top: 46, bottom: 8, containLabel: true },
      xAxis: catAxis([L('第一阶段 0–12月', 'Phase 1 · 0–12m'), L('第二阶段 12–24月', 'Phase 2 · 12–24m'), L('第三阶段 24月+', 'Phase 3 · 24m+')]),
      yAxis: [
        valAxis({ name: L('移动车（辆）', 'Carts'), nameTextStyle: { color: C.muted, fontSize: 11 }, max: 24 }),
        valAxis({ name: L('旗舰店（家）', 'Stores'), nameTextStyle: { color: C.muted, fontSize: 11 }, max: 3, splitLine: { show: false } })
      ],
      series: [
        { name: L('直营移动车', 'Direct carts'), type: 'bar', stack: 'c', barWidth: 44, itemStyle: { color: C.accent, borderRadius: [0, 0, 0, 0] }, data: [4, 6, 6], label: { show: true, position: 'inside', color: '#fff', fontSize: 11, fontWeight: 600 } },
        { name: L('加盟移动车', 'Franchise carts'), type: 'bar', stack: 'c', itemStyle: { color: C.up, borderRadius: [6, 6, 0, 0] }, data: [0, 4, 12], label: { show: true, position: 'inside', color: '#000', fontSize: 11, fontWeight: 600 } },
        { name: L('旗舰店', 'Flagship stores'), type: 'line', yAxisIndex: 1, symbolSize: 9, lineStyle: { width: 2.5, color: C.warn }, itemStyle: { color: C.warn }, data: [0, 1, 2] }
      ]
    }));
    return ch;
  }

  /* ---------- 2. payback curve (economics) ---------- */
  function payback(invest, net) {
    var el = document.getElementById('chart-payback'); if (!el) return;
    var ch = window.echarts.init(el, null, { renderer: 'canvas' });
    var months = [], cash = [], zero = [];
    var cum = -invest, i;
    for (i = 0; i <= 18; i++) {
      months.push(i + L('月', 'm'));
      cash.push(Math.round(cum));
      zero.push(0);
      cum += net;
    }
    ch.setOption(base({
      tooltip: Object.assign(base().tooltip, { trigger: 'axis', valueFormatter: function (v) { return '¥' + Number(v).toLocaleString(); } }),
      legend: Object.assign(base().legend, { data: [L('累计现金流', 'Cumulative cash flow')] }),
      xAxis: catAxis(months, { boundaryGap: false }),
      yAxis: valAxis({ axisLabel: { color: C.muted, fontSize: 11.5, formatter: function (v) { return (v / 10000) + L('万', 'w'); } } }),
      series: [{
        name: L('累计现金流', 'Cumulative cash flow'), type: 'line', smooth: true, symbolSize: 5,
        lineStyle: { width: 3, color: C.accent }, itemStyle: { color: C.accent },
        areaStyle: { color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(29,155,240,.28)' }, { offset: 1, color: 'rgba(29,155,240,0)' }]) },
        data: cash,
        markLine: { silent: true, symbol: 'none', data: [{ yAxis: 0 }], lineStyle: { color: C.muted, type: 'dashed' }, label: { show: false } },
        markPoint: {
          symbol: 'circle', symbolSize: 10, data: [{ type: 'min' }],
          itemStyle: { color: C.down }, label: { show: false }
        }
      }]
    }));
    return ch;
  }

  /* ---------- 3. profit mix (economics) ---------- */
  function profitMix() {
    var el = document.getElementById('chart-mix'); if (!el) return;
    var ch = window.echarts.init(el, null, { renderer: 'canvas' });
    ch.setOption(base({
      tooltip: Object.assign(base().tooltip, { trigger: 'item', valueFormatter: function (v) { return v + '%'; } }),
      legend: Object.assign(base().legend, { orient: 'vertical', right: 4, top: 24, left: 'auto' }),
      series: [{
        type: 'pie', radius: ['58%', '82%'], center: ['36%', '54%'], avoidLabelOverlap: true,
        itemStyle: { borderColor: '#000', borderWidth: 3 },
        label: { show: false }, labelLine: { show: false },
        data: [
          { value: 46, name: L('豆子与烘焙供应', 'Green bean & roast supply'), itemStyle: { color: C.accent } },
          { value: 22, name: L('水培苗与耗材', 'Seedlings & consumables'), itemStyle: { color: C.up } },
          { value: 18, name: L('直营车利润', 'Direct-cart profit'), itemStyle: { color: C.teal } },
          { value: 9, name: L('设备与培训', 'Equipment & training'), itemStyle: { color: C.warn } },
          { value: 5, name: L('品牌与授权服务', 'Brand & licence services'), itemStyle: { color: C.purple } }
        ]
      }]
    }));
    return ch;
  }

  /* ---------- 4. sensitivity (economis) ---------- */
  function sensitivity() {
    var el = document.getElementById('chart-sens'); if (!el) return;
    var ch = window.echarts.init(el, null, { renderer: 'canvas' });
    var xs = [60, 70, 80, 90, 100, 110, 120];
    var a = [], b = [];
    xs.forEach(function (c) {
      a.push(Math.round((c * 22 * 0.65 * 30 - 19500)));
      b.push(Math.round((c * 26 * 0.68 * 30 - 21000)));
    });
    ch.setOption(base({
      tooltip: Object.assign(base().tooltip, { trigger: 'axis', valueFormatter: function (v) { return '¥' + Number(v).toLocaleString(); } }),
      legend: Object.assign(base().legend, { data: [L('基准 ¥22 / 65%毛利', 'Base ¥22 ticket / 65% GP'), L('高配 ¥26 / 68%毛利', 'Premium ¥26 / 68% GP')] }),
      xAxis: catAxis(xs.map(function (v) { return v + L('杯/日', ' cups'); }), { boundaryGap: false }),
      yAxis: valAxis({ axisLabel: { color: C.muted, fontSize: 11.5, formatter: function (v) { return (v / 10000) + L('万', 'w'); } } }),
      series: [
        { name: L('基准 ¥22 / 65%毛利', 'Base ¥22 ticket / 65% GP'), type: 'line', smooth: true, symbolSize: 6, lineStyle: { width: 3, color: C.accent }, itemStyle: { color: C.accent }, data: a },
        { name: L('高配 ¥26 / 68%毛利', 'Premium ¥26 / 68% GP'), type: 'line', smooth: true, symbolSize: 6, lineStyle: { width: 3, color: C.up, type: 'dashed' }, itemStyle: { color: C.up }, data: b },
        { type: 'line', data: xs.map(function () { return 0; }), symbol: 'none', lineStyle: { color: C.muted, type: 'dotted' }, silent: true, legendHoverLink: false }
      ]
    }));
    return ch;
  }

  /* ---------- 5. spot efficiency (mobile cart page) ---------- */
  function spots() {
    var el = document.getElementById('chart-spots'); if (!el) return;
    var ch = window.echarts.init(el, null, { renderer: 'canvas' });
    var names = [L('写字楼午高峰', 'Office lunch peak'), L('大学城', 'University town'), L('市集 / 周末', 'Weekend market'), L('产业园', 'Industrial park'), L('景区', 'Scenic area'), L('商圈街边', 'High-street corner')];
    var cups = [135, 120, 110, 95, 78, 55];
    var cost = [320, 260, 420, 180, 900, 3200];
    var eff = cups.map(function (c, i) { return Math.round(c / (cost[i] / 100)); });
    ch.setOption(base({
      tooltip: Object.assign(base().tooltip, { trigger: 'axis', axisPointer: { type: 'shadow' } }),
      grid: { left: 8, right: 24, top: 40, bottom: 8, containLabel: true },
      legend: Object.assign(base().legend, { data: [L('日均出杯', 'Cups / day'), L('每百元点位成本的出杯效率', 'Cups per ¥100 of pitch cost')] }),
      xAxis: valAxis({ max: 150 }),
      yAxis: catAxis(names.slice().reverse()),
      series: [
        { name: L('日均出杯', 'Cups / day'), type: 'bar', barWidth: 14, itemStyle: { color: C.accent, borderRadius: [0, 6, 6, 0] }, data: cups.slice().reverse() },
        { name: L('每百元点位成本的出杯效率', 'Cups per ¥100 of pitch cost'), type: 'scatter', symbolSize: 11, itemStyle: { color: C.up }, data: eff.slice().reverse() }
      ]
    }));
    return ch;
  }

  /* ---------- 6. revenue build (roadmap) ---------- */
  function revenue() {
    var el = document.getElementById('chart-revenue'); if (!el) return;
    var ch = window.echarts.init(el, null, { renderer: 'canvas' });
    var yrs = [L('第 1 年', 'Year 1'), L('第 2 年', 'Year 2'), L('第 3 年', 'Year 3'), L('第 4 年', 'Year 4')];
    var sys = [L('系统终端销售额（含加盟）', 'System-wide sales (incl. franchise)'), L('总部供应链收入', 'HQ supply-chain revenue')];
    ch.setOption(base({
      tooltip: Object.assign(base().tooltip, { trigger: 'axis', valueFormatter: function (v) { return '¥' + Number(v).toLocaleString() + L(' 万', '0k'); } }),
      legend: Object.assign(base().legend, { data: sys }),
      xAxis: catAxis(yrs),
      yAxis: valAxis({ axisLabel: { color: C.muted, fontSize: 11.5, formatter: function (v) { return v + L('万', 'w'); } } }),
      series: [
        { name: sys[0], type: 'bar', barWidth: 40, itemStyle: { color: C.accent, borderRadius: [6, 6, 0, 0] }, data: [258, 610, 1080, 1980], label: { show: true, position: 'top', color: C.muted, fontSize: 11 } },
        { name: sys[1], type: 'bar', barWidth: 40, itemStyle: { color: C.up, borderRadius: [6, 6, 0, 0] }, data: [0, 86, 268, 610], label: { show: true, position: 'top', color: C.up, fontSize: 11 } }
      ]
    }));
    return ch;
  }

  /* ---------- calculator ---------- */
  var DEF = { cups: 90, ticket: 22, gp: 65, invest: 200000, opex: 19500 };
  function calc() {
    var el = document.getElementById('calc'); if (!el) return;
    var ids = ['cups', 'ticket', 'gp', 'invest', 'opex'];

    function render() {
      var v = {};
      ids.forEach(function (id) {
        var inp = document.getElementById(id);
        v[id] = inp ? parseFloat(inp.value) : DEF[id];
      });
      var rev = v.cups * v.ticket * 30;
      var gross = rev * v.gp / 100;
      var net = gross - v.opex;
      var paybackM = net > 0 ? v.invest / net : Infinity;
      var beCups = v.opex / (v.ticket * v.gp / 100 * 30);
      var annROI = net > 0 ? (net * 12 / v.invest) * 100 : 0;

      function set(id, val) {
        var e = document.getElementById(id); if (e) e.textContent = val;
      }
      function money(n) { return '¥' + Math.round(n).toLocaleString(); }

      document.querySelectorAll('[data-out="cups"]').forEach(function (e) { e.textContent = Math.round(v.cups); });
      set('out-rev', money(rev));
      set('out-gross', money(gross));
      set('out-net', money(net));
      set('out-payback', net > 0 ? paybackM.toFixed(1) + L(' 个月', ' months') : L('无法回本', 'Never'));
      set('out-be', Math.ceil(beCups) + L(' 杯/日', ' cups/day'));
      set('out-roi', annROI.toFixed(0) + '%');

      ['cups', 'ticket', 'gp', 'invest', 'opex'].forEach(function (id) {
        var lab = document.querySelector('[data-live="' + id + '"]');
        if (!lab) return;
        var inp = document.getElementById(id); if (!inp) return;
        var val = parseFloat(inp.value);
        if (id === 'invest' || id === 'opex') lab.textContent = '¥' + val.toLocaleString();
        else if (id === 'gp' || id === 'ticket') lab.textContent = id === 'gp' ? val + '%' : '¥' + val;
        else lab.textContent = val;
      });

      var pb = document.getElementById('chart-payback');
      if (pb && window.echarts) {
        if (!reg('chart-payback')) payback(v.invest, Math.max(net, 0));
        else {
          var inst = reg('chart-payback');
          var months = [], cash = [], cum = -v.invest;
          for (var i = 0; i <= 18; i++) { months.push(i + L('月', 'm')); cash.push(Math.round(cum)); cum += Math.max(net, 0); }
          inst.setOption({ xAxis: { data: months }, series: [{ data: cash }] });
        }
      }
    }

    ids.forEach(function (id) {
      var inp = document.getElementById(id);
      if (inp) inp.addEventListener('input', render);
    });
    render();
  }

  /* ---------- boot ---------- */
  function build() {
    ['chart-fleet', 'chart-payback', 'chart-mix', 'chart-sens', 'chart-spots', 'chart-revenue'].forEach(function (id) {
      var inst = reg(id); if (inst) inst.dispose();
    });
    fleet(); profitMix(); sensitivity(); spots(); revenue(); payback(DEF.invest, 19110); calc();
  }

  function boot() {
    if (!window.echarts) { setTimeout(boot, 120); return; }
    build();
    window.addEventListener('langchange', function () { setTimeout(build, 30); });
    window.addEventListener('resize', function () {
      ['chart-fleet', 'chart-payback', 'chart-mix', 'chart-sens', 'chart-spots', 'chart-revenue'].forEach(function (id) {
        var i = reg(id); if (i) i.resize();
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
