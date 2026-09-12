/* ============================================================
 * 大学生活模拟器 · 游戏引擎（main.js）
 * 三个阶段：属性分配 → 剧情推进 → 称号结算
 * ============================================================ */
(function () {
  'use strict';

  const D = GAME_DATA;
  const $ = (id) => document.getElementById(id);

  /* ---------- 游戏状态 ---------- */
  const state = {
    attrs: {},        // 当前五维数值
    mode: 'ideal',    // ideal / hard / random
    gender: '1',      // 1 男 / 2 女
    intro: true,      // 是否先播放开篇剧情
    index: 0,         // 当前第几个矛盾
    chosen: false     // 本矛盾是否已选择
  };

  /* ---------- 界面切换 ---------- */
  const screens = { start: $('screen-start'), game: $('screen-game'), result: $('screen-result') };
  function showScreen(name) {
    Object.keys(screens).forEach((k) => screens[k].classList.toggle('active', k === name));
    window.scrollTo(0, 0);
  }

  /* ============================================================
   * 界面一：初始
   * ============================================================ */
  function buildStart() {
    state.attrs = {};
    state.gender = D.defaultGender;
    const list = $('attr-list');
    list.innerHTML = '';

    D.attrs.forEach((a) => {
      state.attrs[a.id] = 0;
      const row = document.createElement('div');
      row.className = 'attr-row';
      row.innerHTML =
        '<span class="attr-name">' + a.name + '</span>' +
        '<button class="attr-btn minus" data-attr="' + a.id + '">−</button>' +
        '<span class="attr-val" id="val-' + a.id + '">0</span>' +
        '<button class="attr-btn plus" data-attr="' + a.id + '">+</button>';
      list.appendChild(row);
    });

    list.querySelectorAll('.attr-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.attr;
        allocate(id, btn.classList.contains('plus') ? 1 : -1);
      });
    });

    // 模式选择（默认选中第一个）
    state.mode = D.modes[0].id;
    const modeList = $('mode-list');
    modeList.innerHTML = '';
    D.modes.forEach((m) => {
      const card = document.createElement('div');
      card.className = 'mode-card' + (m.id === state.mode ? ' selected' : '');
      card.dataset.mode = m.id;
      card.innerHTML = '<div class="mode-name">' + m.name + '</div><div class="mode-desc">' + m.desc + '</div>';
      card.addEventListener('click', () => {
        modeList.querySelectorAll('.mode-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        state.mode = m.id;
      });
      modeList.appendChild(card);
    });

    // 性别选择（默认选 defaultGender）
    const genderList = $('gender-list');
    genderList.innerHTML = '';
    D.genders.forEach((g) => {
      const card = document.createElement('div');
      card.className = 'mode-card' + (g.id === state.gender ? ' selected' : '');
      card.dataset.gender = g.id;
      card.textContent = g.name;
      card.addEventListener('click', () => {
        genderList.querySelectorAll('.mode-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        state.gender = g.id;
      });
      genderList.appendChild(card);
    });

    $('btn-start').addEventListener('click', startGame);
    $('start-hint').textContent = '';
    updatePointsUI();
  }

  function pointsUsed() {
    return D.attrs.reduce((s, a) => s + (state.attrs[a.id] || 0), 0);
  }

  function allocate(id, delta) {
    const next = state.attrs[id] + delta;
    if (next < D.minAttr || next > D.maxAttr) return;
    if (delta > 0 && pointsUsed() >= D.startPoints) return;
    state.attrs[id] = next;
    updatePointsUI();
  }

  function updatePointsUI() {
    const left = D.startPoints - pointsUsed();
    $('points-left').textContent = left;
    D.attrs.forEach((a) => { $('val-' + a.id).textContent = state.attrs[a.id]; });
    document.querySelectorAll('.attr-btn.plus').forEach((b) => {
      b.disabled = left <= 0 || state.attrs[b.dataset.attr] >= D.maxAttr;
    });
    document.querySelectorAll('.attr-btn.minus').forEach((b) => {
      b.disabled = state.attrs[b.dataset.attr] <= D.minAttr;
    });
  }

  /* ============================================================
   * 界面二：游戏
   * ============================================================ */
  function startGame() {
    $('start-hint').textContent = '';
    // 未分配完的剩余点数据直接作废，允许开始（不再强制分配满）

    state.index = 0;
    state.chosen = false;
    state.intro = true;
    $('scene-total').textContent = D.scenes.length;
    $('mode-name').textContent = D.modes.find((m) => m.id === state.mode).name;
    buildAttrBar();
    showScreen('game');
    renderScene();
  }

  function buildAttrBar() {
    const bar = $('attr-bar');
    bar.innerHTML = '';
    D.attrs.forEach((a) => {
      const chip = document.createElement('span');
      chip.className = 'attr-chip';
      chip.id = 'chip-' + a.id;
      bar.appendChild(chip);
    });
    updateAttrBar();
  }

  function updateAttrBar() {
    D.attrs.forEach((a) => {
      const chip = $('chip-' + a.id);
      if (chip) chip.innerHTML = a.name + ' <b>' + state.attrs[a.id] + '</b>';
    });
  }

  function renderScene() {
    // 开篇剧情：随机选一张开场图 + 文案，点按钮进入第一个矛盾
    if (state.intro) {
      $('scene-index').textContent = '序';
      // 固定首图 + 随机一张编号图，两张并排展示
      const slot = $('scene-image');
      slot.style.display = '';
      const first = D.intro.first;
      const pool = D.intro.pool;
      const second = pool[Math.floor(Math.random() * pool.length)];
      slot.innerHTML =
        '<div class="intro-imgs">' +
        '<img src="' + resolveImage(first) + '" alt="开场一">' +
        '<img src="' + resolveImage(second) + '" alt="开场二">' +
        '</div>';
      $('scene-title').textContent = D.intro.title;
      $('scene-text').textContent = D.intro.text;
      const wrap = $('options');
      wrap.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = '深吸一口气，走进校门';
      btn.addEventListener('click', () => {
        state.intro = false;
        renderScene();
      });
      wrap.appendChild(btn);
      $('branch').classList.add('hidden');
      window.scrollTo(0, 0);
      return;
    }

    const scene = D.scenes[state.index];
    state.chosen = false;

    $('scene-index').textContent = state.index + 1;
    setImage($('scene-image'), scene.image, '场景漫画图待替换：' + scene.title);

    $('scene-title').textContent = scene.title;
    $('scene-text').textContent = scene.text || '（矛盾剧情文案待填写）';

    const wrap = $('options');
    wrap.innerHTML = '';
    scene.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt.text || '选项' + (i + 1) + '（文本待替换）';
      btn.addEventListener('click', () => chooseOption(i));
      wrap.appendChild(btn);
    });

    $('branch').classList.add('hidden');
    $('btn-next').textContent = state.index + 1 < D.scenes.length ? '进入下一段剧情' : '查看结果';
    window.scrollTo(0, 0);
  }

  function chooseOption(i) {
    if (state.chosen) return;
    state.chosen = true;

    const scene = D.scenes[state.index];
    const opt = scene.options[i];
    const res = resolveEffect(opt.effects);
    const effect = res.effect;

    // 应用属性效果，收集提示条
    const lines = [];
    Object.keys(effect).forEach((id) => {
      const v = effect[id];
      if (!v) return;
      state.attrs[id] += v;
      const name = D.attrs.find((a) => a.id === id).name;
      lines.push(name + ' ' + (v > 0 ? '+' : '') + v);
    });
    updateAttrBar();

    // 选项锁定 + 选中高亮
    const btns = $('options').children;
    for (let k = 0; k < btns.length; k++) {
      btns[k].disabled = true;
      if (k === i) btns[k].classList.add('chosen');
    }

    // 分支剧情图 + 结果文案 + 效果提示
    setImage($('branch-image'), opt.image, '分支剧情图待替换');
    const ret = $('branch-text');
    ret.textContent = (opt.resultText && opt.resultText[res.line]) || '';
    const el = $('effect-line');
    el.className = 'effect-line';
    if (lines.length === 0) {
      el.className += ' zero';
      el.textContent = '风平浪静，属性没有变化';
    } else {
      el.innerHTML = '';
      lines.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'delta ' + (t.indexOf('-') === -1 ? 'up' : 'down');
        span.textContent = t;
        el.appendChild(span);
      });
    }

    $('branch').classList.remove('hidden');
    setTimeout(() => $('branch').scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  /* 模式 → 效果 + 命中的线（用于结果文案）：
   * ideal 用 effects.ideal；hard 用 effects.hard；
   * random 掷硬币：50% 按 ideal、50% 按 hard，文案跟随实际结果 */
  function resolveEffect(effects) {
    if (state.mode === 'ideal') return { effect: effects.ideal || {}, line: 'ideal' };
    if (state.mode === 'hard') return { effect: effects.hard || {}, line: 'hard' };
    const r = Math.random() < 0.5 ? 'ideal' : 'hard';
    return { effect: effects[r] || {}, line: r };
  }

  function setImage(container, path, placeholderText) {
    container.innerHTML = '';
    // null / undefined：该位置明确不用图片，整体隐藏
    if (path === null || path === undefined) {
      container.style.display = 'none';
      return;
    }
    container.style.display = '';
    if (path) {
      const img = document.createElement('img');
      img.src = resolveImage(path);
      img.alt = placeholderText;
      container.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'placeholder';
      ph.textContent = '🖼 ' + placeholderText;
      container.appendChild(ph);
    }
  }

  /* ---------- 图片路径 %g 性别替换辅助 ---------- */
  function resolveImage(path) {
    // 对象形式：按性别直接取对应路径（用于男女图颠倒的特殊场景）
    if (path && typeof path === 'object') return path[state.gender] || '';
    return path.replace('%g', state.gender);
  }

  /* ============================================================
   * 界面三：结果
   * ============================================================ */
  function tierOf(value) {
    return value <= 3 ? 'low' : value <= 7 ? 'mid' : 'high';
  }
  function titleInfo(attrId, value) {
    return D.attrTitles[attrId][tierOf(value)];
  }

  function showResult() {
    // 属性收拢到 0-10 再评级
    D.attrs.forEach((a) => {
      state.attrs[a.id] = Math.max(D.minAttr, Math.min(D.maxAttr, state.attrs[a.id]));
    });

    const list = $('result-list');
    list.innerHTML = '';
    D.attrs.forEach((a) => {
      const v = state.attrs[a.id];
      const t = titleInfo(a.id, v);
      const row = document.createElement('div');
      row.className = 'result-row';
      row.innerHTML =
        '<span class="result-attr">' + a.name + ' · <b>' + v + '</b></span>' +
        '<span class="result-title">' + t.tag + '</span>';
      list.appendChild(row);
    });

    // 总称号：最高两项 + 最低一项，按「最高desc 却 最低desc 的 次高tag」模板生成
    // 10 种维度组合 × 27 种档位组合 = 270 种，全部由素材自动覆盖
    const top = D.attrs.slice().sort((a, b) => state.attrs[b.id] - state.attrs[a.id]);
    const hi = titleInfo(top[0].id, state.attrs[top[0].id]);
    const mid = titleInfo(top[1].id, state.attrs[top[1].id]);
    const lo = titleInfo(top[top.length - 1].id, state.attrs[top[top.length - 1].id]);
    const finalTitle = hi.desc + '却' + lo.desc + '的' + mid.tag;
    $('result-banner').textContent = '总称号：' + finalTitle;
    $('copy-hint').textContent = '';
    showScreen('result');
  }

  function copyResult() {
    const modeName = D.modes.find((m) => m.id === state.mode).name;
    const text = '🎓 大学生活模拟器 · ' + modeName + '\n' +
      D.attrs.map((a) => a.name + ' ' + state.attrs[a.id] + ' 「' + titleInfo(a.id, state.attrs[a.id]).tag + '」').join('\n') +
      '\n' + $('result-banner').textContent;

    const done = () => { $('copy-hint').textContent = '结果已复制'; };
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { $('copy-hint').textContent = '复制失败，请手动选择文本'; }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  /* ---------- 事件绑定 ---------- */
  $('btn-next').addEventListener('click', () => {
    if (state.index + 1 < D.scenes.length) {
      state.index++;
      renderScene();
    } else {
      showResult();
    }
  });

  $('btn-restart').addEventListener('click', () => {
    buildStart();
    showScreen('start');
  });

  $('btn-copy').addEventListener('click', copyResult);

  /* ---------- 启动 ---------- */
  buildStart();
  showScreen('start');
})();