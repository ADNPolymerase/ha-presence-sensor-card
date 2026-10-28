/**
 * ha-presence-sensor-card — behaviour tests.  Run with:  node test/run.mjs
 *
 * The states below are the ones real sensors report through Zigbee2MQTT
 * (ha-appliance-card#51): two Linptech ES1, an Aqara FP1E and an Aqara P1.
 * What is covered is what silently goes wrong: the state line (the FP1E's
 * no_movement is someone keeping still, not moving), where the silhouette
 * stands, the units of the distances, the lines, the guesses the editor makes
 * from the same device, and the editor contract.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import { loadCard, markup, check, contains, freezeClock, report } from './harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, '..', 'dist', 'ha-presence-sensor-card.js');
const registry = await loadCard(FILE);
const Card   = registry.get('ha-presence-sensor-card');
const Editor = registry.get('ha-presence-sensor-card-editor');

freezeClock('2026-10-28T12:00:00Z');
const NB = ' ';
const OCC = { device_class: 'occupancy' };

/** A state as Home Assistant hands it, changed `ago` minutes before now. */
const s = (state, attributes = {}, ago = 25) => ({
  state: String(state), attributes,
  last_changed: new Date(Date.now() - ago * 60000).toISOString(),
});

function render(cfg, states, language = 'en') {
  const c = new Card();
  c.setConfig(Object.freeze(cfg));
  c.hass = { language, states, callService() {} };
  return markup(c);
}

const stateLine = html => (String(html).match(/<div class="state">([^<]*)</) || [])[1];
const cardMode  = html => (String(html).match(/<ha-card class="m-([a-z]+)/) || [])[1];
const feetY     = html => {
  const m = String(html).match(/class="pr-target" transform="translate\(100 ([\d.]+)\)"/);
  return m ? Number(m[1]) : null;
};
/** Value of the info line whose label is `label`, or null. */
function line(html, label) {
  const re = new RegExp(`<span class="label">${label}</span><span class="value">([^<]*)</span>`);
  const m = String(html).match(re);
  return m ? m[1] : null;
}

// ── The file itself ──────────────────────────────────────────────────────────

const src = readFileSync(FILE, 'utf8');
check('le fichier est en pur ASCII (\\uXXXX partout)', /[^\x00-\x7f]/.test(src), false);

// Every language has every key: a missing one would fall back to English in
// the middle of a translated card.
{
  const block = src.slice(src.indexOf('const T = {'), src.indexOf('\n};\n', src.indexOf('const T = {')));
  const langs = [...block.matchAll(/^  ([a-z]{2}): \{$/gm)].map(m => m[1]);
  check('14 langues', langs.length, 14);
  const keysOf = code => {
    const start = block.indexOf(`  ${code}: {`);
    const end = block.indexOf('\n  },', start);
    return [...block.slice(start, end).matchAll(/(\w+): "/g)].map(m => m[1]).sort().join(',');
  };
  const en = keysOf('en');
  for (const l of langs) check(`langue ${l} : toutes les clés`, keysOf(l), en);
}

// ── Linptech ES1: occupancy and distance, no movement ────────────────────────

const ES1 = {
  entity: 'binary_sensor.bureau_occupancy',
  distance_entity: 'sensor.bureau_target_distance',
  range_entity: 'number.bureau_motion_detection_distance',
  illuminance_entity: 'sensor.bureau_illuminance',
};
const es1 = (occ, dist, range = 450, extra = {}) => ({
  'binary_sensor.bureau_occupancy': s(occ, OCC),
  'sensor.bureau_target_distance': s(dist, { unit_of_measurement: 'cm' }),
  'number.bureau_motion_detection_distance': s(range, { unit_of_measurement: 'cm', min: 0, max: 600, step: 75 }),
  'sensor.bureau_illuminance': s(116, { unit_of_measurement: 'lx', device_class: 'illuminance' }),
  ...extra,
});

check('ES1 : occupé', stateLine(render(ES1, es1('on', 180))), 'Occupied');
check('ES1 : libre', stateLine(render(ES1, es1('off', 0))), 'Clear');
check('ES1 : hors ligne', stateLine(render(ES1, es1('unavailable', 0))), 'Offline');
check('ES1 : dessin occupé', cardMode(render(ES1, es1('on', 180))), 'occupied');
check('ES1 : silhouette à 302 cm sur 450', feetY(render(ES1, es1('on', 302))), 16 + 100 * 0.67);
check('ES1 : au bout de la portée, pas au-delà', feetY(render(ES1, es1('on', 900))), 116);
check('ES1 : tout près, pas sur le capteur', feetY(render(ES1, es1('on', 20))), 16 + 100 * 0.42);
check('ES1 : distance en mètres', line(render(ES1, es1('on', 180)), 'Distance'), `1.8${NB}m`);
check('ES1 : lumière', line(render(ES1, es1('on', 180)), 'Light'), `116${NB}lx`);
check('ES1 : occupé depuis', line(render(ES1, es1('on', 180)), 'Occupied for'), `25${NB}min`);
check('ES1 : pas de distance quand libre', line(render(ES1, es1('off', 0)), 'Distance'), null);
check('ES1 : pas de silhouette quand libre', feetY(render(ES1, es1('off', 0))), null);
contains('ES1 : arcs gradués sur la portée (1.5 / 3 / 4.5 m)', render(ES1, es1('on', 180)), `>4.5${NB}m<`);
check('ES1 : graduations masquables', render({ ...ES1, show_scale: false }, es1('on', 180)).includes('<text class="pr-scale"'), false);
check('ES1 : rien que la pile hors ligne', line(render(ES1, es1('unavailable', 0)), 'Light'), null);

// ── Aqara FP1E: presence, movement and a distance in metres ─────────────────

const FP1E = {
  entity: 'binary_sensor.salon_presence',
  movement_entity: 'sensor.salon_movement',
  distance_entity: 'sensor.salon_target_distance',
  range_entity: 'number.salon_detection_range',
};
const fp1e = (pres, mv, dist = 2.4) => ({
  'binary_sensor.salon_presence': s(pres, OCC),
  'sensor.salon_movement': s(mv),
  'sensor.salon_target_distance': s(dist, { unit_of_measurement: 'm' }),
  'number.salon_detection_range': s(6, { unit_of_measurement: 'm' }),
});

check('FP1E : movement bouge', stateLine(render(FP1E, fp1e('on', 'movement'))), 'Moving');
check('FP1E : no_movement est immobile, pas en mouvement', stateLine(render(FP1E, fp1e('on', 'no_movement'))), 'Still');
check('FP1E : no_presence en fin de maintien reste occupé', stateLine(render(FP1E, fp1e('on', 'no_presence'))), 'Occupied');
check('FP1E : libre malgré un mouvement', stateLine(render(FP1E, fp1e('off', 'movement', 0))), 'Clear');
check('FP1E : dessin immobile', cardMode(render(FP1E, fp1e('on', 'no_movement'))), 'still');
check('FP1E : dessin en mouvement', cardMode(render(FP1E, fp1e('on', 'movement'))), 'moving');
check('FP1E : silhouette à 3 m sur 6', feetY(render(FP1E, fp1e('on', 'movement', 3))), 66);
check('FP1E : distance 0 quand libre ne met personne', feetY(render(FP1E, fp1e('off', 'no_presence', 0))), null);
check('FP1E : occupé sans distance (0) → au milieu', feetY(render(FP1E, fp1e('on', 'no_movement', 0))), 16 + 100 * 0.55);
check('FP1E : en français', stateLine(render(FP1E, fp1e('on', 'no_movement'), 'fr')), 'Immobile');
check('FP1E : langue forcée sur la carte',
  stateLine(render({ ...FP1E, language: 'de' }, fp1e('on', 'movement'))), 'In Bewegung');

// ── Aqara P1: plain PIR, light and battery ───────────────────────────────────

const P1 = { entity: 'binary_sensor.couloir_occupancy', illuminance_entity: 'sensor.couloir_illuminance', battery_entity: 'sensor.couloir_battery' };
const p1 = (occ, bat = 100, ago = 70) => ({
  'binary_sensor.couloir_occupancy': s(occ, OCC, ago),
  'sensor.couloir_illuminance': s(0, { unit_of_measurement: 'lx' }),
  'sensor.couloir_battery': s(bat, { unit_of_measurement: '%', device_class: 'battery' }),
});

check('P1 : sans distance, silhouette au milieu', feetY(render(P1, p1('on'))), 16 + 100 * 0.55);
check('P1 : pas de graduation sans distance', render(P1, p1('on')).includes('<text class="pr-scale"'), false);
check('P1 : libre depuis 1 h 10', line(render(P1, p1('off')), 'Clear for'), `1${NB}hr 10${NB}min`);
check('P1 : pile', line(render(P1, p1('on')), 'Battery'), `100${NB}%`);
check('P1 : pile faible signalée', render(P1, p1('on', 9)).includes('class="line caution"'), true);
check('P1 : nuit noire → icône lune', render(P1, p1('on')).includes('mdi:weather-night'), true);
check('P1 : la pile reste même hors ligne',
  line(render(P1, { ...p1('on'), 'binary_sensor.couloir_occupancy': s('unavailable') }), 'Battery'), `100${NB}%`);
check('P1 : durée masquable', line(render({ ...P1, show_since: false }, p1('off')), 'Clear for'), null);
check('moins d\'une minute', line(render(P1, p1('on', 100, 0.2)), 'Occupied for'), `&lt; 1${NB}min`);
check('plus d\'un jour', line(render(P1, p1('on', 100, 60 * 27 + 5)), 'Occupied for'), `1${NB}day 3${NB}hr`);

// ── Other sources ────────────────────────────────────────────────────────────

const one = (cfg, states) => stateLine(render(cfg, states));
// Tuya's presence_state in the main entity: none / presence / move.
const TUYA = { entity: 'sensor.chambre_presence_state' };
check('Tuya : none libre', one(TUYA, { 'sensor.chambre_presence_state': s('none') }), 'Clear');
check('Tuya : presence immobile', one(TUYA, { 'sensor.chambre_presence_state': s('presence') }), 'Still');
check('Tuya : move en mouvement', one(TUYA, { 'sensor.chambre_presence_state': s('move') }), 'Moving');
check('Tuya : large_move en mouvement', one(TUYA, { 'sensor.chambre_presence_state': s('large_move') }), 'Moving');
check('Tuya : peaceful immobile', one(TUYA, { 'sensor.chambre_presence_state': s('peaceful') }), 'Still');
// ESPHome LD2410: a "moving target" binary sensor as the movement.
const LD = { entity: 'binary_sensor.ld2410_presence', movement_entity: 'binary_sensor.ld2410_moving_target' };
check('LD2410 : cible mobile', one(LD, { 'binary_sensor.ld2410_presence': s('on'), 'binary_sensor.ld2410_moving_target': s('on') }), 'Moving');
check('LD2410 : cible immobile', one(LD, { 'binary_sensor.ld2410_presence': s('on'), 'binary_sensor.ld2410_moving_target': s('off') }), 'Still');
check('stationary immobile', one(FP1E, fp1e('on', 'stationary')), 'Still');
check('mouvement inconnu → occupé', one(FP1E, fp1e('on', 'banana')), 'Occupied');
check('mouvement indisponible → occupé', one(FP1E, fp1e('on', 'unavailable')), 'Occupied');
check('entité absente → hors ligne', one({ entity: 'binary_sensor.nope' }, {}), 'Offline');
check('distance en mm', line(render({ entity: 'binary_sensor.p', distance_entity: 'sensor.d' },
  { 'binary_sensor.p': s('on'), 'sensor.d': s(2500, { unit_of_measurement: 'mm' }) }), 'Distance'), `2.5${NB}m`);
check('portée choisie sans entité', feetY(render({ entity: 'binary_sensor.p', distance_entity: 'sensor.d', detection_range: 4 },
  { 'binary_sensor.p': s('on'), 'sensor.d': s(2, { unit_of_measurement: 'm' }) })), 66);
check('compact : une pastille au lieu du dessin', render({ ...P1, compact: true }, p1('on')).includes('class="badge"'), true);
check('compact : pas de dessin', render({ ...P1, compact: true }, p1('on')).includes('<svg'), false);
check('nom par défaut : friendly_name', render({ entity: 'binary_sensor.p' },
  { 'binary_sensor.p': s('on', { friendly_name: 'Bureau' }) }).includes('<div class="name">Bureau</div>'), true);

// ── Escaping ─────────────────────────────────────────────────────────────────

const evil = render({ entity: 'binary_sensor.p', name: 'Salon "<script>alert(1)</script>"' }, { 'binary_sensor.p': s('on') });
contains('nom échappé', evil, '&quot;&lt;script&gt;');
check("nom : rien d'injecté", /<script>alert/.test(evil), false);
const evilUnit = render({ entity: 'binary_sensor.p', illuminance_entity: 'sensor.l' },
  { 'binary_sensor.p': s('on'), 'sensor.l': s(5, { unit_of_measurement: '<img src=x onerror=alert(1)>' }) });
check("unité : rien d'injecté", /<img/.test(evilUnit), false);

// ── Config, more-info, re-render ─────────────────────────────────────────────

let threw = false;
try { new Card().setConfig({}); } catch (e) { threw = true; }
check('entity obligatoire', threw, true);

{
  const c = new Card();
  c.setConfig({ entity: 'binary_sensor.p' });
  c.hass = { language: 'en', states: { 'binary_sensor.p': s('on') } };
  c._moreInfo('sensor.d');
  const ev = c.events.at(-1);
  check('more-info : événement', ev?.type, 'hass-more-info');
  check('more-info : entité', ev?.detail?.entityId, 'sensor.d');
  check('more-info : remonte jusqu’à HA', ev?.bubbles && ev?.composed, true);
  const before = markup(c);
  c.shadowRoot.innerHTML = 'SENTINELLE';
  c.hass = { language: 'en', states: { 'binary_sensor.p': s('on') } };
  check('même état → pas de nouveau rendu', markup(c), 'SENTINELLE');
  c.hass = { language: 'en', states: { 'binary_sensor.p': s('off') } };
  check('nouvel état → nouveau rendu', markup(c) !== 'SENTINELLE' && markup(c) !== before, true);
}

// ── Siblings: what the editor fills from the same device ─────────────────────

function deviceHass(devices) {
  const states = {}, entities = {};
  for (const [device, list] of Object.entries(devices)) {
    for (const [id, attrs] of Object.entries(list)) {
      states[id] = s('0', attrs);
      entities[id] = { entity_id: id, device_id: device };
    }
  }
  return { language: 'en', states, entities };
}
const H = deviceHass({
  es1: {
    'binary_sensor.bureau_occupancy': OCC,
    'sensor.bureau_target_distance': { unit_of_measurement: 'cm' },
    'number.bureau_motion_detection_distance': {},
    'number.bureau_motion_detection_sensitivity': {},
    'number.bureau_static_detection_sensitivity': {},
    'number.bureau_fading_time': {},
    'sensor.bureau_illuminance': { device_class: 'illuminance' },
    'sensor.bureau_presence_keep_time': {},
  },
  fp1e: {
    'binary_sensor.salon_presence': OCC,
    'sensor.salon_movement': {},
    'sensor.salon_target_distance': {},
    'number.salon_detection_range': {},
    'select.salon_motion_sensitivity': {},
    'sensor.salon_device_temperature': {},
  },
  p1: {
    'binary_sensor.couloir_occupancy': OCC,
    'sensor.couloir_illuminance': { device_class: 'illuminance' },
    'sensor.couloir_battery': { device_class: 'battery' },
    'number.couloir_detection_interval': {},
    'select.couloir_motion_sensitivity': {},
  },
  ld: {
    'binary_sensor.ld2410_presence': { device_class: 'occupancy' },
    'binary_sensor.ld2410_moving_target': {},
    'binary_sensor.ld2410_still_target': {},
    'sensor.ld2410_detection_distance': {},
    'sensor.ld2410_moving_distance': {},
    'sensor.ld2410_still_distance': {},
    'number.ld2410_max_move_distance_gate': {},
    'sensor.ld2410_light': { device_class: 'illuminance' },
  },
});
const stub = id => JSON.stringify(Object.entries(Card.getStubConfig({ ...H, states: Object.fromEntries(Object.entries(H.states).filter(([k]) => k === id || H.entities[k].device_id === H.entities[id].device_id)) }))
  .filter(([k]) => k !== 'type' && k !== 'entity').sort());
check('ES1 : champs devinés', stub('binary_sensor.bureau_occupancy'), JSON.stringify([
  ['distance_entity', 'sensor.bureau_target_distance'],
  ['illuminance_entity', 'sensor.bureau_illuminance'],
  ['range_entity', 'number.bureau_motion_detection_distance'],
]));
check('FP1E : champs devinés', stub('binary_sensor.salon_presence'), JSON.stringify([
  ['distance_entity', 'sensor.salon_target_distance'],
  ['movement_entity', 'sensor.salon_movement'],
  ['range_entity', 'number.salon_detection_range'],
]));
check('P1 : champs devinés', stub('binary_sensor.couloir_occupancy'), JSON.stringify([
  ['battery_entity', 'sensor.couloir_battery'],
  ['illuminance_entity', 'sensor.couloir_illuminance'],
]));
check('LD2410 : champs devinés', stub('binary_sensor.ld2410_presence'), JSON.stringify([
  ['distance_entity', 'sensor.ld2410_detection_distance'],
  ['illuminance_entity', 'sensor.ld2410_light'],
  ['movement_entity', 'binary_sensor.ld2410_moving_target'],
  ['range_entity', 'number.ld2410_max_move_distance_gate'],
]));
check('carte ajoutée : un capteur de présence choisi', Card.getStubConfig(H).entity.startsWith('binary_sensor.'), true);
check('sans registre : rien de deviné', JSON.stringify(Card.getStubConfig({ states: H.states })).includes('distance_entity'), false);

// ── Editor contract ──────────────────────────────────────────────────────────
// CustomEvent.detail is a readonly accessor: assigning it after construction
// silently drops the payload and every edit made in the editor is discarded.

const ed = new Editor();
ed.setConfig({ entity: 'binary_sensor.p' });
ed._emit();
const ev = ed.events.at(-1);
check("l'éditeur émet config-changed", ev?.type, 'config-changed');
check('config-changed porte bien detail.config', ev?.detail?.config?.entity, 'binary_sensor.p');

// HA calls setConfig again after every config-changed the editor emits: the
// echo must not rebuild the form (fresh pickers could erase an entity).
const ed2 = new Editor();
ed2.setConfig({ entity: 'binary_sensor.p' });
ed2.hass = { language: 'en', states: {} };
ed2._root.innerHTML = 'SENTINELLE';
ed2.setConfig({ entity: 'binary_sensor.p', name: 'x' });
check("l'écho setConfig ne reconstruit pas le formulaire", markup(ed2), 'SENTINELLE');

// Picking the occupancy entity fills the empty readings, never a chosen one.
const ed3 = new Editor();
ed3.setConfig({ entity: '', movement_entity: 'sensor.mine' });
ed3.hass = H;
ed3._pickEntity('binary_sensor.salon_presence');
const picked = ed3.events.at(-1).detail.config;
check('choix de l’entité : distance remplie', picked.distance_entity, 'sensor.salon_target_distance');
check('choix de l’entité : portée remplie', picked.range_entity, 'number.salon_detection_range');
check('choix de l’entité : un champ déjà choisi est gardé', picked.movement_entity, 'sensor.mine');

const ed4 = new Editor();
ed4.setConfig({ entity: 'binary_sensor.p' });
ed4.hass = { language: 'en', states: {} };
ed4._set('show_since', false);
check('option à vrai par défaut : stockée seulement à false', ed4._config.show_since, false);
ed4._set('show_since', undefined);
check('option remise par défaut : clé retirée', 'show_since' in ed4._config, false);
contains('éditeur : champ portée sans entité', markup(ed4), 'data-field="detection_range"');
contains('éditeur : langue de la carte', markup(ed4), 'data-field="language"');

// ── Multi-brand: what the other integrations write ──────────────────────────
// Field names and states read from the Zigbee2MQTT device pages and from the
// ESPHome components (ld2410, ld2412, ld2450, seeed_mr24hpc1, seeed_mr60bha2).

const MV = (state, cfgExtra = {}, mvId = 'sensor.p_mv') => stateLine(render(
  { entity: 'binary_sensor.p', movement_entity: mvId, ...cfgExtra },
  { 'binary_sensor.p': s('on', OCC), [mvId]: s(state) }));
// Tuya ZG-204ZM motion_state
check('Tuya motion_state large', MV('large'), 'Moving');
check('Tuya motion_state small', MV('small'), 'Moving');
check('Tuya motion_state static', MV('static'), 'Still');
check('Tuya motion_state none → occupé', MV('none'), 'Occupied');
// Aqara FP1 presence_event
check('FP1 enter', MV('enter'), 'Moving');
check('FP1 approach', MV('approach'), 'Moving');
check('FP1 left_enter', MV('left_enter'), 'Moving');
check('FP1 leave → occupé', MV('leave'), 'Occupied');
// Seeed MR24HPC1 motion_status
check('MR24HPC1 Motionless', MV('Motionless'), 'Still');
check('MR24HPC1 Active', MV('Active'), 'Moving');
check('MR24HPC1 None → occupé', MV('None'), 'Occupied');
// LD2410 still target binary sensor: on is still, off is moving
check('LD2410 still target on', MV('on', {}, 'binary_sensor.ld2410_still_target'), 'Still');
check('LD2410 still target off', MV('off', {}, 'binary_sensor.ld2410_still_target'), 'Moving');

// A count of people as the main entity, or as an entity of its own.
const CNT = (n, extra = {}) => render({ entity: 'sensor.salon_target_count', ...extra },
  { 'sensor.salon_target_count': s(n, { state_class: 'measurement' }) });
check('compte 0 → libre', stateLine(CNT(0)), 'Clear');
check('compte 2 → occupé', stateLine(CNT(2)), 'Occupied');
check('compte 2 → deux silhouettes', (CNT(2).match(/class="pr-walker /g) || []).length, 2);
check('compte 2 → ligne Personnes', line(CNT(2), 'People'), '2');
check('compte 5 → trois silhouettes et +2', (CNT(5).match(/class="pr-walker /g) || []).length === 3 && CNT(5).includes('>+2<'), true);
check('compte 1 → pas de ligne Personnes', line(CNT(1), 'People'), null);
check('entité de compte séparée', (render({ entity: 'binary_sensor.p', target_count_entity: 'sensor.n' },
  { 'binary_sensor.p': s('on', OCC), 'sensor.n': s(3) }).match(/class="pr-walker /g) || []).length, 3);

// LD2410 range as a gate number, 0.75 m each: gate 4 is 3 m.
const GATE = { entity: 'binary_sensor.p', distance_entity: 'sensor.d', range_entity: 'number.ld2410_max_move_distance_gate' };
const gateStates = (g) => ({ 'binary_sensor.p': s('on'), 'sensor.d': s(150, { unit_of_measurement: 'cm' }), 'number.ld2410_max_move_distance_gate': s(g) });
check('portée en gates (4 × 0,75 m)', feetY(render(GATE, gateStates(4))), 16 + 100 * 0.5);
contains('portée en gates : arcs gradués à 3 m', render(GATE, gateStates(4)), `>3${NB}m<`);
check('taille de gate réglable', feetY(render({ ...GATE, gate_size: 0.2 }, gateStates(10))), 16 + 100 * 0.75);

// Sonoff SNZB-06P: light in words.
const SNZB = (st) => render({ entity: 'binary_sensor.p', illuminance_entity: 'sensor.p_illumination' },
  { 'binary_sensor.p': s('on', OCC), 'sensor.p_illumination': s(st) });
check('SNZB-06P dim → Sombre', line(SNZB('dim'), 'Light'), 'Dim');
check('SNZB-06P bright → Lumineux', line(SNZB('bright'), 'Light'), 'Bright');
check('SNZB-06P en français', line(render({ entity: 'binary_sensor.p', illuminance_entity: 'sensor.l', language: 'fr' },
  { 'binary_sensor.p': s('on'), 'sensor.l': s('dim') }), 'Lumière'), 'Sombre');

// Philips Hue / Tuya ZG-204ZV: temperature and humidity.
const HUE = render({ entity: 'binary_sensor.p', temperature_entity: 'sensor.t', humidity_entity: 'sensor.h' },
  { 'binary_sensor.p': s('off', { device_class: 'motion' }), 'sensor.t': s(21.46, { unit_of_measurement: '°C' }), 'sensor.h': s(48, { unit_of_measurement: '%' }) });
check('température', line(HUE, 'Temperature'), `21.5${NB}°C`);
check('humidité', line(HUE, 'Humidity'), `48${NB}%`);

// Seeed MR60BHA2: heart and breathing, only while someone is there; the
// still silhouette breathes at the measured rate.
const VITAL = { entity: 'binary_sensor.p', movement_entity: 'sensor.mv', heart_rate_entity: 'sensor.hr', breath_rate_entity: 'sensor.br' };
const vital = (occ) => ({ 'binary_sensor.p': s(occ), 'sensor.mv': s('static'), 'sensor.hr': s(64, { unit_of_measurement: 'bpm' }), 'sensor.br': s(15, { unit_of_measurement: '/min' }) });
check('rythme cardiaque', line(render(VITAL, vital('on')), 'Heart rate'), `64${NB}bpm`);
check('respiration', line(render(VITAL, vital('on')), 'Breathing'), '15/min');
contains('respiration : la silhouette respire à 15/min (4 s)', render(VITAL, vital('on')), '--pr-breath: 4s');
check('pas de signes vitaux quand libre', line(render(VITAL, vital('off')), 'Heart rate'), null);

// entities: anything else, as a line of its own.
const EXTRA = render({ entity: 'binary_sensor.p', entities: ['sensor.keep', { entity: 'sensor.co2', name: 'CO2', icon: 'mdi:molecule-co2' }, 'sensor.missing'] },
  { 'binary_sensor.p': s('on'), 'sensor.keep': s(51, { unit_of_measurement: 'min', friendly_name: 'Presence keep time' }), 'sensor.co2': s(612, { unit_of_measurement: 'ppm' }) });
check('entités libres : nom de l’entité', line(EXTRA, 'Presence keep time'), `51${NB}min`);
check('entités libres : nom choisi', line(EXTRA, 'CO2'), `612${NB}ppm`);
check('entités libres : icône choisie', EXTRA.includes('mdi:molecule-co2'), true);
check('entités libres : absente ignorée', EXTRA.includes('sensor.missing'), false);

// Siblings of the other brands.
const H2 = deviceHass({
  hue: {
    'binary_sensor.hall_motion': { device_class: 'motion' },
    'sensor.hall_illuminance': { device_class: 'illuminance' },
    'sensor.hall_temperature': { device_class: 'temperature' },
    'sensor.hall_battery': { device_class: 'battery' },
  },
  zg204zm: {
    'binary_sensor.office_presence': OCC,
    'sensor.office_motion_state': {},
    'number.office_static_detection_distance': {},
    'sensor.office_illuminance': {},
    'sensor.office_battery': {},
    'number.office_fading_time': {},
  },
  zym100: {
    'binary_sensor.den_presence': OCC,
    'sensor.den_target_distance': {},
    'number.den_minimum_range': {},
    'number.den_maximum_range': {},
    'sensor.den_illuminance': {},
  },
  ld2450: {
    'binary_sensor.room_presence': OCC,
    'sensor.room_target_count': {},
    'sensor.room_target_1_distance': {},
    'sensor.room_target_2_distance': {},
  },
  mr60: {
    'binary_sensor.bed_has_target': OCC,
    'sensor.bed_heart_rate': {},
    'sensor.bed_breath_rate': {},
    'sensor.bed_distance': {},
    'sensor.bed_num_targets': {},
  },
  fp1e: {
    'binary_sensor.lab_presence': OCC,
    'sensor.lab_device_temperature': { device_class: 'temperature' },
  },
});
const sib = (id) => JSON.stringify(Object.entries(Card.getStubConfig({ ...H2,
  states: Object.fromEntries(Object.entries(H2.states).filter(([k]) => H2.entities[k].device_id === H2.entities[id].device_id)) }))
  .filter(([k]) => k !== 'type' && k !== 'entity').sort());
check('Hue : champs devinés', sib('binary_sensor.hall_motion'), JSON.stringify([
  ['battery_entity', 'sensor.hall_battery'], ['illuminance_entity', 'sensor.hall_illuminance'], ['temperature_entity', 'sensor.hall_temperature']]));
check('Tuya ZG-204ZM : champs devinés', sib('binary_sensor.office_presence'), JSON.stringify([
  ['battery_entity', 'sensor.office_battery'], ['illuminance_entity', 'sensor.office_illuminance'],
  ['movement_entity', 'sensor.office_motion_state'], ['range_entity', 'number.office_static_detection_distance']]));
check('Tuya ZY-M100 : portée max, pas min', sib('binary_sensor.den_presence'), JSON.stringify([
  ['distance_entity', 'sensor.den_target_distance'], ['illuminance_entity', 'sensor.den_illuminance'], ['range_entity', 'number.den_maximum_range']]));
check('LD2450 : compte et cible 1', sib('binary_sensor.room_presence'), JSON.stringify([
  ['distance_entity', 'sensor.room_target_1_distance'], ['target_count_entity', 'sensor.room_target_count']]));
check('MR60BHA2 : signes vitaux', sib('binary_sensor.bed_has_target'), JSON.stringify([
  ['breath_rate_entity', 'sensor.bed_breath_rate'], ['distance_entity', 'sensor.bed_distance'],
  ['heart_rate_entity', 'sensor.bed_heart_rate'], ['target_count_entity', 'sensor.bed_num_targets']]));
check('FP1E : la température de la puce n’est pas celle de la pièce', sib('binary_sensor.lab_presence'), '[]');
{
  const ld = deviceHass({ ld: { 'binary_sensor.ld_moving_target': { device_class: 'motion' }, 'binary_sensor.ld_has_target': OCC, 'binary_sensor.ld_still_target': OCC } });
  check('LD2410 : la carte part sur has_target', Card.getStubConfig(ld).entity, 'binary_sensor.ld_has_target');
}
contains('éditeur : autres mesures', markup(ed4), 'data-picker="heart_rate_entity"');

report();
