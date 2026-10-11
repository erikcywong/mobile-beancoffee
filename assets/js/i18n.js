/* i18n — EN / 中文 toggle, X.com-style chrome
   Pairs use <span class="en">…</span><span class="zh">…</span>
   Persists to localStorage key: mb_lang  */
(function () {
  var KEY = 'mb_lang';
  var TITLE = {
    zh: '移动咖啡车 · 商业模式与扩张路径',
    en: 'Mobile Bean · Business Model & Expansion Path'
  };

  function get() {
    try { return localStorage.getItem(KEY) || 'zh'; } catch (e) { return 'zh'; }
  }

  function apply(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    var label = document.querySelector('[data-lang-label]');
    if (label) label.textContent = lang === 'zh' ? 'EN' : '中文';
    var title = document.querySelector('[data-page-title]');
    if (title) {
      var zh = title.getAttribute('data-zh') || '';
      var en = title.getAttribute('data-en') || '';
      document.title = (lang === 'zh' ? zh : en) + ' · ' + (lang === 'zh' ? 'MOBILE BEAN' : 'MOBILE BEAN');
    }
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  window.MB_LANG = get;
  window.MB_SET_LANG = apply;

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-lang-toggle]');
    if (!t) return;
    e.preventDefault();
    apply(get() === 'zh' ? 'en' : 'zh');
  });

  // apply as early as possible to avoid flash
  document.documentElement.setAttribute('data-lang', get());
  document.addEventListener('DOMContentLoaded', function () { apply(get()); });

  // expose title map for pages that want it
  window.MB_TITLE = TITLE;
})();
