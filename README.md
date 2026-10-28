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
- **Moving or still**: from a movement entity (Aqara FP1E `movement` / `no_movement`, Tuya `move` / `presence` / `peaceful`, an LD2410 *moving target* binary sensor…) or from the state itself. The silhouette walks, or breathes slowly.
- **State line**: *Occupied*, *Moving*, *Still*, *Clear* or *Offline*, from an occupancy, presence or motion binary sensor, or a text sensor.
- **Info lines**: distance, light (a moon when it is dark), *Occupied for 25 min* or *Clear for 1 h 10 min*, and the battery, in red below 15 %. Tap a line for that entity's details, tap the card for the sensor's.
- **Any unit**: distances in m, cm, mm, ft or in are all brought back to metres.
- **Visual editor** that fills the distance, range, movement, light and battery from the **same device** as soon as the occupancy entity is picked.
- **14 languages** (EN, FR, DE, ES, IT, NL, PT, SV, NO, DA, PL, RU, ZH, CS), Home Assistant's or pinned on the card.
- **Compact mode**: a coloured icon instead of the drawing.

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
| `entity` | **Required.** The occupancy: a `binary_sensor` (occupancy, presence, motion), an `input_boolean`, or a text `sensor` (`none` / `presence` / `move`…). |
| `movement_entity` | Moving or still: a `sensor` or `select` (`movement`, `no_movement`, `stationary`, `move`, `peaceful`…) or a `binary_sensor` that is on while the target moves. |
| `distance_entity` | The target's distance, in any length unit. Places the silhouette in the fan. |
| `range_entity` | The detection range (`number` or `sensor`), to scale the distance. |
| `detection_range` | The range in metres when no entity gives it. Default `6`. |
| `illuminance_entity` | Light level. |
| `battery_entity` | Battery %. Shown even while the sensor is offline. |
| `name` | Title. Defaults to the entity's name. |
| `language` | Show the card in another language than Home Assistant: `en`, `fr`, `de`, `es`, `it`, `nl`, `pt`, `sv`, `no`, `da`, `pl`, `ru`, `zh` or `cs`. The editor keeps your own language. |
| `compact` | Coloured icon instead of the drawing. Default `false`. |
| `show_since` | *Occupied for* / *Clear for* line. Default `true`. |
| `show_scale` | Distances on the range arcs. Default `true`. |

The colours follow your theme: `--pr-occupied-color` (default blue) and `--pr-still-color` (default indigo) can be set with card-mod or a theme.

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
