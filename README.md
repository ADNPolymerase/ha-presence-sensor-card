# HA Presence Sensor Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/ADNPolymerase/ha-presence-sensor-card?sort=semver)](https://github.com/ADNPolymerase/ha-presence-sensor-card/releases)
[![HACS Action](https://github.com/ADNPolymerase/ha-presence-sensor-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/ADNPolymerase/ha-presence-sensor-card/actions/workflows/hacs.yml)
[![Tests](https://github.com/ADNPolymerase/ha-presence-sensor-card/actions/workflows/test.yml/badge.svg)](https://github.com/ADNPolymerase/ha-presence-sensor-card/actions/workflows/test.yml)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)](https://www.home-assistant.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/adnpolymerase)

<a href="https://buymeacoffee.com/adnpolymerase" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60"></a>
<a href="https://adnpolymerase.github.io/HA/" target="_blank"><img src="https://raw.githubusercontent.com/ADNPolymerase/HA/main/assets/site-button.svg" alt="Link to my github.io for my other projects" height="60"></a>

A Lovelace card for presence sensors, mmWave radars and PIRs: the sensor on the wall and its detection fan across the floor, someone standing in it at the distance the radar reads, walking when they move, breathing slowly when they keep still.

mmWave sensors report much more than *occupied*: how far the target is, whether it moves or sits still, the light level. This card puts all of it in one place instead of a tile per entity. No brand assumed: every field is an entity you pick, so it works with **any** integration (Zigbee2MQTT, ZHA, ESPHome, Tuya, Aqara, Linptech, LD2410…).

**[Try the demo](https://adnpolymerase.github.io/ha-presence-sensor-card/docs/demo.html)**: every state in your browser, light or dark, no Home Assistant needed.

> Feedback and issues welcome. 🇫🇷 [Lire en français](README.fr.md)

[![HA Presence Sensor Card screenshot](https://raw.githubusercontent.com/ADNPolymerase/ha-presence-sensor-card/main/docs/screenshot.png)](https://raw.githubusercontent.com/ADNPolymerase/ha-presence-sensor-card/main/docs/screenshot.png)

## Features

- **The detection fan**: the sensor on the wall, its fan across the floor and three range arcs graduated in metres. Clear, the fan stays still and dim; occupied, a sweep runs across it.
- **The target at its distance**: the silhouette stands where the radar sees it, scaled on the detection range (an entity, a number of your own, or 6 m). A PIR, which has no distance, puts it in the middle.
- **Moving or still**: from a movement entity (Aqara FP1E `movement` / `no_movement`, Tuya `motion_state` or `presence_state`, Seeed `Motionless` / `Active`, an LD2410 *moving* or *still target* binary sensor…) or from the state itself. The silhouette walks, or breathes slowly.
- **Several people**: a people count (LD2450, MR60BHA2, a camera's person count) puts up to three silhouettes in the fan, and says how many.
- **Plan view** for sensors that give each target's position (HLK-LD2450, Everything Presence Lite): everyone stands where they are, x and y, with an arrow when they come closer or walk away and a trail of their last steps. The sensor's zones are drawn on the floor, brighter while someone is in them, filter and exclusion zones hatched, entry zones dashed, with one line per zone and one per target. The Everything Presence Lite's polygon zones are drawn as they are, and its fan turns with its installation angle. The room's walls can be drawn around it, and the Everything Presence Lite's last exit is shown in a line.
- **State line**: *Occupied*, *Moving*, *Still*, *Clear* or *Offline*, from an occupancy, presence or motion binary sensor, or a text sensor. *Offline* is drawn in red, so a sensor that stopped answering never looks like an empty room.
- **Info lines**: distance, people, light (in lux, or *Dim* / *Bright* for a Sonoff SNZB-06P), temperature, humidity, heart rate and breathing (the silhouette breathes at the measured rate), *Occupied for 25 min* or *Clear for 1 h 10 min*, and the battery, in red below 15 %. Any other entity can be added with `entities`. Tap a line for that entity's details, tap the card for the sensor's (or set your own `tap_action`). In the plan view, tap a person or a zone to open its entity.
- **The last 24 hours** (`show_history`): a band under the lines, coloured where the room was occupied, moving or still, red where the sensor was offline, with the time occupied over the period. Read once from Home Assistant's history, then kept going with the live state.
- **Any unit**: distances in m, cm, mm, ft or in are all brought back to metres, and a range given as an LD2410 gate number becomes metres too.
- **Visual editor** that fills the distance, range, movement, light and battery from the **same device** as soon as the occupancy entity is picked.
- **14 languages** (EN, FR, DE, ES, IT, NL, PT, SV, NO, DA, PL, RU, ZH, CS), Home Assistant's or pinned on the card.
- **Appearance**: compact mode (a coloured icon instead of the drawing, or the drawing small on the side), the drawing's size and the text's size on their own, the name or the state hidden, a transparent background for a wall tablet, and the full height of its slot. The same settings as ha-appliance-card.

## Supported sensors

Any sensor whose integration gives Home Assistant an occupancy, presence or motion entity works. These are the ones the card knows by name, and fills in on its own from the same device:

| Sensor | Integration | Read |
|---|---|---|
| Aqara FP1E, FP1 | Zigbee2MQTT, ZHA | presence, movement or presence event, distance, range |
| Aqara FP2 | HomeKit, Aqara | presence (one card per zone), light |
| Aqara P1, Philips Hue, IKEA Vallhorn | Zigbee2MQTT, ZHA, Hue | motion, light, temperature, battery |
| Linptech ES1 | Zigbee2MQTT | occupancy, distance, range, light |
| Sonoff SNZB-06P | Zigbee2MQTT, ZHA | occupancy, light (dim / bright) |
| Tuya ZG-204ZM, ZG-204ZV, ZY-M100, MTG075 | Zigbee2MQTT, ZHA, Tuya | presence, motion state, distance, range, light, temperature, humidity, battery |
| HLK-LD2410, LD2412 (Apollo, Screek, Everything Presence One…) | ESPHome | has target, moving / still target, distance, range in gates |
| HLK-LD2450 | ESPHome | target count, each target's x / y, direction and speed, the three zones and their counts (plan view) |
| Everything Presence Lite | ESPHome | occupancy, each target's x / y and speed, four polygon zones and their counts, two exclusions, two entries, installation angle, max distance (plan view) |
| Seeed MR24HPC1, MR60BHA2 | ESPHome | motion status, distance, people, heart rate, breathing |
| Matter occupancy sensors, cameras (person count) | Matter, Frigate, UniFi Protect… | occupancy, or a count of people |

Something missing or misread? Open an issue with the entities and the states your sensor reports.

## Installation (HACS)

1. In HACS, open the menu ⋮ → **Custom repositories**, add `https://github.com/ADNPolymerase/ha-presence-sensor-card` as a **Dashboard**. (Not needed once the card is in the HACS default store.)
2. Search for **HA Presence Sensor Card** and install it.
3. Add a `custom:ha-presence-sensor-card` card (YAML or visual editor).

<details>
<summary>Manual installation</summary>

Copy `dist/ha-presence-sensor-card.js` to `config/www/`, then add `/local/ha-presence-sensor-card.js` as a **JavaScript module** under *Settings → Dashboards → Resources*.
</details>

## Configuration

| Option | Description |
|---|---|
| `entity` | **Required.** The occupancy: a `binary_sensor` (occupancy, presence, motion), an `input_boolean`, a text `sensor` (`none` / `presence` / `move`…), or a count of people (above zero is occupied). |
| `movement_entity` | Moving or still: a `sensor` or `select` (`movement`, `no_movement`, `static`, `large`, `Motionless`, `Active`…) or a `binary_sensor`, on while the target moves (or while it keeps still, when its name says *still*). |
| `target_count_entity` | How many people the sensor sees. Up to three silhouettes, and a *People* line above one. |
| `distance_entity` | The target's distance, in any length unit. Places the silhouette in the fan. |
| `range_entity` | The detection range (`number` or `sensor`), to scale the distance. |
| `detection_range` | The range in metres when no entity gives it. Default `6`. |
| `gate_size` | Metres per gate when the range entity is a gate number (LD2410). Default `0.75`. |
| `illuminance_entity` | Light level, in lux or in words (`dim`, `bright`). |
| `temperature_entity` / `humidity_entity` | Temperature and humidity. |
| `heart_rate_entity` / `breath_rate_entity` | Heart rate and breathing, shown while someone is there. A still silhouette breathes at that rate. |
| `battery_entity` | Battery %. Shown even while the sensor is offline. |
| `entities` | Any other entity, one line each: an id, or `{ entity, name, icon }`. |
| `name` | Title. Defaults to the entity's name. |
| `language` | Show the card in another language than Home Assistant: `en`, `fr`, `de`, `es`, `it`, `nl`, `pt`, `sv`, `no`, `da`, `pl`, `ru`, `zh` or `cs`. The editor keeps your own language. |
| `compact` | `true` (or `hide`) shows a coloured icon instead of the drawing. `side` draws it small (96 px) on the left, with the name and the state beside it and the lines under them across the card. Default `false`. |
| `illustration_size` | The drawing's size, from `0.3` to `1.2` times its own (default `1`), in every mode. The text keeps its size. A slider in the editor. |
| `font_scale` | The text's size, from `0.7` to `1.4` times its own (default `1`). The drawing keeps its size. A slider in the editor. |
| `show_name` / `show_state` | `false` hides the name, or the state line. Both shown by default. |
| `transparent` | `true` removes the card's background, border and shadow, for a card laid on a wall tablet's background. |
| `fill_height` | `true` makes the card take the full height of its slot, so two cards side by side have the same height. |
| `show_since` | *Occupied for* / *Clear for* line. Default `true`. |
| `show_scale` | Distances on the range arcs. Default `true`. |
| `show_history` / `history_hours` | `true` adds a band of the last hours under the lines: occupied, moving or still in their colour, clear in grey, offline in red, and how long the room was occupied. Read from Home Assistant's history (the occupancy entity, and the movement entity when set), again every five minutes. `history_hours`: 24 by default, 1 to 168. Off by default. |
| `tap_action` | What a tap on the card does, in Home Assistant's own words: `more-info` (default, the occupancy entity), `none`, `navigate`, `url`, `toggle`, `perform-action` or `fire-dom-event` (for the popup cards built on browser_mod). In YAML only. |
| `targets` | Plan view: up to three targets, each `{ x, y, direction, speed }` (entity ids; x and y in any length unit). Filled in by the editor from the same device. |
| `zones` | Plan view: up to eight zones, each `{ x1, y1, x2, y2, count, name, type }`, or `{ points, count, name, type }` where `points` is a text entity holding a polygon as `x:y;x:y;…` in mm (Everything Presence Lite). `count` is the zone's people count, `type` is `detection`, `filter` (exclusion) or `entry`. |
| `zone_type_entity` | The sensor's zone type select (`Disabled`, `Detection`, `Filter`). |
| `show_plan` | Plan view when the targets are set. Default `true`; `false` keeps the drawing on the axis. |
| `show_targets` | One line per target in the plan view. Default `true`. |
| `flip_x` | Swap left and right in the plan view. Default `false`. |
| `room` | Plan view: the room's walls in metres as seen on the card, `{ left, right, depth }`: how far the left wall, the right wall and the opposite wall are from the sensor. Any of the three may be left out; a wall beyond the drawing is left open. In the editor. |
| `exit_entity` / `exit_zone_entity` | The Everything Presence Lite's Entry Exit Last Decision and Last Entry Zone: a line tells how long ago someone left, and through which entry zone, or that the sensor holds the room occupied after a target went out of view. Filled in by the editor. |
| `angle_entity` / `installation_angle` | How far the sensor is turned from the wall, in degrees: an entity (the Everything Presence Lite's Installation Angle) or a fixed number. Only the fan turns: the sensor already gives its positions square to the room. |

The colours follow your theme: `--pr-occupied-color` (default blue), `--pr-still-color` (default indigo), `--pr-offline-color` (default the theme's error colour) and `--pr-zone1-color` to `--pr-zone4-color` and `--pr-entry-color` can be set with card-mod or a theme.

### Examples

Linptech ES1 (Zigbee2MQTT): occupancy and distance, no movement.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.office_occupancy
distance_entity: sensor.office_target_distance
range_entity: number.office_motion_detection_distance
illuminance_entity: sensor.office_illuminance
```

Aqara FP1E (Zigbee2MQTT): presence, movement and distance.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.living_room_presence
movement_entity: sensor.living_room_movement
distance_entity: sensor.living_room_target_distance
range_entity: number.living_room_detection_range
```

HLK-LD2410 (ESPHome): range given as a gate number.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.office_radar_target
movement_entity: binary_sensor.office_radar_moving_target
distance_entity: sensor.office_radar_detection_distance
range_entity: number.office_radar_max_move_distance_gate
```

Seeed MR60BHA2 (ESPHome): breathing and heart rate.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.bedroom_has_target
distance_entity: sensor.bedroom_distance
heart_rate_entity: sensor.bedroom_heart_rate
breath_rate_entity: sensor.bedroom_breath_rate
target_count_entity: sensor.bedroom_num_targets
```

HLK-LD2450 (ESPHome): plan view, each target at its position and the zones on the floor. Picking the occupancy entity in the editor fills all of this in.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.lounge_presence
target_count_entity: sensor.lounge_target_count
zone_type_entity: select.lounge_zone_type
targets:
  - x: sensor.lounge_target_1_x
    y: sensor.lounge_target_1_y
    direction: sensor.lounge_target_1_direction
    speed: sensor.lounge_target_1_speed
  - x: sensor.lounge_target_2_x
    y: sensor.lounge_target_2_y
zones:
  - { x1: number.lounge_zone_1_x1, y1: number.lounge_zone_1_y1, x2: number.lounge_zone_1_x2, y2: number.lounge_zone_1_y2, count: sensor.lounge_zone_1_target_count, name: Desk }
  - { x1: number.lounge_zone_2_x1, y1: number.lounge_zone_2_y1, x2: number.lounge_zone_2_x2, y2: number.lounge_zone_2_y2, name: Sofa }
```

Everything Presence Lite (ESPHome): polygon zones, an exclusion, an entry, and the sensor turned in a corner. The editor fills this in too.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.den_occupancy
range_entity: number.den_max_distance
angle_entity: number.den_installation_angle
room: { left: 2.7, right: 3, depth: 6 }
exit_entity: sensor.den_entry_exit_last_decision
exit_zone_entity: sensor.den_entry_exit_last_entry_zone
targets:
  - { x: sensor.den_target_1_x, y: sensor.den_target_1_y, speed: sensor.den_target_1_speed }
  - { x: sensor.den_target_2_x, y: sensor.den_target_2_y, speed: sensor.den_target_2_speed }
zones:
  - { points: text.den_polygon_zone_1, count: sensor.den_zone_1_target_count, name: Desk }
  - { points: text.den_polygon_exclusion_1, type: filter }
  - { points: text.den_polygon_entry_1, type: entry, name: Door }
```

Aqara P1 (plain PIR): motion, light and battery.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.hallway_occupancy
illuminance_entity: sensor.hallway_illuminance
battery_entity: sensor.hallway_battery
```

## Thanks

To [@dasimon135](https://github.com/dasimon135), whose proposal in [ha-appliance-card#51](https://github.com/ADNPolymerase/ha-appliance-card/issues/51) started this card, and whose sensors are its first test bench.

## License

MIT, see [LICENSE](LICENSE).
