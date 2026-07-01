/* Xunmu Wu OpenSeadragon direct-hires viewer. */
(function () {
  'use strict';

  var works = [];
  var currentIndex = 0;
  var osd = null;
  var homeZoom = 1;
  var assetVersion = 'osd-direct-hires-20260701-v5';

  function getLang() {
    var pageLang = (document.documentElement.lang || '').toLowerCase();
    if (pageLang.indexOf('zh') === 0) return 'zh';
    if (pageLang.indexOf('en') === 0) return 'en';

    var savedLang = localStorage.getItem('aether_lang');
    if (savedLang === 'zh' || savedLang === 'en') return savedLang;

    var browserLangs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || navigator.userLanguage || ''])
      .filter(Boolean)
      .map(function (lang) { return String(lang).toLowerCase(); });
    return browserLangs.some(function (lang) { return lang.indexOf('zh') === 0; }) ? 'zh' : 'en';
  }

  function isZh() {
    return getLang().indexOf('zh') === 0;
  }

  function text(key) {
    var zh = isZh();
    var labels = {
      back: zh ? '\u2039 \u8fd4\u56de\u4f5c\u54c1\u9875\u9762' : '\u2039 Back to artworks',
      backLabel: zh ? '\u8fd4\u56de\u4f5c\u54c1\u9875\u9762' : 'Back to artworks',
      close: zh ? '\u5173\u95ed' : 'Close',
      previous: zh ? '\u4e0a\u4e00\u4ef6\u4f5c\u54c1' : 'Previous artwork',
      next: zh ? '\u4e0b\u4e00\u4ef6\u4f5c\u54c1' : 'Next artwork',
      zoomIn: zh ? '\u653e\u5927' : 'Zoom in',
      zoomOut: zh ? '\u7f29\u5c0f' : 'Zoom out',
      resetZoom: zh ? '\u91cd\u7f6e\u7f29\u653e' : 'Reset zoom',
      loading: zh ? '\u9ad8\u6e05\u52a0\u8f7d\u4e2d' : 'Loading high-resolution image',
      loaded: zh ? '\u9ad8\u6e05\u5df2\u52a0\u8f7d' : 'High-resolution image loaded',
      viewerFailed: zh ? '\u9ad8\u6e05\u67e5\u770b\u5668\u52a0\u8f7d\u5931\u8d25' : 'High-resolution viewer failed to load',
      imageFailed: zh ? '\u9ad8\u6e05\u56fe\u52a0\u8f7d\u5931\u8d25' : 'High-resolution image failed to load'
    };
    return labels[key] || '';
  }

  function makeOverlay() {
    if (document.getElementById('xwOsdViewer')) return;

    var overlay = document.createElement('div');
    overlay.id = 'xwOsdViewer';
    overlay.className = 'xw-osd-viewer';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = [
      '<button type="button" class="xw-osd-back" id="xwOsdBack" aria-label="Back to artworks">\u2039 Back to artworks</button>',
      '<button type="button" class="xw-osd-close" id="xwOsdClose" aria-label="Close">\u00d7</button>',
      '<button type="button" class="xw-osd-nav xw-osd-prev" id="xwOsdPrev" aria-label="Previous artwork">\u2039</button>',
      '<div id="xwOsdCanvas" class="xw-osd-canvas"></div>',
      '<button type="button" class="xw-osd-nav xw-osd-next" id="xwOsdNext" aria-label="Next artwork">\u203a</button>',
      '<div class="xw-osd-caption">',
        '<div class="xw-osd-number" id="xwOsdNumber"></div>',
        '<div class="xw-osd-title" id="xwOsdTitle"></div>',
        '<div class="xw-osd-meta" id="xwOsdMeta"></div>',
        '<div class="xw-osd-status" id="xwOsdStatus"></div>',
      '</div>',
      '<div class="xw-osd-controls">',
        '<button type="button" id="xwOsdZoomOut" aria-label="Zoom out">\u2212</button>',
        '<button type="button" id="xwOsdZoomLabel" aria-label="Reset zoom">100%</button>',
        '<button type="button" id="xwOsdZoomIn" aria-label="Zoom in">+</button>',
      '</div>'
    ].join('');

    document.body.appendChild(overlay);
    applyViewerLanguage();

    document.getElementById('xwOsdBack').addEventListener('click', closeViewer);
    document.getElementById('xwOsdClose').addEventListener('click', closeViewer);
    document.getElementById('xwOsdPrev').addEventListener('click', function () { move(-1); });
    document.getElementById('xwOsdNext').addEventListener('click', function () { move(1); });
    document.getElementById('xwOsdZoomIn').addEventListener('click', function () {
      if (osd) osd.viewport.zoomBy(1.35), osd.viewport.applyConstraints();
    });
    document.getElementById('xwOsdZoomOut').addEventListener('click', function () {
      if (osd) osd.viewport.zoomBy(0.74), osd.viewport.applyConstraints();
    });
    document.getElementById('xwOsdZoomLabel').addEventListener('click', resetToHome);

    window.addEventListener('keydown', function (e) {
      var open = overlay.classList.contains('is-open');
      if (!open) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === '+' || e.key === '=') {
        if (osd) osd.viewport.zoomBy(1.35), osd.viewport.applyConstraints();
      }
      if (e.key === '-') {
        if (osd) osd.viewport.zoomBy(0.74), osd.viewport.applyConstraints();
      }
    });
  }

  function applyViewerLanguage() {
    var back = document.getElementById('xwOsdBack');
    var close = document.getElementById('xwOsdClose');
    var prev = document.getElementById('xwOsdPrev');
    var next = document.getElementById('xwOsdNext');
    var zoomOut = document.getElementById('xwOsdZoomOut');
    var zoomLabel = document.getElementById('xwOsdZoomLabel');
    var zoomIn = document.getElementById('xwOsdZoomIn');

    if (back) {
      back.textContent = text('back');
      back.setAttribute('aria-label', text('backLabel'));
    }
    if (close) close.setAttribute('aria-label', text('close'));
    if (prev) prev.setAttribute('aria-label', text('previous'));
    if (next) next.setAttribute('aria-label', text('next'));
    if (zoomOut) zoomOut.setAttribute('aria-label', text('zoomOut'));
    if (zoomLabel) zoomLabel.setAttribute('aria-label', text('resetZoom'));
    if (zoomIn) zoomIn.setAttribute('aria-label', text('zoomIn'));
  }

  function status(message) {
    var el = document.getElementById('xwOsdStatus');
    if (el) el.textContent = message || '';
  }

  function updateZoomLabel() {
    var label = document.getElementById('xwOsdZoomLabel');
    if (!label || !osd || !osd.viewport) return;
    var ratio = osd.viewport.getZoom(true) / (homeZoom || 1);
    label.textContent = Math.round(ratio * 100) + '%';
  }

  function getDetailZoom() {
    if (!osd || !osd.viewport || !osd.world || !osd.world.getItemCount()) return homeZoom * 3;

    var canvas = document.getElementById('xwOsdCanvas');
    var viewportAspect = canvas && canvas.clientHeight
      ? canvas.clientWidth / canvas.clientHeight
      : 0.5;
    var item = osd.world.getItemAt(0);
    var size = item && item.getContentSize ? item.getContentSize() : null;
    var imageAspect = size && size.y ? size.x / size.y : 2.9;

    var heightFillRatio = imageAspect / Math.max(0.35, viewportAspect);
    var targetRatio = Math.max(2.6, Math.min(4.2, heightFillRatio * 0.72));
    return homeZoom * targetRatio;
  }

  function resetToHome() {
    if (!osd || !osd.viewport) return;
    osd.viewport.goHome(false);
    osd.viewport.applyConstraints();
    updateZoomLabel();
  }

  function setCaption(w, index) {
    var zh = isZh();
    var title = zh ? (w.title_zh || w.title_en) : (w.title_en || w.title_zh);
    var artist = zh ? (w.artist_zh || '\u5434\u8bad\u6728') : (w.artist_en || 'Xunmu Wu');
    var medium = zh ? (w.medium_zh || '') : (w.medium_en || '');
    var meta = [artist, medium, w.dimensions_cm || '', w.year || ''].filter(Boolean).join(' \u00b7 ');

    document.getElementById('xwOsdNumber').textContent = w.catalog_number || String(index + 1).padStart(3, '0');
    document.getElementById('xwOsdTitle').textContent = title;
    document.getElementById('xwOsdMeta').textContent = meta;
  }

  function openViewer(index) {
    works = window.__artworkViewerWorks || works || [];
    if (!works.length) return;

    makeOverlay();
    applyViewerLanguage();
    currentIndex = index;
    var w = works[currentIndex];
    var hires = w.hires_image || w.image;

    var overlay = document.getElementById('xwOsdViewer');
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('xw-osd-open');
    document.body.classList.add('xw-osd-open');

    setCaption(w, currentIndex);
    status(text('loading'));

    if (typeof OpenSeadragon !== 'function') {
      status(text('viewerFailed'));
      return;
    }

    if (osd) {
      osd.destroy();
      osd = null;
    }

    document.getElementById('xwOsdCanvas').innerHTML = '';

    osd = OpenSeadragon({
      id: 'xwOsdCanvas',
      prefixUrl: 'js/vendor/openseadragon-images/',
      showNavigationControl: false,
      showHomeControl: false,
      showFullPageControl: false,
      showZoomControl: false,
      showNavigator: false,
      animationTime: 0.28,
      blendTime: 0,
      maxZoomPixelRatio: 5,
      minZoomImageRatio: 0.85,
      visibilityRatio: 0.92,
      constrainDuringPan: true,
      gestureSettingsMouse: {
        scrollToZoom: true,
        clickToZoom: false,
        dblClickToZoom: true,
        dragToPan: true
      },
      gestureSettingsTouch: {
        pinchToZoom: true,
        flickEnabled: true,
        clickToZoom: false,
        dblClickToZoom: true,
        dragToPan: true
      },
      tileSources: {
        type: 'image',
        url: hires + (hires.indexOf('?') === -1 ? '?v=' + assetVersion : '&v=' + assetVersion)
      }
    });

    osd.addHandler('open', function () {
      homeZoom = osd.viewport.getHomeZoom();
      osd.viewport.goHome(true);
      updateZoomLabel();
      status(text('loaded'));
      setTimeout(function () {
        var s = document.getElementById('xwOsdStatus');
        if (s && s.textContent === text('loaded')) s.textContent = '';
      }, 1400);
    });

    osd.addHandler('animation', updateZoomLabel);
    osd.addHandler('zoom', updateZoomLabel);
    osd.addHandler('pan', updateZoomLabel);

    osd.addHandler('canvas-double-click', function (event) {
      event.preventDefaultAction = true;
      var current = osd.viewport.getZoom(true);
      if (current / homeZoom > 1.18) {
        resetToHome();
        return;
      }

      var target = getDetailZoom();
      var refPoint = osd.viewport.pointFromPixel(event.position, true);
      osd.viewport.zoomTo(target, refPoint, false);
      osd.viewport.applyConstraints();
      updateZoomLabel();
    });

    osd.addHandler('open-failed', function () {
      status(text('imageFailed'));
    });
  }

  function closeViewer() {
    var overlay = document.getElementById('xwOsdViewer');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('xw-osd-open');
    document.body.classList.remove('xw-osd-open');
    if (osd) {
      osd.destroy();
      osd = null;
    }
  }

  function move(delta) {
    works = window.__artworkViewerWorks || works || [];
    if (!works.length) return;
    currentIndex = (currentIndex + delta + works.length) % works.length;
    openViewer(currentIndex);
  }

  function installInterception() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.artwork-viewer-trigger');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openViewer(Number(btn.dataset.workIndex || 0));
    }, true);
  }

  function waitForWorks() {
    if (document.querySelector('.artwork-viewer-trigger')) {
      installInterception();
      return;
    }
    setTimeout(waitForWorks, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForWorks);
  } else {
    waitForWorks();
  }
})();
