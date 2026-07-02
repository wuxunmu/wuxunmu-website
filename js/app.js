const VIEWER_VERSION = 'direct-hires-v9';
const I18N = {
  en: {
    brand: 'XUNMU WU', digital_archive: 'Digital Archive', footer_archive: 'XUNMU WU DIGITAL ARCHIVE',
    nav_home: 'Home', nav_artist: 'The Artist', nav_artworks: 'Artworks', nav_writing: 'Writing', nav_exhibitions: 'Exhibitions', nav_studio: 'Studio', nav_texts: 'Literature', nav_contact: 'Contact',
    footer_note: 'A growing archive of painting, writing and thought.',
    enter_archive: 'Art Archive', journey_soon: 'Curated Journey · Coming Soon',
    artist_title: 'The Artist', exhibitions_title: 'Exhibitions', exhibitions_lead: '',
    solo: 'Solo Exhibitions', group: 'Group Exhibitions', fair: 'Art Fairs', complete_cv: 'Complete CV', complete_cv_note: 'Complete exhibition history, awards and art fair records will be available in the downloadable CV.', download_cv_soon: 'Download Complete CV · Coming Soon', read_full_statement: 'Read Full Statement →', back_to_artist: 'Back to The Artist →',
    texts_title: 'Literature', texts_lead: '', back_to_texts: 'Back to Literature →', writing_title: 'Writing', read_full_text: 'Read Full Text →', back_to_writing: 'Back to Writing →', contents: 'Contents', previous_chapter: 'Previous Chapter', next_chapter: 'Next Chapter', back_to_contents: 'Back to Contents', read: 'Read →',
    artworks_title: 'Artworks', artworks_lead: '', selected_works_eyebrow: '', selected_works_title: 'Selected Works', selected_works_lead: '',
    artwork_series_link: 'Thresholds of Time and Space', more_works_link: 'More Works',
    current_series_label: 'Current Series',
    artwork_series_intro: 'Thresholds of Time and Space is a nine-painting cycle exploring the evolution of life, civilization, and the spiritual dimensions of time and space.',
    more_works_title: 'More Works', more_works_note: 'Additional works will be added to this section.',
    contact_title: 'Contact', studio_title: 'Studio', biography: 'Biography', timeline: 'Timeline', cv: 'CV', artist_statement: 'Artist Statement'
  },
  zh: {
    brand: '吴训木', digital_archive: '数字档案', footer_archive: '吴训木数字档案',
    nav_home: '首页', nav_artist: '艺术家', nav_artworks: '作品', nav_writing: '写作', nav_exhibitions: '展览', nav_studio: '创作现场', nav_texts: '文献', nav_contact: '联系',
    footer_note: '一个持续生长的绘画、文字与思想档案。',
    enter_archive: '艺术档案', journey_soon: '策展之旅 · 即将推出',
    artist_title: '艺术家', exhibitions_title: '展览', exhibitions_lead: '',
    solo: '个展', group: '群展', fair: '艺术博览会', complete_cv: '完整艺术履历', complete_cv_note: '完整展览履历、获奖与艺博会记录将收录于可下载的完整 CV。', download_cv_soon: '下载完整履历 · 即将提供', read_full_statement: '阅读全文 →', back_to_artist: '返回艺术家 →',
    texts_title: '文献', texts_lead: '', back_to_texts: '返回文献 →', writing_title: '写作', read_full_text: '阅读全文 →', back_to_writing: '返回写作 →', contents: '目录', previous_chapter: '上一章', next_chapter: '下一章', back_to_contents: '返回目录', read: '阅读 →',
    artworks_title: '\u4f5c\u54c1', artworks_lead: '', selected_works_eyebrow: '', selected_works_title: '\u4ee3\u8868\u4f5c\u54c1', selected_works_lead: '',
    artwork_series_link: '\u65f6\u7a7a\u96a7\u9053\u7cfb\u5217', more_works_link: '\u66f4\u591a\u4f5c\u54c1',
    current_series_label: '\u5f53\u524d\u7cfb\u5217',
    artwork_series_intro: '\u65f6\u7a7a\u96a7\u9053\u7cfb\u5217\u662f\u4e00\u7ec4\u7531\u4e5d\u5e45\u753b\u4f5c\u6784\u6210\u7684\u7cfb\u5217\u4f5c\u54c1\uff0c\u65e8\u5728\u63a2\u7d22\u751f\u547d\u4e0e\u6587\u660e\u7684\u6f14\u53d8\uff0c\u4ee5\u53ca\u65f6\u7a7a\u7684\u7cbe\u795e\u7ef4\u5ea6\u3002',
    more_works_title: '\u66f4\u591a\u4f5c\u54c1', more_works_note: '\u66f4\u591a\u4f5c\u54c1\u5c06\u7ee7\u7eed\u6574\u7406\u5e76\u653e\u5165\u8fd9\u4e2a\u9875\u9762\u3002',
    contact_title: '联系', studio_title: '创作现场', biography: '简介', timeline: '时间轴', cv: '完整艺术履历', artist_statement: '艺术家自述'
  }
};

let DATA = {};

const LANG_STORAGE_KEY = 'aether_lang';

function detectBrowserLang() {
  const browserLangs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || navigator.userLanguage || ''])
    .filter(Boolean)
    .map(lang => String(lang).toLowerCase());

  return browserLangs.some(lang => lang.startsWith('zh')) ? 'zh' : 'en';
}

function getLang() {
  return localStorage.getItem(LANG_STORAGE_KEY) || detectBrowserLang();
}

function pick(obj, lang) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || obj.zh || '';
}

function paragraphs(text) {
  return (text || '')
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

async function loadJSON(path) {
  try {
    const r = await fetch(path);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    console.warn('Could not load', path, e);
    return null;
  }
}

async function init() {
  DATA.artist = await loadJSON('data/artist.json');
  DATA.exhibitions = await loadJSON('data/exhibitions.json');
  DATA.exhibitionPhotos = await loadJSON('data/exhibition_photos.json');
  DATA.texts = await loadJSON('data/texts.json');
  DATA.writing = await loadJSON('data/writing.json');
  DATA.artworks = await loadJSON('data/artworks.json');
  DATA.contact = await loadJSON('data/contact.json');
  DATA.studio = await loadJSON('data/studio.json');

  normalizeData();
  renderPage();
  applyLang(getLang());

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => setLang(getLang() === 'en' ? 'zh' : 'en'));
  }
}

function setLang(lang) {
  const y = window.scrollY;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  applyLang(lang);
  requestAnimationFrame(() => window.scrollTo(0, y));
}

function applyLang(lang) {
  document.body.classList.toggle('zh', lang === 'zh');
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = I18N[lang]?.[el.dataset.i18n];
    if (value) el.textContent = value;
  });

  document.querySelectorAll('[data-href-en][data-href-zh]').forEach(el => {
    el.setAttribute('href', lang === 'zh' ? el.dataset.hrefZh : el.dataset.hrefEn);
  });

  document.querySelectorAll('[data-content]').forEach(el => {
    const [root, key] = el.dataset.content.split('.');
    el.textContent = pick(DATA[root]?.[key], lang);
  });

  document.querySelectorAll('[data-rich]').forEach(el => {
    const [root, key] = el.dataset.rich.split('.');
    el.innerHTML = paragraphs(pick(DATA[root]?.[key], lang));
  });

  renderDynamic(lang);

  const langToggle = document.getElementById('langToggle');
  if (langToggle) langToggle.textContent = lang === 'en' ? 'ZH' : 'EN';

  document.documentElement.classList.remove('prelang-en', 'prelang-zh');
  document.documentElement.classList.add('lang-ready');
}

function normalizeData() {
  // Be tolerant of data files exported with translated/Chinese top-level keys.
  if (DATA.artworks && !DATA.artworks.works) {
    DATA.artworks.works = DATA.artworks.works || DATA.artworks.items || DATA.artworks['作品'] || DATA.artworks['artworks'] || [];
  }
  if (DATA.texts && !DATA.texts.items) {
    DATA.texts.items = DATA.texts.items || DATA.texts['文献'] || DATA.texts['texts'] || [];
  }
  if (DATA.writing && !DATA.writing.items) {
    DATA.writing.items = DATA.writing.items || DATA.writing['写作'] || DATA.writing['writing'] || [];
  }
  if (DATA.studio && !DATA.studio.items) {
    DATA.studio.items = DATA.studio.items || DATA.studio['创作现场'] || DATA.studio['studio'] || DATA.studio['images'] || [];
  }
  if (DATA.exhibitionPhotos && !DATA.exhibitionPhotos.items) {
    DATA.exhibitionPhotos.items = DATA.exhibitionPhotos.items || DATA.exhibitionPhotos['展览照片'] || DATA.exhibitionPhotos['photos'] || [];
  }
}

function renderPage() {
  // Render by page filename when possible, but also render by target element IDs.
  // This prevents empty pages if a browser, link, or translated filename differs from the expected English filename.
  const page = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  if (page === 'artist.html' || document.getElementById('timeline') || document.getElementById('statementPreview')) renderArtist();
  if (page === 'exhibitions.html' || document.getElementById('soloList') || document.getElementById('exhibitionGallery')) renderExhibitions();
  if (page === 'texts.html' || document.getElementById('textsList') || document.getElementById('textOverview')) renderTexts();
  if (page === 'writing.html' || document.getElementById('writingList')) renderWriting();
  if (page === 'writing-text.html') renderWritingDetail();
  if (page === 'writing-book.html' || document.getElementById('bookContents')) renderWritingBook();
  if (page === 'writing-chapter.html' || document.getElementById('chapterBody')) renderWritingChapter();
  if (page === 'text.html' || document.getElementById('textDetail')) renderTextDetail();
  if (page === 'statement.html' || document.getElementById('statementBackLink')) renderStatementPage();
  if (page === 'artworks.html' || document.getElementById('selectedWorks')) renderArtworks();
  if (page === 'studio.html' || document.getElementById('studioGallery')) renderStudio();
  if (page === 'contact.html' || document.getElementById('emailLink')) renderContact();
}

function renderArtist() {
  const tl = document.getElementById('timeline');
  if (tl && DATA.artist?.timeline) {
    tl.innerHTML = DATA.artist.timeline.map(item => `
      <div class="timeline-item">
        <div class="timeline-year">${item.year}</div>
        <div data-en="${escapeHtml(item.en)}" data-zh="${escapeHtml(item.zh)}"></div>
      </div>
    `).join('');
  }

  const preview = document.getElementById('statementPreview');
  if (preview && (DATA.artist?.statement_preview || DATA.artist?.statement)) {
    const source = DATA.artist.statement_preview || {
      en: excerptText(DATA.artist.statement.en, 3),
      zh: excerptText(DATA.artist.statement.zh, 3)
    };
    preview.setAttribute('data-en', escapeHtml(source.en));
    preview.setAttribute('data-zh', escapeHtml(source.zh));
    preview.classList.add('text-body');
  }
}

function eventHTML(e) {
  return `
    <div class="event">
      <div class="event-year">${e.year || ''}</div>
      <div>
        <div class="event-title" data-en="${escapeHtml(e.title_en)}" data-zh="${escapeHtml(e.title_zh)}"></div>
        <div class="event-meta" data-en="${escapeHtml((e.date_en || '') + ' · ' + (e.venue_en || ''))}" data-zh="${escapeHtml((e.date_zh || '') + ' · ' + (e.venue_zh || ''))}"></div>
      </div>
    </div>
  `;
}

function renderExhibitions() {
  if (!DATA.exhibitions) return;
  const el = document.getElementById('soloList');
  if (el) el.innerHTML = (DATA.exhibitions.solo || []).map(eventHTML).join('');

  const gallery = document.getElementById('exhibitionGallery');
  if (gallery && DATA.exhibitionPhotos?.items) {
    gallery.innerHTML = DATA.exhibitionPhotos.items.map((item, index) => `
      <article class="exhibition-frame" id="exhibition-photo-${String(index + 1).padStart(2, '0')}">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt_en || 'Xunmu Wu exhibition scene')}" loading="lazy">
      </article>
    `).join('');
  }
}

function getTextHref(item) {
  if (!item) return 'texts.html';
  if (item.id === 'statement') return 'statement.html?from=texts';
  return `text.html?id=${encodeURIComponent(item.id)}&from=texts`;
}



function getWritingHref(item) {
  if (!item) return 'writing.html';
  return `writing-book.html?id=${encodeURIComponent(item.id)}`;
}

function getWritingChapterHref(book, chapter) {
  return `writing-chapter.html?book=${encodeURIComponent(book.id)}&chapter=${encodeURIComponent(chapter.id)}`;
}

function renderWriting() {
  const el = document.getElementById('writingList');
  if (!el || !DATA.writing?.items) return;
  el.innerHTML = DATA.writing.items.map(item => `
    <article class="writing-preview" id="writing-${escapeHtml(item.id)}">
      <h2><a class="writing-title-link" href="${escapeHtml(getWritingHref(item))}" data-en="${escapeHtml(item.title_en)}" data-zh="${escapeHtml(item.title_zh)}"></a></h2>
      <div class="writing-year">${escapeHtml(item.year || '')}</div>
      <div class="text-body writing-excerpt" data-en="${escapeHtml(item.preview_en || '')}" data-zh="${escapeHtml(item.preview_zh || '')}"></div>
      <a class="read-link" href="${escapeHtml(getWritingHref(item))}" data-i18n="read"></a>
    </article>
  `).join('');
}

function renderWritingBook() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'mending-the-fire';
  const book = DATA.writing?.items?.find(x => x.id === id) || DATA.writing?.items?.[0];
  const title = document.getElementById('bookTitle');
  const year = document.getElementById('bookYear');
  const contents = document.getElementById('bookContents');
  if (!book) return;
  if (title) {
    title.setAttribute('data-en', escapeHtml(book.title_en));
    title.setAttribute('data-zh', escapeHtml(book.title_zh));
  }
  if (year) year.textContent = book.year || '';
  if (contents) {
    contents.innerHTML = (book.chapters || []).map(ch => `
      <a class="chapter-row" href="${escapeHtml(getWritingChapterHref(book, ch))}">
        <span class="chapter-number">${escapeHtml(ch.number || '')}</span>
        <span class="chapter-title" data-en="${escapeHtml(ch.title_en)}" data-zh="${escapeHtml(ch.title_zh)}"></span>
        <span class="chapter-arrow">→</span>
      </a>
    `).join('');
  }
}

function renderWritingChapter() {
  const params = new URLSearchParams(location.search);
  const bookId = params.get('book') || 'mending-the-fire';
  const chapterId = params.get('chapter') || '';
  const book = DATA.writing?.items?.find(x => x.id === bookId) || DATA.writing?.items?.[0];
  if (!book) return;
  const chapters = book.chapters || [];
  let index = chapters.findIndex(x => x.id === chapterId);
  if (index < 0) index = 0;
  const chapter = chapters[index];
  const bookTitle = document.getElementById('chapterBookTitle');
  const chapterNo = document.getElementById('chapterNumber');
  const chapterTitle = document.getElementById('chapterTitle');
  const body = document.getElementById('chapterBody');
  const contents = document.getElementById('chapterContents');
  const prev = document.getElementById('prevChapter');
  const next = document.getElementById('nextChapter');
  const back = document.getElementById('chapterBackToContents');
  const backBottom = document.getElementById('chapterBackBottom');
  if (bookTitle) {
    bookTitle.setAttribute('data-en', escapeHtml(book.title_en));
    bookTitle.setAttribute('data-zh', escapeHtml(book.title_zh));
  }
  if (chapterNo) chapterNo.textContent = chapter.number || String(index + 1).padStart(2, '0');
  if (chapterTitle) {
    chapterTitle.setAttribute('data-en', escapeHtml(chapter.title_en));
    chapterTitle.setAttribute('data-zh', escapeHtml(chapter.title_zh));
  }
  if (body) {
    body.setAttribute('data-en', escapeHtml(chapter.content_en));
    body.setAttribute('data-zh', escapeHtml(chapter.content_zh));
    body.classList.add('text-body');
  }
  if (contents) {
    contents.innerHTML = chapters.map((ch, i) => `
      <a class="contents-link ${i === index ? 'active' : ''}" href="${escapeHtml(getWritingChapterHref(book, ch))}">
        <span>${escapeHtml(ch.number || String(i + 1).padStart(2, '0'))}</span>
        <span data-en="${escapeHtml(ch.title_en)}" data-zh="${escapeHtml(ch.title_zh)}"></span>
      </a>
    `).join('');
  }
  if (back) back.href = `writing-book.html?id=${encodeURIComponent(book.id)}`;
  if (backBottom) backBottom.href = `writing-book.html?id=${encodeURIComponent(book.id)}`;
  if (prev) {
    if (index > 0) {
      prev.href = getWritingChapterHref(book, chapters[index - 1]);
      prev.classList.remove('disabled');
    } else {
      prev.href = `writing-book.html?id=${encodeURIComponent(book.id)}`;
      prev.classList.add('disabled');
    }
  }
  if (next) {
    if (index < chapters.length - 1) {
      next.href = getWritingChapterHref(book, chapters[index + 1]);
      next.classList.remove('disabled');
    } else {
      next.href = 'writing.html';
      next.classList.remove('disabled');
    }
  }
}

function renderWritingDetail() {
  // Kept for older links: redirect to the book contents page.
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'mending-the-fire';
  location.replace(`writing-book.html?id=${encodeURIComponent(id)}`);
}

function renderTexts() {
  const el = document.getElementById('textsList');
  const overview = document.getElementById('textOverview');
  if (el && DATA.texts?.items) {
    el.innerHTML = DATA.texts.items.map(t => `
      <a class="text-link-card" href="${escapeHtml(getTextHref(t))}">
        <span class="text-link-title" data-en="${escapeHtml(t.title_en)}" data-zh="${escapeHtml(t.title_zh)}"></span>
        <span class="text-link-arrow">→</span>
      </a>
    `).join('');
  }
  if (overview && DATA.texts?.items) {
    overview.innerHTML = DATA.texts.items.map(t => {
      const href = getTextHref(t);
      const readLink = `<a class="read-link" href="${escapeHtml(href)}" data-en="Read Full Text →" data-zh="阅读全文 →"></a>`;
      return `
        <article class="text-overview-section" id="text-${escapeHtml(t.id)}">
          <div class="text-overview-heading">
            <h2 data-en="${escapeHtml(t.title_en)}" data-zh="${escapeHtml(t.title_zh)}"></h2>
            ${readLink}
          </div>
          <div class="text-body publication-text" data-text-id="${escapeHtml(t.id)}" data-en="${escapeHtml(getTextPreview(t, 'en'))}" data-zh="${escapeHtml(getTextPreview(t, 'zh'))}"></div>
        </article>
      `;
    }).join('');
  }
}

function renderTextDetail() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'on-painting';
  const item = DATA.texts?.items?.find(t => t.id === id);
  const title = document.getElementById('textTitle');
  const body = document.getElementById('textDetail');
  if (!item) {
    if (title) title.setAttribute('data-en', 'Text Not Found'), title.setAttribute('data-zh', '未找到文本');
    if (body) body.setAttribute('data-en', ''), body.setAttribute('data-zh', '');
    return;
  }
  if (title) {
    title.setAttribute('data-en', escapeHtml(item.title_en));
    title.setAttribute('data-zh', escapeHtml(item.title_zh));
  }
  if (body) {
    body.setAttribute('data-text-id', escapeHtml(item.id));
    body.setAttribute('data-en', escapeHtml(item.content_en));
    body.setAttribute('data-zh', escapeHtml(item.content_zh));
  }
}


function renderStatementPage() {
  const back = document.getElementById('statementBackLink');
  if (!back) return;
  const params = new URLSearchParams(location.search);
  const from = params.get('from');
  if (from === 'texts') {
    back.href = 'texts.html#text-statement';
    back.dataset.i18n = 'back_to_texts';
  } else {
    back.href = 'artist.html';
    back.dataset.i18n = 'back_to_artist';
  }
}

function renderArtworks() {
  const el = document.getElementById('selectedWorks');
  if (el && DATA.artworks?.works) {
    const works = [...DATA.artworks.works].sort((a, b) => (a.order || 0) - (b.order || 0));
    window.__artworkViewerWorks = works;
    el.innerHTML = works.map((w, index) => `
      <article class="work-panel" id="${escapeHtml(w.id)}">
        <button class="work-image-wrap artwork-viewer-trigger" type="button" data-work-index="${index}" aria-label="View ${escapeHtml(w.title_en)} full screen">
          <img src="${escapeHtml(w.image)}" data-hires="${escapeHtml(w.hires_image || w.image)}" alt="${escapeHtml(w.alt_en || w.title_en)}" loading="lazy">
        </button>
        <div class="work-info">
          <div class="work-count">${escapeHtml(w.catalog_number || String(index + 1).padStart(3, '0'))}</div>
          <h2 data-en="${escapeHtml(w.title_en)}" data-zh="${escapeHtml(w.title_zh)}"></h2>
          <div class="work-meta">
            <div data-en="Artist: ${escapeHtml(w.artist_en || 'Xunmu Wu')}" data-zh="艺术家：${escapeHtml(w.artist_zh || '吴训木')}"></div>
            <div data-en="${escapeHtml(w.medium_en)}" data-zh="${escapeHtml(w.medium_zh)}"></div>
            <div>${escapeHtml(w.dimensions_cm || '')}</div>
            <div>${escapeHtml(w.dimensions_in || '')}</div>
            <div>${escapeHtml(w.year || '')}</div>
          </div>
        </div>
      </article>
    `).join('');
    setupArtworkViewer(works);
  }
}


function renderStudio() {
  const el = document.getElementById('studioGallery');
  if (el && DATA.studio?.items) {
    el.innerHTML = DATA.studio.items.map((item, index) => `
      <article class="studio-frame" id="studio-${String(index + 1).padStart(2, '0')}">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt_en || 'Xunmu Wu Studio')}" loading="lazy">
      </article>
    `).join('');
  }
}

function renderContact() {
  if (!DATA.contact) return;
  const email = document.getElementById('emailLink');
  if (email) {
    email.href = 'mailto:' + DATA.contact.email;
    email.textContent = DATA.contact.email;
  }
  const ig = document.getElementById('instagramLink');
  if (ig) ig.href = DATA.contact.instagram || '#';
  const fb = document.getElementById('facebookLink');
  if (fb) fb.href = DATA.contact.facebook || '#';
}

function renderDynamic(lang) {
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    const val = lang === 'zh' ? el.dataset.zh : el.dataset.en;
    if (el.classList.contains('text-body')) {
      const textId = el.dataset.textId || '';
      if (textId === 'on-painting') {
        el.innerHTML = renderOnPainting(val, lang);
      } else if (textId === 'reflections') {
        el.innerHTML = renderReflectionBlocks(val);
      } else {
        el.innerHTML = paragraphs(val);
      }
    } else {
      el.textContent = val;
    }
  });
}

function getTextPreview(item, lang) {
  const content = lang === 'zh' ? item.content_zh : item.content_en;
  if (item.id === 'statement') {
    const artistPreview = DATA.artist?.statement_preview;
    if (artistPreview) return pick(artistPreview, lang);
    return excerptText(content, 4);
  }
  return content || '';
}

function renderOnPainting(text, lang) {
  const titles = lang === 'zh'
    ? ['我对绘画的态度', '希望能画这样一张画', '我喜欢的画', '我想画这样一张画', '希望我的作品']
    : ['My Attitude Toward Painting', 'A Picture I Long to Paint', 'The Kind of Painting I Love', 'A Picture I Wish to Paint', 'What I Hope My Work Can Be'];
  const blocks = [];
  let current = null;
  (text || '').split(/\n\s*\n/).map(x => x.trim()).filter(Boolean).forEach(part => {
    if (titles.includes(part)) {
      current = { title: part, body: [] };
      blocks.push(current);
    } else {
      if (!current) {
        current = { title: '', body: [] };
        blocks.push(current);
      }
      current.body.push(part);
    }
  });
  return blocks.map(block => `
    <section class="publication-section">
      ${block.title ? `<h3>${block.title.replace(/[：:]$/, '')}${lang === 'zh' ? '：' : ':'}</h3>` : ''}
      ${block.body.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}
    </section>
  `).join('');
}

function renderReflectionBlocks(text) {
  return (text || '')
    .split(/\n\s*\n/)
    .map(x => x.trim())
    .filter(Boolean)
    .map(p => `<section class="reflection-block"><p>${p.replace(/\n/g, '<br>')}</p></section>`)
    .join('');
}

function excerptText(text, count = 3) {
  return (text || '')
    .split(/\n\s*\n/)
    .filter(Boolean)
    .slice(0, count)
    .join('\n\n');
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}



// Full-screen artwork viewer: click an artwork to view high-resolution image, zoom, drag, pinch, and navigate.
let artworkViewerState = {
  works: [], index: 0,
  scale: 1, x: 0, y: 0,
  pointers: new Map(),
  dragStart: null,
  pinchStart: null,
  lastTap: { time: 0, x: 0, y: 0 }
};

function setupArtworkViewer(works) {
  artworkViewerState.works = works || [];
  ensureArtworkViewer();
  document.querySelectorAll('.artwork-viewer-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openArtworkViewer(Number(btn.dataset.workIndex || 0));
    });
  });
}

function ensureArtworkViewer() {
  if (document.getElementById('artworkViewer')) return;
  const viewer = document.createElement('div');
  viewer.id = 'artworkViewer';
  viewer.className = 'artwork-viewer';
  viewer.setAttribute('aria-hidden', 'true');
  viewer.innerHTML = `
    <button type="button" class="artwork-viewer-back" id="artworkViewerBack" aria-label="Back to artworks">\u2039 Back to artworks</button>
    <div class="artwork-viewer-stage" id="artworkViewerStage">
      <img id="artworkViewerImage" class="artwork-viewer-image" alt="">
    </div>
    <div class="artwork-viewer-topbar">
      <button type="button" class="artwork-viewer-btn" id="artworkViewerClose" aria-label="Close">×</button>
    </div>
    <button type="button" class="artwork-viewer-nav artwork-viewer-prev" id="artworkViewerPrev" aria-label="Previous artwork">‹</button>
    <button type="button" class="artwork-viewer-nav artwork-viewer-next" id="artworkViewerNext" aria-label="Next artwork">›</button>
    <div class="artwork-viewer-caption">
      <div id="artworkViewerNumber" class="artwork-viewer-number"></div>
      <div>
        <div id="artworkViewerTitle" class="artwork-viewer-title"></div>
        <div id="artworkViewerMeta" class="artwork-viewer-meta"></div>
      </div>
    </div>
    <div class="artwork-viewer-controls">
      <button type="button" class="artwork-viewer-control" id="artworkViewerZoomOut">−</button>
      <button type="button" class="artwork-viewer-control artwork-viewer-zoom-label" id="artworkViewerReset">100%</button>
      <button type="button" class="artwork-viewer-control" id="artworkViewerZoomIn">+</button>
    </div>
  `;
  document.body.appendChild(viewer);

  const stage = document.getElementById('artworkViewerStage');

  document.getElementById('artworkViewerBack').addEventListener('click', closeArtworkViewer);
  document.getElementById('artworkViewerClose').addEventListener('click', closeArtworkViewer);
  document.getElementById('artworkViewerPrev').addEventListener('click', () => moveArtworkViewer(-1));
  document.getElementById('artworkViewerNext').addEventListener('click', () => moveArtworkViewer(1));
  document.getElementById('artworkViewerZoomIn').addEventListener('click', () => zoomArtworkViewerAtCenter(1.25));
  document.getElementById('artworkViewerZoomOut').addEventListener('click', () => zoomArtworkViewerAtCenter(0.8));
  document.getElementById('artworkViewerReset').addEventListener('click', resetArtworkTransform);

  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomArtworkViewerAt(e.clientX, e.clientY, artworkViewerState.scale * (e.deltaY < 0 ? 1.12 : 0.9));
  }, { passive: false });

  stage.addEventListener('pointerdown', onArtworkPointerDown, { passive: false });
  stage.addEventListener('pointermove', onArtworkPointerMove, { passive: false });
  stage.addEventListener('pointerup', onArtworkPointerEnd);
  stage.addEventListener('pointercancel', onArtworkPointerEnd);

  document.addEventListener('keydown', (e) => {
    const open = document.getElementById('artworkViewer')?.classList.contains('is-open');
    if (!open) return;
    if (e.key === 'Escape') closeArtworkViewer();
    if (e.key === 'ArrowLeft') moveArtworkViewer(-1);
    if (e.key === 'ArrowRight') moveArtworkViewer(1);
    if (e.key === '+' || e.key === '=') zoomArtworkViewerAtCenter(1.25);
    if (e.key === '-') zoomArtworkViewerAtCenter(0.8);
    if (e.key === '0') resetArtworkTransform();
  });
}

function openArtworkViewer(index) {
  const viewer = document.getElementById('artworkViewer');
  if (!viewer || !artworkViewerState.works.length) return;
  artworkViewerState.index = index;
  viewer.classList.add('is-open');
  viewer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('viewer-open');
  document.documentElement.classList.add('viewer-open');
  loadArtworkViewerImage();
}

function closeArtworkViewer() {
  const viewer = document.getElementById('artworkViewer');
  if (!viewer) return;
  viewer.classList.remove('is-open');
  viewer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('viewer-open');
  document.documentElement.classList.remove('viewer-open');
  artworkViewerState.pointers.clear();
  artworkViewerState.dragStart = null;
  artworkViewerState.pinchStart = null;
  resetArtworkTransform();
}

function moveArtworkViewer(delta) {
  const len = artworkViewerState.works.length;
  if (!len) return;
  artworkViewerState.index = (artworkViewerState.index + delta + len) % len;
  loadArtworkViewerImage();
}

function cacheBustArtworkUrl(url) {
  if (!url) return url;
  const joiner = url.indexOf('?') === -1 ? '?' : '&';
  return url + joiner + 'v=hires-v5';
}

function loadArtworkViewerImage() {
  const w = artworkViewerState.works[artworkViewerState.index];
  if (!w) return;
  const img = document.getElementById('artworkViewerImage');
  const lang = getLang();
  const title = lang === 'zh' ? w.title_zh : w.title_en;
  const meta = lang === 'zh'
    ? `吴训木 · ${w.medium_zh || ''} · ${w.dimensions_cm || ''} · ${w.year || ''}`
    : `Xunmu Wu · ${w.medium_en || ''} · ${w.dimensions_cm || ''} · ${w.year || ''}`;
  resetArtworkTransform();

  const displaySrc = w.image || '';
  const hiresSrc = w.hires_image || w.image || '';
  img.dataset.displaySrc = displaySrc;
  img.dataset.hiresSrc = hiresSrc;
  img.dataset.activeSrc = hiresSrc;

  const reset = document.getElementById('artworkViewerReset');
  if (reset) reset.textContent = lang === 'zh' ? '\u9ad8\u6e05\u52a0\u8f7d\u4e2d' : 'Loading HD';

  img.classList.add('is-loading-hires');
  img.onload = function () {
    img.classList.remove('is-loading-hires');
    img.onload = null;
    if (reset) reset.textContent = '100%';
  };
  img.onerror = function () {
    img.classList.remove('is-loading-hires');
    img.onerror = null;
    img.src = cacheBustArtworkUrl(displaySrc);
    img.dataset.activeSrc = displaySrc;
    if (reset) reset.textContent = lang === 'zh' ? '\u666e\u901a\u56fe' : 'Standard image';
  };

  // Directly load the 6000px image. This avoids mobile browsers showing the web-display image.
  img.src = cacheBustArtworkUrl(hiresSrc);

  img.alt = lang === 'zh' ? (w.alt_zh || title) : (w.alt_en || title);
  document.getElementById('artworkViewerNumber').textContent = w.catalog_number || String(artworkViewerState.index + 1).padStart(3, '0');
  document.getElementById('artworkViewerTitle').textContent = title;
  document.getElementById('artworkViewerMeta').textContent = meta;
}

function onArtworkPointerDown(e) {
  e.preventDefault();
  const stage = document.getElementById('artworkViewerStage');
  stage.setPointerCapture(e.pointerId);
  artworkViewerState.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (artworkViewerState.pointers.size === 1) {
    const now = Date.now();
    const last = artworkViewerState.lastTap;
    const distance = Math.hypot(e.clientX - last.x, e.clientY - last.y);
    if (now - last.time < 320 && distance < 44) {
      const targetScale = artworkViewerState.scale > 1.05 ? 1 : 3;
      zoomArtworkViewerAt(e.clientX, e.clientY, targetScale);
      artworkViewerState.lastTap = { time: 0, x: 0, y: 0 };
      return;
    }
    artworkViewerState.lastTap = { time: now, x: e.clientX, y: e.clientY };
    artworkViewerState.dragStart = {
      x: e.clientX,
      y: e.clientY,
      baseX: artworkViewerState.x,
      baseY: artworkViewerState.y
    };
  }

  if (artworkViewerState.pointers.size === 2) {
    const pts = Array.from(artworkViewerState.pointers.values());
    artworkViewerState.pinchStart = {
      dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
      scale: artworkViewerState.scale
    };
    artworkViewerState.dragStart = null;
  }
}

function onArtworkPointerMove(e) {
  if (!artworkViewerState.pointers.has(e.pointerId)) return;
  e.preventDefault();
  artworkViewerState.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (artworkViewerState.pointers.size === 2 && artworkViewerState.pinchStart) {
    const pts = Array.from(artworkViewerState.pointers.values());
    const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    const cx = (pts[0].x + pts[1].x) / 2;
    const cy = (pts[0].y + pts[1].y) / 2;
    const nextScale = artworkViewerState.pinchStart.scale * dist / artworkViewerState.pinchStart.dist;
    zoomArtworkViewerAt(cx, cy, nextScale);
    return;
  }

  if (artworkViewerState.pointers.size === 1 && artworkViewerState.dragStart && artworkViewerState.scale > 1.01) {
    artworkViewerState.x = artworkViewerState.dragStart.baseX + (e.clientX - artworkViewerState.dragStart.x);
    artworkViewerState.y = artworkViewerState.dragStart.baseY + (e.clientY - artworkViewerState.dragStart.y);
    clampArtworkPan();
    updateArtworkTransform();
  }
}

function onArtworkPointerEnd(e) {
  artworkViewerState.pointers.delete(e.pointerId);
  if (artworkViewerState.pointers.size < 2) artworkViewerState.pinchStart = null;
  if (artworkViewerState.pointers.size === 0) artworkViewerState.dragStart = null;
}

function zoomArtworkViewerAtCenter(factor) {
  const stage = document.getElementById('artworkViewerStage');
  const rect = stage.getBoundingClientRect();
  zoomArtworkViewerAt(rect.left + rect.width / 2, rect.top + rect.height / 2, artworkViewerState.scale * factor);
}

function zoomArtworkViewerAt(clientX, clientY, nextScale) {
  const stage = document.getElementById('artworkViewerStage');
  const rect = stage.getBoundingClientRect();
  const oldScale = artworkViewerState.scale || 1;
  nextScale = Math.max(1, Math.min(6, nextScale));

  const ox = clientX - rect.left - rect.width / 2;
  const oy = clientY - rect.top - rect.height / 2;

  artworkViewerState.x = ox - (ox - artworkViewerState.x) * (nextScale / oldScale);
  artworkViewerState.y = oy - (oy - artworkViewerState.y) * (nextScale / oldScale);
  artworkViewerState.scale = nextScale;

  if (artworkViewerState.scale <= 1.01) {
    artworkViewerState.scale = 1;
    artworkViewerState.x = 0;
    artworkViewerState.y = 0;
  }
  clampArtworkPan();
  updateArtworkTransform();
}

function resetArtworkTransform() {
  artworkViewerState.scale = 1;
  artworkViewerState.x = 0;
  artworkViewerState.y = 0;
  updateArtworkTransform();
}

function clampArtworkPan() {
  if (artworkViewerState.scale <= 1.01) {
    artworkViewerState.x = 0;
    artworkViewerState.y = 0;
    return;
  }
  const stage = document.getElementById('artworkViewerStage');
  const img = document.getElementById('artworkViewerImage');
  if (!stage || !img) return;
  const rect = stage.getBoundingClientRect();
  const ratio = (img.naturalWidth || 1) / (img.naturalHeight || 1);
  let fitW = rect.width;
  let fitH = fitW / ratio;
  if (fitH > rect.height) {
    fitH = rect.height;
    fitW = fitH * ratio;
  }
  const maxX = Math.max(0, (fitW * artworkViewerState.scale - rect.width) / 2);
  const maxY = Math.max(0, (fitH * artworkViewerState.scale - rect.height) / 2);
  artworkViewerState.x = Math.max(-maxX, Math.min(maxX, artworkViewerState.x));
  artworkViewerState.y = Math.max(-maxY, Math.min(maxY, artworkViewerState.y));
}

function updateArtworkTransform() {
  const img = document.getElementById('artworkViewerImage');
  const reset = document.getElementById('artworkViewerReset');
  if (!img) return;
  img.style.transform = `translate3d(${artworkViewerState.x}px, ${artworkViewerState.y}px, 0) scale(${artworkViewerState.scale})`;
  if (reset) reset.textContent = `${Math.round(artworkViewerState.scale * 100)}%`;
}

window.addEventListener('resize', () => {
  const viewer = document.getElementById('artworkViewer');
  if (viewer?.classList.contains('is-open')) {
    clampArtworkPan();
    updateArtworkTransform();
  }
});

init();
