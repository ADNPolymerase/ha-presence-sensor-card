const CARD_VERSION = "0.1.0";

console.info(
  "%c HA-PRESENCE-SENSOR-CARD %c v" + CARD_VERSION + " ",
  "color:white;background:#1e88e5;font-weight:700;",
  "color:#1e88e5;background:white;font-weight:700;"
);

// ---------------------------------------------------------------------------
// i18n
// NOTE: this file is intentionally pure ASCII -- every non-ASCII character
// is written as a \uXXXX escape so the card renders correctly no matter
// which charset the resource is served with.
// ---------------------------------------------------------------------------

const T = {
  en: {
    occupied: "Occupied", moving: "Moving", still: "Still", clear: "Clear", offline: "Offline",
    distance: "Distance", light: "Light", occupied_for: "Occupied for", clear_for: "Clear for", battery: "Battery",
    entity: "Occupancy entity (required)", movement_entity: "Movement entity (moving / still)",
    distance_entity: "Target distance entity", range_entity: "Detection range entity",
    detection_range: "Detection range without an entity (m)", illuminance_entity: "Illuminance entity",
    battery_entity: "Battery entity", name: "Name", card_language: "Card language", lang_auto: "Same as Home Assistant",
    compact: "Compact mode (icon instead of illustration)", show_since: "Show how long it has been occupied or clear",
    show_scale: "Show the distances on the range arcs", section_readings: "Readings",
    autofill_hint: "The other fields are filled in from the same device when the occupancy entity is picked.",
    people: "People", temperature: "Temperature", humidity: "Humidity", heart_rate: "Heart rate", breath_rate: "Breathing", dim: "Dim", bright: "Bright", target_count_entity: "People count entity", temperature_entity: "Temperature entity", humidity_entity: "Humidity entity", heart_rate_entity: "Heart rate entity", breath_rate_entity: "Breathing rate entity", section_more: "More readings",
  },
  fr: {
    occupied: "Occup\u00e9", moving: "En mouvement", still: "Immobile", clear: "Libre", offline: "Hors ligne",
    distance: "Distance", light: "Lumi\u00e8re", occupied_for: "Occup\u00e9 depuis", clear_for: "Libre depuis", battery: "Batterie",
    entity: "Entit\u00e9 de pr\u00e9sence (obligatoire)", movement_entity: "Entit\u00e9 de mouvement (bouge / immobile)",
    distance_entity: "Entit\u00e9 distance de la cible", range_entity: "Entit\u00e9 port\u00e9e de d\u00e9tection",
    detection_range: "Port\u00e9e de d\u00e9tection sans entit\u00e9 (m)", illuminance_entity: "Entit\u00e9 luminosit\u00e9",
    battery_entity: "Entit\u00e9 batterie", name: "Nom", card_language: "Langue de la carte", lang_auto: "Comme Home Assistant",
    compact: "Mode compact (ic\u00f4ne au lieu de l'illustration)", show_since: "Afficher depuis quand c'est occup\u00e9 ou libre",
    show_scale: "Afficher les distances sur les arcs de port\u00e9e", section_readings: "Mesures",
    autofill_hint: "Les autres champs se remplissent depuis le m\u00eame appareil quand l'entit\u00e9 de pr\u00e9sence est choisie.",
    people: "Personnes", temperature: "Temp\u00e9rature", humidity: "Humidit\u00e9", heart_rate: "Rythme cardiaque", breath_rate: "Respiration", dim: "Sombre", bright: "Lumineux", target_count_entity: "Entit\u00e9 nombre de personnes", temperature_entity: "Entit\u00e9 temp\u00e9rature", humidity_entity: "Entit\u00e9 humidit\u00e9", heart_rate_entity: "Entit\u00e9 rythme cardiaque", breath_rate_entity: "Entit\u00e9 rythme respiratoire", section_more: "Autres mesures",
  },
  de: {
    occupied: "Belegt", moving: "In Bewegung", still: "Ruhig", clear: "Frei", offline: "Offline",
    distance: "Abstand", light: "Licht", occupied_for: "Belegt seit", clear_for: "Frei seit", battery: "Batterie",
    entity: "Belegungs-Entit\u00e4t (erforderlich)", movement_entity: "Bewegungs-Entit\u00e4t (bewegt / ruhig)",
    distance_entity: "Entit\u00e4t Zielabstand", range_entity: "Entit\u00e4t Erfassungsbereich",
    detection_range: "Erfassungsbereich ohne Entit\u00e4t (m)", illuminance_entity: "Helligkeits-Entit\u00e4t",
    battery_entity: "Batterie-Entit\u00e4t", name: "Name", card_language: "Kartensprache", lang_auto: "Wie Home Assistant",
    compact: "Kompaktmodus (Symbol statt Illustration)", show_since: "Anzeigen, wie lange belegt oder frei",
    show_scale: "Abst\u00e4nde an den Reichweitenb\u00f6gen anzeigen", section_readings: "Messwerte",
    autofill_hint: "Die \u00fcbrigen Felder werden vom selben Ger\u00e4t ausgef\u00fcllt, sobald die Belegungs-Entit\u00e4t gew\u00e4hlt ist.",
    people: "Personen", temperature: "Temperatur", humidity: "Luftfeuchtigkeit", heart_rate: "Herzfrequenz", breath_rate: "Atmung", dim: "Dunkel", bright: "Hell", target_count_entity: "Entit\u00e4t Personenzahl", temperature_entity: "Temperatur-Entit\u00e4t", humidity_entity: "Luftfeuchtigkeits-Entit\u00e4t", heart_rate_entity: "Entit\u00e4t Herzfrequenz", breath_rate_entity: "Entit\u00e4t Atemfrequenz", section_more: "Weitere Messwerte",
  },
  es: {
    occupied: "Ocupado", moving: "En movimiento", still: "Quieto", clear: "Libre", offline: "Sin conexi\u00f3n",
    distance: "Distancia", light: "Luz", occupied_for: "Ocupado desde hace", clear_for: "Libre desde hace", battery: "Bater\u00eda",
    entity: "Entidad de ocupaci\u00f3n (obligatoria)", movement_entity: "Entidad de movimiento (se mueve / quieto)",
    distance_entity: "Entidad distancia del objetivo", range_entity: "Entidad alcance de detecci\u00f3n",
    detection_range: "Alcance de detecci\u00f3n sin entidad (m)", illuminance_entity: "Entidad de iluminancia",
    battery_entity: "Entidad de bater\u00eda", name: "Nombre", card_language: "Idioma de la tarjeta", lang_auto: "Igual que Home Assistant",
    compact: "Modo compacto (icono en lugar de ilustraci\u00f3n)", show_since: "Mostrar desde cu\u00e1ndo est\u00e1 ocupado o libre",
    show_scale: "Mostrar las distancias en los arcos de alcance", section_readings: "Mediciones",
    autofill_hint: "Los dem\u00e1s campos se rellenan desde el mismo dispositivo al elegir la entidad de ocupaci\u00f3n.",
    people: "Personas", temperature: "Temperatura", humidity: "Humedad", heart_rate: "Ritmo card\u00edaco", breath_rate: "Respiraci\u00f3n", dim: "Oscuro", bright: "Luminoso", target_count_entity: "Entidad n\u00famero de personas", temperature_entity: "Entidad de temperatura", humidity_entity: "Entidad de humedad", heart_rate_entity: "Entidad ritmo card\u00edaco", breath_rate_entity: "Entidad ritmo respiratorio", section_more: "Otras mediciones",
  },
  it: {
    occupied: "Occupato", moving: "In movimento", still: "Fermo", clear: "Libero", offline: "Non in linea",
    distance: "Distanza", light: "Luce", occupied_for: "Occupato da", clear_for: "Libero da", battery: "Batteria",
    entity: "Entit\u00e0 di occupazione (obbligatoria)", movement_entity: "Entit\u00e0 di movimento (si muove / fermo)",
    distance_entity: "Entit\u00e0 distanza del bersaglio", range_entity: "Entit\u00e0 portata di rilevamento",
    detection_range: "Portata di rilevamento senza entit\u00e0 (m)", illuminance_entity: "Entit\u00e0 illuminamento",
    battery_entity: "Entit\u00e0 batteria", name: "Nome", card_language: "Lingua della scheda", lang_auto: "Come Home Assistant",
    compact: "Modalit\u00e0 compatta (icona invece dell'illustrazione)", show_since: "Mostra da quanto \u00e8 occupato o libero",
    show_scale: "Mostra le distanze sugli archi di portata", section_readings: "Misure",
    autofill_hint: "Gli altri campi si compilano dallo stesso dispositivo quando si sceglie l'entit\u00e0 di occupazione.",
    people: "Persone", temperature: "Temperatura", humidity: "Umidit\u00e0", heart_rate: "Frequenza cardiaca", breath_rate: "Respirazione", dim: "Buio", bright: "Luminoso", target_count_entity: "Entit\u00e0 numero di persone", temperature_entity: "Entit\u00e0 temperatura", humidity_entity: "Entit\u00e0 umidit\u00e0", heart_rate_entity: "Entit\u00e0 frequenza cardiaca", breath_rate_entity: "Entit\u00e0 frequenza respiratoria", section_more: "Altre misure",
  },
  nl: {
    occupied: "Bezet", moving: "In beweging", still: "Stil", clear: "Vrij", offline: "Offline",
    distance: "Afstand", light: "Licht", occupied_for: "Bezet sinds", clear_for: "Vrij sinds", battery: "Batterij",
    entity: "Bezettingsentiteit (verplicht)", movement_entity: "Bewegingsentiteit (beweegt / stil)",
    distance_entity: "Entiteit afstand tot doel", range_entity: "Entiteit detectiebereik",
    detection_range: "Detectiebereik zonder entiteit (m)", illuminance_entity: "Entiteit verlichtingssterkte",
    battery_entity: "Batterij-entiteit", name: "Naam", card_language: "Taal van de kaart", lang_auto: "Zoals Home Assistant",
    compact: "Compacte modus (pictogram i.p.v. illustratie)", show_since: "Tonen hoe lang bezet of vrij",
    show_scale: "Afstanden op de bereikbogen tonen", section_readings: "Metingen",
    autofill_hint: "De overige velden worden vanuit hetzelfde apparaat ingevuld zodra de bezettingsentiteit gekozen is.",
    people: "Personen", temperature: "Temperatuur", humidity: "Luchtvochtigheid", heart_rate: "Hartslag", breath_rate: "Ademhaling", dim: "Donker", bright: "Licht", target_count_entity: "Entiteit aantal personen", temperature_entity: "Temperatuurentiteit", humidity_entity: "Vochtigheidsentiteit", heart_rate_entity: "Entiteit hartslag", breath_rate_entity: "Entiteit ademhalingsfrequentie", section_more: "Meer metingen",
  },
  pt: {
    occupied: "Ocupado", moving: "Em movimento", still: "Parado", clear: "Livre", offline: "Offline",
    distance: "Dist\u00e2ncia", light: "Luz", occupied_for: "Ocupado h\u00e1", clear_for: "Livre h\u00e1", battery: "Bateria",
    entity: "Entidade de ocupa\u00e7\u00e3o (obrigat\u00f3ria)", movement_entity: "Entidade de movimento (mexe / parado)",
    distance_entity: "Entidade dist\u00e2ncia do alvo", range_entity: "Entidade alcance de dete\u00e7\u00e3o",
    detection_range: "Alcance de dete\u00e7\u00e3o sem entidade (m)", illuminance_entity: "Entidade de ilumin\u00e2ncia",
    battery_entity: "Entidade de bateria", name: "Nome", card_language: "Idioma do cart\u00e3o", lang_auto: "Igual ao Home Assistant",
    compact: "Modo compacto (\u00edcone em vez da ilustra\u00e7\u00e3o)", show_since: "Mostrar h\u00e1 quanto tempo est\u00e1 ocupado ou livre",
    show_scale: "Mostrar as dist\u00e2ncias nos arcos de alcance", section_readings: "Medi\u00e7\u00f5es",
    autofill_hint: "Os outros campos s\u00e3o preenchidos a partir do mesmo dispositivo ao escolher a entidade de ocupa\u00e7\u00e3o.",
    people: "Pessoas", temperature: "Temperatura", humidity: "Humidade", heart_rate: "Frequ\u00eancia card\u00edaca", breath_rate: "Respira\u00e7\u00e3o", dim: "Escuro", bright: "Claro", target_count_entity: "Entidade n\u00famero de pessoas", temperature_entity: "Entidade de temperatura", humidity_entity: "Entidade de humidade", heart_rate_entity: "Entidade frequ\u00eancia card\u00edaca", breath_rate_entity: "Entidade frequ\u00eancia respirat\u00f3ria", section_more: "Outras medi\u00e7\u00f5es",
  },
  sv: {
    occupied: "Upptaget", moving: "I r\u00f6relse", still: "Stilla", clear: "Ledigt", offline: "Fr\u00e5nkopplad",
    distance: "Avst\u00e5nd", light: "Ljus", occupied_for: "Upptaget i", clear_for: "Ledigt i", battery: "Batteri",
    entity: "N\u00e4rvaroentitet (obligatorisk)", movement_entity: "R\u00f6relseentitet (r\u00f6r sig / stilla)",
    distance_entity: "Entitet avst\u00e5nd till m\u00e5let", range_entity: "Entitet detekteringsomr\u00e5de",
    detection_range: "Detekteringsomr\u00e5de utan entitet (m)", illuminance_entity: "Entitet belysningsstyrka",
    battery_entity: "Batterientitet", name: "Namn", card_language: "Kortets spr\u00e5k", lang_auto: "Som Home Assistant",
    compact: "Kompakt l\u00e4ge (ikon i st\u00e4llet f\u00f6r illustration)", show_since: "Visa hur l\u00e4nge det varit upptaget eller ledigt",
    show_scale: "Visa avst\u00e5nden p\u00e5 r\u00e4ckviddsb\u00e5garna", section_readings: "M\u00e4tv\u00e4rden",
    autofill_hint: "\u00d6vriga f\u00e4lt fylls i fr\u00e5n samma enhet n\u00e4r n\u00e4rvaroentiteten v\u00e4ljs.",
    people: "Personer", temperature: "Temperatur", humidity: "Luftfuktighet", heart_rate: "Puls", breath_rate: "Andning", dim: "M\u00f6rkt", bright: "Ljust", target_count_entity: "Entitet antal personer", temperature_entity: "Temperaturentitet", humidity_entity: "Fuktighetsentitet", heart_rate_entity: "Entitet puls", breath_rate_entity: "Entitet andningsfrekvens", section_more: "Fler m\u00e4tv\u00e4rden",
  },
  no: {
    occupied: "Opptatt", moving: "I bevegelse", still: "Stille", clear: "Ledig", offline: "Frakoblet",
    distance: "Avstand", light: "Lys", occupied_for: "Opptatt i", clear_for: "Ledig i", battery: "Batteri",
    entity: "Tilstedev\u00e6relsesentitet (p\u00e5krevd)", movement_entity: "Bevegelsesentitet (beveger seg / stille)",
    distance_entity: "Entitet avstand til m\u00e5let", range_entity: "Entitet deteksjonsomr\u00e5de",
    detection_range: "Deteksjonsomr\u00e5de uten entitet (m)", illuminance_entity: "Entitet belysningsstyrke",
    battery_entity: "Batterientitet", name: "Navn", card_language: "Kortets spr\u00e5k", lang_auto: "Som Home Assistant",
    compact: "Kompakt modus (ikon i stedet for illustrasjon)", show_since: "Vis hvor lenge det har v\u00e6rt opptatt eller ledig",
    show_scale: "Vis avstandene p\u00e5 rekkeviddebuene", section_readings: "M\u00e5linger",
    autofill_hint: "De andre feltene fylles ut fra samme enhet n\u00e5r tilstedev\u00e6relsesentiteten velges.",
    people: "Personer", temperature: "Temperatur", humidity: "Luftfuktighet", heart_rate: "Puls", breath_rate: "Pust", dim: "M\u00f8rkt", bright: "Lyst", target_count_entity: "Entitet antall personer", temperature_entity: "Temperaturentitet", humidity_entity: "Fuktighetsentitet", heart_rate_entity: "Entitet puls", breath_rate_entity: "Entitet pustefrekvens", section_more: "Flere m\u00e5linger",
  },
  da: {
    occupied: "Optaget", moving: "I bev\u00e6gelse", still: "Stille", clear: "Ledig", offline: "Offline",
    distance: "Afstand", light: "Lys", occupied_for: "Optaget i", clear_for: "Ledig i", battery: "Batteri",
    entity: "Tilstedev\u00e6relsesentitet (p\u00e5kr\u00e6vet)", movement_entity: "Bev\u00e6gelsesentitet (bev\u00e6ger sig / stille)",
    distance_entity: "Entitet afstand til m\u00e5let", range_entity: "Entitet detektionsomr\u00e5de",
    detection_range: "Detektionsomr\u00e5de uden entitet (m)", illuminance_entity: "Entitet belysningsstyrke",
    battery_entity: "Batterientitet", name: "Navn", card_language: "Kortets sprog", lang_auto: "Som Home Assistant",
    compact: "Kompakt tilstand (ikon i stedet for illustration)", show_since: "Vis hvor l\u00e6nge det har v\u00e6ret optaget eller ledigt",
    show_scale: "Vis afstandene p\u00e5 r\u00e6kkeviddebuerne", section_readings: "M\u00e5linger",
    autofill_hint: "De \u00f8vrige felter udfyldes fra samme enhed, n\u00e5r tilstedev\u00e6relsesentiteten v\u00e6lges.",
    people: "Personer", temperature: "Temperatur", humidity: "Luftfugtighed", heart_rate: "Puls", breath_rate: "Vejrtr\u00e6kning", dim: "M\u00f8rkt", bright: "Lyst", target_count_entity: "Entitet antal personer", temperature_entity: "Temperaturentitet", humidity_entity: "Fugtighedsentitet", heart_rate_entity: "Entitet puls", breath_rate_entity: "Entitet vejrtr\u00e6kningsfrekvens", section_more: "Flere m\u00e5linger",
  },
  pl: {
    occupied: "Zaj\u0119te", moving: "W ruchu", still: "Bez ruchu", clear: "Wolne", offline: "Offline",
    distance: "Odleg\u0142o\u015b\u0107", light: "\u015awiat\u0142o", occupied_for: "Zaj\u0119te od", clear_for: "Wolne od", battery: "Bateria",
    entity: "Encja obecno\u015bci (wymagana)", movement_entity: "Encja ruchu (rusza si\u0119 / bez ruchu)",
    distance_entity: "Encja odleg\u0142o\u015bci od celu", range_entity: "Encja zasi\u0119gu wykrywania",
    detection_range: "Zasi\u0119g wykrywania bez encji (m)", illuminance_entity: "Encja nat\u0119\u017cenia o\u015bwietlenia",
    battery_entity: "Encja baterii", name: "Nazwa", card_language: "J\u0119zyk karty", lang_auto: "Jak Home Assistant",
    compact: "Tryb kompaktowy (ikona zamiast ilustracji)", show_since: "Poka\u017c, jak d\u0142ugo jest zaj\u0119te lub wolne",
    show_scale: "Poka\u017c odleg\u0142o\u015bci na \u0142ukach zasi\u0119gu", section_readings: "Pomiary",
    autofill_hint: "Pozosta\u0142e pola wype\u0142niaj\u0105 si\u0119 z tego samego urz\u0105dzenia po wybraniu encji obecno\u015bci.",
    people: "Osoby", temperature: "Temperatura", humidity: "Wilgotno\u015b\u0107", heart_rate: "T\u0119tno", breath_rate: "Oddech", dim: "Ciemno", bright: "Jasno", target_count_entity: "Encja liczby os\u00f3b", temperature_entity: "Encja temperatury", humidity_entity: "Encja wilgotno\u015bci", heart_rate_entity: "Encja t\u0119tna", breath_rate_entity: "Encja cz\u0119sto\u015bci oddechu", section_more: "Inne pomiary",
  },
  ru: {
    occupied: "\u0417\u0430\u043d\u044f\u0442\u043e", moving: "\u0414\u0432\u0438\u0436\u0435\u043d\u0438\u0435", still: "\u041d\u0435\u043f\u043e\u0434\u0432\u0438\u0436\u043d\u043e", clear: "\u0421\u0432\u043e\u0431\u043e\u0434\u043d\u043e", offline: "\u041d\u0435 \u0432 \u0441\u0435\u0442\u0438",
    distance: "\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435", light: "\u0421\u0432\u0435\u0442", occupied_for: "\u0417\u0430\u043d\u044f\u0442\u043e \u0443\u0436\u0435", clear_for: "\u0421\u0432\u043e\u0431\u043e\u0434\u043d\u043e \u0443\u0436\u0435", battery: "\u0411\u0430\u0442\u0430\u0440\u0435\u044f",
    entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u043f\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044f (\u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e)", movement_entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u044f (\u0434\u0432\u0438\u0436\u0435\u0442\u0441\u044f / \u043d\u0435\u043f\u043e\u0434\u0432\u0438\u0436\u043d\u043e)",
    distance_entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u0440\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u044f \u0434\u043e \u0446\u0435\u043b\u0438", range_entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u0434\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438 \u043e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d\u0438\u044f",
    detection_range: "\u0414\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u043e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d\u0438\u044f \u0431\u0435\u0437 \u0441\u0443\u0449\u043d\u043e\u0441\u0442\u0438 (\u043c)", illuminance_entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u043e\u0441\u0432\u0435\u0449\u0451\u043d\u043d\u043e\u0441\u0442\u0438",
    battery_entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u0431\u0430\u0442\u0430\u0440\u0435\u0438", name: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435", card_language: "\u042f\u0437\u044b\u043a \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0438", lang_auto: "\u041a\u0430\u043a \u0432 Home Assistant",
    compact: "\u041a\u043e\u043c\u043f\u0430\u043a\u0442\u043d\u044b\u0439 \u0440\u0435\u0436\u0438\u043c (\u0437\u043d\u0430\u0447\u043e\u043a \u0432\u043c\u0435\u0441\u0442\u043e \u0438\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u0438)", show_since: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c, \u043a\u0430\u043a \u0434\u043e\u043b\u0433\u043e \u0437\u0430\u043d\u044f\u0442\u043e \u0438\u043b\u0438 \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u043e",
    show_scale: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0440\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u044f \u043d\u0430 \u0434\u0443\u0433\u0430\u0445 \u0434\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438", section_readings: "\u0418\u0437\u043c\u0435\u0440\u0435\u043d\u0438\u044f",
    autofill_hint: "\u041e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u043f\u043e\u043b\u044f \u0437\u0430\u043f\u043e\u043b\u043d\u044f\u044e\u0442\u0441\u044f \u0441 \u0442\u043e\u0433\u043e \u0436\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430 \u043f\u0440\u0438 \u0432\u044b\u0431\u043e\u0440\u0435 \u0441\u0443\u0449\u043d\u043e\u0441\u0442\u0438 \u043f\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044f.",
    people: "\u041b\u044e\u0434\u0438", temperature: "\u0422\u0435\u043c\u043f\u0435\u0440\u0430\u0442\u0443\u0440\u0430", humidity: "\u0412\u043b\u0430\u0436\u043d\u043e\u0441\u0442\u044c", heart_rate: "\u041f\u0443\u043b\u044c\u0441", breath_rate: "\u0414\u044b\u0445\u0430\u043d\u0438\u0435", dim: "\u0422\u0435\u043c\u043d\u043e", bright: "\u0421\u0432\u0435\u0442\u043b\u043e", target_count_entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u0447\u0438\u0441\u043b\u0430 \u043b\u044e\u0434\u0435\u0439", temperature_entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u0442\u0435\u043c\u043f\u0435\u0440\u0430\u0442\u0443\u0440\u044b", humidity_entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u0432\u043b\u0430\u0436\u043d\u043e\u0441\u0442\u0438", heart_rate_entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u043f\u0443\u043b\u044c\u0441\u0430", breath_rate_entity: "\u0421\u0443\u0449\u043d\u043e\u0441\u0442\u044c \u0447\u0430\u0441\u0442\u043e\u0442\u044b \u0434\u044b\u0445\u0430\u043d\u0438\u044f", section_more: "\u0414\u0440\u0443\u0433\u0438\u0435 \u0438\u0437\u043c\u0435\u0440\u0435\u043d\u0438\u044f",
  },
  zh: {
    occupied: "\u6709\u4eba", moving: "\u79fb\u52a8\u4e2d", still: "\u9759\u6b62", clear: "\u65e0\u4eba", offline: "\u79bb\u7ebf",
    distance: "\u8ddd\u79bb", light: "\u5149\u7167", occupied_for: "\u6709\u4eba\u5df2", clear_for: "\u65e0\u4eba\u5df2", battery: "\u7535\u6c60",
    entity: "\u5b58\u5728\u5b9e\u4f53\uff08\u5fc5\u586b\uff09", movement_entity: "\u79fb\u52a8\u5b9e\u4f53\uff08\u79fb\u52a8 / \u9759\u6b62\uff09",
    distance_entity: "\u76ee\u6807\u8ddd\u79bb\u5b9e\u4f53", range_entity: "\u68c0\u6d4b\u8303\u56f4\u5b9e\u4f53",
    detection_range: "\u65e0\u5b9e\u4f53\u65f6\u7684\u68c0\u6d4b\u8303\u56f4\uff08\u7c73\uff09", illuminance_entity: "\u7167\u5ea6\u5b9e\u4f53",
    battery_entity: "\u7535\u6c60\u5b9e\u4f53", name: "\u540d\u79f0", card_language: "\u5361\u7247\u8bed\u8a00", lang_auto: "\u4e0e Home Assistant \u76f8\u540c",
    compact: "\u7d27\u51d1\u6a21\u5f0f\uff08\u56fe\u6807\u4ee3\u66ff\u63d2\u56fe\uff09", show_since: "\u663e\u793a\u6709\u4eba\u6216\u65e0\u4eba\u6301\u7eed\u7684\u65f6\u95f4",
    show_scale: "\u5728\u8303\u56f4\u5f27\u4e0a\u663e\u793a\u8ddd\u79bb", section_readings: "\u8bfb\u6570",
    autofill_hint: "\u9009\u62e9\u5b58\u5728\u5b9e\u4f53\u540e\uff0c\u5176\u4ed6\u5b57\u6bb5\u4f1a\u4ece\u540c\u4e00\u8bbe\u5907\u81ea\u52a8\u586b\u5199\u3002",
    people: "\u4eba\u6570", temperature: "\u6e29\u5ea6", humidity: "\u6e7f\u5ea6", heart_rate: "\u5fc3\u7387", breath_rate: "\u547c\u5438", dim: "\u6697", bright: "\u4eae", target_count_entity: "\u4eba\u6570\u5b9e\u4f53", temperature_entity: "\u6e29\u5ea6\u5b9e\u4f53", humidity_entity: "\u6e7f\u5ea6\u5b9e\u4f53", heart_rate_entity: "\u5fc3\u7387\u5b9e\u4f53", breath_rate_entity: "\u547c\u5438\u9891\u7387\u5b9e\u4f53", section_more: "\u66f4\u591a\u8bfb\u6570",
  },
  cs: {
    occupied: "Obsazeno", moving: "V pohybu", still: "Bez pohybu", clear: "Volno", offline: "Offline",
    distance: "Vzd\u00e1lenost", light: "Sv\u011btlo", occupied_for: "Obsazeno po dobu", clear_for: "Volno po dobu", battery: "Baterie",
    entity: "Entita p\u0159\u00edtomnosti (povinn\u00e1)", movement_entity: "Entita pohybu (pohybuje se / bez pohybu)",
    distance_entity: "Entita vzd\u00e1lenosti c\u00edle", range_entity: "Entita dosahu detekce",
    detection_range: "Dosah detekce bez entity (m)", illuminance_entity: "Entita osv\u011btlen\u00ed",
    battery_entity: "Entita baterie", name: "N\u00e1zev", card_language: "Jazyk karty", lang_auto: "Jako Home Assistant",
    compact: "Kompaktn\u00ed re\u017eim (ikona m\u00edsto ilustrace)", show_since: "Zobrazit, jak dlouho je obsazeno nebo volno",
    show_scale: "Zobrazit vzd\u00e1lenosti na oblouc\u00edch dosahu", section_readings: "M\u011b\u0159en\u00ed",
    autofill_hint: "Ostatn\u00ed pole se vypln\u00ed ze stejn\u00e9ho za\u0159\u00edzen\u00ed po v\u00fdb\u011bru entity p\u0159\u00edtomnosti.",
    people: "Osoby", temperature: "Teplota", humidity: "Vlhkost", heart_rate: "Tep", breath_rate: "Dech", dim: "Tma", bright: "Sv\u011btlo", target_count_entity: "Entita po\u010dtu osob", temperature_entity: "Entita teploty", humidity_entity: "Entita vlhkosti", heart_rate_entity: "Entita tepu", breath_rate_entity: "Entita dechov\u00e9 frekvence", section_more: "Dal\u0161\u00ed m\u011b\u0159en\u00ed",
  },
};

function lang(hass) {
  const l = String((hass && ((hass.locale && hass.locale.language) || hass.language)) || "en")
    .toLowerCase().split("-")[0];
  return T[l] ? l : "en";
}

// language: the card can be shown in another language than Home Assistant.
// Only the rendering follows it; the editor stays in the user's own language.
const LANGUAGE_NAMES = [
  ["en", "English"],
  ["fr", "Fran\u00e7ais"],
  ["de", "Deutsch"],
  ["es", "Espa\u00f1ol"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["pt", "Portugu\u00eas"],
  ["sv", "Svenska"],
  ["no", "Norsk"],
  ["da", "Dansk"],
  ["pl", "Polski"],
  ["ru", "\u0420\u0443\u0441\u0441\u043a\u0438\u0439"],
  ["zh", "\u4e2d\u6587"],
  ["cs", "\u010cesky"],
];

function withLanguage(hass, language) {
  if (!hass || !language || !T[language]) return hass;
  return Object.create(hass, {
    language: { value: language },
    locale: { value: { ...(hass.locale || {}), language } },
  });
}

function t(hass, key) {
  const l = lang(hass);
  return (T[l] && T[l][key]) || T.en[key] || key;
}

// Freeform text (friendly_name is device-supplied) must never reach
// innerHTML or an attribute unescaped.
function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function stripAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function domainOf(entityId) {
  return entityId ? String(entityId).split(".")[0] : null;
}

function stateObj(hass, entityId) {
  return entityId && hass.states[entityId] ? hass.states[entityId] : null;
}

function isMeaningless(raw) {
  return ["unknown", "unavailable", ""].includes(String(raw).trim().toLowerCase());
}

// A number read from an entity, or null when it has none to give.
function numericState(hass, entityId) {
  const st = stateObj(hass, entityId);
  if (!st || isMeaningless(st.state)) return null;
  const v = Number(st.state);
  return Number.isFinite(v) ? v : null;
}

// ---------------------------------------------------------------------------
// Occupancy and movement
// Occupancy comes from the main entity: a binary sensor (occupancy, presence,
// motion) most of the time, but a text sensor works too (Tuya's
// presence_state: none / presence / move), and so does a count of people
// (LD2450 target count, a camera's person count): above zero is occupied.
// Movement, when there is a source for it, refines an occupied room into
// moving or still. Words are matched accent-free, and the "still" words are
// tested first: the Aqara FP1E says no_movement when someone keeps still and
// Seeed's MR24HPC1 says Motionless, and a match on "mov" or "motion" alone
// would read them as moving. What the integrations write:
//   Aqara FP1E      movement: movement / no_movement / no_presence
//   Aqara FP1       presence_event: enter / leave / approach / away / left_enter...
//   Tuya ZG-204ZM   motion_state: none / large / small / static
//   Tuya ZY-M100    presence_state: none / presence / move
//   Seeed MR24HPC1  motion_status: None / Motionless / Active
//   LD2410, LD2412  has_moving_target / has_still_target (binary sensors)
// ---------------------------------------------------------------------------

const CLEAR_RE = /^(off|false|0|clear|clr|none|no|no_?presence|no_?one|nobody|unoccupied|not_?occupied|not_?detected|undetected|absent|away|not_home|idle|vacant|empty)$/;
const NO_INFO_RE = /no.?presence|^none$|^clear$|absent|^off$|^false$|nobody|no.?one|unoccupied|vacant|leave/;
const STILL_RE = /no.?mov|non.?mov|motionless|stationar|static|still|immobil|breath|peace|sleep|^presence$/;
const MOVING_RE = /mov|walk|approach|away|large|small|motion|active|enter|leav/;

function occupancyOf(st) {
  if (!st || isMeaningless(st.state)) return "offline";
  const raw = stripAccents(String(st.state).trim().toLowerCase()).replace(/\s+/g, "_");
  const n = Number(raw);
  if (raw !== "" && Number.isFinite(n)) return n > 0 ? "occupied" : "clear";
  return CLEAR_RE.test(raw) ? "clear" : "occupied";
}

// "moving", "still", or null when the source says nothing about it. A binary
// sensor (ESPHome's LD2410 "Moving target") is on while it moves and off
// while the target keeps still; one about a still target says the opposite.
function movementOf(st) {
  if (!st || isMeaningless(st.state)) return null;
  const raw = stripAccents(String(st.state).trim().toLowerCase()).replace(/\s+/g, "_");
  if (domainOf(st.entity_id) === "binary_sensor") {
    const on = raw === "on" ? true : raw === "off" ? false : null;
    if (on === null) return null;
    return /still|static/i.test(st.entity_id) === on ? "still" : "moving";
  }
  if (NO_INFO_RE.test(raw)) return null;
  if (STILL_RE.test(raw)) return "still";
  if (MOVING_RE.test(raw)) return "moving";
  return null;
}

function presenceMode(hass, cfg) {
  const st = stateObj(hass, cfg.entity);
  const occ = occupancyOf(st);
  if (occ !== "occupied") return occ;
  let mv = null;
  if (cfg.movement_entity) {
    const m = stateObj(hass, cfg.movement_entity);
    mv = m ? movementOf({ ...m, entity_id: cfg.movement_entity }) : null;
  } else if (domainOf(cfg.entity) !== "binary_sensor" && domainOf(cfg.entity) !== "input_boolean") {
    // A text sensor carries the movement in its own state.
    mv = movementOf({ ...st, entity_id: cfg.entity });
  }
  return mv || "occupied";
}

// A distance in metres, whatever unit the integration writes it in.
function meters(hass, entityId) {
  const v = numericState(hass, entityId);
  if (v === null) return null;
  const u = String(stateObj(hass, entityId).attributes.unit_of_measurement || "m").trim().toLowerCase();
  return u === "cm" ? v / 100 : u === "mm" ? v / 1000 : u === "km" ? v * 1000
    : u === "ft" ? v * 0.3048 : u === "in" ? v * 0.0254 : v;
}

// Six metres when nothing says how far the sensor sees: the reach of most
// mmWave sensors (FP1E, ES1, LD2410).
const DEFAULT_RANGE_M = 6;

// The LD2410 and LD2412 give their range as a gate number, 0.75 m each.
const GATE_M = 0.75;

function detectionRange(hass, cfg) {
  const re = stateObj(hass, cfg.range_entity);
  if (re && /gate/i.test(cfg.range_entity) && !re.attributes.unit_of_measurement) {
    const g = numericState(hass, cfg.range_entity);
    const size = parseFloat(cfg.gate_size);
    if (g !== null && g > 0) return g * (Number.isFinite(size) && size > 0 ? size : GATE_M);
  }
  const fromEntity = meters(hass, cfg.range_entity);
  if (fromEntity !== null && fromEntity > 0) return fromEntity;
  const fromCfg = parseFloat(cfg.detection_range);
  return Number.isFinite(fromCfg) && fromCfg > 0 ? fromCfg : DEFAULT_RANGE_M;
}

const MODE_COLORS = {
  occupied: "var(--pr-occupied-color, #1e88e5)",
  moving: "var(--pr-occupied-color, #1e88e5)",
  still: "var(--pr-still-color, #5c6bc0)",
  clear: "var(--disabled-text-color, #9e9e9e)",
  offline: "var(--disabled-text-color, #9e9e9e)",
};

const MODE_ICONS = {
  occupied: "mdi:motion-sensor",
  moving: "mdi:walk",
  still: "mdi:human-handsdown",
  clear: "mdi:motion-sensor-off",
  offline: "mdi:lan-disconnect",
};

const PRESENT = ["occupied", "moving", "still"];

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

function formatNumber(hass, v, digits) {
  return new Intl.NumberFormat(lang(hass), { maximumFractionDigits: digits }).format(v);
}

function formatUnit(hass, v, unit) {
  try {
    return new Intl.NumberFormat(lang(hass), { style: "unit", unit, unitDisplay: "short", maximumFractionDigits: 0 }).format(v).replace(/ /g, NBSP);
  } catch (e) {
    return `${v}${NBSP}${unit}`;
  }
}

// "25 min", "1 h 10 min", "2 d 3 h": two parts at most, the larger ones.
function formatDuration(hass, seconds) {
  const s = Math.max(0, Math.floor(seconds));
  if (s < 60) return `< ${formatUnit(hass, 1, "minute")}`;
  const m = Math.floor(s / 60) % 60;
  const h = Math.floor(s / 3600) % 24;
  const d = Math.floor(s / 86400);
  if (d > 0) return [formatUnit(hass, d, "day"), h ? formatUnit(hass, h, "hour") : ""].filter(Boolean).join(" ");
  if (h > 0) return [formatUnit(hass, h, "hour"), m ? formatUnit(hass, m, "minute") : ""].filter(Boolean).join(" ");
  return formatUnit(hass, m, "minute");
}

const NBSP = "\u00a0";

function batteryIcon(v) {
  if (v <= 10) return "mdi:battery-alert-variant-outline";
  const step = Math.min(100, Math.max(10, Math.round(v / 10) * 10));
  return step === 100 ? "mdi:battery" : `mdi:battery-${step}`;
}

// ---------------------------------------------------------------------------
// Illustration -- the sensor on the wall, seen from above, and its detection
// fan across the floor with three range arcs. Someone there stands in the fan
// at the target's distance, scaled on the detection range: walking when the
// sensor says it moves, breathing slowly when it keeps still, and a sweep
// runs across the fan. Clear, the fan stays still and dim. A PIR, which has
// no distance, puts the silhouette in the middle.
// ---------------------------------------------------------------------------

const SENSOR = { x: 100, y: 16 };
const FAN_R = 100;
const FAN_FROM = 35;
const FAN_TO = 145;

function fanPoint(r, deg) {
  const a = (deg * Math.PI) / 180;
  return [Math.round((SENSOR.x + r * Math.cos(a)) * 10) / 10, Math.round((SENSOR.y + r * Math.sin(a)) * 10) / 10];
}

// Where the silhouette's feet are, from 0 (at the sensor) to 1 (at the end
// of the range). Closer than about a third of the range its head would
// cover the sensor itself, so it stops there.
function targetRatio(dist, range) {
  if (dist === null || !(dist > 0)) return 0.55;
  return Math.round(Math.max(0.42, Math.min(1, dist / range)) * 100) / 100;
}

const PERSON = `
  <circle class="pr-head" cx="0" cy="-24" r="4.2"/>
  <path class="pr-torso" d="M-5 -18.5 Q0 -20.5 5 -18.5 L4.4 -8 L-4.4 -8 Z"/>
  <path class="pr-arm pr-arm-l" d="M-4.6 -17.5 L-6.4 -9"/>
  <path class="pr-arm pr-arm-r" d="M4.6 -17.5 L6.4 -9"/>
  <path class="pr-leg pr-leg-l" d="M-2.2 -8.5 L-2.6 0"/>
  <path class="pr-leg pr-leg-r" d="M2.2 -8.5 L2.6 0"/>`;

// Up to three silhouettes side by side; more are told by a number.
const PEOPLE_X = { 1: [0], 2: [-13, 13], 3: [-24, 0, 24] };

function presenceSvg(hass, mode, ratio, range, showScale, people = 1) {
  const [x1, y1] = fanPoint(FAN_R, FAN_FROM);
  const [x2, y2] = fanPoint(FAN_R, FAN_TO);
  const arcs = [1 / 3, 2 / 3, 1].map((k) => {
    const r = Math.round(FAN_R * k * 10) / 10;
    const [ax, ay] = fanPoint(r, FAN_FROM);
    const [bx, by] = fanPoint(r, FAN_TO);
    const label = showScale && range
      ? `<text class="pr-scale" x="${ax + 3}" y="${ay + 1}">${escapeHtml(formatScale(hass, range * k))}</text>` : "";
    return `<path class="pr-arc" d="M${ax} ${ay} A${r} ${r} 0 0 1 ${bx} ${by}"/>${label}`;
  }).join("");
  const present = PRESENT.includes(mode);
  const feetY = Math.round((SENSOR.y + FAN_R * ratio) * 10) / 10;
  const n = Math.max(1, Math.min(3, Math.round(people) || 1));
  const person = present
    ? `<g class="pr-target" transform="translate(${SENSOR.x} ${feetY})">${PEOPLE_X[n].map((dx, i) =>
      `<g transform="translate(${dx} 0)"><g class="pr-walker pr-p${i}"><ellipse class="pr-shadow" cx="0" cy="0.5" rx="6" ry="1.6"/><g class="pr-person">${PERSON}</g></g></g>`).join("")}${
      people > 3 ? `<text class="pr-more" x="34" y="-10">+${Math.round(people) - 3}</text>` : ""}</g>`
    : "";
  return `<svg viewBox="0 0 200 122" role="img" aria-hidden="true">
<defs><radialGradient id="pr-fan-g" cx="${SENSOR.x}" cy="${SENSOR.y}" r="${FAN_R}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="var(--pr-color)" stop-opacity=".42"/><stop offset="1" stop-color="var(--pr-color)" stop-opacity=".05"/></radialGradient></defs>
<path class="pr-wall" d="M22 ${SENSOR.y - 6} H178"/>
<path class="pr-fan" d="M${SENSOR.x} ${SENSOR.y} L${x1} ${y1} A${FAN_R} ${FAN_R} 0 0 1 ${x2} ${y2} Z"/>
${arcs}
<line class="pr-sweep" x1="${SENSOR.x}" y1="${SENSOR.y}" x2="${SENSOR.x}" y2="${SENSOR.y + FAN_R}"/>
${person}
<rect class="pr-box" x="${SENSOR.x - 11}" y="${SENSOR.y - 9}" width="22" height="12" rx="4"/>
<circle class="pr-led" cx="${SENSOR.x}" cy="${SENSOR.y - 3}" r="2"/>
</svg>`;
}

// Readings a sensor may add to its presence: the Hue and the Tuya ZG-204ZV
// read the temperature (and the humidity), Seeed's MR60BHA2 the heart and the
// breathing of the one it watches -- those two only while someone is there.
const READINGS = [
  { field: "temperature_entity", key: "temperature", icon: "mdi:thermometer", digits: 1, unit: "\u00b0C" },
  { field: "humidity_entity", key: "humidity", icon: "mdi:water-percent", digits: 0, unit: "%" },
  { field: "heart_rate_entity", key: "heart_rate", icon: "mdi:heart-pulse", digits: 0, unit: "bpm", presentOnly: true },
  { field: "breath_rate_entity", key: "breath_rate", icon: "mdi:lungs", digits: 0, unit: "/min", presentOnly: true },
];

function withUnit(hass, v, digits, unit) {
  const n = formatNumber(hass, v, digits);
  // A rate's unit hangs on its number: 14/min, not 14 /min.
  return !unit ? n : unit.startsWith("/") ? `${n}${unit}` : `${n}${NBSP}${unit}`;
}

// Light as a number, or as words: the Sonoff SNZB-06P only says dim or bright.
function lightLine(hass, entityId) {
  const st = stateObj(hass, entityId);
  if (!st || isMeaningless(st.state)) return null;
  const lux = numericState(hass, entityId);
  if (lux !== null) {
    const unit = st.attributes.unit_of_measurement || "lx";
    return { key: "light", icon: lux < 10 ? "mdi:weather-night" : "mdi:brightness-5", entity: entityId,
      value: `${formatNumber(hass, lux, 0)}${NBSP}${unit}` };
  }
  const raw = stripAccents(String(st.state).trim().toLowerCase());
  const dark = /dim|dark|low|night|^off$/.test(raw);
  const bright = /bright|light|high|day|^on$/.test(raw);
  if (!dark && !bright) return { key: "light", icon: "mdi:brightness-5", entity: entityId, value: String(st.state) };
  return { key: "light", icon: dark ? "mdi:weather-night" : "mdi:brightness-5", entity: entityId, valueKey: dark ? "dim" : "bright", value: "" };
}

// How many people the sensor sees: a count entity of its own, or the main
// entity when it is the count. One when it only knows someone is there.
function peopleCount(hass, cfg) {
  const own = numericState(hass, cfg.target_count_entity);
  if (own !== null) return Math.max(0, Math.round(own));
  if (domainOf(cfg.entity) === "sensor") {
    const main = numericState(hass, cfg.entity);
    if (main !== null) return Math.max(0, Math.round(main));
  }
  return 1;
}

// entities: any other reading, as a line of its own. An entity id alone, or
// { entity, name, icon }.
function extraEntities(cfg) {
  return (Array.isArray(cfg.entities) ? cfg.entities : [])
    .map((e) => (typeof e === "string" ? { entity: e } : e))
    .filter((e) => e && typeof e.entity === "string" && e.entity);
}

function formatScale(hass, m) {
  return `${formatNumber(hass, m, m >= 10 ? 0 : 1)}${NBSP}m`;
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

// The since line moves on by the minute: half a minute keeps it on time
// without re-rendering for nothing (the signature skips unchanged frames).
const TICK_MS = 30 * 1000;

// The sensor a new card starts on: an occupancy or presence sensor before a
// motion one, a radar's own name first. The LD2410's moving and still target
// sensors only say how, so its has_target goes before them.
function guessPresenceEntity(hass) {
  const ids = Object.keys(hass.states).filter((e) => e.startsWith("binary_sensor.") && !/(moving|still)_?target/i.test(e));
  const byClass = (cls) => ids.filter((e) => cls.includes(hass.states[e].attributes.device_class));
  const named = (list) => list.find((e) => /presence|mmwave|radar|fp1|fp2|ld24|es1|has_target/i.test(e));
  const occ = byClass(["occupancy", "presence"]);
  const motion = byClass(["motion"]);
  return named(occ) || occ[0] || named(motion) || motion[0] || "";
}

class PresenceSensorCard extends HTMLElement {
  static getStubConfig(hass) {
    const entity = guessPresenceEntity(hass);
    return { type: "custom:ha-presence-sensor-card", entity, ...guessSiblings(hass, entity) };
  }

  static getConfigElement() {
    return document.createElement("ha-presence-sensor-card-editor");
  }

  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("ha-presence-sensor-card: 'entity' (occupancy, presence or motion sensor) is required");
    }
    this._config = config;
    this._signature = null;
    if (!this._root) {
      this.attachShadow({ mode: "open" });
      this._root = this.shadowRoot;
    }
  }

  getCardSize() {
    return this._config && this._config.compact ? 2 : 4;
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  connectedCallback() {
    clearInterval(this._tick);
    this._tick = setInterval(() => this._render(), TICK_MS);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }

  // Everything the card shows, worked out from the states. Kept apart from
  // the markup so a test can read it without parsing HTML.
  _model(hass) {
    const cfg = this._config;
    const st = stateObj(hass, cfg.entity);
    const mode = presenceMode(hass, cfg);
    const present = PRESENT.includes(mode);
    const dist = meters(hass, cfg.distance_entity);
    const hasDistance = !!cfg.distance_entity;
    const range = detectionRange(hass, cfg);
    const people = peopleCount(hass, cfg);
    const lines = [];
    if (mode !== "offline") {
      if (present && dist !== null && dist > 0) {
        lines.push({ key: "distance", icon: "mdi:map-marker-distance", entity: cfg.distance_entity,
          value: `${formatNumber(hass, dist, dist >= 10 ? 0 : 1)}${NBSP}m` });
      }
      if (present && people > 1) {
        lines.push({ key: "people", icon: "mdi:account-multiple", entity: cfg.target_count_entity || cfg.entity,
          value: formatNumber(hass, people, 0) });
      }
      const light = lightLine(hass, cfg.illuminance_entity);
      if (light) lines.push(light);
      for (const r of READINGS) {
        const v = numericState(hass, cfg[r.field]);
        if (v === null || (r.presentOnly && !present)) continue;
        lines.push({ key: r.key, icon: r.icon, entity: cfg[r.field],
          value: withUnit(hass, v, r.digits, stateObj(hass, cfg[r.field]).attributes.unit_of_measurement || r.unit) });
      }
      const since = st ? Date.parse(st.last_changed) : NaN;
      if (cfg.show_since !== false && Number.isFinite(since) && Date.now() >= since) {
        lines.push({ key: present ? "occupied_for" : "clear_for", icon: present ? "mdi:account-clock" : "mdi:account-off-outline",
          entity: cfg.entity, value: formatDuration(hass, (Date.now() - since) / 1000) });
      }
    }
    const bat = numericState(hass, cfg.battery_entity);
    if (bat !== null) {
      lines.push({ key: "battery", icon: batteryIcon(bat), entity: cfg.battery_entity,
        value: `${formatNumber(hass, bat, 0)}${NBSP}%`, caution: bat <= 15 });
    }
    for (const e of extraEntities(cfg)) {
      const est = stateObj(hass, e.entity);
      if (!est) continue;
      const v = numericState(hass, e.entity);
      const unit = est.attributes.unit_of_measurement;
      lines.push({ label: e.name || est.attributes.friendly_name || e.entity, icon: e.icon || est.attributes.icon || "mdi:information-outline",
        entity: e.entity, value: v !== null ? withUnit(hass, v, 1, unit) : String(est.state) });
    }
    const rate = numericState(hass, cfg.breath_rate_entity);
    return {
      mode,
      name: cfg.name || (st && st.attributes.friendly_name) || cfg.entity,
      ratio: present ? targetRatio(hasDistance ? dist : null, range) : 0.55,
      // The arcs only carry distances when the card knows the sensor reads
      // one: a PIR has a range but no target to place on it.
      range: hasDistance || cfg.range_entity || cfg.detection_range ? range : null,
      people: present ? people : 0,
      // A breathing silhouette breathes at the rate the radar reads.
      breath: mode === "still" && rate !== null && rate > 0 ? Math.round(Math.max(1.5, Math.min(8, 60 / rate)) * 10) / 10 : null,
      lines,
    };
  }

  _render() {
    const cfg = this._config;
    const hass = withLanguage(this._hass, cfg && cfg.language);
    if (!hass || !cfg) return;
    const m = this._model(hass);
    const showScale = cfg.show_scale !== false;
    const signature = JSON.stringify([m, lang(hass), cfg.compact, showScale]);
    if (signature === this._signature) return;
    this._signature = signature;

    const lines = m.lines.map((l) => `
          <div class="line${l.caution ? " caution" : ""}" data-entity="${escapeHtml(l.entity)}">
            <ha-icon icon="${escapeHtml(l.icon)}"></ha-icon><span class="label">${l.label ? escapeHtml(l.label) : t(hass, l.key)}</span><span class="value">${l.valueKey ? t(hass, l.valueKey) : escapeHtml(l.value)}</span>
          </div>`).join("");

    this._root.innerHTML = `
      <style>
:host { --pr-color: ${MODE_COLORS[m.mode]}; --pr-breath: ${m.breath || 3.6}s; }
ha-card { position:relative; display:flex; flex-direction:column; gap:10px; padding:16px; cursor:pointer; }
ha-card.compact { flex-direction:row; flex-wrap:wrap; align-items:center; gap:12px 16px; padding:10px 16px; }
.illu { width:240px; max-width:86%; margin:0 auto; }
.illu svg { display:block; width:100%; overflow:visible; }
.pr-wall { stroke:var(--secondary-text-color); stroke-width:2; stroke-linecap:round; opacity:.35; }
.pr-fan { fill:url(#pr-fan-g); }
.pr-arc { fill:none; stroke:var(--pr-color); stroke-width:.8; stroke-dasharray:2.5 2.5; opacity:.55; }
.pr-scale { font:500 7px sans-serif; fill:var(--secondary-text-color); }
.pr-box { fill:#f4f6f8; stroke:#aeb7c0; stroke-width:.8; }
.pr-led { fill:#3a4049; }
.pr-sweep { stroke:var(--pr-color); stroke-width:1.4; stroke-linecap:round; opacity:0; transform-box:view-box; transform-origin:${SENSOR.x}px ${SENSOR.y}px; }
.pr-shadow { fill:#000; opacity:.14; }
.pr-person { fill:var(--pr-color); stroke:var(--pr-color); stroke-linecap:round; transform-box:fill-box; transform-origin:50% 100%; }
.pr-person path.pr-arm, .pr-person path.pr-leg { fill:none; stroke-width:2.6; }
.pr-torso { stroke-width:.6; stroke-linejoin:round; }
.pr-leg, .pr-arm { transform-box:fill-box; transform-origin:50% 0; }
.m-occupied .pr-led, .m-moving .pr-led, .m-still .pr-led { fill:var(--pr-color); filter:drop-shadow(0 0 2px var(--pr-color)); }
.m-occupied .pr-sweep, .m-moving .pr-sweep, .m-still .pr-sweep { opacity:.7; animation:pr-sweep 3.2s ease-in-out infinite alternate; }
.m-still .pr-sweep { animation-duration:6s; }
@keyframes pr-sweep { from { transform:rotate(-50deg); } to { transform:rotate(50deg); } }
.m-moving .pr-walker { animation:pr-drift 4s ease-in-out infinite alternate; }
.m-moving .pr-person { animation:pr-bob .45s ease-in-out infinite alternate; }
.m-moving .pr-leg-l, .m-moving .pr-arm-r { animation:pr-swing .45s ease-in-out infinite alternate; }
.m-moving .pr-leg-r, .m-moving .pr-arm-l { animation:pr-swing .45s ease-in-out infinite alternate-reverse; }
@keyframes pr-drift { from { transform:translateX(-16px); } to { transform:translateX(16px); } }
@keyframes pr-bob { from { transform:translateY(0); } to { transform:translateY(-1px); } }
@keyframes pr-swing { from { transform:rotate(-22deg); } to { transform:rotate(22deg); } }
.m-still .pr-person { animation:pr-breathe var(--pr-breath) ease-in-out infinite; }
.pr-p1 .pr-person, .pr-p1.pr-walker { animation-delay:-.7s !important; }
.pr-p2 .pr-person, .pr-p2.pr-walker { animation-delay:-1.9s !important; }
.pr-more { font:600 9px sans-serif; fill:var(--pr-color); }
@keyframes pr-breathe { 0%, 100% { transform:scale(1, 1); } 50% { transform:scale(1.04, 1.06); } }
.m-clear .pr-fan { opacity:.55; }
.m-offline .illu { opacity:.45; filter:grayscale(1); }
@media (prefers-reduced-motion: reduce) { .illu * { animation:none !important; } }
.badge { flex:none; width:44px; height:44px; border-radius:50%; background:var(--pr-color); color:#fff; display:flex; align-items:center; justify-content:center; }
.badge ha-icon { --mdc-icon-size:26px; }
.head { min-width:0; overflow-wrap:anywhere; }
ha-card.compact .head { flex:1 1 120px; }
.name { font-size:15px; font-weight:500; color:var(--primary-text-color); }
.state { font-size:13.5px; font-weight:500; color:var(--pr-color); }
.m-clear .state, .m-offline .state { color:var(--secondary-text-color); }
.lines { display:flex; flex-direction:column; gap:2px; }
ha-card.compact .lines { flex:1 1 100%; }
.line { display:flex; align-items:center; gap:8px; padding:3px 0; font-size:13px; color:var(--secondary-text-color); }
.line ha-icon { --mdc-icon-size:18px; flex:none; }
.line .label { flex:1; min-width:0; }
.line .value { color:var(--primary-text-color); font-variant-numeric:tabular-nums; white-space:nowrap; }
.line.caution, .line.caution .value { color:var(--error-color, #f44336); }
      </style>
      <ha-card class="m-${m.mode}${cfg.compact ? " compact" : ""}">
        ${cfg.compact
          ? `<div class="badge"><ha-icon icon="${MODE_ICONS[m.mode]}"></ha-icon></div>`
          : `<div class="illu">${presenceSvg(hass, m.mode, m.ratio, m.range, showScale, m.people)}</div>`}
        <div class="head">
          <div class="name">${escapeHtml(m.name)}</div>
          <div class="state">${t(hass, m.mode)}</div>
        </div>
        ${lines ? `<div class="lines">${lines}</div>` : ""}
      </ha-card>`;

    this._root.querySelector("ha-card").addEventListener("click", () => this._moreInfo(cfg.entity));
    this._root.querySelectorAll(".line[data-entity]").forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._moreInfo(el.dataset.entity);
      });
    });
  }
}

// ---------------------------------------------------------------------------
// Siblings -- the readings of the same device, found from the entity
// registry when the occupancy entity is picked. Zigbee2MQTT, ZHA, ESPHome,
// Hue, Matter and the Tuya and Aqara integrations name them in English, from
// the property they read. Each field looks in its own domains: an LD2410's
// detection distance is the target's distance as a sensor, and the range as
// a number. Within a field the patterns are tried in order, so a range in
// metres wins over a gate number.
// ---------------------------------------------------------------------------

const SIBLING_RULES = [
  { field: "movement_entity", domains: ["sensor", "select", "binary_sensor"],
    re: [/movement|motion_?state|motion_?status|presence_?state|presence_?event|activity/i, /moving_?target/i, /still_?target/i] },
  { field: "distance_entity", domains: ["sensor"],
    re: [/target_?distance|detection_?distance|target_?1_?distance/i, /(^|_)distance$/i], not: /still|moving|max|min|gate|static|motion_detection|target_[2-9]/i },
  { field: "range_entity", domains: ["number", "input_number", "sensor"],
    re: [/detection_?range|maximum_?range|max_?range|motion_?detection_?distance|large_?motion_?detection_?distance|max_?distance/i,
      /static_?detection_?distance|detection_?distance|range/i, /max_?move_?distance_?gate/i], not: /min|sensitiv|shield|entry|indent/i },
  { field: "target_count_entity", domains: ["sensor"], re: [/(^|_)target_?count$|num_?targets|presence_?target_?count|people_?count|person_?count|occupant/i] },
  { field: "illuminance_entity", domains: ["sensor", "binary_sensor"], deviceClass: ["illuminance", "light"], re: [/illuminance|illumination|lux/i], not: /threshold|interval/i },
  { field: "temperature_entity", domains: ["sensor"], deviceClass: ["temperature"], re: [/temperature/i], not: /device_?temp|calibration|chip|cpu/i },
  { field: "humidity_entity", domains: ["sensor"], deviceClass: ["humidity"], re: [/humidity/i], not: /calibration/i },
  { field: "heart_rate_entity", domains: ["sensor"], re: [/heart_?rate|heart_?beat_?rate|(^|_)bpm$/i] },
  { field: "breath_rate_entity", domains: ["sensor"], re: [/breath(ing)?_?rate|respirat/i] },
  { field: "battery_entity", domains: ["sensor"], deviceClass: ["battery"], re: [/battery/i], not: /low|voltage|state/i },
];

function guessSiblings(hass, entityId) {
  const reg = hass && hass.entities;
  const own = entityId && reg && reg[entityId];
  if (!own || !own.device_id) return {};
  const siblings = Object.keys(reg).filter((e) => e !== entityId && reg[e].device_id === own.device_id && hass.states[e]);
  const found = {};
  for (const rule of SIBLING_RULES) {
    const candidates = siblings.filter((e) => rule.domains.includes(domainOf(e)) && !Object.values(found).includes(e)
      && !(rule.not && rule.not.test(e.split(".")[1])));
    let match = null;
    for (const re of rule.re) {
      match = candidates.find((e) => re.test(e.split(".")[1]));
      if (match) break;
    }
    if (!match && rule.deviceClass) {
      match = candidates.find((e) => rule.deviceClass.includes(hass.states[e].attributes.device_class));
    }
    if (match) found[rule.field] = match;
  }
  return found;
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

const EDITOR_PICKERS = [
  { field: "entity", domains: ["binary_sensor", "sensor", "input_boolean"] },
  { field: "movement_entity", domains: ["sensor", "select", "binary_sensor", "input_select"] },
  { field: "distance_entity", domains: ["sensor", "input_number"] },
  { field: "range_entity", domains: ["sensor", "number", "input_number"] },
  { field: "target_count_entity", domains: ["sensor", "input_number"] },
  { field: "illuminance_entity", domains: ["sensor", "binary_sensor"] },
  { field: "battery_entity", domains: ["sensor"] },
  { field: "temperature_entity", domains: ["sensor"], more: true },
  { field: "humidity_entity", domains: ["sensor"], more: true },
  { field: "heart_rate_entity", domains: ["sensor"], more: true },
  { field: "breath_rate_entity", domains: ["sensor"], more: true },
];

// Toggles that default to true: the key is only stored when switched off.
const DEFAULT_ON = ["show_since", "show_scale"];

class PresenceSensorCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._maybeBuild();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) this._maybeBuild();
    else this._refreshPickersHass();
  }

  // HA calls setConfig again after every config-changed the editor emits. If
  // that echo rebuilt the form, freshly created ha-entity-picker could fire an
  // empty value-changed and silently erase a configured entity: the form is
  // built once, and rebuilt only on purpose.
  _maybeBuild() {
    if (!this._hass || !this._config || this._built) return;
    this._built = true;
    this._build();
  }

  _refreshPickersHass() {
    if (!this._root) return;
    this._root.querySelectorAll("ha-entity-picker").forEach((p) => {
      p.hass = this._hass;
    });
  }

  _emit() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _set(field, value) {
    this._config = { ...this._config };
    if (value === undefined || value === null || value === "") delete this._config[field];
    else this._config[field] = value;
  }

  // Picking the occupancy entity fills the readings of the same device that
  // are still empty; one already chosen is never replaced.
  _pickEntity(value) {
    this._set("entity", value);
    const guessed = guessSiblings(this._hass, value);
    const added = Object.keys(guessed).filter((f) => !this._config[f]);
    for (const f of added) this._set(f, guessed[f]);
    this._emit();
    if (added.length) {
      this._built = false;
      this._maybeBuild();
    }
  }

  _mountPicker(slotEl, field, domains) {
    const picker = document.createElement("ha-entity-picker");
    picker.hass = this._hass;
    picker.value = this._config[field] || "";
    picker.label = t(this._hass, field);
    picker.includeDomains = domains;
    picker.addEventListener("value-changed", (ev) => {
      const value = ev.detail.value;
      if ((value || "") === (this._config[field] || "")) return;
      if (field === "entity") {
        this._pickEntity(value);
        return;
      }
      this._set(field, value);
      this._emit();
    });
    slotEl.appendChild(picker);
  }

  _build() {
    if (!this._root) {
      this.attachShadow({ mode: "open" });
      this._root = this.shadowRoot;
    }
    const hass = this._hass;
    const cfg = this._config;
    const check = (field) => {
      const on = DEFAULT_ON.includes(field) ? cfg[field] !== false : !!cfg[field];
      return `<div class="row row-inline"><label><input type="checkbox" data-field="${field}" ${on ? "checked" : ""}/> ${t(hass, field)}</label></div>`;
    };
    this._root.innerHTML = `
      <style>
.form { display:flex; flex-direction:column; gap:14px; padding:4px 0; }
.row label { display:block; font-size:13px; margin-bottom:4px; color:var(--secondary-text-color); }
.row input[type="text"], .row input[type="number"], .row select { width:100%; box-sizing:border-box; padding:8px; border-radius:6px; border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); font:inherit; }
.row-inline label { display:flex; align-items:center; gap:8px; font-size:13.5px; color:var(--primary-text-color); }
.hint { font-size:12px; color:var(--secondary-text-color); margin-top:-8px; }
details { border:1px solid var(--divider-color); border-radius:8px; padding:8px 12px; }
summary { cursor:pointer; font-size:13.5px; color:var(--secondary-text-color); }
details .form { padding-top:10px; }
      </style>
      <div class="form">
        <div class="row" data-picker="entity"></div>
        <div class="hint">${t(hass, "autofill_hint")}</div>
        <details open>
          <summary>${t(hass, "section_readings")}</summary>
          <div class="form">
            ${EDITOR_PICKERS.slice(1).filter((p) => !p.more).map((p) => `<div class="row" data-picker="${p.field}"></div>`).join("")}
            <div class="row">
              <label>${t(hass, "detection_range")}</label>
              <input type="number" min="0" step="0.1" data-field="detection_range" placeholder="${DEFAULT_RANGE_M}" value="${escapeHtml(cfg.detection_range ?? "")}" />
            </div>
          </div>
        </details>
        <details ${EDITOR_PICKERS.some((p) => p.more && cfg[p.field]) ? "open" : ""}>
          <summary>${t(hass, "section_more")}</summary>
          <div class="form">
            ${EDITOR_PICKERS.filter((p) => p.more).map((p) => `<div class="row" data-picker="${p.field}"></div>`).join("")}
          </div>
        </details>
        <div class="row">
          <label>${t(hass, "name")}</label>
          <input type="text" data-field="name" value="${escapeHtml(cfg.name || "")}" />
        </div>
        <div class="row">
          <label>${t(hass, "card_language")}</label>
          <select data-field="language">
            <option value="" ${!cfg.language || !T[cfg.language] ? "selected" : ""}>${t(hass, "lang_auto")}</option>
            ${LANGUAGE_NAMES.map(([c, n]) => `<option value="${c}" ${cfg.language === c ? "selected" : ""}>${n}</option>`).join("")}
          </select>
        </div>
        ${check("compact")}
        ${check("show_since")}
        ${check("show_scale")}
      </div>`;

    for (const { field, domains } of EDITOR_PICKERS) {
      this._mountPicker(this._root.querySelector(`[data-picker="${field}"]`), field, domains);
    }
    const nameIn = this._root.querySelector('input[data-field="name"]');
    if (nameIn) nameIn.addEventListener("change", (ev) => {
      this._set("name", ev.target.value);
      this._emit();
    });
    const rangeIn = this._root.querySelector('input[data-field="detection_range"]');
    if (rangeIn) rangeIn.addEventListener("change", (ev) => {
      const v = parseFloat(ev.target.value);
      this._set("detection_range", Number.isFinite(v) && v > 0 ? v : undefined);
      this._emit();
    });
    const langSel = this._root.querySelector('select[data-field="language"]');
    if (langSel) langSel.addEventListener("change", (ev) => {
      this._set("language", ev.target.value);
      this._emit();
    });
    this._root.querySelectorAll('input[type="checkbox"][data-field]').forEach((cb) => {
      cb.addEventListener("change", () => {
        const field = cb.dataset.field;
        if (DEFAULT_ON.includes(field)) this._set(field, cb.checked ? undefined : false);
        else this._set(field, cb.checked ? true : undefined);
        this._emit();
      });
    });
  }
}

// ---------------------------------------------------------------------------

customElements.define("ha-presence-sensor-card", PresenceSensorCard);
customElements.define("ha-presence-sensor-card-editor", PresenceSensorCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "ha-presence-sensor-card",
  name: "HA Presence Sensor Card",
  description: "Presence sensor card (mmWave radar, PIR): the detection fan, the target at its distance, moving or still, light and battery.",
  preview: true,
  documentationURL: "https://github.com/ADNPolymerase/ha-presence-sensor-card",
});
