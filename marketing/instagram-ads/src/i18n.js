// Двуязычные креативы: словарь лежит в <script type="application/json" id="i18n">{"kk":{...},"ru":{...}}</script>.
// Язык берётся из ?lang=kk|ru (по умолчанию kk — казахский основной). Разметка: <h1 data-i="h1"></h1>;
// в словаре допустимы <b>, <br>, <span class="hl">. В JS (видео): t('ключ').
(function () {
  var q = new URLSearchParams(location.search);
  var lang = q.get("lang") === "ru" ? "ru" : "kk";
  window.LANG = lang;
  document.documentElement.lang = lang;
  document.body.classList.add("lang-" + lang);
  var el = document.getElementById("i18n");
  var dict = {};
  try { dict = el ? JSON.parse(el.textContent) : {}; } catch (e) { console.error("i18n JSON error", e); }
  window.DICT = dict;
  window.t = function (k) { var d = dict[lang]; return d && d[k] !== undefined ? d[k] : ""; };
  var missing = [];
  document.querySelectorAll("[data-i]").forEach(function (n) {
    var k = n.getAttribute("data-i");
    if (!window.t(k)) missing.push(k);
    n.innerHTML = window.t(k);
  });
  // ключи, которые есть только на одном языке
  var kk = Object.keys(dict.kk || {}), ru = Object.keys(dict.ru || {});
  kk.forEach(function (k) { if (ru.indexOf(k) < 0) missing.push("ru:" + k); });
  ru.forEach(function (k) { if (kk.indexOf(k) < 0) missing.push("kk:" + k); });
  window.__missing = missing;
})();
