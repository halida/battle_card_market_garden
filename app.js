const order = ['belgium', 'eindhoven', 'grave', 'nijmegen', 'arnhem'];
const combatLocations = ['eindhoven', 'grave', 'nijmegen', 'arnhem'];
function locLabel(key) {
  return i18n[language].locations[key] || key;
}

let game;
let language = 'zh';

const i18n = {
  zh: {
    locations: {
      belgium: '比利时',
      eindhoven: '埃因霍温',
      grave: '赫拉弗',
      nijmegen: '奈梅亨',
      arnhem: '阿纳姆'
    },
    unitNames: {
      '101st Airborne': '第101空降师',
      '82nd Airborne': '第82空降师',
      '1st Airborne': '第1空降师'
    },
    mapTitles: {
      alliedControl: '盟军控制',
      germanControl: '德军控制',
      germanUnit: '德军单位',
      thirtyCorps: '第30军'
    },
    tagline: '放置骰子、选择行动，带领第30军抵达阿纳姆。',
    infoLink: '游戏介绍',
    languageLabel: '语言',
    phaseTitle: '阶段',
    lastEventsTitle: '上一阶段事件',
    resetButton: '重开',
    moveTitle: '盟军移动',
    moveHelp: '盟军推进阶段在地图上的 30C 右侧选择前进目标。',
    unitLabel: '单位',
    targetLabel: '目标',
    moveButton: '执行移动',
    logTitle: '记录',
    infoAlt: '游戏介绍',
    none: '暂无',
    attack: '攻击',
    defend: '防御',
    advantage: '优势',
    phaseNames: {
      setup: '部署',
      battle: '战斗',
      reinforce: '德军增援',
      advance: '盟军推进',
      airborne: '空降兵增援',
      turn: '推进回合',
      gameover: '游戏结束'
    },
    phaseHelp: {
      setup: '点击“开始游戏”掷空投修正骰，并把修正应用到所有盟军空降单位。',
      battle: '为每个有盟军的地点选择攻击或防御，然后点击结算战斗。战斗骰会放到骰子池。',
      reinforce: '从阿纳姆向南检查德军单位，符合条件的德军 +1；若德军强度高于盟军且当地为盟军控制，控制骰改为 1。',
      advance: '选择一个盟军单位或第30军，再选择目标地点执行移动。移动完成后进入下一阶段。',
      airborne: '若尚未发生，掷 1d6；如果结果 <= 回合骰，第1空降师 +1。',
      turn: '回合骰 +1；若超过 6 则失败，否则进入下一轮战斗。',
      gameover: '游戏已结束。点击“重开”重新开始。'
    },
    buttons: {
      setup: '开始游戏',
      battle: '结算战斗',
      reinforce: '执行德军增援',
      advance: '跳过',
      airborne: '执行空降增援',
      turn: '推进回合',
      gameover: '游戏结束'
    },
    messages: {
      win: '胜利：第30军进入阿纳姆！',
      alliedEliminated: '失败：盟军单位被消灭。',
      turnExceeded: '失败：回合骰 > 6。',
      airdrop: '{location} 空投修正骰：{die}，修正 {mod}。',
      alliedLoss: '盟军 -{value}',
      germanLoss: '德军 -{value}',
      alliedControl: '盟军控制',
      noEffect: '无效果',
      battle: '{location} {action}：优势 {advantage}，掷 {die} → {details}。',
      germanReinforcement: '{location} 德军增援：德军 +1，现为 {strength}{controlChange}。',
      germanControlChange: '；德军强度高于盟军，控制骰改为 1',
      airborneAdjacentOnly: '空降部队只能向阿纳姆方向移动到相邻地点。',
      airborneMerged: '{unit} 移动到 {location} 并合并，强度 {total} → {strength}。',
      airborneMoved: '{unit} 移动到 {location}。',
      corpsAdjacentOnly: '第30军只能向阿纳姆方向移动到相邻地点。',
      corpsAlliedControlOnly: '第30军只能进入盟军控制地点。',
      corpsMoved: '第30军进入 {location}，突破并移除当地德军。',
      sameTarget: '目标地点不能与当前位置相同。',
      airborneAlreadyReinforced: '第1空降师增援已经发生过，本阶段跳过。',
      airborneReinforced: '第1空降师增援骰 {die} <= 回合骰 {turn}：强度 +1。',
      airborneAway: '增援成功，但第1空降师已不在阿纳姆，无法执行固定地点增援。',
      airborneFailed: '第1空降师增援骰 {die} > 回合骰 {turn}，无效果。',
      turnAdvanced: '回合骰增加到 {turn}。',
      gameReset: '游戏重置。'
    }
  },
  en: {
    locations: {
      belgium: 'Belgium',
      eindhoven: 'Eindhoven',
      grave: 'Grave',
      nijmegen: 'Nijmegen',
      arnhem: 'Arnhem'
    },
    unitNames: {
      '101st Airborne': '101st Airborne',
      '82nd Airborne': '82nd Airborne',
      '1st Airborne': '1st Airborne'
    },
    mapTitles: {
      alliedControl: 'Allied Control',
      germanControl: 'German Control',
      germanUnit: 'German Unit',
      thirtyCorps: '30 Corps'
    },
    tagline: 'Place dice, choose actions, and lead 30 Corps to Arnhem.',
    infoLink: 'Game Info',
    languageLabel: 'Language',
    phaseTitle: 'Phases',
    lastEventsTitle: 'Previous Phase Events',
    resetButton: 'Restart',
    moveTitle: 'Allied Movement',
    moveHelp: 'During Allied Advance, choose an advance target beside 30C on the map.',
    unitLabel: 'Unit',
    targetLabel: 'Target',
    moveButton: 'Move',
    logTitle: 'Log',
    infoAlt: 'Game information',
    none: 'None',
    attack: 'Attack',
    defend: 'Defend',
    advantage: 'Advantage',
    phaseNames: {
      setup: 'Setup',
      battle: 'Battle',
      reinforce: 'German Reinforcement',
      advance: 'Allied Advance',
      airborne: '1st Airborne Reinforcement',
      turn: 'Advance Turn',
      gameover: 'Game Over'
    },
    phaseHelp: {
      setup: 'Click “Start Game” to roll the Airdrop adjustment die and apply it to all Allied airborne units.',
      battle: 'Choose Attack or Defend for each location with Allied units, then resolve battles. Battle dice go to the dice pool.',
      reinforce: 'Check German units from Arnhem southward. Eligible German units gain +1; if German strength is higher than Allied strength and the location has Allied control, set the Control Die to 1.',
      advance: 'Choose an Allied unit or 30 Corps, then choose a target location to move. After moving, proceed to the next phase.',
      airborne: 'If it has not happened yet, roll 1d6. If the result is <= Turn Die, 1st Airborne gains +1.',
      turn: 'Increase Turn Die by 1. If it exceeds 6, the game is lost; otherwise return to Battle.',
      gameover: 'The game is over. Click “Restart” to start again.'
    },
    buttons: {
      setup: 'Start Game',
      battle: 'Resolve Battles',
      reinforce: 'Reinforce Germans',
      advance: 'Skip',
      airborne: 'Reinforce Airborne',
      turn: 'Advance Turn',
      gameover: 'Game Over'
    },
    messages: {
      win: 'Victory: 30 Corps entered Arnhem!',
      alliedEliminated: 'Defeat: an Allied unit was eliminated.',
      turnExceeded: 'Defeat: Turn Die > 6.',
      airdrop: '{location} Airdrop adjustment die: {die}, modifier {mod}.',
      alliedLoss: 'Allied -{value}',
      germanLoss: 'German -{value}',
      alliedControl: 'Allied control',
      noEffect: 'No effect',
      battle: '{location} {action}: advantage {advantage}, rolled {die} → {details}.',
      germanReinforcement: '{location} German reinforcement: German +1, now {strength}{controlChange}.',
      germanControlChange: '; German strength is higher than Allied strength, Control Die changed to 1',
      airborneAdjacentOnly: 'Airborne units can only move one adjacent location toward Arnhem.',
      airborneMerged: '{unit} moved to {location} and merged, strength {total} → {strength}.',
      airborneMoved: '{unit} moved to {location}.',
      corpsAdjacentOnly: '30 Corps can only move one adjacent location toward Arnhem.',
      corpsAlliedControlOnly: '30 Corps can only enter Allied-controlled locations.',
      corpsMoved: '30 Corps entered {location}, broke through, and removed the local German unit.',
      sameTarget: 'The target location cannot be the current location.',
      airborneAlreadyReinforced: '1st Airborne reinforcement has already occurred; skipping this phase.',
      airborneReinforced: '1st Airborne reinforcement die {die} <= Turn Die {turn}: strength +1.',
      airborneAway: 'Reinforcement succeeded, but 1st Airborne is no longer in Arnhem, so the fixed-location reinforcement cannot be applied.',
      airborneFailed: '1st Airborne reinforcement die {die} > Turn Die {turn}; no effect.',
      turnAdvanced: 'Turn Die increased to {turn}.',
      gameReset: 'Game reset.'
    }
  }
};

const phaseKeys = ['setup', 'battle', 'reinforce', 'advance', 'airborne', 'turn', 'gameover'];

function initialGame() {
  return {
    phase: 'setup',
    turn: 1,
    weather: 'Fog',
    airborneReinforced: false,
    advancedThisPhase: false,
    over: false,
    locations: {
      belgium: { allied: null, german: null, control: 6, corps: true },
      eindhoven: { allied: { name: '101st Airborne', strength: 6 }, german: 2, control: 1, corps: false },
      grave: { allied: { name: '82nd Airborne', strength: 6 }, german: 2, control: 1, corps: false },
      nijmegen: { allied: null, german: 1, control: 1, corps: false },
      arnhem: { allied: { name: '1st Airborne', strength: 5 }, german: 2, control: 1, corps: false }
    },
    orders: {},
    currentPhaseEvents: [],
    lastPhaseEvents: [],
    logEvents: []
  };
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function advantage(loc) {
  const allied = loc.allied ? loc.allied.strength : 0;
  const german = loc.german || 0;
  if (allied > german) return 'All';
  if (german > allied) return 'Ger';
  return 'No';
}

function combatResult(type, adv, die) {
  const band = die === 1 ? 'low' : die <= 4 ? 'mid' : 'high';
  const tables = {
    attack: {
      All: { low: { a: 1 }, mid: { a: 1, g: 1, c: true }, high: { g: 1, c: true } },
      Ger: { low: { a: 3 }, mid: { a: 2, g: 1 }, high: { g: 1, c: true } },
      No: { low: { a: 2 }, mid: { a: 1, g: 1 }, high: { g: 1, c: true } }
    },
    defend: {
      All: { low: { g: 1, a: 1 }, mid: {}, high: {} },
      Ger: { low: { a: 2 }, mid: { a: 1 }, high: {} },
      No: { low: { a: 1 }, mid: { a: 1, g: 1 }, high: { g: 1 } }
    }
  };
  return tables[type][adv][band];
}

function t(key) {
  return i18n[language][key];
}

function unitDisplay(name) {
  return i18n[language].unitNames[name] || name;
}

function translate(key, data = {}) {
  const template = i18n[language].messages[key];
  return template.replace(/\{(\w+)\}/g, (_, name) => data[name]);
}

function logMessage(key, data = {}) {
  const event = { key, data };
  if (game) {
    game.currentPhaseEvents.push(event);
    game.logEvents.push(event);
  }
  $('#log').prepend(`<p>${renderEvent(event)}</p>`);
}

function renderEvent(event) {
  if (typeof event === 'string') return event;
  if (event.key === 'battle') {
    const details = event.data.detailEvents.length
      ? event.data.detailEvents.map(detail => translate(detail.key, detail.data)).join(language === 'zh' ? '，' : ', ')
      : translate('noEffect');
    return translate('battle', { ...event.data, action: t(event.data.action), details });
  }
  if (event.key === 'germanReinforcement') {
    return translate('germanReinforcement', {
      ...event.data,
      controlChange: event.data.retakesControl ? translate('germanControlChange') : ''
    });
  }
  return translate(event.key, event.data);
}

function setPhase(phase) {
  if (game.phase !== phase) {
    game.lastPhaseEvents = game.currentPhaseEvents;
    game.currentPhaseEvents = [];
  }
  game.phase = phase;
}

function dieClass(kind, owner = '') {
  return `die ${kind}${owner ? ` ${owner}` : ''}`;
}

function renderDie(value, kind, title = '', loc = '', owner = '') {
  const locAttr = loc ? ` data-loc="${loc}"` : '';
  return `<span class="${dieClass(kind, owner)}" data-kind="${kind}"${locAttr} title="${title}">${value}</span>`;
}

function renderMapDie(value, kind, loc, title, owner = '') {
  $('#mapBoard').append(renderDie(value, kind, title, loc, owner));
}

function renderMapOrder(key) {
  const value = game.orders[key] || 'attack';
  $('#mapBoard').append(`
    <select class="map-order order-select" data-loc="${key}">
      <option value="attack" ${value === 'attack' ? 'selected' : ''}>${t('attack')}</option>
      <option value="defend" ${value === 'defend' ? 'selected' : ''}>${t('defend')}</option>
    </select>
  `);
}

function advanceTarget(from, type) {
  const target = order[order.indexOf(from) + 1];
  if (!target) return null;
  if (type === 'corps') return game.locations[target].control === 6 ? target : null;
  return target;
}

function renderMapAdvance(from, type) {
  if (game.advancedThisPhase) return;

  const target = advanceTarget(from, type);
  if (!target) return;

  $('#mapBoard').append(`
    <button class="map-advance" data-type="${type}" data-from="${from}" data-to="${target}">
      ${i18n[language].phaseNames.advance}
    </button>
  `);
}

function renderMap() {
  $('#mapBoard > .die, #mapBoard > .map-order, #mapBoard > .map-advance').remove();

  order.forEach(key => {
    const loc = game.locations[key];
    const $node = $(`.location[data-loc="${key}"]`);

    $node.toggleClass('allied-control', loc.control === 6);

    if (key !== 'belgium' && loc.control) renderMapDie(loc.control, 'control', key, loc.control === 6 ? i18n[language].mapTitles.alliedControl : i18n[language].mapTitles.germanControl, loc.control === 6 ? 'allied' : 'german');
    if (loc.german) renderMapDie(loc.german, 'german', key, i18n[language].mapTitles.germanUnit);
    if (loc.allied) {
      renderMapDie(loc.allied.strength, 'allied', key, unitDisplay(loc.allied.name));
      if (game.phase === 'battle' && loc.german) renderMapOrder(key);
      if (game.phase === 'advance') renderMapAdvance(key, 'airborne');
    }
    if (loc.corps) {
      renderMapDie('30C', 'corps', key, i18n[language].mapTitles.thirtyCorps);
      if (game.phase === 'advance') renderMapAdvance(key, 'corps');
    }
  });
}

function renderOrders() {
  const $orders = $('#orders').empty();
  combatLocations.forEach(key => {
    const loc = game.locations[key];
    if (!loc.allied || !loc.german) return;
    const value = game.orders[key] || 'attack';
    $orders.append(`
      <div class="order-row">
        <label>${locLabel(key)}
          <select class="order-select" data-loc="${key}">
            <option value="attack" ${value === 'attack' ? 'selected' : ''}>${t('attack')}</option>
            <option value="defend" ${value === 'defend' ? 'selected' : ''}>${t('defend')}</option>
          </select>
        </label>
        <span>${t('advantage')}: ${advantage(loc)}</span>
      </div>
    `);
  });
}

function renderMoveControls() {
  const $unit = $('#moveUnit').empty();
  const $target = $('#moveTarget').empty();

  order.forEach(key => {
    const loc = game.locations[key];
    if (loc.allied) $unit.append(`<option value="airborne:${key}">${unitDisplay(loc.allied.name)} (${locLabel(key)})</option>`);
    if (loc.corps) $unit.append(`<option value="corps:${key}">${i18n[language].mapTitles.thirtyCorps} (${locLabel(key)})</option>`);
    $target.append(`<option value="${key}">${locLabel(key)}</option>`);
  });
}

function renderDicePool(values = []) {
  $('#dicePool').html(values.map(value => renderDie(value, 'roll')).join(''));
}

function renderStaticText() {
  $('[data-i18n]').each(function () {
    $(this).text(t($(this).data('i18n')));
  });
  $('[data-i18n-alt]').each(function () {
    $(this).attr('alt', t($(this).data('i18n-alt')));
  });
  $('#closeInfo').attr('aria-label', language === 'zh' ? '关闭' : 'Close');
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
}

function renderPhase() {
  $('#phaseList').html(phaseKeys.map(key => `
    <li class="${key === game.phase ? 'active' : ''}" title="${i18n[language].phaseHelp[key]}">${i18n[language].phaseNames[key]}</li>
  `).join(''));
  $('#phaseHelp').text(i18n[language].phaseHelp[game.phase]);
  $('#lastEvents').html(game.lastPhaseEvents.length ? game.lastPhaseEvents.map(event => `<p>${renderEvent(event)}</p>`).join('') : t('none'));
  $('#primaryAction').text(i18n[language].buttons[game.phase]).prop('disabled', game.over);
  $('#turnDie').text(game.turn);
  $('.map-turn-die').toggleClass('clear-weather', game.weather === 'Clear');
  $('#moveBtn').prop('disabled', game.phase !== 'advance' || game.over);
}

function render() {
  renderStaticText();
  renderMap();
  renderOrders();
  renderMoveControls();
  renderPhase();
}

function checkWinLoss() {
  if (game.locations.arnhem.corps) {
    endGame('win');
    return true;
  }
  const eliminated = combatLocations.some(key => game.locations[key].allied && game.locations[key].allied.strength < 1);
  if (eliminated) {
    endGame('alliedEliminated');
    return true;
  }
  if (game.turn > 6) {
    endGame('turnExceeded');
    return true;
  }
  return false;
}

function endGame(messageKey) {
  setPhase('gameover');
  game.over = true;
  logMessage(messageKey);
}

function applySetup() {
  const dice = [];
  combatLocations.forEach(key => {
    const loc = game.locations[key];
    if (!loc.allied) return;

    const die = rollD6();
    const mod = die <= 2 ? -2 : die <= 4 ? -1 : 0;
    loc.allied.strength += mod;
    dice.push(die);
    logMessage('airdrop', { location: locLabel(key), die, mod });
  });
  renderDicePool(dice);
  setPhase('battle');
  checkWinLoss();
}

function applyBattle() {
  const dice = [];
  combatLocations.forEach(key => {
    const loc = game.locations[key];
    if (!loc.allied || !loc.german) return;

    const action = game.orders[key] || 'attack';
    const adv = advantage(loc);
    const die = rollD6();
    const result = combatResult(action, adv, die);
    dice.push(die);

    if (result.a) loc.allied.strength -= result.a;
    if (result.g) loc.german = Math.max(1, (loc.german || 1) - result.g);
    if (result.c) loc.control = 6;
    if (loc.german > (loc.allied ? loc.allied.strength : 0)) loc.control = 1;

    const detailEvents = [
      result.a ? { key: 'alliedLoss', data: { value: result.a } } : null,
      result.g ? { key: 'germanLoss', data: { value: result.g } } : null,
      result.c ? { key: 'alliedControl', data: {} } : null
    ].filter(Boolean);
    const details = detailEvents.length
      ? detailEvents.map(detail => translate(detail.key, detail.data)).join(language === 'zh' ? '，' : ', ')
      : translate('noEffect');
    logMessage('battle', { location: locLabel(key), action, advantage: adv, die, details, detailEvents });
  });
  renderDicePool(dice);
  if (!checkWinLoss()) setPhase('reinforce');
}

function applyGermanReinforcement() {
  ['arnhem', 'nijmegen', 'grave', 'eindhoven'].forEach(key => {
    if (key === 'nijmegen' && game.locations.arnhem.control !== 1) return;

    const loc = game.locations[key];
    if (!loc.german) return;
    loc.german += 1;

    const alliedStrength = loc.allied ? loc.allied.strength : 0;
    const retakesControl = loc.control === 6 && loc.german > alliedStrength;
    if (retakesControl) loc.control = 1;

    logMessage('germanReinforcement', {
      location: locLabel(key),
      strength: loc.german,
      controlChange: retakesControl ? translate('germanControlChange') : '',
      retakesControl
    });
  });
  game.advancedThisPhase = false;
  setPhase('advance');
}

function adjacent(a, b) {
  return Math.abs(order.indexOf(a) - order.indexOf(b)) === 1;
}

function moveAirborne(from, to) {
  if (order.indexOf(to) !== order.indexOf(from) + 1) {
    logMessage('airborneAdjacentOnly');
    return false;
  }
  const source = game.locations[from];
  const target = game.locations[to];
  if (!source.allied) return false;
  if (target.allied) {
    const total = target.allied.strength + source.allied.strength;
    target.allied.strength = Math.min(6, total);
    logMessage('airborneMerged', { unit: unitDisplay(source.allied.name), location: locLabel(to), total, strength: target.allied.strength });
  } else {
    target.allied = source.allied;
    logMessage('airborneMoved', { unit: unitDisplay(source.allied.name), location: locLabel(to) });
  }
  source.allied = null;
  return true;
}

function moveCorps(from, to) {
  if (order.indexOf(to) !== order.indexOf(from) + 1) {
    logMessage('corpsAdjacentOnly');
    return false;
  }
  const source = game.locations[from];
  const target = game.locations[to];
  if (target.control !== 6) {
    logMessage('corpsAlliedControlOnly');
    return false;
  }

  source.corps = false;
  target.corps = true;
  target.german = null;
  logMessage('corpsMoved', { location: locLabel(to) });
  return true;
}

function applyMove() {
  const [type, from] = $('#moveUnit').val().split(':');
  const to = $('#moveTarget').val();
  if (from === to) return logMessage('sameTarget');

  if (type === 'airborne') moveAirborne(from, to);
  if (type === 'corps') moveCorps(from, to);
  checkWinLoss();
  render();
}

function applyMapAdvance() {
  if (game.advancedThisPhase) return;

  const type = $(this).data('type');
  const from = $(this).data('from');
  const to = $(this).data('to');
  const moved = type === 'airborne' ? moveAirborne(from, to) : moveCorps(from, to);
  if (moved) {
    game.advancedThisPhase = true;
    if (!checkWinLoss()) setPhase('airborne');
  }
  render();
}

function applyAirborneReinforcement() {
  if (game.airborneReinforced) {
    logMessage('airborneAlreadyReinforced');
    setPhase('turn');
    return;
  }

  const die = rollD6();
  renderDicePool([die]);
  if (die <= game.turn) {
    const arnhem = game.locations.arnhem;
    if (arnhem.allied && arnhem.allied.name === '1st Airborne') {
      arnhem.allied.strength = Math.min(6, arnhem.allied.strength + 1);
      logMessage('airborneReinforced', { die, turn: game.turn });
    } else {
      logMessage('airborneAway');
    }
    game.weather = 'Clear';
    game.airborneReinforced = true;
  } else {
    logMessage('airborneFailed', { die, turn: game.turn });
  }
  setPhase('turn');
}

function applyTurnAdvance() {
  game.turn += 1;
  logMessage('turnAdvanced', { turn: game.turn });
  if (!checkWinLoss()) setPhase('battle');
}

function nextPhaseAction() {
  if (game.phase === 'setup') applySetup();
  else if (game.phase === 'battle') applyBattle();
  else if (game.phase === 'reinforce') applyGermanReinforcement();
  else if (game.phase === 'advance') setPhase('airborne');
  else if (game.phase === 'airborne') applyAirborneReinforcement();
  else if (game.phase === 'turn') applyTurnAdvance();
  render();
}

function resetGame() {
  game = initialGame();
  $('#log').empty();
  renderDicePool([]);
  game.logEvents.push({ key: 'gameReset', data: {} });
  $('#log').prepend(`<p>${translate('gameReset')}</p>`);
  render();
}

$(function () {
  $('#languageSelect').val(language);
  resetGame();

  $('#languageSelect').on('change', function () {
    language = $(this).val();
    render();
    $('#log').html(game.logEvents.slice().reverse().map(event => `<p>${renderEvent(event)}</p>`).join(''));
  });
  $('#primaryAction').on('click', nextPhaseAction);
  $('#resetGame').on('click', resetGame);
  $('#moveBtn').on('click', applyMove);
  $('#orders, #mapBoard').on('change', '.order-select', function () {
    game.orders[$(this).data('loc')] = $(this).val();
  });
  $('#mapBoard').on('click', '.map-advance', applyMapAdvance);
  $('#infoLink').on('click', function (event) {
    event.preventDefault();
    $('#infoModal').prop('hidden', false);
  });
  $('#closeInfo, #infoModal').on('click', function (event) {
    if (event.target === this) $('#infoModal').prop('hidden', true);
  });
});
