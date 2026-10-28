# HA Presence Sensor Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/ADNPolymerase/ha-presence-sensor-card?sort=semver)](https://github.com/ADNPolymerase/ha-presence-sensor-card/releases)
[![HACS Action](https://github.com/ADNPolymerase/ha-presence-sensor-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/ADNPolymerase/ha-presence-sensor-card/actions/workflows/hacs.yml)
[![Tests](https://github.com/ADNPolymerase/ha-presence-sensor-card/actions/workflows/test.yml/badge.svg)](https://github.com/ADNPolymerase/ha-presence-sensor-card/actions/workflows/test.yml)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)](https://www.home-assistant.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/adnpolymerase)

<a href="https://buymeacoffee.com/adnpolymerase" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60"></a>
<a href="https://adnpolymerase.github.io/HA/" target="_blank"><img src="https://raw.githubusercontent.com/ADNPolymerase/HA/main/assets/site-button.svg" alt="Lien vers mon github.io pour mes autres projets" height="60"></a>

Une carte Lovelace pour les détecteurs de présence, radars mmWave et PIR : le capteur au mur et son éventail de détection au sol, une silhouette qui s'y tient à la distance lue par le radar, qui marche quand elle bouge et respire lentement quand elle reste immobile.

Les capteurs mmWave disent bien plus qu'*occupé* : à quelle distance est la cible, si elle bouge ou reste immobile, la luminosité. Cette carte réunit tout au même endroit au lieu d'une tuile par entité. Aucune marque imposée : chaque champ est une entité que vous choisissez, elle marche donc avec **n'importe quelle** intégration (Zigbee2MQTT, ZHA, ESPHome, Tuya, Aqara, Linptech, LD2410…).

**[Essayer la démo](https://adnpolymerase.github.io/ha-presence-sensor-card/docs/demo.html?lang=fr)** : tous les états dans votre navigateur, en clair ou en sombre, sans Home Assistant.

> Retours et issues bienvenus. 🇬🇧 [Read in English](README.md)

[![Capture de HA Presence Sensor Card](https://raw.githubusercontent.com/ADNPolymerase/ha-presence-sensor-card/main/docs/screenshot.fr.png)](https://raw.githubusercontent.com/ADNPolymerase/ha-presence-sensor-card/main/docs/screenshot.fr.png)

## Fonctionnalités

- **L'éventail de détection** : le capteur au mur, son éventail au sol et trois arcs de portée gradués en mètres. Libre, l'éventail reste fixe et atténué ; occupé, un balayage le parcourt.
- **La cible à sa distance** : la silhouette se tient là où le radar la voit, à l'échelle de la portée de détection (une entité, une valeur de votre choix, ou 6 m). Un PIR, qui n'a pas de distance, la place au milieu.
- **En mouvement ou immobile** : d'après une entité de mouvement (Aqara FP1E `movement` / `no_movement`, Tuya `move` / `presence` / `peaceful`, le capteur binaire *moving target* d'un LD2410…) ou d'après l'état lui-même. La silhouette marche, ou respire lentement.
- **Ligne d'état** : *Occupé*, *En mouvement*, *Immobile*, *Libre* ou *Hors ligne*, d'après un capteur binaire d'occupation, de présence ou de mouvement, ou un capteur texte.
- **Lignes d'info** : distance, luminosité (une lune quand il fait noir), *Occupé depuis 25 min* ou *Libre depuis 1 h 10 min*, et la batterie, en rouge sous 15 %. Un appui sur une ligne ouvre le détail de son entité, un appui sur la carte celui du capteur.
- **Toutes les unités** : les distances en m, cm, mm, ft ou in sont ramenées en mètres.
- **Éditeur visuel** qui remplit distance, portée, mouvement, luminosité et batterie depuis le **même appareil** dès que l'entité de présence est choisie.
- **14 langues** (EN, FR, DE, ES, IT, NL, PT, SV, NO, DA, PL, RU, ZH, CS), celle de Home Assistant ou fixée sur la carte.
- **Mode compact** : une icône colorée à la place du dessin.

## Installation (HACS)

1. Dans HACS, menu ⋮ → **Dépôts personnalisés**, ajoutez `https://github.com/ADNPolymerase/ha-presence-sensor-card` en type **Dashboard**. (Inutile une fois la carte dans le store HACS par défaut.)
2. Cherchez **HA Presence Sensor Card** et installez-la.
3. Ajoutez une carte `custom:ha-presence-sensor-card` (YAML ou éditeur visuel).

<details>
<summary>Installation manuelle</summary>

Copiez `dist/ha-presence-sensor-card.js` dans `config/www/`, puis ajoutez `/local/ha-presence-sensor-card.js` comme **module JavaScript** dans *Paramètres → Tableaux de bord → Ressources*.
</details>

## Configuration

| Option | Description |
|---|---|
| `entity` | **Obligatoire.** L'occupation : un `binary_sensor` (occupancy, presence, motion), un `input_boolean`, ou un `sensor` texte (`none` / `presence` / `move`…). |
| `movement_entity` | En mouvement ou immobile : un `sensor` ou `select` (`movement`, `no_movement`, `stationary`, `move`, `peaceful`…) ou un `binary_sensor` allumé quand la cible bouge. |
| `distance_entity` | La distance de la cible, dans n'importe quelle unité. Place la silhouette dans l'éventail. |
| `range_entity` | La portée de détection (`number` ou `sensor`), pour mettre la distance à l'échelle. |
| `detection_range` | La portée en mètres quand aucune entité ne la donne. Par défaut `6`. |
| `illuminance_entity` | Luminosité. |
| `battery_entity` | Batterie en %. Affichée même quand le capteur est hors ligne. |
| `name` | Titre. Par défaut le nom de l'entité. |
| `language` | Afficher la carte dans une autre langue que Home Assistant : `en`, `fr`, `de`, `es`, `it`, `nl`, `pt`, `sv`, `no`, `da`, `pl`, `ru`, `zh` ou `cs`. L'éditeur garde votre langue. |
| `compact` | Icône colorée au lieu du dessin. Par défaut `false`. |
| `show_since` | Ligne *Occupé depuis* / *Libre depuis*. Par défaut `true`. |
| `show_scale` | Distances sur les arcs de portée. Par défaut `true`. |

Les couleurs suivent votre thème : `--pr-occupied-color` (bleu par défaut) et `--pr-still-color` (indigo par défaut) se règlent avec card-mod ou un thème.

### Exemples

Linptech ES1 (Zigbee2MQTT) : occupation et distance, pas de mouvement.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.bureau_occupancy
distance_entity: sensor.bureau_target_distance
range_entity: number.bureau_motion_detection_distance
illuminance_entity: sensor.bureau_illuminance
```

Aqara FP1E (Zigbee2MQTT) : présence, mouvement et distance.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.salon_presence
movement_entity: sensor.salon_movement
distance_entity: sensor.salon_target_distance
range_entity: number.salon_detection_range
```

Aqara P1 (PIR simple) : mouvement, luminosité et batterie.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.couloir_occupancy
illuminance_entity: sensor.couloir_illuminance
battery_entity: sensor.couloir_battery
```

## Remerciements

À [@dasimon135](https://github.com/dasimon135), dont la proposition dans [ha-appliance-card#51](https://github.com/ADNPolymerase/ha-appliance-card/issues/51) est à l'origine de cette carte, et dont les capteurs sont le premier banc d'essai.

## Licence

MIT, voir [LICENSE](LICENSE).
