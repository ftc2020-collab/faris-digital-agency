/* وكالة فارس الرقمية — سلوكيات مشتركة بكل الصفحات
   ملاحظة: كل منطق "سارة" هنا عرض تجريبي مبسّط (شجرة قرار JavaScript)
   وليس نظامًا حقيقيًا أو نموذج ذكاء اصطناعي — لأغراض النموذج الأولي فقط. */
(function(){
  "use strict";

  /* ----- سنة الفوتر ----- */
  document.querySelectorAll("[data-year]").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  /* ----- قائمة الجوال ----- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  if(navToggle && mainNav){
    navToggle.addEventListener("click", function(){
      mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", mainNav.classList.contains("open"));
    });
    mainNav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ mainNav.classList.remove("open"); });
    });
  }

  /* ----- reveal on scroll ----- */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, {threshold:.15});
    revealEls.forEach(function(el){ io.observe(el); });
  }else{
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }

  /* ----- توست بسيط ----- */
  function showToast(msg){
    var toast = document.querySelector(".toast");
    if(!toast){
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(function(){ toast.classList.add("show"); });
    clearTimeout(toast._t);
    toast._t = setTimeout(function(){ toast.classList.remove("show"); }, 3200);
  }
  window.farisToast = showToast;

  /* ----- عناصر "قريبًا" (صفحات لم تُبنَ بعد) ----- */
  document.querySelectorAll("[data-soon]").forEach(function(el){
    el.addEventListener("click", function(e){
      e.preventDefault();
      showToast(el.getAttribute("data-soon"));
    });
  });

  /* ----- نماذج التواصل/التشخيص (مسار بديل لسارة، نماذج أولية بدون Backend) ----- */
  document.querySelectorAll(".contact-form").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      showToast("تم استلام طلبك (نموذج أولي تجريبي — لا يوجد إرسال فعلي بعد).");
      form.reset();
    });
  });

  /* =====================================================
     ودجة "سارة" — شجرة قرار مبسّطة للعرض فقط
     ===================================================== */
  var saraFab = document.querySelector("[data-sara-open]");
  var saraBackdrop = document.querySelector(".sara-modal-backdrop");
  var saraClose = document.querySelector(".sara-modal-close");
  var saraRestart = document.querySelector(".sara-restart");

  function openSara(prefill){
    if(!saraBackdrop) return;
    saraBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    var prefillBox = saraBackdrop.querySelector(".sara-prefill-box");
    if(prefill){
      var tag = saraBackdrop.querySelector("[data-sara-prefill]");
      if(tag) tag.textContent = prefill;
      if(prefillBox) prefillBox.hidden = false;
    }else if(prefillBox){
      prefillBox.hidden = true;
    }
  }
  function closeSara(){
    if(!saraBackdrop) return;
    saraBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  window.farisOpenSara = openSara;
  window.farisCloseSara = closeSara;

  /* تفويض الحدث بدل الربط المباشر: يشتغل حتى مع عناصر تُضاف لاحقًا للصفحة
     (مثل كروت الحلول التي يرسمها solutions.js ديناميكيًا). */
  document.addEventListener("click", function(e){
    var trigger = e.target.closest("[data-sara-open]");
    if(trigger) openSara(trigger.getAttribute("data-sara-open") || null);
  });
  if(saraClose) saraClose.addEventListener("click", closeSara);
  if(saraBackdrop){
    saraBackdrop.addEventListener("click", function(e){
      if(e.target === saraBackdrop) closeSara();
    });
  }
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape") closeSara();
  });

  /* شجرة القرار: خطوتان بسيطتان ثم توصية بأحد طرق العمل الثلاث
     كل الاستعلامات هنا مقيّدة داخل ودجة سارة الحقيقية (.sara-modal) فقط —
     أي معاينة ثابتة غير تفاعلية بصفحات أخرى (مثل قسم "سارة" بالرئيسية) لا تُمس. */
  var saraRoot = document.querySelector(".sara-modal");
  var saraSteps = saraRoot ? saraRoot.querySelectorAll(".sara-demo-step") : [];
  var saraProgress = saraRoot ? saraRoot.querySelectorAll(".sara-progress span") : [];
  var saraChoice1 = null;

  var recommendations = {
    "مشكلة محددة": {
      way:"حل جاهز",
      text:"يبدو إن عندك مشكلة واضحة ومحددة — مسار «حل جاهز» غالبًا أسرع طريق: تسليم مباشر بدون تعقيد.",
      cta:"استعرض الحلول الجاهزة", href:"solutions.html"
    },
    "قدرة تشغيلية مستمرة": {
      way:"شراكة نمو",
      text:"إذا كنت تحتاج عمل مستمر شهريًا (محتوى، إدارة منصات، دعم تقني) فمسار «شراكة نمو» هو الأنسب.",
      cta:"استعرض باقات شراكة النمو", href:"growth.html"
    },
    "تحول استراتيجي كبير": {
      way:"حل مخصص",
      text:"للتحولات الكبرى نحتاج تشخيصًا أولًا قبل اقتراح أي حل — مسار «حل مخصص» يبدأ بجلسة تشخيص.",
      cta:"اطلب جلسة تشخيص", href:"custom.html#diagnosis"
    }
  };

  if(saraRoot){
    saraRoot.querySelectorAll(".sara-options[data-step='1'] button").forEach(function(btn){
      btn.addEventListener("click", function(){
        saraChoice1 = btn.getAttribute("data-value");
        goToStep(2);
      });
    });

    saraRoot.querySelectorAll(".sara-options[data-step='2'] button").forEach(function(btn){
      btn.addEventListener("click", function(){
        renderSaraResult(btn.getAttribute("data-value"));
        goToStep(3);
      });
    });
  }

  function goToStep(n){
    saraSteps.forEach(function(s){
      s.classList.toggle("active", parseInt(s.getAttribute("data-step"),10) === n);
    });
    saraProgress.forEach(function(p, i){
      p.classList.toggle("done", i < n);
    });
  }

  function renderSaraResult(urgency){
    var key = saraChoice1;
    var rec = recommendations[key] || recommendations["مشكلة محددة"];
    var box = saraRoot ? saraRoot.querySelector(".sara-result") : null;
    if(!box) return;
    box.innerHTML =
      '<span class="badge">توصية أولية: ' + rec.way + '</span>' +
      '<h4>' + rec.text + '</h4>' +
      '<a class="btn btn-primary btn-sm" href="' + rec.href + '">' + rec.cta + '</a>';
  }

  if(saraRestart){
    saraRestart.addEventListener("click", function(){
      saraChoice1 = null;
      goToStep(1);
    });
  }

  /* =====================================================
     Showreel — تبديل تلقائي لخمس مشاهد
     ===================================================== */
  var scenes = document.querySelectorAll(".showreel-scene");
  var dotsWrap = document.querySelector(".showreel-dots");
  if(scenes.length){
    var current = 0;
    scenes.forEach(function(s, i){
      var d = document.createElement("button");
      if(i===0) d.className = "active";
      d.setAttribute("aria-label", "مشهد " + (i+1));
      d.addEventListener("click", function(){ setScene(i); resetTimer(); });
      dotsWrap.appendChild(d);
    });
    function setScene(i){
      scenes[current].classList.remove("active");
      dotsWrap.children[current].classList.remove("active");
      current = i;
      scenes[current].classList.add("active");
      dotsWrap.children[current].classList.add("active");
    }
    var timer;
    function resetTimer(){
      clearInterval(timer);
      timer = setInterval(function(){
        setScene((current+1) % scenes.length);
      }, 4200);
    }
    resetTimer();
  }

})();
