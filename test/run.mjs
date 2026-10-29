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
check('hors ligne en rouge, pas gris comme une pièce vide', /--pr-color: var\(--pr-offline-color, var\(--error-color/.test(render(ES1, es1('unavailable', 0))), true);
check('libre reste gris', /--pr-color: var\(--disabled-text-color/.test(render(ES1, es1('off', 0))), true);
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

// ── HLK-LD2450 (ESPHome): plan view ──────────────────────────────────────────
// Each target at its own x / y (mm), the zones on the floor, an arrow for who
// comes closer or walks away. A slot at 0 / 0 has no target in it.

const MM = { unit_of_measurement: 'mm' };
const LD50 = {
  entity: 'binary_sensor.salon_presence',
  target_count_entity: 'sensor.salon_target_count',
  targets: [1, 2, 3].map(n => ({
    x: `sensor.salon_target_${n}_x`, y: `sensor.salon_target_${n}_y`,
    direction: `sensor.salon_target_${n}_direction`, speed: `sensor.salon_target_${n}_speed` })),
  zones: [1, 2, 3].map(n => ({
    x1: `number.salon_zone_${n}_x1`, y1: `number.salon_zone_${n}_y1`,
    x2: `number.salon_zone_${n}_x2`, y2: `number.salon_zone_${n}_y2`, count: `sensor.salon_zone_${n}_target_count`,
    // One select types the LD2450's three zones; a zone may say its own.
    ...(n === 3 ? { type: 'filter' } : {}) })),
  zone_type_entity: 'select.salon_zone_type',
};
const ZONES = [[-2300, 900, -500, 2700], [500, 2300, 2700, 4500], [-700, 4500, 700, 5600]];
function ld(targets, { type = 'Detection', occ, zones = ZONES, counts = true } = {}) {
  const st = {
    'binary_sensor.salon_presence': s(occ ?? (targets.length ? 'on' : 'off'), OCC),
    'sensor.salon_target_count': s(targets.length),
    'select.salon_zone_type': s(type),
  };
  for (let n = 1; n <= 3; n++) {
    const tg = targets[n - 1] || { x: 0, y: 0 };
    st[`sensor.salon_target_${n}_x`] = s(tg.x, MM);
    st[`sensor.salon_target_${n}_y`] = s(tg.y, MM);
    st[`sensor.salon_target_${n}_direction`] = s(tg.dir || 'NA');
    st[`sensor.salon_target_${n}_speed`] = s(tg.speed || 0, { unit_of_measurement: 'mm/s' });
    const z = zones[n - 1] || [0, 0, 0, 0];
    ['x1', 'y1', 'x2', 'y2'].forEach((k, i) => { st[`number.salon_zone_${n}_${k}`] = s(z[i], MM); });
    const inside = targets.filter(t => t.x >= Math.min(z[0], z[2]) && t.x <= Math.max(z[0], z[2]) && t.y >= Math.min(z[1], z[3]) && t.y <= Math.max(z[1], z[3]));
    if (counts) st[`sensor.salon_zone_${n}_target_count`] = s(inside.length);
  }
  return st;
}
const pts = html => [...String(html).matchAll(/<g class="pr-pt t-([a-z]+) pr-p\d" data-n="(\d)"(?: data-entity="[^"]*")? transform="translate\(([\d.-]+) ([\d.-]+)\)">/g)]
  .map(m => ({ state: m[1], n: Number(m[2]), x: Number(m[3]), y: Number(m[4]) }));
const zonesOf = html => [...String(html).matchAll(/<g class="pr-zone pr-zone-([a-z]+)( pr-zone-on)?"/g)].map(m => m[1] + (m[2] ? '+' : ''));
const SITTING = { x: -1350, y: 1700, dir: 'Stationary' };
const COMING = { x: 1200, y: 3100, dir: 'Approaching', speed: -700 };
{
  const html = render(LD50, ld([SITTING, COMING]));
  check('LD2450 : deux cibles posées, la troisième (0 / 0) absente', pts(html).length, 2);
  check('LD2450 : cible 1 à sa place (x, y en mm sur 6 m)', JSON.stringify(pts(html).find(p => p.n === 1)), JSON.stringify({ state: 'still', n: 1, x: 77.5, y: 44.3 }));
  check('LD2450 : Stationary respire, Approaching marche', pts(html).map(p => p.state).join(','), 'still,moving');
  check('LD2450 : flèche pour celle qui s’approche', (html.match(/class="pr-heading"/g) || []).length, 1);
  {
    // The arrow's tip is nearer the sensor (100, 16) than her feet when she
    // comes closer, farther when she walks away.
    const tip = h => { const m = String(h).match(/class="pr-heading" d="M[\d. -]+ L([\d.]+) ([\d.]+)/); return m ? Math.hypot(m[1] - 100, m[2] - 16) : null; };
    const feet = h => { const p = pts(h)[0]; return Math.hypot(p.x - 100, p.y - 16); };
    const near = render(LD50, ld([COMING]));
    const far = render(LD50, ld([{ ...COMING, dir: 'Moving away', speed: 700 }]));
    check('LD2450 : flèche vers le capteur quand elle s’approche', tip(near) < feet(near), true);
    check('LD2450 : flèche vers le fond quand elle s’éloigne', tip(far) > feet(far), true);
    check('LD2450 : Moving away', line(far, 'Target 1'), `3.3${NB}m · Moving away · 0.7${NB}m/s`);
  }
  check('LD2450 : ligne de la cible immobile', line(html, 'Target 1'), `2.2${NB}m · Still`);
  check('LD2450 : ligne de la cible qui s’approche', line(html, 'Target 2'), `3.3${NB}m · Approaching · 0.7${NB}m/s`);
  check('LD2450 : pas de troisième ligne de cible', line(html, 'Target 3'), null);
  check('LD2450 : zones dessinées, filtre hachuré', zonesOf(html).join(','), 'detection+,detection+,filter');
  check('LD2450 : compte de la zone 1', line(html, 'Zone 1'), '1');
  check('LD2450 : pas de ligne pour la zone filtre', line(html, 'Zone 3'), null);
  check('LD2450 : plus de ligne Distance seule', line(html, 'Distance'), null);
  check('LD2450 : nombre de personnes', line(html, 'People'), '2');
  check('LD2450 : vue en plan marquée', html.includes('class="pr-plan"'), true);
  check('LD2450 : une cible marche, la pièce est en mouvement', stateLine(html), 'Moving');
  check('LD2450 : personnes avant les cibles', html.indexOf('>People<') < html.indexOf('>Target 1<'), true);
  check('LD2450 : plus de silhouette sur l’axe', feetY(html), null);
}
check('LD2450 : toutes immobiles, la pièce est immobile', stateLine(render(LD50, ld([SITTING, { ...COMING, dir: 'Stationary', speed: 0 }]))), 'Still');
check('LD2450 : gauche et droite inversées', pts(render({ ...LD50, flip_x: true }, ld([SITTING]))).map(p => p.x).join(), '122.5');
check('LD2450 : tout près du mur, la tête ne cache pas le capteur', pts(render(LD50, ld([{ x: 0, y: 300 }]))).map(p => p.y).join(), '42');
check('LD2450 : zones désactivées', zonesOf(render(LD50, ld([SITTING], { type: 'Disabled' }))).length, 0);
check('LD2450 : zone non réglée (0 partout) ignorée', zonesOf(render(LD50, ld([SITTING], { zones: [ZONES[0], [0, 0, 0, 0]] }))).join(), 'detection+');
check('LD2450 : nom de zone choisi', line(render({ ...LD50, zones: [{ ...LD50.zones[0], name: 'Bureau' }] }, ld([SITTING])), 'Bureau'), '1');
check('LD2450 : zone vide = libre', line(render(LD50, ld([SITTING])), 'Zone 2'), 'Clear');
check('LD2450 : sans compteur de zone, compté sur les positions', line(render({ ...LD50, zones: LD50.zones.map(({ count, ...z }) => z) }, ld([SITTING, COMING], { counts: false })), 'Zone 2'), '1');
{
  const html = render(LD50, ld([]));
  check('LD2450 : libre, personne dans le plan', pts(html).length, 0);
  check('LD2450 : libre, les zones restent', zonesOf(html).join(','), 'detection,detection,filter');
  check('LD2450 : libre, zone 1 libre', line(html, 'Zone 1'), 'Clear');
}
check('LD2450 : hors ligne, pas de lignes de cible', line(render(LD50, ld([SITTING], { occ: 'unavailable' })), 'Target 1'), null);
check('LD2450 : hors ligne, personne dans le plan', pts(render(LD50, ld([SITTING], { occ: 'unavailable' }))).length, 0);
{
  const html = render({ ...LD50, show_plan: false }, ld([SITTING, COMING]));
  check('LD2450 : vue en plan coupée, dessin d’origine', pts(html).length === 0 && feetY(html) !== null, true);
  check('LD2450 : vue en plan coupée, pas de zones', zonesOf(html).length, 0);
}
check('LD2450 : lignes de cible masquables', line(render({ ...LD50, show_targets: false }, ld([SITTING])), 'Target 1'), null);
check('LD2450 : en français', line(render(LD50, ld([COMING]), 'fr'), 'Cible 1'), `3,3${NB}m · S&#39;approche · 0,7${NB}m/s`);
{
  const noCount = { ...LD50 };
  delete noCount.target_count_entity;
  check('LD2450 : personnes comptées sur les positions', line(render(noCount, ld([SITTING, COMING])), 'People'), '2');
}
// The trail: same card, the target walks; without a direction sensor the
// card reads it from where the target stood before.
{
  const c = new Card();
  c.setConfig(Object.freeze(LD50));
  const at = (x, y) => { c.hass = { language: 'en', states: ld([{ x, y }]), callService() {} }; return markup(c); };
  at(800, 4200);
  const html = at(600, 3500);
  check('LD2450 : traînée derrière la cible', (html.match(/class="pr-trail"/g) || []).length, 1);
  check('LD2450 : sans capteur de direction, lue sur la traînée', line(html, 'Target 1'), `3.6${NB}m · Approaching`);
  check('LD2450 : elle marche', pts(html).map(p => p.state).join(), 'moving');
  check('LD2450 : un pas trop petit ne laisse pas de trace', (at(620, 3510).match(/class="pr-trail"/g) || []).length, 1);
  freezeClock('2026-10-28T12:00:30Z');
  check('LD2450 : la traînée s’efface', (at(620, 3510).match(/class="pr-trail"/g) || []).length, 0);
  freezeClock('2026-10-28T12:00:00Z');
  at(0, 0);
  check('LD2450 : cible partie, traînée oubliée', (at(600, 3500).match(/class="pr-trail"/g) || []).length, 0);
}
// The editor fills the positions and zones from the same device.
{
  const dev = {};
  dev['binary_sensor.ld_has_target'] = OCC;
  dev['sensor.ld_target_count'] = {};
  for (const n of [1, 2, 3]) {
    for (const k of ['x', 'y', 'speed', 'angle', 'distance', 'resolution', 'direction']) dev[`sensor.ld_target_${n}_${k}`] = {};
    for (const k of ['x1', 'y1', 'x2', 'y2']) dev[`number.ld_zone_${n}_${k}`] = {};
    dev[`sensor.ld_zone_${n}_target_count`] = {};
    dev[`sensor.ld_zone_${n}_moving_target_count`] = {};
  }
  dev['select.ld_zone_type'] = {};
  const stub = Card.getStubConfig(deviceHass({ ld: dev }));
  check('LD2450 : cibles devinées', JSON.stringify(stub.targets[1]), JSON.stringify({
    x: 'sensor.ld_target_2_x', y: 'sensor.ld_target_2_y', direction: 'sensor.ld_target_2_direction', speed: 'sensor.ld_target_2_speed' }));
  check('LD2450 : trois cibles', stub.targets.length, 3);
  check('LD2450 : zones devinées, compte total et pas mobile', JSON.stringify(stub.zones[2]), JSON.stringify({
    x1: 'number.ld_zone_3_x1', y1: 'number.ld_zone_3_y1', x2: 'number.ld_zone_3_x2', y2: 'number.ld_zone_3_y2', count: 'sensor.ld_zone_3_target_count' }));
  check('LD2450 : type de zone deviné', stub.zone_type_entity, 'select.ld_zone_type');
  check('LD2410 : pas de vue en plan sans x / y', 'targets' in Card.getStubConfig(deviceHass({ ld: { 'binary_sensor.ld_has_target': OCC, 'sensor.ld_detection_distance': {} } })), false);
  const edp = new Editor();
  edp.setConfig(LD50);
  edp.hass = { language: 'en', states: {} };
  contains('éditeur : section vue en plan', markup(edp), 'Targets: 3 · Zones: 3');
  contains('éditeur : type de zone', markup(edp), 'data-picker="zone_type_entity"');
  contains('éditeur : nom des zones', markup(edp), 'data-zone="2"');
  contains('éditeur : inverser gauche et droite', markup(edp), 'data-field="flip_x"');
  check('éditeur : pas de section vue en plan sans cibles', markup(ed4).includes('data-field="flip_x"'), false);
}

// ── Appearance (the same settings as ha-appliance-card) ──────────────────────

{
  const on = es1('on', 180);
  const cls = html => (String(html).match(/<ha-card class="([^"]*)"/) || [])[1];
  const illuW = html => Number((String(html).match(/\.illu \{ width:(\d+)px/) || [])[1]);
  const sideW = html => Number((String(html).match(/\.top \.illu \{ flex:none; width:(\d+)px/) || [])[1]);
  const fontPx = html => Number((String(html).match(/:host \{[^}]*font-size:([\d.]+)px/) || [])[1]);
  check('apparence : rien par défaut', cls(render(ES1, on)), 'm-occupied');
  check('compact true : icône au lieu du dessin', cls(render({ ...ES1, compact: true }, on)), 'm-occupied compact');
  check('compact hide = compact true', cls(render({ ...ES1, compact: 'hide' }, on)), 'm-occupied compact');
  contains('compact : la pastille', render({ ...ES1, compact: true }, on), 'class="badge"');
  {
    const html = render({ ...ES1, compact: 'side' }, on);
    check('side : classe', cls(html), 'm-occupied side');
    contains('side : dessin et texte côte à côte', html, '<div class="top"><div class="illu">');
    check('side : pas de pastille', html.includes('class="badge"'), false);
    check('side : pas de graduations, illisibles en petit', html.includes('<text class="pr-scale"'), false);
    check('side : dessin de 96 px', sideW(html), 96);
    check('side : les lignes restent', line(html, 'Distance'), `1.8${NB}m`);
  }
  check('taille du dessin 0,5', illuW(render({ ...ES1, illustration_size: 0.5 }, on)), 120);
  check('taille du dessin bornée à 1,2', illuW(render({ ...ES1, illustration_size: 5 }, on)), 288);
  check('taille du dessin bornée à 0,3', illuW(render({ ...ES1, illustration_size: 0.1 }, on)), 72);
  check('taille du dessin sur le côté', sideW(render({ ...ES1, compact: 'side', illustration_size: 0.5 }, on)), 48);
  check('taille du dessin invalide = 1', illuW(render({ ...ES1, illustration_size: 'abc' }, on)), 240);
  check('taille du texte par défaut', fontPx(render(ES1, on)), 16);
  check('taille du texte 1,25', fontPx(render({ ...ES1, font_scale: 1.25 }, on)), 20);
  check('taille du texte bornée à 1,4', fontPx(render({ ...ES1, font_scale: 3 }, on)), 22.4);
  check('le texte suit sa taille (em, pas px)', /\.name \{ font-size:[\d.]+em/.test(render(ES1, on)), true);
  check('nom masqué', render({ ...ES1, show_name: false }, on).includes('class="name"'), false);
  check('nom masqué, état gardé', stateLine(render({ ...ES1, show_name: false }, on)), 'Occupied');
  check('état masqué', stateLine(render({ ...ES1, show_state: false }, on)), undefined);
  check('nom et état masqués : plus de bloc', render({ ...ES1, show_name: false, show_state: false }, on).includes('class="head"'), false);
  check('fond transparent', cls(render({ ...ES1, transparent: true }, on)), 'm-occupied clear');
  check('pleine hauteur', cls(render({ ...ES1, fill_height: true }, on)), 'm-occupied fill');
  check('side + transparent + pleine hauteur', cls(render({ ...ES1, compact: 'side', transparent: true, fill_height: true }, on)), 'm-occupied side clear fill');
  const size = cfg => { const c = new Card(); c.setConfig(cfg); return c.getCardSize(); };
  check('taille de carte : normale 4, side 3, compact 2', [size(ES1), size({ ...ES1, compact: 'side' }), size({ ...ES1, compact: true })].join(), '4,3,2');
  check('vue en plan sur le côté', pts(render({ ...LD50, compact: 'side' }, ld([SITTING]))).length, 1);
  const eda = new Editor();
  eda.setConfig({ ...ES1, compact: 'side', font_scale: 1.2 });
  eda.hass = { language: 'en', states: {} };
  const em = markup(eda);
  contains('éditeur : mode compact en liste', em, '<option value="side" selected>Drawing on the side</option>');
  contains('éditeur : curseur du dessin', em, 'data-range="illustration_size"');
  contains('éditeur : curseur du texte à sa valeur', em, 'data-range="font_scale" value="1.2"');
  contains('éditeur : transparent', em, 'data-field="transparent"');
  contains('éditeur : pleine hauteur', em, 'data-field="fill_height"');
  check('éditeur : plus de case compact', em.includes('type="checkbox" data-field="compact"'), false);
  check('éditeur : Apparence ouverte quand un réglage est posé', /<details open>\s*<summary>Appearance/.test(em), true);
  check('éditeur : Apparence fermée sinon', /<details open>\s*<summary>Appearance/.test(markup(ed4)), false);
  check('éditeur : nom affiché par défaut', /data-field="show_name" checked/.test(markup(ed4)), true);
}

// ── Tap: Home Assistant's action config, a person and a zone ─────────────────

{
  const tap = (action, extra = {}) => {
    const c = new Card();
    const calls = [];
    c.setConfig({ entity: 'binary_sensor.p', ...(action ? { tap_action: action } : {}), ...extra });
    c.hass = { language: 'en', states: { 'binary_sensor.p': s('on') }, callService: (...a) => calls.push(a) };
    c.events.length = 0;
    c._tap();
    return { ev: c.events.at(-1), n: c.events.length, calls };
  };
  check('tap : ouvre le capteur par défaut', tap().ev?.detail?.entityId, 'binary_sensor.p');
  check('tap : more-info vers une autre entité', tap({ action: 'more-info', entity: 'sensor.x' }).ev?.detail?.entityId, 'sensor.x');
  check('tap : none ne fait rien', tap({ action: 'none' }).n, 0);
  check('tap : navigate', tap({ action: 'navigate', navigation_path: '/lovelace/1' }).ev?.type, 'location-changed');
  check('tap : fire-dom-event pour browser_mod', tap({ action: 'fire-dom-event', browser_mod: {} }).ev?.type, 'll-custom');
  check('tap : toggle', JSON.stringify(tap({ action: 'toggle' }).calls[0]), JSON.stringify(['homeassistant', 'toggle', { entity_id: 'binary_sensor.p' }]));
  check('tap : perform-action', JSON.stringify(tap({ action: 'perform-action', perform_action: 'light.turn_on', target: { entity_id: 'light.a' } }).calls[0]),
    JSON.stringify(['light', 'turn_on', {}, { entity_id: 'light.a' }]));
  check('tap : call-service (ancien nom)', tap({ action: 'call-service', service: 'script.go', service_data: { a: 1 } }).calls[0]?.[2]?.a, 1);
  check('tap : action inconnue → ouvre le capteur', tap({ action: 'wat' }).ev?.type, 'hass-more-info');
  const html = render(LD50, ld([SITTING]));
  contains('plan : la cible ouvre son capteur', html, 'data-n="1" data-entity="sensor.salon_target_1_x"');
  contains('plan : la zone ouvre son compte', html, 'pr-zone-on" data-entity="sensor.salon_zone_1_target_count"');
  contains('plan : sans compte, la zone ouvre son premier coin',
    render({ ...LD50, zones: LD50.zones.map(({ count, ...z }) => z) }, ld([SITTING], { counts: false })), 'data-entity="number.salon_zone_1_x1"');
}

// ── History band ─────────────────────────────────────────────────────────────

{
  const H = 3600000;
  const NOW = Date.now();
  const sec = ms => ms / 1000;
  const cfgH = { entity: 'binary_sensor.p', show_history: true };
  async function band(cfg, rows, states, { ws = true } = {}) {
    const c = new Card();
    const asked = [];
    c.setConfig(cfg);
    const hass = { language: 'en', states, callService() {} };
    if (ws) hass.callWS = (msg) => { asked.push(msg); return Promise.resolve(rows); };
    c.hass = hass;
    await new Promise(r => setTimeout(r, 0));
    return { html: markup(c), asked, c, hass };
  }
  const rects = html => [...String(html).matchAll(/<rect class="h-([a-z]+)" x="([\d.]+)" y="0" width="([\d.]+)"/g)].filter(m => m[1] !== 'bg').map(m => `${m[1]}@${m[2]}+${m[3]}`);
  const legend = html => (String(html).match(/<div class="hist-legend"><span>[^<]*<\/span><span>([^<]*)<\/span>/) || [])[1];
  const P = {
    'binary_sensor.p': [{ s: 'off', lu: sec(NOW - 24 * H) }, { s: 'on', lu: sec(NOW - 6 * H) }, { s: 'off', lu: sec(NOW - 3 * H) }],
  };
  {
    const { html, asked } = await band(cfgH, P, { 'binary_sensor.p': s('on', OCC, 25) });
    check('bande : une seule lecture de l’historique', asked.length, 1);
    check('bande : 24 h par défaut', asked[0]?.start_time, new Date(NOW - 24 * H).toISOString());
    check('bande : lit le capteur seul', JSON.stringify(asked[0]?.entity_ids), JSON.stringify(['binary_sensor.p']));
    check('bande : libre, occupé 3 h, libre, puis l’état en direct',
      rects(html).join(' '), 'clear@0+750 occupied@750+125 clear@875+107.6 occupied@982.6+17.4');
    check('bande : temps occupé sur la période', legend(html), `Occupied · 3${NB}hr 25${NB}min`);
    contains('bande : de −24 h à maintenant', html, `<span>−24${NB}h</span>`);
    contains('bande : ouvre le capteur', html, '<div class="hist" data-entity="binary_sensor.p">');
  }
  {
    const { html, asked } = await band({ ...cfgH, movement_entity: 'sensor.p_motion' }, {
      'binary_sensor.p': [{ s: 'on', lu: sec(NOW - 24 * H) }],
      'sensor.p_motion': [{ s: 'moving', lu: sec(NOW - 24 * H) }, { s: 'still', lu: sec(NOW - 12 * H) }],
    }, { 'binary_sensor.p': s('on', OCC, 24 * 60), 'sensor.p_motion': s('still', {}, 12 * 60) });
    check('bande : lit aussi le mouvement', JSON.stringify(asked[0]?.entity_ids), JSON.stringify(['binary_sensor.p', 'sensor.p_motion']));
    check('bande : en mouvement puis immobile', rects(html).join(' '), 'moving@0+500 still@500+500');
    check('bande : immobile compte comme occupé', legend(html), `Occupied · 1${NB}day`);
  }
  {
    const { html } = await band(cfgH, { 'binary_sensor.p': [{ s: 'off', lu: sec(NOW - 24 * H) }, { s: 'unavailable', lu: sec(NOW - 2 * H) }] },
      { 'binary_sensor.p': s('unavailable', OCC, 120) });
    check('bande : hors ligne en rouge, jamais pris pour libre', rects(html).join(' '), 'clear@0+916.7 offline@916.7+83.3');
    check('bande : jamais occupé', legend(html), 'Clear');
  }
  {
    const { html } = await band(cfgH, { 'binary_sensor.p': [{ s: 'on', lu: sec(NOW - 2 * H) }] }, { 'binary_sensor.p': s('on', OCC, 120) });
    check('bande : avant le premier relevé, rien de dessiné', rects(html).join(' '), 'occupied@916.7+83.3');
  }
  {
    const { asked } = await band({ ...cfgH, history_hours: 500 }, P, { 'binary_sensor.p': s('off', OCC) });
    check('bande : 168 h au plus', asked[0]?.start_time, new Date(NOW - 168 * H).toISOString());
    const one = await band({ ...cfgH, history_hours: 0 }, P, { 'binary_sensor.p': s('off', OCC) });
    check('bande : 1 h au moins', one.asked[0]?.start_time, new Date(NOW - H).toISOString());
  }
  {
    const off = await band({ entity: 'binary_sensor.p' }, P, { 'binary_sensor.p': s('on', OCC) });
    check('bande : désactivée par défaut, rien n’est lu', off.asked.length, 0);
    check('bande : désactivée, pas de bande', off.html.includes('class="hist"'), false);
    const nows = await band(cfgH, P, { 'binary_sensor.p': s('on', OCC) }, { ws: false });
    check('bande : sans callWS, pas de bande', nows.html.includes('class="hist"'), false);
  }
  {
    const { c, hass, asked } = await band(cfgH, P, { 'binary_sensor.p': s('on', OCC) });
    c.hass = { ...hass, states: { 'binary_sensor.p': s('off', OCC, 1) } };
    check('bande : pas relue à chaque état', asked.length, 1);
    check('bande : suit l’état en direct entre deux lectures', rects(markup(c)).join(' '), 'clear@0+750 occupied@750+125 clear@875+125');
    freezeClock(new Date(NOW + 6 * 60000).toISOString());
    c.hass = { ...hass };
    check('bande : relue après cinq minutes', asked.length, 2);
    freezeClock(new Date(NOW).toISOString());
  }
  {
    const ed = new Editor();
    ed.setConfig({ ...cfgH, history_hours: 48 });
    ed.hass = { language: 'fr', states: {} };
    const em = markup(ed);
    contains('éditeur : case de la bande cochée', em, 'data-field="show_history" checked');
    contains('éditeur : heures de la bande', em, 'data-field="history_hours" placeholder="24" value="48"');
    contains('éditeur : traduit', em, 'Heures de la bande');
  }
}

// ── Everything Presence Lite (ESPHome): polygon zones ────────────────────────
// Its zones are text entities "x:y;x:y;..." in mm: four detection zones, two
// exclusions and two entries. Its positions already come out square to the
// room, so only the fan turns with the Installation Angle.
{
  const EPL = {
    entity: 'binary_sensor.epl_occupancy',
    range_entity: 'number.epl_max_distance',
    targets: [1, 2, 3].map(n => ({ x: `sensor.epl_target_${n}_x`, y: `sensor.epl_target_${n}_y`, speed: `sensor.epl_target_${n}_speed` })),
    zones: [
      ...[1, 2, 3, 4].map(n => ({ points: `text.epl_polygon_zone_${n}`, count: `sensor.epl_zone_${n}_target_count` })),
      { points: 'text.epl_polygon_exclusion_1', type: 'filter' }, { points: 'text.epl_polygon_exclusion_2', type: 'filter' },
      { points: 'text.epl_polygon_entry_1', type: 'entry' }, { points: 'text.epl_polygon_entry_2', type: 'entry' },
    ],
    angle_entity: 'number.epl_installation_angle',
  };
  const SQUARE = '-1000:500;1000:500;1000:2500;-1000:2500';
  // An L: its notch (x > 0, y > 1.5 m) is outside.
  const ELL = '-2000:3000;2000:3000;2000:3500;0:3500;0:5000;-2000:5000';
  const epl = (targets, { polys = {}, angle = 0, counts = true } = {}) => {
    const p = { zone_1: SQUARE, zone_2: ELL, zone_3: '', zone_4: '2500:500;2900:500;2900:900;2500:900',
      exclusion_1: '-2900:500;-2500:500;-2700:1200', exclusion_2: '', entry_1: '-300:5300;300:5300;300:5800;-300:5800', entry_2: 'x', ...polys };
    const st = {
      'binary_sensor.epl_occupancy': s(targets.length ? 'on' : 'off', OCC),
      'number.epl_max_distance': s(600, { unit_of_measurement: 'cm' }),
      'number.epl_installation_angle': s(angle, { unit_of_measurement: 'º' }),
    };
    for (const [k, v] of Object.entries(p)) st[`text.epl_polygon_${k}`] = s(v);
    for (let n = 1; n <= 3; n++) {
      const tg = targets[n - 1] || { x: 0, y: 0 };
      st[`sensor.epl_target_${n}_x`] = s(tg.x, MM);
      st[`sensor.epl_target_${n}_y`] = s(tg.y, MM);
      st[`sensor.epl_target_${n}_speed`] = s(tg.speed || 0, { unit_of_measurement: 'm/s' });
    }
    if (counts) for (let n = 1; n <= 4; n++) st[`sensor.epl_zone_${n}_target_count`] = s(n === 1 ? targets.filter(t => Math.abs(t.x) <= 1000 && t.y >= 500 && t.y <= 2500).length : 0);
    return st;
  };
  const IN_SQUARE = { x: 200, y: 1500 };
  const html = render(EPL, epl([IN_SQUARE]));
  check('EP Lite : zones dessinées (vide et illisible sautées)', zonesOf(html).join(','), 'detection+,detection,detection,filter,entry');
  contains('EP Lite : polygone à sa place (mm sur Max Distance en cm)', html, 'points="83.3,24.3 116.7,24.3 116.7,57.7 83.3,57.7"');
  contains('EP Lite : nom au milieu', html, '<text class="pr-zone-mid" x="100" y="43">Zone 1</text>');
  contains('EP Lite : quatrième zone', html, 'var(--pr-zone4-color, #d4609c)');
  contains('EP Lite : exclusion nommée', html, '>Exclusion 1</text>');
  check('EP Lite : exclusion sans « filter » en plus', html.includes('Exclusion 1 · filter'), false);
  contains('EP Lite : entrée nommée et colorée', html, 'class="pr-zone pr-zone-entry" data-entity="text.epl_polygon_entry_1" style="--pr-zc:var(--pr-entry-color, #f9a825)"');
  check('EP Lite : une ligne par zone de détection', line(html, 'Zone 1'), '1');
  check('EP Lite : zone vide sans ligne', line(html, 'Zone 3'), null);
  check('EP Lite : pas de ligne pour l’entrée', line(html, 'Entry 1'), null);
  check('EP Lite : sans angle, le cône ne tourne pas', html.includes('pr-turn'), false);
  contains('EP Lite : angle, le cône tourne', render(EPL, epl([IN_SQUARE], { angle: 30 })), '<g class="pr-turn" transform="rotate(-30 100 16)">');
  contains('EP Lite : angle et gauche/droite inversés', render({ ...EPL, flip_x: true }, epl([IN_SQUARE], { angle: 30 })), 'transform="rotate(30 100 16)"');
  contains('EP Lite : angle fixe sans entité', render({ ...EPL, angle_entity: undefined, installation_angle: -20 }, epl([IN_SQUARE])), 'rotate(20 100 16)');
  check('EP Lite : la cible ne tourne pas avec le cône', JSON.stringify(pts(render(EPL, epl([IN_SQUARE], { angle: 30 })))[0]),
    JSON.stringify(pts(html)[0]));
  {
    const noCount = { ...EPL, zones: EPL.zones.map(({ count, ...z }) => z) };
    check('EP Lite : compté sur les positions dans le L', line(render(noCount, epl([{ x: -1000, y: 4000 }], { counts: false })), 'Zone 2'), '1');
    check('EP Lite : encoche du L hors zone', line(render(noCount, epl([{ x: 1000, y: 4000 }], { counts: false })), 'Zone 2'), 'Clear');
  }
  check('EP Lite : deux sommets ne font pas une zone', zonesOf(render(EPL, epl([], { polys: { zone_1: '0:500;1000:500' } }))).length, 4);
  check('EP Lite : deux sommets, pas de ligne de zone', line(render(EPL, epl([IN_SQUARE], { polys: { zone_1: '0:500;1000:500' } })), 'Zone 1'), null);
  check('EP Lite : lu jusqu’au premier sommet illisible', zonesOf(render(EPL, epl([], { polys: { zone_1: '0:500;1000:500;oops;1000:1500' } }))).length, 4);
  check('EP Lite : zone écrasée hors du dessin ignorée', zonesOf(render(EPL, epl([], { polys: { zone_1: '0:500;0:900;0:1500' } }))).length, 4);
  contains('EP Lite : tap sur la zone ouvre son compteur', html, 'data-entity="sensor.epl_zone_1_target_count"');
  {
    const dev = { 'binary_sensor.epl_occupancy': OCC, 'number.epl_max_distance': {}, 'number.epl_installation_angle': {},
      'switch.epl_upside_down_mounting': {}, 'sensor.epl_occupancy_mask_1_target_count': {}, 'text.epl_entry_exit_last_decision': {} };
    for (const n of [1, 2, 3]) for (const k of ['x', 'y', 'speed', 'angle', 'distance', 'resolution']) dev[`sensor.epl_target_${n}_${k}`] = {};
    for (const n of [1, 2, 3]) dev[`binary_sensor.epl_target_${n}_active`] = {};
    for (const n of [1, 2, 3, 4]) {
      dev[`text.epl_polygon_zone_${n}`] = {};
      dev[`sensor.epl_zone_${n}_target_count`] = {};
      dev[`binary_sensor.epl_zone_${n}_occupancy`] = {};
    }
    for (const n of [1, 2]) { dev[`text.epl_polygon_exclusion_${n}`] = {}; dev[`text.epl_polygon_entry_${n}`] = {}; }
    const stub = Card.getStubConfig(deviceHass({ epl: dev }));
    check('EP Lite : huit zones devinées', stub.zones.length, 8);
    check('EP Lite : zone 4 et son compteur', JSON.stringify(stub.zones[3]), JSON.stringify({ points: 'text.epl_polygon_zone_4', count: 'sensor.epl_zone_4_target_count' }));
    check('EP Lite : exclusion devinée', JSON.stringify(stub.zones[5]), JSON.stringify({ points: 'text.epl_polygon_exclusion_2', type: 'filter' }));
    check('EP Lite : entrée devinée', JSON.stringify(stub.zones[6]), JSON.stringify({ points: 'text.epl_polygon_entry_1', type: 'entry' }));
    check('EP Lite : angle deviné', stub.angle_entity, 'number.epl_installation_angle');
    check('EP Lite : Max Distance comme portée', stub.range_entity, 'number.epl_max_distance');
    check('EP Lite : un compteur de zone n’est pas le nombre de personnes', stub.target_count_entity, undefined);
    check('EP Lite : trois cibles', stub.targets.length, 3);
    const ed = new Editor();
    ed.setConfig(stub);
    ed.hass = { language: 'fr', states: {} };
    const em = markup(ed);
    contains('éditeur EP Lite : angle', em, 'data-picker="angle_entity"');
    contains('éditeur EP Lite : nom de l’exclusion', em, 'Nom (Exclusion 2)');
    contains('éditeur EP Lite : nom de l’entrée', em, 'placeholder="Entrée 1"');
    contains('éditeur EP Lite : nom de la zone 4', em, 'Nom de la zone 4');
  }
}

report();
