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
- **En mouvement ou immobile** : d'après une entité de mouvement (Aqara FP1E `movement` / `no_movement`, Tuya `motion_state` ou `presence_state`, Seeed `Motionless` / `Active`, le capteur binaire *moving* ou *still target* d'un LD2410…) ou d'après l'état lui-même. La silhouette marche, ou respire lentement.
- **Plusieurs personnes** : un nombre de personnes (LD2450, MR60BHA2, le compteur de personnes d'une caméra) place jusqu'à trois silhouettes dans l'éventail, et dit combien.
- **Vue en plan** pour les capteurs qui donnent la position de chaque cible (HLK-LD2450, Everything Presence Lite) : chacun se tient là où il est, en x et en y, avec une flèche quand il s'approche ou s'éloigne et une traînée de ses derniers pas. Les zones du capteur sont dessinées au sol, plus vives quand quelqu'un s'y trouve, hachurées pour les zones filtre et d'exclusion, en pointillés pour les zones d'entrée, avec une ligne par zone et une par cible. Les zones en polygone de l'Everything Presence Lite sont dessinées telles quelles, et son éventail tourne avec son angle d'installation. Les murs de la pièce peuvent être dessinés autour, et la dernière sortie de l'Everything Presence Lite s'affiche sur une ligne.
- **Ligne d'état** : *Occupé*, *En mouvement*, *Immobile*, *Libre* ou *Hors ligne*, d'après un capteur binaire d'occupation, de présence ou de mouvement, ou un capteur texte. *Hors ligne* est dessiné en rouge : un capteur qui ne répond plus ne ressemble jamais à une pièce vide.
- **Lignes d'info** : distance, personnes, luminosité (en lux, ou *Sombre* / *Lumineux* pour un Sonoff SNZB-06P), température, humidité, rythme cardiaque et respiration (la silhouette respire au rythme mesuré), *Occupé depuis 25 min* ou *Libre depuis 1 h 10 min*, et la batterie, en rouge sous 15 %. N'importe quelle autre entité s'ajoute avec `entities`. Un appui sur une ligne ouvre le détail de son entité, un appui sur la carte celui du capteur (ou votre propre `tap_action`). En vue en plan, un appui sur une personne ou une zone ouvre son entité.
- **Les dernières 24 heures** (`show_history`) : une bande sous les lignes, colorée là où la pièce était occupée, en mouvement ou immobile, rouge là où le capteur était hors ligne, avec le temps d'occupation sur la période. Lue une fois dans l'historique de Home Assistant, puis tenue à jour avec l'état en direct.
- **Toutes les unités** : les distances en m, cm, mm, ft ou in sont ramenées en mètres, et une portée donnée en numéro de « gate » LD2410 aussi.
- **Éditeur visuel** qui remplit distance, portée, mouvement, luminosité et batterie depuis le **même appareil** dès que l'entité de présence est choisie.
- **14 langues** (EN, FR, DE, ES, IT, NL, PT, SV, NO, DA, PL, RU, ZH, CS), celle de Home Assistant ou fixée sur la carte.
- **Apparence** : mode compact (une icône colorée à la place du dessin, ou le dessin en petit sur le côté), la taille du dessin et celle du texte chacune de son côté, le nom ou l'état masqués, un fond transparent pour une tablette murale, et toute la hauteur de sa case. Les mêmes réglages que ha-appliance-card.

## Capteurs pris en charge

Tout capteur dont l'intégration donne à Home Assistant une entité d'occupation, de présence ou de mouvement fonctionne. Voici ceux que la carte connaît par leur nom, et qu'elle remplit toute seule depuis le même appareil :

| Capteur | Intégration | Lu |
|---|---|---|
| Aqara FP1E, FP1 | Zigbee2MQTT, ZHA | présence, mouvement ou événement de présence, distance, portée |
| Aqara FP2 | HomeKit, Aqara | présence (une carte par zone), luminosité |
| Aqara P1, Philips Hue, IKEA Vallhorn | Zigbee2MQTT, ZHA, Hue | mouvement, luminosité, température, batterie |
| Linptech ES1 | Zigbee2MQTT | occupation, distance, portée, luminosité |
| Sonoff SNZB-06P | Zigbee2MQTT, ZHA | occupation, luminosité (sombre / lumineux) |
| Tuya ZG-204ZM, ZG-204ZV, ZY-M100, MTG075 | Zigbee2MQTT, ZHA, Tuya | présence, état de mouvement, distance, portée, luminosité, température, humidité, batterie |
| HLK-LD2410, LD2412 (Apollo, Screek, Everything Presence One…) | ESPHome | cible, cible mobile / immobile, distance, portée en gates |
| HLK-LD2450 | ESPHome | nombre de cibles, x / y, direction et vitesse de chaque cible, les trois zones et leur compte (vue en plan) |
| Everything Presence Lite | ESPHome | occupation, x / y et vitesse de chaque cible, quatre zones en polygone et leur compte, deux exclusions, deux entrées, angle d'installation, distance max (vue en plan) |
| Seeed MR24HPC1, MR60BHA2 | ESPHome | état de mouvement, distance, personnes, rythme cardiaque, respiration |
| Capteurs d'occupation Matter, caméras (nombre de personnes) | Matter, Frigate, UniFi Protect… | occupation, ou un nombre de personnes |

Un capteur manque ou est mal lu ? Ouvrez une issue avec les entités et les états qu'il remonte.

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
| `entity` | **Obligatoire.** L'occupation : un `binary_sensor` (occupancy, presence, motion), un `input_boolean`, un `sensor` texte (`none` / `presence` / `move`…), ou un nombre de personnes (au-dessus de zéro, c'est occupé). |
| `movement_entity` | En mouvement ou immobile : un `sensor` ou `select` (`movement`, `no_movement`, `static`, `large`, `Motionless`, `Active`…) ou un `binary_sensor`, allumé quand la cible bouge (ou quand elle reste immobile, si son nom dit *still*). |
| `target_count_entity` | Combien de personnes le capteur voit. Jusqu'à trois silhouettes, et une ligne *Personnes* au-delà d'une. |
| `distance_entity` | La distance de la cible, dans n'importe quelle unité. Place la silhouette dans l'éventail. |
| `range_entity` | La portée de détection (`number` ou `sensor`), pour mettre la distance à l'échelle. |
| `detection_range` | La portée en mètres quand aucune entité ne la donne. Par défaut `6`. |
| `gate_size` | Mètres par gate quand l'entité de portée est un numéro de gate (LD2410). Par défaut `0.75`. |
| `illuminance_entity` | Luminosité, en lux ou en mots (`dim`, `bright`). |
| `temperature_entity` / `humidity_entity` | Température et humidité. |
| `heart_rate_entity` / `breath_rate_entity` | Rythme cardiaque et respiration, affichés quand quelqu'un est là. Une silhouette immobile respire à ce rythme. |
| `battery_entity` | Batterie en %. Affichée même quand le capteur est hors ligne. |
| `entities` | N'importe quelle autre entité, une ligne chacune : un id, ou `{ entity, name, icon }`. |
| `name` | Titre. Par défaut le nom de l'entité. |
| `language` | Afficher la carte dans une autre langue que Home Assistant : `en`, `fr`, `de`, `es`, `it`, `nl`, `pt`, `sv`, `no`, `da`, `pl`, `ru`, `zh` ou `cs`. L'éditeur garde votre langue. |
| `compact` | `true` (ou `hide`) affiche une icône colorée au lieu du dessin. `side` dessine en petit (96 px) à gauche, avec le nom et l'état à côté et les lignes dessous sur toute la largeur. Par défaut `false`. |
| `illustration_size` | La taille du dessin, de `0.3` à `1.2` fois la sienne (par défaut `1`), dans tous les modes. Le texte garde sa taille. Un curseur dans l'éditeur. |
| `font_scale` | La taille du texte, de `0.7` à `1.4` fois la sienne (par défaut `1`). Le dessin garde sa taille. Un curseur dans l'éditeur. |
| `show_name` / `show_state` | `false` masque le nom, ou la ligne d'état. Les deux sont affichés par défaut. |
| `transparent` | `true` retire le fond, la bordure et l'ombre de la carte, pour une carte posée sur le fond d'une tablette murale. |
| `fill_height` | `true` fait prendre à la carte toute la hauteur de sa case : deux cartes côte à côte ont alors la même hauteur. |
| `show_since` | Ligne *Occupé depuis* / *Libre depuis*. Par défaut `true`. |
| `show_scale` | Distances sur les arcs de portée. Par défaut `true`. |
| `show_history` / `history_hours` | `true` ajoute une bande des dernières heures sous les lignes : occupé, en mouvement ou immobile dans leur couleur, libre en gris, hors ligne en rouge, et le temps d'occupation de la pièce. Lue dans l'historique de Home Assistant (l'entité d'occupation, et celle du mouvement si elle est renseignée), puis relue toutes les cinq minutes. `history_hours` : 24 par défaut, de 1 à 168. Désactivée par défaut. |
| `tap_action` | Ce que fait un appui sur la carte, dans les mots de Home Assistant : `more-info` (par défaut, l'entité d'occupation), `none`, `navigate`, `url`, `toggle`, `perform-action` ou `fire-dom-event` (pour les cartes popup basées sur browser_mod). En YAML uniquement. |
| `targets` | Vue en plan : jusqu'à trois cibles, chacune `{ x, y, direction, speed }` (identifiants d'entités ; x et y dans n'importe quelle unité de longueur). Remplies par l'éditeur depuis le même appareil. |
| `zones` | Vue en plan : jusqu'à huit zones, chacune `{ x1, y1, x2, y2, count, name, type }`, ou `{ points, count, name, type }` où `points` est une entité texte qui contient un polygone `x:y;x:y;…` en mm (Everything Presence Lite). `count` est le nombre de personnes de la zone, `type` vaut `detection`, `filter` (exclusion) ou `entry` (entrée). |
| `zone_type_entity` | Le select du type de zone du capteur (`Disabled`, `Detection`, `Filter`). |
| `show_plan` | Vue en plan quand les cibles sont renseignées. Par défaut `true` ; `false` garde le dessin sur l'axe. |
| `show_targets` | Une ligne par cible dans la vue en plan. Par défaut `true`. |
| `flip_x` | Inverse gauche et droite dans la vue en plan. Par défaut `false`. |
| `room` | Vue en plan : les murs de la pièce en mètres, vus sur la carte, `{ left, right, depth }` : la distance du capteur au mur de gauche, au mur de droite et au mur d'en face. Chacune peut être omise ; un mur au-delà du dessin reste ouvert. Dans l'éditeur. |
| `exit_entity` / `exit_zone_entity` | Le Entry Exit Last Decision et le Last Entry Zone de l'Everything Presence Lite : une ligne dit depuis quand quelqu'un est sorti, et par quelle zone d'entrée, ou que le capteur maintient la pièce occupée après la disparition d'une cible. Rempli par l'éditeur. |
| `angle_entity` / `installation_angle` | De combien le capteur est tourné par rapport au mur, en degrés : une entité (l'Installation Angle de l'Everything Presence Lite) ou un nombre fixe. Seul l'éventail tourne : le capteur donne déjà ses positions dans l'axe de la pièce. |

Les couleurs suivent votre thème : `--pr-occupied-color` (bleu par défaut), `--pr-still-color` (indigo par défaut), `--pr-offline-color` (par défaut la couleur d'erreur du thème) et `--pr-zone1-color` à `--pr-zone4-color` et `--pr-entry-color` se règlent avec card-mod ou un thème.

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

HLK-LD2410 (ESPHome) : portée donnée en numéro de gate.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.bureau_radar_target
movement_entity: binary_sensor.bureau_radar_moving_target
distance_entity: sensor.bureau_radar_detection_distance
range_entity: number.bureau_radar_max_move_distance_gate
```

Seeed MR60BHA2 (ESPHome) : respiration et rythme cardiaque.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.chambre_has_target
distance_entity: sensor.chambre_distance
heart_rate_entity: sensor.chambre_heart_rate
breath_rate_entity: sensor.chambre_breath_rate
target_count_entity: sensor.chambre_num_targets
```

HLK-LD2450 (ESPHome) : vue en plan, chaque cible à sa position et les zones au sol. Choisir l'entité d'occupation dans l'éditeur remplit tout cela.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.salon_presence
target_count_entity: sensor.salon_target_count
zone_type_entity: select.salon_zone_type
targets:
  - x: sensor.salon_target_1_x
    y: sensor.salon_target_1_y
    direction: sensor.salon_target_1_direction
    speed: sensor.salon_target_1_speed
  - x: sensor.salon_target_2_x
    y: sensor.salon_target_2_y
zones:
  - { x1: number.salon_zone_1_x1, y1: number.salon_zone_1_y1, x2: number.salon_zone_1_x2, y2: number.salon_zone_1_y2, count: sensor.salon_zone_1_target_count, name: Bureau }
  - { x1: number.salon_zone_2_x1, y1: number.salon_zone_2_y1, x2: number.salon_zone_2_x2, y2: number.salon_zone_2_y2, name: Canapé }
```

Everything Presence Lite (ESPHome) : zones en polygone, une exclusion, une entrée, et le capteur tourné dans un coin. L'éditeur remplit cela aussi.

```yaml
type: custom:ha-presence-sensor-card
entity: binary_sensor.bureau_occupancy
range_entity: number.bureau_max_distance
angle_entity: number.bureau_installation_angle
room: { left: 2.7, right: 3, depth: 6 }
exit_entity: sensor.bureau_entry_exit_last_decision
exit_zone_entity: sensor.bureau_entry_exit_last_entry_zone
targets:
  - { x: sensor.bureau_target_1_x, y: sensor.bureau_target_1_y, speed: sensor.bureau_target_1_speed }
  - { x: sensor.bureau_target_2_x, y: sensor.bureau_target_2_y, speed: sensor.bureau_target_2_speed }
zones:
  - { points: text.bureau_polygon_zone_1, count: sensor.bureau_zone_1_target_count, name: Bureau }
  - { points: text.bureau_polygon_exclusion_1, type: filter }
  - { points: text.bureau_polygon_entry_1, type: entry, name: Porte }
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
