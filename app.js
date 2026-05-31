const order = ['belgium', 'eindhoven', 'grave', 'nijmegen', 'arnhem'];
const combatLocations = ['eindhoven', 'grave', 'nijmegen', 'arnhem'];
const labels = {
  belgium: 'Belgium',
  eindhoven: 'Eindhoven',
  grave: 'Grave',
  nijmegen: 'Nijmegen',
  arnhem: 'Arnhem'
};

let game;

const phases = [
  ['setup', 'Setup', '点击“开始游戏”掷空投修正骰，并把修正应用到所有盟军空降单位。'],
  ['battle', 'Battle', '为每个有盟军的地点选择 Attack 或 Defend，然后点击结算战斗。战斗骰会放到骰子池。'],
  ['reinforce', 'German Reinforcement', '从 Arnhem 向南检查德军单位，符合条件的德军 +1；若德军强度高于盟军且当地为盟军控制，Control Die 改为 1。'],
  ['advance', 'Allied Advance', '选择一个盟军单位或 30 Corps，再选择目标地点执行移动。移动完成后进入下一阶段。'],
  ['airborne', '1st Airborne Reinforcement', '若尚未发生，掷 1d6；如果结果 <= Turn Die，1st Airborne +1。'],
  ['turn', 'Advance Turn', 'Turn Die +1；若超过 6 则失败，否则进入下一轮 Battle。'],
  ['gameover', 'Game Over', '游戏已结束。点击“重开”重新开始。']
];

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
    lastPhaseEvents: []
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

function log(message) {
  if (game) game.currentPhaseEvents.push(message);
  $('#log').prepend(`<p>${message}</p>`);
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
      <option value="attack" ${value === 'attack' ? 'selected' : ''}>Attack</option>
      <option value="defend" ${value === 'defend' ? 'selected' : ''}>Defend</option>
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
      Advance
    </button>
  `);
}

function renderMap() {
  $('#mapBoard > .die, #mapBoard > .map-order, #mapBoard > .map-advance').remove();

  order.forEach(key => {
    const loc = game.locations[key];
    const $node = $(`.location[data-loc="${key}"]`);

    $node.toggleClass('allied-control', loc.control === 6);

    if (key !== 'belgium' && loc.control) renderMapDie(loc.control, 'control', key, loc.control === 6 ? 'Allied Control' : 'German Control', loc.control === 6 ? 'allied' : 'german');
    if (loc.german) renderMapDie(loc.german, 'german', key, 'German Unit');
    if (loc.allied) {
      renderMapDie(loc.allied.strength, 'allied', key, loc.allied.name);
      if (game.phase === 'battle' && loc.german) renderMapOrder(key);
      if (game.phase === 'advance') renderMapAdvance(key, 'airborne');
    }
    if (loc.corps) {
      renderMapDie('30C', 'corps', key, '30 Corps');
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
        <label>${labels[key]}
          <select class="order-select" data-loc="${key}">
            <option value="attack" ${value === 'attack' ? 'selected' : ''}>Attack</option>
            <option value="defend" ${value === 'defend' ? 'selected' : ''}>Defend</option>
          </select>
        </label>
        <span>优势：${advantage(loc)}</span>
      </div>
    `);
  });
}

function renderMoveControls() {
  const $unit = $('#moveUnit').empty();
  const $target = $('#moveTarget').empty();

  order.forEach(key => {
    const loc = game.locations[key];
    if (loc.allied) $unit.append(`<option value="airborne:${key}">${loc.allied.name} (${labels[key]})</option>`);
    if (loc.corps) $unit.append(`<option value="corps:${key}">30 Corps (${labels[key]})</option>`);
    $target.append(`<option value="${key}">${labels[key]}</option>`);
  });
}

function renderDicePool(values = []) {
  $('#dicePool').html(values.map(value => renderDie(value, 'roll')).join(''));
}

function renderPhase() {
  const help = Object.fromEntries(phases.map(([key, , text]) => [key, text]));
  const button = {
    setup: '开始游戏',
    battle: '结算战斗',
    reinforce: '执行德军增援',
    advance: '跳过',
    airborne: '执行空降增援',
    turn: '推进回合',
    gameover: '游戏结束'
  };

  $('#phaseList').html(phases.map(([key, name, text]) => `
    <li class="${key === game.phase ? 'active' : ''}" title="${text}">${name}</li>
  `).join(''));
  $('#phaseHelp').text(help[game.phase]);
  $('#lastEvents').html(game.lastPhaseEvents.length ? game.lastPhaseEvents.map(event => `<p>${event}</p>`).join('') : '暂无');
  $('#primaryAction').text(button[game.phase]).prop('disabled', game.over);
  $('#turnDie').text(game.turn);
  $('.map-turn-die').toggleClass('clear-weather', game.weather === 'Clear');
  $('#moveBtn').prop('disabled', game.phase !== 'advance' || game.over);
}

function render() {
  renderMap();
  renderOrders();
  renderMoveControls();
  renderPhase();
}

function checkWinLoss() {
  if (game.locations.arnhem.corps) {
    endGame('胜利：30 Corps 进入 Arnhem！');
    return true;
  }
  const eliminated = combatLocations.some(key => game.locations[key].allied && game.locations[key].allied.strength < 1);
  if (eliminated) {
    endGame('失败：盟军单位被消灭。');
    return true;
  }
  if (game.turn > 6) {
    endGame('失败：Turn Die > 6。');
    return true;
  }
  return false;
}

function endGame(message) {
  setPhase('gameover');
  game.over = true;
  log(message);
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
    log(`${labels[key]} 空投修正骰：${die}，修正 ${mod}。`);
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

    const details = [
      result.a ? `盟军 -${result.a}` : null,
      result.g ? `德军 -${result.g}` : null,
      result.c ? '盟军控制' : null
    ].filter(Boolean).join('，') || '无效果';
    log(`${labels[key]} ${action.toUpperCase()}：优势 ${adv}，掷 ${die} → ${details}。`);
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

    log(`${labels[key]} 德军增援：德军 +1，现为 ${loc.german}${retakesControl ? '；德军强度高于盟军，Control Die 改为 1' : ''}。`);
  });
  game.advancedThisPhase = false;
  setPhase('advance');
}

function adjacent(a, b) {
  return Math.abs(order.indexOf(a) - order.indexOf(b)) === 1;
}

function moveAirborne(from, to) {
  if (order.indexOf(to) !== order.indexOf(from) + 1) {
    log('空降部队只能向 Arnhem 方向移动到相邻地点。');
    return false;
  }
  const source = game.locations[from];
  const target = game.locations[to];
  if (!source.allied) return false;
  if (target.allied) {
    const total = target.allied.strength + source.allied.strength;
    target.allied.strength = Math.min(6, total);
    log(`${source.allied.name} 移动到 ${labels[to]} 并合并，强度 ${total} → ${target.allied.strength}。`);
  } else {
    target.allied = source.allied;
    log(`${source.allied.name} 移动到 ${labels[to]}。`);
  }
  source.allied = null;
  return true;
}

function moveCorps(from, to) {
  if (order.indexOf(to) !== order.indexOf(from) + 1) {
    log('30 Corps 只能向 Arnhem 方向移动到相邻地点。');
    return false;
  }
  const source = game.locations[from];
  const target = game.locations[to];
  if (target.control !== 6) {
    log('30 Corps 只能进入盟军控制地点。');
    return false;
  }

  source.corps = false;
  target.corps = true;
  target.german = null;
  log(`30 Corps 进入 ${labels[to]}，突破并移除当地德军。`);
  return true;
}

function applyMove() {
  const [type, from] = $('#moveUnit').val().split(':');
  const to = $('#moveTarget').val();
  if (from === to) return log('目标地点不能与当前位置相同。');

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
    log('1st Airborne 增援已经发生过，本阶段跳过。');
    setPhase('turn');
    return;
  }

  const die = rollD6();
  renderDicePool([die]);
  if (die <= game.turn) {
    const arnhem = game.locations.arnhem;
    if (arnhem.allied && arnhem.allied.name === '1st Airborne') {
      arnhem.allied.strength = Math.min(6, arnhem.allied.strength + 1);
      log(`1st Airborne 增援骰 ${die} <= Turn Die ${game.turn}：强度 +1。`);
    } else {
      log(`增援成功，但 1st Airborne 已不在 Arnhem，无法执行固定地点增援。`);
    }
    game.weather = 'Clear';
    game.airborneReinforced = true;
  } else {
    log(`1st Airborne 增援骰 ${die} > Turn Die ${game.turn}，无效果。`);
  }
  setPhase('turn');
}

function applyTurnAdvance() {
  game.turn += 1;
  log(`Turn Die 增加到 ${game.turn}。`);
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
  $('#log').prepend('<p>游戏重置。</p>');
  render();
}

$(function () {
  resetGame();

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
