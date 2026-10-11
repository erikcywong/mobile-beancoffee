/* chrome.js — injects floating nav + footer, wires burger, scroll reveal */
(function () {
  var PAGES = [
    { h: 'index.html', zh: '总览', en: 'Overview' },
    {
      zh: '战略', en: 'Strategy',
      kids: [
        { h: 'mobile-cart.html', zh: '移动车优先', en: 'Mobile Cart First', dz: '获客终端 · 现金流单元', de: 'Acquisition terminal · cash engine' },
        { h: 'flagship.html', zh: '固定旗舰店', en: 'Flagship Store', dz: '品牌锚点 · 区域中枢', de: 'Brand anchor · regional hub' },
        { h: 'roadmap.html', zh: '三阶段路线图', en: '3-Phase Roadmap', dz: '0–12 / 12–24 / 24+ 个月', de: '0–12 / 12–24 / 24+ months' }
      ]
    },
    {
      zh: '商业模型', en: 'The Model',
      kids: [
        { h: 'economics.html', zh: '单元经济与测算', en: 'Unit Economics', dz: '回本模型 · 四年预测', de: 'Payback model · 4-yr forecast' },
        { h: 'franchise.html', zh: '加盟与治理', en: 'Franchise & Governance', dz: '谁投什么 · 总部控制点', de: 'Who invests what · HQ control' }
      ]
    },
    { h: 'index.html#conclusion', zh: '结论', en: 'Verdict' }
  ];

  function span(en, zh) { return '<span class="en">' + en + '</span><span class="zh">' + zh + '</span>'; }

  function current() {
    var f = location.pathname.split('/').pop() || 'index.html';
    return f === '' ? 'index.html' : f;
  }

  function buildNav() {
    var cur = current();
    var html = '' +
      '<div class="nav-inner">' +
        '<a class="brand" href="index.html">' +
          '<span class="brand-mark">\u25C6</span>' +
          '<span>' + span('MOBILE BEAN', '移动咖啡车') + '<small>' + span('Aeroponic Coffee GTM', '水培精品咖啡 · 增长路径') + '</small></span>' +
        '</a>' +
        '<nav class="nav-links">';

    PAGES.forEach(function (p) {
      if (!p.kids) {
        var on = cur === p.h.split('#')[0] && p.h.indexOf('#') < 0 ? ' class="on"' : '';
        html += '<div class="nav-item"><a href="' + p.h + '"' + on + '>' + span(p.en, p.zh) + '</a></div>';
      } else {
        var kids = p.kids.map(function (k) { return k.h; });
        var active = kids.indexOf(cur) > -1 ? ' class="on"' : '';
        html += '<div class="nav-item"><a href="javascript:void(0)"' + active + '>' + span(p.en, p.zh) + ' \u25BE</a><div class="drop">';
        p.kids.forEach(function (k) {
          html += '<a href="' + k.h + '"><b>' + span(k.en, k.zh) + '</b><span>' + span(k.de, k.dz) + '</span></a>';
        });
        html += '</div></div>';
      }
    });

    html += '</nav>' +
      '<button class="lang-btn" data-lang-toggle><span data-lang-label>EN</span></button>' +
      '<button class="burger" aria-label="menu">\u2630</button>' +
      '</div>';
    return html;
  }

  function buildFooter() {
    var y = new Date().getFullYear();
    return '<div class="wrap">' +
      '<div class="foot-grid">' +
        '<div>' +
          '<div class="foot-brand">MOBILE BEAN</div>' +
          '<p class="foot-note">' +
            span('Mobile cart as the first customer-acquisition engine and the franchise expansion unit. A very small number of flagship stores as the brand anchor, experience centre and regional hub.',
                 '移动咖啡车做第一获客入口和加盟扩张单元；固定店只做极少量旗舰/区域店，承担品牌锚点、体验中心与区域中枢。') +
          '</p>' +
        '</div>' +
        '<div class="foot-col"><h5>' + span('Strategy', '战略') + '</h5>' +
          '<a href="mobile-cart.html">' + span('Mobile Cart First', '移动车优先') + '</a>' +
          '<a href="flagship.html">' + span('Flagship Store', '固定旗舰店') + '</a>' +
          '<a href="roadmap.html">' + span('3-Phase Roadmap', '三阶段路线图') + '</a>' +
        '</div>' +
        '<div class="foot-col"><h5>' + span('The Model', '商业模型') + '</h5>' +
          '<a href="economics.html">' + span('Unit Economics', '单元经济与测算') + '</a>' +
          '<a href="franchise.html">' + span('Franchise & Governance', '加盟与治理') + '</a>' +
        '</div>' +
        '<div class="foot-col"><h5>' + span('Contact', '联系') + '</h5>' +
          '<a href="mailto:erik.wong@napell.bio">erik.wong@napell.bio</a>' +
          '<a href="index.html#conclusion">' + span('The Verdict', '一句话结论') + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="foot-bottom">' +
        '<span>\u00A9 ' + y + ' MOBILE BEAN · NAPELL BIO</span>' +
        '<span>' + span('Spear · Flag · Granary — mobile carts acquire, flagships anchor, grow pods and roasteries supply.',
                        '矛 · 旗 · 粮仓 —— 移动车获客，旗舰店立牌，种植舱与烘焙中心供粮。') + '</span>' +
      '</div>' +
    '</div>';
  }

  function init() {
    var nav = document.querySelector('.nav');
    if (nav) nav.innerHTML = buildNav();
    var ft = document.querySelector('footer');
    if (ft) ft.innerHTML = buildFooter();

    var burger = document.querySelector('.burger');
    if (burger) burger.addEventListener('click', function () { nav.classList.toggle('open'); });

    // reveal on scroll
    var items = document.querySelectorAll('.rv');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
      items.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
        io.observe(el);
      });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
