/* صفحة الحلول — عرض وفلترة الحلول الجاهزة من بيانات الكتالوج الرسمي */
(function(){
  "use strict";
  var data = window.FARIS_SERVICES || [];
  var grid = document.querySelector("#solutions-grid");
  var trackSelect = document.querySelector("#filter-track");
  var priceSelect = document.querySelector("#filter-price");
  var sortSelect = document.querySelector("#filter-sort");
  var searchInput = document.querySelector("#filter-search");
  var resetBtn = document.querySelector("#filter-reset");
  var countEl = document.querySelector("#results-count");
  var emptyEl = document.querySelector("#catalog-empty");
  if(!grid) return;

  var priceBands = {
    "": function(){ return true; },
    "0-200": function(p){ return p < 200; },
    "200-500": function(p){ return p >= 200 && p <= 500; },
    "500-1500": function(p){ return p > 500 && p <= 1500; },
    "1500-3000": function(p){ return p > 1500 && p <= 3000; },
    "3000+": function(p){ return p > 3000; }
  };

  /* تعبئة قائمة المسارات من البيانات نفسها */
  var tracks = Array.from(new Set(data.map(function(s){ return s.track; })));
  tracks.forEach(function(t){
    var opt = document.createElement("option");
    opt.value = t; opt.textContent = t;
    trackSelect.appendChild(opt);
  });

  function currency(n){
    return n.toLocaleString("ar-SA") + " ر.س";
  }

  function cardTemplate(s){
    return (
      '<article class="solution-card reveal in">' +
        '<span class="track-tag">' + s.track + '</span>' +
        '<h3>' + s.name + '</h3>' +
        '<p class="promise">' + s.promise + '</p>' +
        '<div class="meta-row">' +
          '<span>⏱ ' + s.sla + '</span>' +
          '<span class="price">' + currency(s.price) + '</span>' +
        '</div>' +
        '<button class="btn btn-primary" data-sara-open="' + s.name.replace(/"/g,'&quot;') + '">' + (s.cta || "اطلب الآن") + '</button>' +
      '</article>'
    );
  }

  function applyFilters(){
    var track = trackSelect.value;
    var band = priceSelect.value;
    var query = (searchInput.value || "").trim().toLowerCase();
    var sort = sortSelect.value;

    var filtered = data.filter(function(s){
      var matchTrack = !track || s.track === track;
      var matchPrice = priceBands[band](s.price);
      var matchQuery = !query ||
        s.name.toLowerCase().indexOf(query) !== -1 ||
        s.promise.toLowerCase().indexOf(query) !== -1 ||
        s.track.toLowerCase().indexOf(query) !== -1;
      return matchTrack && matchPrice && matchQuery;
    });

    if(sort === "price-asc") filtered.sort(function(a,b){ return a.price - b.price; });
    if(sort === "price-desc") filtered.sort(function(a,b){ return b.price - a.price; });

    grid.innerHTML = filtered.map(cardTemplate).join("");
    countEl.textContent = filtered.length ? ("عرض " + filtered.length + " حلًا من أصل " + data.length) : "";
    emptyEl.classList.toggle("show", filtered.length === 0);
    /* أزرار "اطلب الآن" بالكروت تحمل data-sara-open وتُفتح تلقائيًا عبر
       تفويض الحدث في main.js — لا حاجة لإعادة ربطها هنا بعد كل رسم. */
  }

  [trackSelect, priceSelect, sortSelect].forEach(function(el){
    el.addEventListener("change", applyFilters);
  });
  searchInput.addEventListener("input", debounce(applyFilters, 200));
  resetBtn.addEventListener("click", function(){
    trackSelect.value = ""; priceSelect.value = ""; sortSelect.value = "";
    searchInput.value = "";
    applyFilters();
  });

  function debounce(fn, wait){
    var t;
    return function(){
      clearTimeout(t);
      var args = arguments;
      t = setTimeout(function(){ fn.apply(null, args); }, wait);
    };
  }

  /* عدّاد ضمن شريحة اختيار سريع (فئات المسارات) */
  var pillRow = document.querySelector("#track-pills");
  if(pillRow){
    var allPill = document.createElement("button");
    allPill.className = "pill active"; allPill.textContent = "الكل";
    pillRow.appendChild(allPill);
    allPill.addEventListener("click", function(){ selectPill(allPill, ""); });
    tracks.forEach(function(t){
      var p = document.createElement("button");
      p.className = "pill"; p.textContent = t;
      p.addEventListener("click", function(){ selectPill(p, t); });
      pillRow.appendChild(p);
    });
  }
  function selectPill(el, value){
    pillRow.querySelectorAll(".pill").forEach(function(p){ p.classList.remove("active"); });
    el.classList.add("active");
    trackSelect.value = value;
    applyFilters();
  }

  applyFilters();
})();
