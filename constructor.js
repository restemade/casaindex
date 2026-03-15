const TOTAL_STEPS = 12;
const STORAGE_KEY = 'casa-configurator-draft-v2';

const refs = {
  intro: document.getElementById('introScreen'),
  wizard: document.getElementById('wizardSection'),
  result: document.getElementById('resultSection'),
  stepContainer: document.getElementById('stepContainer'),
  liveSummary: document.getElementById('liveSummary'),
  previewCard: document.getElementById('previewCard'),
  priceCard: document.getElementById('priceCard'),
  startBtn: document.getElementById('startBtn'),
  startDemoBtn: document.getElementById('startDemoBtn'),
  loadDemoBtn: document.getElementById('loadDemoBtn'),
  saveDraftBtn: document.getElementById('saveDraftBtn'),
  resetAllBtn: document.getElementById('resetAllBtn'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  progressBar: document.getElementById('progressBar'),
  stepLabel: document.getElementById('stepLabel'),
  stepTitle: document.getElementById('stepTitle'),
  progressPercent: document.getElementById('progressPercent')
};

const db = {
  stepTitles: ['Подготовка','Тип объекта','Площадь','Помещения','Стиль','Настроение','Палитра','Материалы','Уровень проекта','Услуги','Сроки','Референсы','Контакты'],
  objectTypes: [
    {name:'Квартира', desc:'Городской жилой интерьер', theme:'t-interior-a', k:1},
    {name:'Частный дом', desc:'Более сложная архитектура и сценарии', theme:'t-interior-b', k:1.15},
    {name:'Пентхаус', desc:'Панорамы, статус и сложные акценты', theme:'t-interior-c', k:1.3},
    {name:'Апартаменты', desc:'Инвестиционный или lifestyle-формат', theme:'t-interior-a', k:1.08},
    {name:'Офис', desc:'Функциональность и бренд-среда', theme:'t-interior-d', k:1.2},
    {name:'Ресторан / кафе', desc:'Эмоциональный коммерческий сценарий', theme:'t-interior-c', k:1.35},
    {name:'Бутик / шоурум', desc:'Продающее пространство и атмосфера', theme:'t-interior-b', k:1.25}
  ],
  areaRanges: ['до 50 м²','50–100 м²','100–150 м²','150–250 м²','250+ м²'],
  rooms: ['Гостиная','Кухня','Спальня','Детская','Кабинет','Гардеробная','Ванная','Санузел','Прихожая','Терраса','Коммерческий зал','Ресепшен','Переговорная'],
  styles: [
    {name:'Minimalism', desc:'Чистая геометрия и воздух', theme:'t-style-1', k:1.0},
    {name:'Japandi', desc:'Теплый баланс и спокойствие', theme:'t-style-2', k:1.06},
    {name:'Modern Luxury', desc:'Статусная выразительность', theme:'t-style-3', k:1.24},
    {name:'Contemporary', desc:'Актуальный городской микс', theme:'t-style-1', k:1.1},
    {name:'Neoclassical', desc:'Архитектурная элегантность', theme:'t-style-3', k:1.28},
    {name:'Soft Minimal', desc:'Мягкий минимализм с теплом', theme:'t-style-2', k:1.04},
    {name:'Dark Modern', desc:'Глубина, графит и драматизм', theme:'t-style-4', k:1.18},
    {name:'Organic Modern', desc:'Плавные формы и природные текстуры', theme:'t-style-2', k:1.12},
    {name:'Boutique Hotel Style', desc:'Эффект дорогого hospitality', theme:'t-style-3', k:1.33}
  ],
  moods: [
    {name:'Спокойный и мягкий', k:1.0},
    {name:'Теплый и уютный', k:1.02},
    {name:'Статусный и выразительный', k:1.08},
    {name:'Светлый и воздушный', k:1.01},
    {name:'Темный и драматичный', k:1.05},
    {name:'Современный и технологичный', k:1.06},
    {name:'Натуральный и живой', k:1.03},
    {name:'Арт-ориентированный и смелый', k:1.09}
  ],
  palettes: [
    {name:'Светлая нейтральная', colors:['#f5f1ea','#e7dfd3','#cec1b2'], scene:['#f7f3ed','#e9dfd1','#b89472','#8e6e56','#f0ebe3','#d9cbb8','#b89a7f','#8a6d58','#d9d1c8','#bcae9d']},
    {name:'Теплая бежевая', colors:['#ead9c7','#cfb39a','#9d7f66'], scene:['#f4ece4','#deccb9','#ad8564','#775845','#efe2d3','#d3bca4','#b28763','#855f46','#dbcab7','#b18a69']},
    {name:'Графитовая', colors:['#d8d8d8','#7b7e84','#373940'], scene:['#efefee','#d8d7d5','#7a756f','#56514e','#d9dadc','#7d8186','#686c73','#343840','#cbc9c5','#8f8b85']},
    {name:'Natural Earthy', colors:['#d7c8b7','#a38c74','#6f5f4e'], scene:['#f0e8de','#d8cab8','#a8876c','#75604d','#eadfce','#bea88e','#906f55','#5f4a3c','#d3c6b6','#a18a73']},
    {name:'Темная luxury', colors:['#1f1d1b','#40362f','#9b7d63'], scene:['#d8d0c8','#97806a','#6b5442','#3e3027','#c5b7a7','#8c715a','#5f4a3c','#2d231d','#b8aa99','#8c725b']},
    {name:'Мрамор + дерево', colors:['#efeae4','#b89e84','#7c624f'], scene:['#f3ede7','#d5c5b4','#a68064','#6d5444','#efe8df','#c8b29b','#9d7d64','#6b5242','#e0d5c9','#9f8975']}
  ],
  materials: [
    {name:'Натуральное дерево', cls:'material-wood', k:1.04},
    {name:'Камень', cls:'material-stone', k:1.05},
    {name:'Мрамор', cls:'material-marble', k:1.08},
    {name:'Стекло', cls:'material-glass', k:1.03},
    {name:'Металл', cls:'material-metal', k:1.04},
    {name:'Мягкий текстиль', cls:'material-textile', k:1.02},
    {name:'Бетон', cls:'material-concrete', k:1.04},
    {name:'Керамика', cls:'material-ceramic', k:1.03},
    {name:'Латунь / бронза', cls:'material-brass', k:1.06},
    {name:'Шпон', cls:'material-veneer', k:1.04},
    {name:'Декоративная штукатурка', cls:'material-plaster', k:1.03}
  ],
  levels: [
    {name:'Essential', desc:'Аккуратная база для уверенного старта', label:'Рациональный', k:1.0},
    {name:'Business', desc:'Больше детализации и выразительности', label:'Сбалансированный', k:1.2},
    {name:'Premium', desc:'Глубокая проработка и сильная подача', label:'Высокий уровень', k:1.45},
    {name:'Signature', desc:'Индивидуальный high-end сценарий', label:'Флагманский', k:1.8}
  ],
  services: [
    {name:'Планировочное решение', add:700},
    {name:'Концепция интерьера', add:1200},
    {name:'Полный дизайн-проект', add:3400},
    {name:'3D-визуализация', add:1800},
    {name:'Рабочая документация', add:2100},
    {name:'Авторский надзор', add:2500},
    {name:'Комплектация', add:2200},
    {name:'Реализация под ключ', add:4800},
    {name:'Консультация', add:300}
  ],
  timelines: [
    {name:'Срочно', k:1.2},
    {name:'В ближайший месяц', k:1.1},
    {name:'В течение 2–3 месяцев', k:1.0},
    {name:'Пока изучаю варианты', k:0.98},
    {name:'Проект на перспективу', k:0.96}
  ],
  references: [
    {name:'Теплый минимализм', desc:'Светлая архитектура, дерево, мягкий текстиль', theme:'t-interior-a'},
    {name:'Soft luxury', desc:'Мрамор, латунь, глубокие акценты', theme:'t-interior-c'},
    {name:'Dark contemporary', desc:'Графит, контраст, выразительный свет', theme:'t-interior-d'},
    {name:'Japandi calm', desc:'Тактильность, простота, натуральность', theme:'t-interior-b'},
    {name:'Boutique hospitality', desc:'Атмосфера дорогого отеля', theme:'t-interior-c'},
    {name:'Organic modern', desc:'Природные формы и мягкие линии', theme:'t-interior-b'}
  ],
  contactMethod: ['Телефон','WhatsApp','Email']
};

function defaultState() {
  return {
    step: 0,
    answers: {
      objectType: '',
      areaRange: '',
      areaExact: '',
      rooms: [],
      styles: [],
      moods: [],
      palette: '',
      materials: [],
      level: '',
      services: [],
      timeline: '',
      references: [],
      refLink: '',
      refHelp: false,
      contact: { name:'', phone:'', whatsapp:'', email:'', city:'', comment:'', preferred:'' },
      consent: false
    }
  };
}

let state = defaultState();

function saveDraft() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  refs.saveDraftBtn.textContent = 'Черновик сохранен ✓';
  setTimeout(() => refs.saveDraftBtn.textContent = 'Сохранить черновик', 1600);
}
function resetAll() {
  state = defaultState();
  localStorage.removeItem(STORAGE_KEY);
  refs.wizard.classList.add('hidden');
  refs.result.classList.add('hidden');
  refs.intro.classList.remove('hidden');
  updateHeader();
}
function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    state = JSON.parse(raw);
    return true;
  } catch {
    return false;
  }
}

function startConfigurator(useDemo = false) {
  if (useDemo) applyDemo();
  refs.intro.classList.add('hidden');
  refs.result.classList.add('hidden');
  refs.wizard.classList.remove('hidden');
  if (state.step < 1) state.step = 1;
  render();
}

function applyDemo() {
  state = defaultState();
  state.step = 1;
  Object.assign(state.answers, {
    objectType: 'Пентхаус',
    areaRange: '150–250 м²',
    areaExact: 186,
    rooms: ['Гостиная','Кухня','Спальня','Кабинет','Гардеробная','Ванная'],
    styles: ['Modern Luxury','Soft Minimal'],
    moods: ['Статусный и выразительный','Теплый и уютный'],
    palette: 'Мрамор + дерево',
    materials: ['Мрамор','Натуральное дерево','Латунь / бронза','Мягкий текстиль'],
    level: 'Premium',
    services: ['Полный дизайн-проект','3D-визуализация','Рабочая документация','Авторский надзор','Комплектация'],
    timeline: 'В ближайший месяц',
    references: ['Soft luxury','Boutique hospitality'],
    refLink: 'https://pinterest.com/casa/demo',
    refHelp: false,
    contact: { name:'Dimash', phone:'+7 702 000 00 00', whatsapp:'+7 702 000 00 00', email:'demo@casa-interiors.com', city:'Актау', comment:'Нужен wow-эффект для презентационного объекта.', preferred:'WhatsApp' },
    consent: true
  });
}

function updateHeader() {
  const step = Math.min(state.step, TOTAL_STEPS);
  const progress = Math.round((step / TOTAL_STEPS) * 100);
  refs.stepLabel.textContent = `Шаг ${step} из ${TOTAL_STEPS}`;
  refs.stepTitle.textContent = db.stepTitles[step] || 'Подготовка';
  refs.progressPercent.textContent = `${progress}%`;
  refs.progressBar.style.width = `${progress}%`;
}

function render() {
  updateHeader();
  renderStep();
  renderPreview();
  renderPrice();
  renderSummary();
  refs.prevBtn.disabled = state.step <= 1;
  refs.nextBtn.disabled = !isStepValid(state.step);
  refs.nextBtn.textContent = state.step === TOTAL_STEPS ? 'Сформировать итог' : 'Далее';
}

function renderStep() {
  const a = state.answers;
  const helper = (text) => `<div class="helper-badge">${text}</div>`;
  const card = (item, active, cls = 'option-card') => `
    <button type="button" class="${cls} ${active ? 'active' : ''}" data-val="${escapeHtml(item.name)}">
      <div class="thumb ${item.theme || 't-interior-a'}"></div>
      <strong>${item.name}</strong>
      <p>${item.desc || ''}</p>
    </button>`;
  const chip = (label, active) => `<button type="button" class="chip ${active ? 'active' : ''}" data-val="${escapeHtml(label)}">${label}</button>`;
  const service = (item, active) => `<button type="button" class="service-card ${active ? 'active' : ''}" data-val="${escapeHtml(item.name)}"><strong>${item.name}</strong><p>+ ${formatMoney(item.add)}</p></button>`;
  const level = (item, active) => `<button type="button" class="level-card ${active ? 'active' : ''}" data-val="${escapeHtml(item.name)}"><strong>${item.name}</strong><p>${item.desc}</p><em>${item.label}</em></button>`;
  let html = '';

  switch (state.step) {
    case 1:
      html = `
        <div class="step-topline"><div><h2>Тип объекта</h2><p class="step-subtitle">Пространство задает базовую архитектуру, логику маршрутов и уровень сложности проекта.</p></div>${helper('База для pricing engine')}</div>
        <div class="choice-grid object-grid">${db.objectTypes.map(item => card(item, a.objectType === item.name)).join('')}</div>`;
      break;
    case 2:
      html = `
        <div class="step-topline"><div><h2>Площадь</h2><p class="step-subtitle">Чем точнее площадь, тем убедительнее выглядит итоговая оценка проекта.</p></div>${helper('Можно указать диапазон и точную площадь')}</div>
        <div class="chips">${db.areaRanges.map(x => chip(x, a.areaRange === x)).join('')}</div>
        <div class="inline-two" style="margin-top:14px">
          <label class="field"><span>Точная площадь, м²</span><input id="areaExact" type="number" min="20" placeholder="Например, 186" value="${a.areaExact || ''}"></label>
          <article class="upload-demo"><strong>Совет</strong><span>Для презентации лучше указать реальную площадь — это усиливает доверие к расчету.</span></article>
        </div>`;
      break;
    case 3:
      html = `
        <div class="step-topline"><div><h2>Помещения</h2><p class="step-subtitle">Отметьте, какие зоны нужно разработать. Это влияет на масштаб и глубину проекта.</p></div>${helper('Можно выбрать несколько')}</div>
        <div class="rooms-grid">${db.rooms.map(x => `<button type="button" class="service-card ${a.rooms.includes(x) ? 'active' : ''}" data-val="${escapeHtml(x)}"><strong>${x}</strong><p>${roomDesc(x)}</p></button>`).join('')}</div>`;
      break;
    case 4:
      html = `
        <div class="step-topline"><div><h2>Стиль</h2><p class="step-subtitle">Выберите до 3 направлений — мы соберем из них персональную стилистику и подстроим live-сцену.</p></div>${helper('До 3 направлений')}</div>
        <div class="choice-grid style-grid">${db.styles.map(item => card(item, a.styles.includes(item.name), 'style-card')).join('')}</div>
        <p class="step-note">Сейчас у вас выбрано: ${a.styles.length || 0} / 3.</p>`;
      break;
    case 5:
      html = `
        <div class="step-topline"><div><h2>Настроение</h2><p class="step-subtitle">Это не про декор, а про то, какое ощущение должно возникать у клиента в пространстве.</p></div>${helper('1–2 эмоциональных вектора')}</div>
        <div class="chips">${db.moods.map(item => chip(item.name, a.moods.includes(item.name))).join('')}</div>`;
      break;
    case 6:
      html = `
        <div class="step-topline"><div><h2>Палитра</h2><p class="step-subtitle">Палитра сразу меняет вид стенда справа: фон, мебель, арт и общую температуру интерьера.</p></div>${helper('Влияет на live preview')}</div>
        <div class="palette-grid">${db.palettes.map(item => `
          <button type="button" class="palette-card ${a.palette === item.name ? 'active' : ''}" data-val="${escapeHtml(item.name)}">
            <div class="palette-swatches">${item.colors.map(c => `<span style="background:${c}"></span>`).join('')}</div>
            <strong>${item.name}</strong>
            <p>${paletteDesc(item.name)}</p>
          </button>`).join('')}</div>`;
      break;
    case 7:
      html = `
        <div class="step-topline"><div><h2>Материалы</h2><p class="step-subtitle">Выбранные фактуры собираются в мини-матборд. Это усиливает ощущение реального подбора.</p></div>${helper('Стенд собирается из деталей')}</div>
        <div class="chips">${db.materials.map(item => `<button type="button" class="texture ${a.materials.includes(item.name) ? 'active' : ''}" data-val="${escapeHtml(item.name)}">${item.name}</button>`).join('')}</div>`;
      break;
    case 8:
      html = `
        <div class="step-topline"><div><h2>Уровень проекта</h2><p class="step-subtitle">Это рамка глубины проработки, количества решений и силы конечной подачи проекта.</p></div>${helper('Один уровень')}</div>
        <div class="level-grid">${db.levels.map(item => level(item, a.level === item.name)).join('')}</div>`;
      break;
    case 9:
      html = `
        <div class="step-topline"><div><h2>Услуги</h2><p class="step-subtitle">Сформируйте состав пакета. Итоговая стоимость будет пересчитываться по мере выбора.</p></div>${helper('Влияет на price breakdown')}</div>
        <div class="service-grid">${db.services.map(item => service(item, a.services.includes(item.name))).join('')}</div>`;
      break;
    case 10:
      html = `
        <div class="step-topline"><div><h2>Сроки</h2><p class="step-subtitle">Темп старта влияет на производственную нагрузку и надбавку к расчету.</p></div>${helper('Срочность = коэффициент')}</div>
        <div class="chips">${db.timelines.map(item => chip(item.name, a.timeline === item.name)).join('')}</div>`;
      break;
    case 11:
      html = `
        <div class="step-topline"><div><h2>Референсы</h2><p class="step-subtitle">Можно выбрать готовые ориентиры, вставить ссылку или отметить, что подбор нужен от студии.</p></div>${helper('AI-ready mood input')}</div>
        <div class="ref-grid">${db.references.map(item => card(item, a.references.includes(item.name), 'reference-card')).join('')}</div>
        <div class="inline-two" style="margin-top:14px">
          <label class="field"><span>Ссылка на Pinterest / Instagram / moodboard</span><input id="refLink" value="${a.refLink || ''}" placeholder="https://..."></label>
          <label class="field"><span>Дополнительно</span><select id="refHelp"><option value="false" ${!a.refHelp ? 'selected' : ''}>Референсы подобрал сам</option><option value="true" ${a.refHelp ? 'selected' : ''}>Нужна помощь студии с подбором</option></select></label>
        </div>
        <div class="upload-demo" style="margin-top:14px">Загрузка изображения референса — демо-слой для будущей API/AI интеграции</div>`;
      break;
    case 12:
      html = `
        <div class="step-topline"><div><h2>Контакты</h2><p class="step-subtitle">Финальный шаг. На его основе соберется AI-бриф, CRM payload и ориентировочное коммерческое предложение.</p></div>${helper('Финал презентационного сценария')}</div>
        <div class="contact-grid">
          <label class="field"><span>Имя</span><input id="name" value="${a.contact.name}" placeholder="Имя"></label>
          <label class="field"><span>Телефон</span><input id="phone" value="${a.contact.phone}" placeholder="Телефон"></label>
          <label class="field"><span>WhatsApp</span><input id="whatsapp" value="${a.contact.whatsapp}" placeholder="WhatsApp"></label>
          <label class="field"><span>Email</span><input id="email" value="${a.contact.email}" placeholder="Email"></label>
          <label class="field"><span>Город</span><input id="city" value="${a.contact.city}" placeholder="Город"></label>
          <label class="field"><span>Предпочтительный способ связи</span><select id="preferred"><option value="">Выбрать</option>${db.contactMethod.map(x => `<option value="${x}" ${a.contact.preferred === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
        </div>
        <label class="field" style="margin-top:14px"><span>Комментарий</span><textarea id="comment" rows="5" placeholder="Коротко опишите задачу">${a.contact.comment}</textarea></label>
        <label class="checkline"><input id="consent" type="checkbox" ${a.consent ? 'checked' : ''}> Согласен(на) с обработкой данных и подготовкой персонального предложения</label>`;
      break;
  }

  refs.stepContainer.innerHTML = html;
  bindStepEvents();
}

function bindStepEvents() {
  const a = state.answers;
  refs.stepContainer.querySelectorAll('[data-val]').forEach(el => {
    el.addEventListener('click', () => {
      const value = el.dataset.val;
      if (state.step === 1) a.objectType = value;
      if (state.step === 2) a.areaRange = value;
      if (state.step === 3) toggleMulti(a.rooms, value);
      if (state.step === 4) toggleLimited(a.styles, value, 3);
      if (state.step === 5) toggleLimited(a.moods, value, 2);
      if (state.step === 6) a.palette = value;
      if (state.step === 7) toggleMulti(a.materials, value);
      if (state.step === 8) a.level = value;
      if (state.step === 9) toggleMulti(a.services, value);
      if (state.step === 10) a.timeline = value;
      if (state.step === 11) toggleMulti(a.references, value);
      render();
    });
  });

  bindInput('areaExact', v => a.areaExact = v);
  bindInput('refLink', v => a.refLink = v);
  bindInput('refHelp', v => a.refHelp = v === 'true');
  bindInput('name', v => a.contact.name = v);
  bindInput('phone', v => a.contact.phone = v);
  bindInput('whatsapp', v => a.contact.whatsapp = v);
  bindInput('email', v => a.contact.email = v);
  bindInput('city', v => a.contact.city = v);
  bindInput('preferred', v => a.contact.preferred = v);
  bindInput('comment', v => a.contact.comment = v);
  bindCheck('consent', v => a.consent = v);
}

function bindInput(id, cb) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => { cb(el.value); renderPreview(); renderPrice(); renderSummary(); refs.nextBtn.disabled = !isStepValid(state.step); });
  el.addEventListener('change', () => { cb(el.value); renderPreview(); renderPrice(); renderSummary(); refs.nextBtn.disabled = !isStepValid(state.step); });
}
function bindCheck(id, cb) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('change', () => { cb(el.checked); renderPreview(); renderPrice(); renderSummary(); refs.nextBtn.disabled = !isStepValid(state.step); });
}

function renderPreview() {
  const a = state.answers;
  const scene = getScenePalette(a.palette);
  const mats = a.materials.length ? a.materials.slice(0,4) : ['Натуральное дерево','Мрамор','Мягкий текстиль','Латунь / бронза'];
  refs.previewCard.innerHTML = `
    <h3>Визуальный стенд</h3>
    <div class="preview-scene" style="
      --scene-wall-start:${scene[0]}; --scene-wall-end:${scene[1]}; --scene-floor-1:${scene[2]}; --scene-floor-2:${scene[3]};
      --sofa-1:${scene[4]}; --sofa-2:${scene[5]}; --table-1:${scene[6]}; --table-2:${scene[7]}; --art-1:${scene[8]}; --art-2:${scene[9]};
    ">
      <div class="preview-floor"></div>
      <div class="preview-art"></div>
      <div class="preview-panel"></div>
      <div class="preview-rug"></div>
      <div class="preview-sofa"></div>
      <div class="preview-table"></div>
    </div>
    <div class="preview-badges">
      <span>${a.objectType || 'Объект не выбран'}</span>
      <span>${composeDirection(a)}</span>
      <span>${a.palette || 'Палитра пока не выбрана'}</span>
    </div>
    <div class="material-board">
      ${mats.map(name => `<div class="material-tile ${materialClass(name)}">${name}</div>`).join('')}
    </div>`;
}

function renderPrice() {
  const p = calculatePricing(state.answers);
  refs.priceCard.innerHTML = `
    <div class="price-head">
      <div>
        <h3>Ориентировочная стоимость</h3>
        <div class="price-range">${p.stage}</div>
      </div>
      <div class="price-total">${formatMoneyRange(p.designLow, p.designHigh)}</div>
    </div>
    <div class="price-breakdown">
      <div class="price-row"><span>Дизайн-проект</span><strong>${formatMoneyRange(p.designLow, p.designHigh)}</strong></div>
      <div class="price-row"><span>С сопровождением</span><strong>${formatMoneyRange(p.supportLow, p.supportHigh)}</strong></div>
      <div class="price-row"><span>Ориентир реализации</span><strong>${formatMoneyRange(p.buildLow, p.buildHigh)}</strong></div>
    </div>
    <div class="price-highlight">
      <strong>${p.packageName}</strong>
      <p>${p.packageText}</p>
    </div>`;
}

function renderSummary() {
  const a = state.answers;
  refs.liveSummary.innerHTML = `
    <h3>Профиль проекта</h3>
    <div class="summary-list">
      ${summaryItem('Объект', a.objectType || '—')}
      ${summaryItem('Площадь', resolveArea(a) ? `${resolveArea(a)} м²` : (a.areaRange || '—'))}
      ${summaryItem('Помещения', a.rooms.length ? a.rooms.join(', ') : '—')}
      ${summaryItem('Стили', a.styles.length ? a.styles.join(' + ') : '—')}
      ${summaryItem('Настроение', a.moods.length ? a.moods.join(' / ') : '—')}
      ${summaryItem('Палитра', a.palette || '—')}
      ${summaryItem('Материалы', a.materials.length ? a.materials.join(', ') : '—')}
      ${summaryItem('Уровень', a.level || '—')}
      ${summaryItem('Услуги', a.services.length ? a.services.join(', ') : '—')}
      ${summaryItem('Сроки', a.timeline || '—')}
    </div>
    <div class="summary-direction"><strong>Предварительное направление:</strong><br>${composeDirection(a)}</div>`;
}

function summaryItem(label, value) {
  return `<div class="summary-item"><small>${label}</small><strong>${value}</strong></div>`;
}

function calculatePricing(a) {
  const area = resolveArea(a) || 95;
  const objectK = findByName(db.objectTypes, a.objectType)?.k || 1;
  const styleK = average(a.styles.map(name => findByName(db.styles, name)?.k || 1)) || 1;
  const moodK = average(a.moods.map(name => findByName(db.moods, name)?.k || 1)) || 1;
  const materialsK = average(a.materials.map(name => findByName(db.materials, name)?.k || 1)) || 1;
  const level = findByName(db.levels, a.level);
  const levelK = level?.k || 1;
  const timeK = findByName(db.timelines, a.timeline)?.k || 1;
  const roomsK = 1 + Math.max(0, a.rooms.length - 3) * 0.025;
  const serviceAdd = a.services.reduce((sum, name) => sum + (findByName(db.services, name)?.add || 0), 0);

  const baseRate = 92;
  const complexity = objectK * styleK * moodK * materialsK * levelK * timeK * roomsK;
  const designBase = area * baseRate * complexity + serviceAdd;
  const designLow = round100(designBase * 0.93);
  const designHigh = round100(designBase * 1.08);
  const supportLow = round100(designBase * 1.2);
  const supportHigh = round100(designBase * 1.38);
  const buildBaseFactor = levelK >= 1.45 ? 1350 : levelK >= 1.2 ? 950 : 650;
  const buildLow = round100(area * buildBaseFactor * styleK * materialsK * objectK * 0.88);
  const buildHigh = round100(area * buildBaseFactor * styleK * materialsK * objectK * 1.22);
  const packageName = level ? `${level.name} package` : 'Базовый draft';
  const packageText = level
    ? `${level.desc}. ${a.services.length ? 'В пакет уже попали: ' + a.services.slice(0, 3).join(', ') + (a.services.length > 3 ? ' и др.' : '') + '.' : 'Состав услуг еще не выбран.'}`
    : 'Выберите уровень проекта, чтобы расчет стал точнее и убедительнее.';

  let stage = 'Ранний ориентир';
  const filled = ['objectType','palette','level','timeline'].filter(k => a[k]).length + a.styles.length + a.materials.length + a.services.length;
  if (filled > 9) stage = 'Продвинутый ориентир';
  if (filled > 13) stage = 'Почти коммерческий предварительный расчет';

  return { designLow, designHigh, supportLow, supportHigh, buildLow, buildHigh, packageName, packageText, stage };
}

function showResult() {
  const a = state.answers;
  const p = calculatePricing(a);
  refs.wizard.classList.add('hidden');
  refs.result.classList.remove('hidden');
  refs.result.innerHTML = `<div class="loader-state">Формируем интерьерный профиль, расчет и AI-бриф…</div>`;
  setTimeout(() => {
    const payload = buildLeadPayload();
    const prompt = buildAIPrompt();
    refs.result.innerHTML = `
      <div class="result-top">
        <div>
          <p class="eyebrow">Персональный результат</p>
          <h2>Интерьерный профиль готов</h2>
          <p class="step-subtitle">Ваше направление — <strong>${composeDirection(a)}</strong>. Стенд собран с акцентом на ${a.materials.slice(0, 2).join(' и ') || 'натуральные материалы'} и палитру <strong>${a.palette || 'по умолчанию'}</strong>.</p>
        </div>
        <div class="helper-badge">AI-ready / CRM-ready</div>
      </div>
      <div class="result-layout">
        <div class="result-block">
          <h3>Коммерческий ориентир</h3>
          <div class="result-highlight">
            <article><small>Дизайн-проект</small><strong>${formatMoneyRange(p.designLow, p.designHigh)}</strong></article>
            <article><small>С сопровождением</small><strong>${formatMoneyRange(p.supportLow, p.supportHigh)}</strong></article>
            <article><small>Реализация</small><strong>${formatMoneyRange(p.buildLow, p.buildHigh)}</strong></article>
          </div>
          <div class="summary-list">
            ${summaryItem('Объект', a.objectType)}
            ${summaryItem('Площадь', `${resolveArea(a)} м²`)}
            ${summaryItem('Помещения', a.rooms.join(', '))}
            ${summaryItem('Стиль', a.styles.join(' + '))}
            ${summaryItem('Палитра', a.palette)}
            ${summaryItem('Материалы', a.materials.join(', '))}
            ${summaryItem('Уровень проекта', a.level)}
            ${summaryItem('Сроки', a.timeline)}
          </div>
          <div class="result-actions">
            <button class="primary-btn" id="sendLeadBtn">Отправить запрос</button>
            <button class="ghost-btn" id="restartBtn">Пройти заново</button>
            <button class="ghost-btn" id="copyJsonBtn">Скопировать CRM JSON</button>
            <button class="ghost-btn" id="copyPromptBtn">Скопировать AI prompt</button>
          </div>
        </div>
        <div class="result-block">
          <h3>Рекомендованное направление</h3>
          <div class="result-preview">
            <article style="background:linear-gradient(135deg, ${getScenePalette(a.palette)[0]}, ${getScenePalette(a.palette)[3]})">${a.styles[0] || 'Base concept'}</article>
            <article style="background:linear-gradient(135deg, ${getScenePalette(a.palette)[4]}, ${getScenePalette(a.palette)[7]})">${a.palette || 'Palette'}</article>
            <article style="background:linear-gradient(135deg, ${getScenePalette(a.palette)[8]}, ${getScenePalette(a.palette)[2]})">${a.level || 'Level'}</article>
            <article style="background:linear-gradient(135deg, ${getScenePalette(a.palette)[1]}, ${getScenePalette(a.palette)[6]})">${a.materials[0] || 'Material board'}</article>
          </div>
          <div class="price-highlight" style="margin-top:16px">
            <strong>AI-рекомендация</strong>
            <p>${prompt}</p>
          </div>
          <div class="price-highlight" style="margin-top:12px">
            <strong>Структура для API / CRM</strong>
            <p><code>${escapeHtml(JSON.stringify(payload).slice(0, 260))}...</code></p>
          </div>
        </div>
      </div>`;

    document.getElementById('restartBtn').addEventListener('click', resetAll);
    document.getElementById('sendLeadBtn').addEventListener('click', function() {
      this.textContent = 'Заявка подготовлена ✓';
      this.disabled = true;
      console.log('CRM payload', payload);
      console.log('WhatsApp payload', sendToWhatsApp(payload));
      console.log('Email payload', sendToEmail(payload));
      console.log('AI prompt', prompt);
    });
    document.getElementById('copyJsonBtn').addEventListener('click', async () => {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      flashButton('copyJsonBtn', 'CRM JSON скопирован ✓');
    });
    document.getElementById('copyPromptBtn').addEventListener('click', async () => {
      await navigator.clipboard.writeText(prompt);
      flashButton('copyPromptBtn', 'AI prompt скопирован ✓');
    });
  }, 900);
}

function buildLeadPayload() {
  const a = state.answers;
  const p = calculatePricing(a);
  return {
    source: 'website-configurator',
    brand: 'Casa Interiors Inc.',
    objectType: a.objectType,
    area: resolveArea(a),
    rooms: a.rooms,
    styles: a.styles,
    moods: a.moods,
    palette: a.palette,
    materials: a.materials,
    projectLevel: a.level,
    services: a.services,
    timeline: a.timeline,
    references: a.references,
    referenceLink: a.refLink,
    needRefHelp: a.refHelp,
    pricing: {
      designLow: p.designLow,
      designHigh: p.designHigh,
      supportLow: p.supportLow,
      supportHigh: p.supportHigh,
      buildLow: p.buildLow,
      buildHigh: p.buildHigh
    },
    contact: a.contact,
    styleDirection: composeDirection(a),
    createdAt: new Date().toISOString()
  };
}

function buildAIPrompt() {
  const a = state.answers;
  const p = calculatePricing(a);
  return `Подбери интерьерную концепцию для ${a.objectType || 'объекта'} площадью ${resolveArea(a) || 'не указано'} м². Стилистика: ${a.styles.join(' + ') || 'не выбрана'}. Настроение: ${a.moods.join(', ') || 'не выбрано'}. Палитра: ${a.palette || 'не выбрана'}. Материалы: ${a.materials.join(', ') || 'не выбраны'}. Уровень проекта: ${a.level || 'не выбран'}. Услуги: ${a.services.join(', ') || 'не выбраны'}. Сроки: ${a.timeline || 'не выбраны'}. Дай moodboard-направление, ключевые материалы, мебельные акценты, свет, сценарий атмосферы и 3 рекомендации по реализации. Ориентир дизайна: ${formatMoneyRange(p.designLow, p.designHigh)}.`;
}

function sendToWhatsApp(payload) {
  return { channel: 'whatsapp', message: `Новый лид Casa Interiors: ${payload.contact.name}, ${payload.objectType}, ${payload.area} м², ${payload.styleDirection}.` };
}
function sendToEmail(payload) {
  return { to: 'studio@casa-interiors.com', subject: `Новый лид: ${payload.objectType} / ${payload.contact.name}`, body: JSON.stringify(payload, null, 2) };
}
function sendToCRM(payload) {
  return { endpoint: '/api/leads', method: 'POST', body: payload };
}

function isStepValid(step) {
  const a = state.answers;
  if (step === 1) return !!a.objectType;
  if (step === 2) return !!a.areaRange || Number(a.areaExact) >= 20;
  if (step === 3) return a.rooms.length > 0;
  if (step === 4) return a.styles.length > 0;
  if (step === 5) return a.moods.length > 0;
  if (step === 6) return !!a.palette;
  if (step === 7) return a.materials.length > 0;
  if (step === 8) return !!a.level;
  if (step === 9) return a.services.length > 0;
  if (step === 10) return !!a.timeline;
  if (step === 11) return a.references.length > 0 || !!a.refLink || a.refHelp;
  if (step === 12) {
    const c = a.contact;
    return c.name && c.phone && c.email && c.city && c.preferred && a.consent;
  }
  return false;
}

function toggleMulti(arr, value) {
  const i = arr.indexOf(value);
  if (i >= 0) arr.splice(i, 1); else arr.push(value);
}
function toggleLimited(arr, value, limit) {
  const i = arr.indexOf(value);
  if (i >= 0) arr.splice(i, 1); else if (arr.length < limit) arr.push(value);
}
function findByName(list, name) { return list.find(item => item.name === name); }
function average(arr) { return arr.length ? arr.reduce((a,b) => a+b, 0) / arr.length : 0; }
function round100(num) { return Math.round(num / 100) * 100; }
function formatMoney(value) { return '$' + Number(value || 0).toLocaleString('en-US'); }
function formatMoneyRange(low, high) { return `${formatMoney(low)} – ${formatMoney(high)}`; }
function resolveArea(a) {
  if (Number(a.areaExact) >= 20) return Number(a.areaExact);
  const map = { 'до 50 м²': 45, '50–100 м²': 78, '100–150 м²': 125, '150–250 м²': 190, '250+ м²': 280 };
  return map[a.areaRange] || 0;
}
function getScenePalette(name) {
  return findByName(db.palettes, name)?.scene || db.palettes[0].scene;
}
function materialClass(name) {
  return findByName(db.materials, name)?.cls || 'material-default';
}
function composeDirection(a) {
  const style = a.styles.length ? a.styles.slice(0, 2).join(' + ') : 'Refined modern baseline';
  const mood = a.moods[0] || 'сдержанный премиальный тон';
  return `${style} · ${mood}`;
}
function paletteDesc(name) {
  const map = {
    'Светлая нейтральная': 'Воздух, чистота и мягкий свет',
    'Теплая бежевая': 'Комфорт, тактильность и тепло',
    'Графитовая': 'Контраст, глубина и статус',
    'Natural Earthy': 'Натуральная связь с материалами',
    'Темная luxury': 'Драматичный high-end сценарий',
    'Мрамор + дерево': 'Баланс премиальности и уюта'
  };
  return map[name] || 'Персональная колористика';
}
function roomDesc(name) {
  const map = {
    'Гостиная':'Главная эмоция пространства', 'Кухня':'Функция + композиция', 'Спальня':'Приватный сценарий', 'Детская':'Безопасность и рост', 'Кабинет':'Фокус и статус',
    'Гардеробная':'Хранение и порядок', 'Ванная':'Материальность и comfort', 'Санузел':'Компактная точность', 'Прихожая':'Первое впечатление', 'Терраса':'Лайфстайл-слой',
    'Коммерческий зал':'Сценарий продаж', 'Ресепшен':'Точка бренда', 'Переговорная':'Имидж и функция'
  };
  return map[name] || 'Функциональная зона';
}
function flashButton(id, text) {
  const btn = document.getElementById(id);
  const prev = btn.textContent;
  btn.textContent = text;
  setTimeout(() => btn.textContent = prev, 1500);
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, s => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[s]));
}

refs.startBtn.addEventListener('click', () => startConfigurator(false));
refs.startDemoBtn.addEventListener('click', () => startConfigurator(true));
refs.loadDemoBtn.addEventListener('click', () => startConfigurator(true));
refs.saveDraftBtn.addEventListener('click', saveDraft);
refs.resetAllBtn.addEventListener('click', resetAll);
refs.prevBtn.addEventListener('click', () => { if (state.step > 1) { state.step--; render(); } });
refs.nextBtn.addEventListener('click', () => {
  if (!isStepValid(state.step)) return;
  if (state.step === TOTAL_STEPS) return showResult();
  state.step++;
  render();
});

// Без автоподхвата старого состояния: чистый вход важнее для презентации.
updateHeader();
renderPreview();
renderPrice();
renderSummary();

// Оставляем ручное восстановление через draft, но не загружаем его автоматически.
window.restoreSavedDraft = () => {
  if (loadDraft()) startConfigurator(false);
};
