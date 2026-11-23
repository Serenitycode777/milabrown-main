/* Vedic Astrology · Jyotish — milabrown.pro/vedicastrology
   Planet positions are calculated in the visitor's browser (astronomy-engine), in the sidereal zodiac with the Lahiri ayanamsa.
   Rahu/Ketu use the mean lunar node. Nothing is sent anywhere. */
(function () {
  "use strict";
  var A = window.Astronomy;
  var VS = "︎"; // show symbols as text, not emoji

  // ---------- reference data ----------
  var SIGNS = [
    { g: "♈", en: "Aries", ru: "Овен", inRu: "Овне", sk: "Mesha", ruler: "Ma", el: "fire", q: "mov" },
    { g: "♉", en: "Taurus", ru: "Телец", inRu: "Тельце", sk: "Vrishabha", ruler: "Ve", el: "earth", q: "fix" },
    { g: "♊", en: "Gemini", ru: "Близнецы", inRu: "Близнецах", sk: "Mithuna", ruler: "Me", el: "air", q: "dual" },
    { g: "♋", en: "Cancer", ru: "Рак", inRu: "Раке", sk: "Karka", ruler: "Mo", el: "water", q: "mov" },
    { g: "♌", en: "Leo", ru: "Лев", inRu: "Льве", sk: "Simha", ruler: "Su", el: "fire", q: "fix" },
    { g: "♍", en: "Virgo", ru: "Дева", inRu: "Деве", sk: "Kanya", ruler: "Me", el: "earth", q: "dual" },
    { g: "♎", en: "Libra", ru: "Весы", inRu: "Весах", sk: "Tula", ruler: "Ve", el: "air", q: "mov" },
    { g: "♏", en: "Scorpio", ru: "Скорпион", inRu: "Скорпионе", sk: "Vrishchika", ruler: "Ma", el: "water", q: "fix" },
    { g: "♐", en: "Sagittarius", ru: "Стрелец", inRu: "Стрельце", sk: "Dhanu", ruler: "Ju", el: "fire", q: "dual" },
    { g: "♑", en: "Capricorn", ru: "Козерог", inRu: "Козероге", sk: "Makara", ruler: "Sa", el: "earth", q: "mov" },
    { g: "♒", en: "Aquarius", ru: "Водолей", inRu: "Водолее", sk: "Kumbha", ruler: "Sa", el: "air", q: "fix" },
    { g: "♓", en: "Pisces", ru: "Рыбы", inRu: "Рыбах", sk: "Meena", ruler: "Ju", el: "water", q: "dual" },
  ];
  var SIGN_TEXT = {
    en: ["Initiative, courage, new beginnings.", "Stability, senses, patience, value.", "Curiosity, speech, connection, versatility.", "Feeling, home, care, memory.", "Heart, confidence, creativity, leadership.", "Analysis, service, health, refinement.", "Balance, partnership, beauty, fairness.", "Depth, transformation, research, intensity.", "Faith, teaching, travel, higher meaning.", "Structure, duty, ambition, endurance.", "Community, ideals, innovation, detachment.", "Compassion, imagination, surrender, spirit."],
    ru: ["Инициатива, смелость, новые начала.", "Устойчивость, чувства, терпение, ценности.", "Любознательность, речь, связи, гибкость.", "Чувства, дом, забота, память.", "Сердце, уверенность, творчество, лидерство.", "Анализ, служение, здоровье, точность.", "Равновесие, партнёрство, красота, справедливость.", "Глубина, трансформация, исследование, интенсивность.", "Вера, учение, путешествия, высший смысл.", "Структура, долг, амбиции, выносливость.", "Сообщество, идеалы, новаторство, отстранённость.", "Сострадание, воображение, принятие, дух."],
  };
  // planets in display order (the transit pictures)
  var PL = [
    { k: "Su", body: "Sun", g: "☉", en: "Sun", ru: "Солнце", ab: { en: "Su", ru: "Со" } },
    { k: "Mo", body: "Moon", g: "☽", en: "Moon", ru: "Луна", ab: { en: "Mo", ru: "Лу" } },
    { k: "Ma", body: "Mars", g: "♂", en: "Mars", ru: "Марс", ab: { en: "Ma", ru: "Ма" } },
    { k: "Me", body: "Mercury", g: "☿", en: "Mercury", ru: "Меркурий", ab: { en: "Me", ru: "Ме" } },
    { k: "Ju", body: "Jupiter", g: "♃", en: "Jupiter", ru: "Юпитер", ab: { en: "Ju", ru: "Юп" } },
    { k: "Ve", body: "Venus", g: "♀", en: "Venus", ru: "Венера", ab: { en: "Ve", ru: "Ве" } },
    { k: "Sa", body: "Saturn", g: "♄", en: "Saturn", ru: "Сатурн", ab: { en: "Sa", ru: "Са" } },
    { k: "Ra", body: null, g: "☊", en: "Rahu", ru: "Раху", ab: { en: "Ra", ru: "Ра" } },
    { k: "Ke", body: null, g: "☋", en: "Ketu", ru: "Кету", ab: { en: "Ke", ru: "Ке" } },
    { k: "Ur", body: "Uranus", g: "♅", en: "Uranus", ru: "Уран", ab: { en: "Ur", ru: "Ур" } },
    { k: "Ne", body: "Neptune", g: "♆", en: "Neptune", ru: "Нептун", ab: { en: "Ne", ru: "Не" } },
    { k: "Pl", body: "Pluto", g: "♇", en: "Pluto", ru: "Плутон", ab: { en: "Pl", ru: "Пл" } },
  ];
  var PK = {}; PL.forEach(function (p) { PK[p.k] = p; });
  // the nine grahas: reference
  var GRAHA = [
    { k: "Su", sk: "Surya", own: [4], ex: [0, 10], deb: [6, 10], day: 0, yrs: 6,
      en: "The soul, vitality and self-confidence; father, authority and purpose.", ru: "Душа, жизненная сила и уверенность в себе; отец, власть и предназначение." },
    { k: "Mo", sk: "Chandra", own: [3], ex: [1, 3], deb: [7, 3], day: 1, yrs: 10,
      en: "The mind and emotions; mother, nourishment, comfort and the public.", ru: "Ум и эмоции; мать, питание, уют и люди вокруг." },
    { k: "Ma", sk: "Mangala", own: [0, 7], ex: [9, 28], deb: [3, 28], day: 2, yrs: 7,
      en: "Energy, courage and drive; siblings, land, sport and decisive action.", ru: "Энергия, смелость и напор; братья и сёстры, земля, спорт и решительные действия." },
    { k: "Me", sk: "Budha", own: [2, 5], ex: [5, 15], deb: [11, 15], day: 3, yrs: 17,
      en: "Intellect, speech and learning; trade, writing and humour.", ru: "Интеллект, речь и обучение; торговля, письмо и юмор." },
    { k: "Ju", sk: "Guru · Brihaspati", own: [8, 11], ex: [3, 5], deb: [9, 5], day: 4, yrs: 16,
      en: "Wisdom, faith and growth; teachers, children, fortune and dharma.", ru: "Мудрость, вера и рост; учителя, дети, удача и дхарма." },
    { k: "Ve", sk: "Shukra", own: [1, 6], ex: [11, 27], deb: [5, 27], day: 5, yrs: 20,
      en: "Love, beauty and pleasure; partnership, art, comfort and refinement.", ru: "Любовь, красота и удовольствие; партнёрство, искусство, комфорт и утончённость." },
    { k: "Sa", sk: "Shani", own: [9, 10], ex: [6, 20], deb: [0, 20], day: 6, yrs: 19,
      en: "Time, discipline and karma; patience, work, endurance and maturity.", ru: "Время, дисциплина и карма; терпение, труд, выносливость и зрелость." },
    { k: "Ra", sk: "Rahu", own: [], ex: [1, null], deb: [7, null], day: null, yrs: 18,
      en: "The north lunar node: desire, ambition, the unusual and the foreign; what we hunger for.", ru: "Северный лунный узел: желания, амбиции, необычное и чужое; то, чего мы жаждем." },
    { k: "Ke", sk: "Ketu", own: [], ex: [7, null], deb: [1, null], day: null, yrs: 7,
      en: "The south lunar node: detachment, intuition, past skills and spiritual release.", ru: "Южный лунный узел: отрешённость, интуиция, прошлые навыки и духовное освобождение." },
  ];
  // element tones for the sign belt on the wheel
  var EL_COL = { fire: "#e0734f", earth: "#7dbb5c", air: "#b9c6ec", water: "#4f8fc4" };
  var EL_ORDER = ["fire", "earth", "air", "water"];
  var EL_TEXT = {
    en: { fire: "🔥 Fire: action, leadership, transformation, ambition", earth: "🌿 Earth: stability, practicality, structure, grounding", air: "🌬️ Air: communication, intellect, movement, flexibility", water: "💧 Water: emotions, intuition, sensitivity, nourishment" },
    ru: { fire: "🔥 Огонь: действие, лидерство, трансформация, амбиции", earth: "🌿 Земля: стабильность, практичность, структура, заземлённость", air: "🌬️ Воздух: общение, интеллект, движение, гибкость", water: "💧 Вода: эмоции, интуиция, чувствительность, забота" },
  };
  var IMG = window.VA_PLANET_IMG || {};
  var DAYS = { en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ru: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"] };
  // Vimshottari order and years
  var DORDER = ["Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"];
  var DYRS = { Ke: 7, Ve: 20, Su: 6, Mo: 10, Ma: 7, Ra: 18, Ju: 16, Sa: 19, Me: 17 };
  var NAK = [
    ["Ashwini", "Ашвини", "Ashvini Kumaras", "Ашвини Кумары", "horse's head", "голова коня"],
    ["Bharani", "Бхарани", "Yama", "Яма", "yoni", "йони"],
    ["Krittika", "Криттика", "Agni", "Агни", "razor, flame", "бритва, пламя"],
    ["Rohini", "Рохини", "Brahma (Prajapati)", "Брахма (Праджапати)", "chariot", "колесница"],
    ["Mrigashira", "Мригашира", "Soma", "Сома", "deer's head", "голова оленя"],
    ["Ardra", "Ардра", "Rudra", "Рудра", "teardrop", "слеза"],
    ["Punarvasu", "Пунарвасу", "Aditi", "Адити", "quiver of arrows", "колчан со стрелами"],
    ["Pushya", "Пушья", "Brihaspati", "Брихаспати", "cow's udder, flower", "вымя коровы, цветок"],
    ["Ashlesha", "Ашлеша", "Nagas", "Наги", "coiled serpent", "свернувшийся змей"],
    ["Magha", "Магха", "Pitris (ancestors)", "Питри (предки)", "royal throne", "царский трон"],
    ["Purva Phalguni", "Пурва Пхалгуни", "Bhaga", "Бхага", "front legs of a bed", "передние ножки ложа"],
    ["Uttara Phalguni", "Уттара Пхалгуни", "Aryaman", "Арьяман", "back legs of a bed", "задние ножки ложа"],
    ["Hasta", "Хаста", "Savitar", "Савитар", "hand", "ладонь"],
    ["Chitra", "Читра", "Vishvakarma", "Вишвакарма", "bright jewel", "сияющая жемчужина"],
    ["Swati", "Свати", "Vayu", "Ваю", "sprout in the wind", "росток на ветру"],
    ["Vishakha", "Вишакха", "Indra and Agni", "Индра и Агни", "triumphal arch", "триумфальная арка"],
    ["Anuradha", "Анурадха", "Mitra", "Митра", "lotus", "лотос"],
    ["Jyeshtha", "Джьештха", "Indra", "Индра", "earring, umbrella", "серьга, зонт"],
    ["Mula", "Мула", "Nirriti", "Ниррити", "bunch of roots", "пучок корней"],
    ["Purva Ashadha", "Пурва Ашадха", "Apas (waters)", "Апас (воды)", "fan, winnowing basket", "веер, веялка"],
    ["Uttara Ashadha", "Уттара Ашадха", "Vishvedevas", "Вишведевы", "elephant's tusk", "бивень слона"],
    ["Shravana", "Шравана", "Vishnu", "Вишну", "ear, three footprints", "ухо, три следа"],
    ["Dhanishta", "Дхаништха", "the eight Vasus", "восемь Васу", "drum", "барабан"],
    ["Shatabhisha", "Шатабхиша", "Varuna", "Варуна", "empty circle", "пустой круг"],
    ["Purva Bhadrapada", "Пурва Бхадрапада", "Aja Ekapada", "Аджа Экапада", "front of a funeral cot, sword", "передняя часть погребального ложа, меч"],
    ["Uttara Bhadrapada", "Уттара Бхадрапада", "Ahir Budhnya", "Ахир Будхнья", "back of a funeral cot, twins", "задняя часть погребального ложа, близнецы"],
    ["Revati", "Ревати", "Pushan", "Пушан", "fish, drum", "рыба, барабан"],
  ];
  var HOUSES = [
    ["Tanu", "Self, body, appearance, vitality", "Личность, тело, внешность, жизненная сила"],
    ["Dhana", "Money, family, speech, food, values", "Деньги, семья, речь, питание, ценности"],
    ["Sahaja", "Siblings, courage, effort, short trips, communication", "Братья и сёстры, смелость, усилия, поездки, общение"],
    ["Sukha", "Home, mother, inner peace, property, vehicles", "Дом, мать, внутренний покой, недвижимость, транспорт"],
    ["Putra", "Children, creativity, intelligence, romance, past merit", "Дети, творчество, ум, романтика, заслуги прошлого"],
    ["Ripu", "Health, work, service, debts, obstacles", "Здоровье, работа, служение, долги, препятствия"],
    ["Kalatra", "Marriage, partners, contracts, the public", "Брак, партнёры, договоры, люди вокруг"],
    ["Randhra", "Transformation, longevity, hidden matters, inheritance", "Трансформация, долголетие, скрытое, наследство"],
    ["Dharma", "Fortune, teachers, faith, higher learning, long journeys", "Удача, учителя, вера, высшее образование, дальние путешествия"],
    ["Karma", "Career, status, reputation, actions in the world", "Карьера, статус, репутация, дела в мире"],
    ["Labha", "Gains, friends, networks, hopes and wishes", "Доходы, друзья, круг общения, надежды и желания"],
    ["Vyaya", "Expenses, retreat, sleep, foreign lands, liberation", "Расходы, уединение, сон, заграница, освобождение"],
  ];
  var ZONES = [
    ["America/New_York", "New York", "Нью-Йорк"], ["America/Chicago", "Chicago", "Чикаго"], ["America/Denver", "Denver", "Денвер"],
    ["America/Los_Angeles", "Los Angeles", "Лос-Анджелес"], ["America/Toronto", "Toronto", "Торонто"], ["Europe/London", "London", "Лондон"],
    ["Europe/Berlin", "Berlin, Paris, Rome", "Берлин, Париж, Рим"], ["Europe/Riga", "Riga", "Рига"], ["Europe/Vilnius", "Vilnius", "Вильнюс"],
    ["Europe/Tallinn", "Tallinn", "Таллин"], ["Europe/Kyiv", "Kyiv", "Киев"], ["Europe/Minsk", "Minsk", "Минск"], ["Europe/Chisinau", "Chisinau", "Кишинёв"],
    ["Europe/Moscow", "Moscow, St Petersburg", "Москва, Санкт-Петербург"], ["Europe/Samara", "Samara", "Самара"], ["Asia/Yekaterinburg", "Yekaterinburg", "Екатеринбург"],
    ["Asia/Omsk", "Omsk", "Омск"], ["Asia/Novosibirsk", "Novosibirsk", "Новосибирск"], ["Asia/Krasnoyarsk", "Krasnoyarsk", "Красноярск"],
    ["Asia/Irkutsk", "Irkutsk", "Иркутск"], ["Asia/Vladivostok", "Vladivostok", "Владивосток"], ["Asia/Tbilisi", "Tbilisi", "Тбилиси"],
    ["Asia/Yerevan", "Yerevan", "Ереван"], ["Asia/Baku", "Baku", "Баку"], ["Asia/Almaty", "Almaty", "Алматы"], ["Asia/Tashkent", "Tashkent", "Ташкент"],
    ["Asia/Jerusalem", "Jerusalem", "Иерусалим"], ["Europe/Istanbul", "Istanbul", "Стамбул"], ["Asia/Dubai", "Dubai", "Дубай"],
    ["Asia/Kolkata", "India", "Индия"], ["Asia/Bangkok", "Bangkok", "Бангкок"], ["Asia/Tokyo", "Tokyo", "Токио"], ["Australia/Sydney", "Sydney", "Сидней"], ["UTC", "UTC", "UTC"],
  ];

  // ---------- words ----------
  var T = {
    en: {
      title: "Vedic Astrology · Jyotish", desc: "Live Vedic (sidereal) transits, a dasha calculator, and a guide to the planets, signs, nakshatras and houses of Jyotish.",
      h1: "Vedic astrology · Jyotish",
      lead: "Jyotish, the “science of light”, is the astrology of India. It uses the sidereal zodiac, which is tied to the stars, and reads a life through the planets, the signs, the 27 lunar mansions and the great planetary periods called dashas.",
      heroBtn: "Today's transits", wheelCap: "The sky right now, in the sidereal zodiac",
      nTransits: "Transits", nDasha: "Dasha calculator", nPlanets: "Planets", nSigns: "Signs", nNak: "Nakshatras", nPeriods: "Periods", nHouses: "Houses", nSade: "Sade Sati", nVW: "Vedic and Western",
      liveLabel: "Live · calculated in your browser",
      trIntro: "Where the planets are on any date, in the sidereal zodiac (Lahiri). Choose your lagna (ascendant) to see which house of your chart each planet is passing through.",
      date: "Date", time: "Time", tz: "Time zone", yourLagna: "Your lagna", table: "Table", chart: "Chart",
      trTitle: "Transits · {d}", subTable: "Sidereal zodiac (Lahiri) · {t} {z} · {m}", subChart: "North Indian chart · lagna {l} · sidereal zodiac (Lahiri) · {t} {z}",
      cPlanet: "Planet", cSign: "Sign", cDeg: "Degree", cNak: "Nakshatra", cHouse: "House",
      footHouse: "House: counted from the {l} lagna. R: retrograde.", next: "Next:", noNext: "no sign changes in the next 60 days",
      signsByHouse: "Signs by house:", numsNote: "Numbers in the houses are sign numbers (1 Aries … 12 Pisces). R: retrograde.",
      moonAll: "Moon in {s} all day", moonEnters: "Moon → {s} at {t}", lagnaWord: "LAGNA",
      calcLabel: "Calculator", dTitle: "Your dasha periods (Vimshottari)",
      dIntro: "Vimshottari dasha divides a 120-year cycle among the nine planets. The nakshatra the Moon stood in at your birth decides which period you were born into and how much of it was left. Each period colours the years it covers.",
      bDate: "Birth date", bTime: "Birth time", bTz: "Time zone of the birthplace", calc: "Calculate",
      dNote: "Birth time matters: the Moon moves about 1° every 2 hours, which can shift dasha dates by several months. Your details stay in your browser.",
      dNeed: "Please enter your birth date and time.",
      moonAtBirth: "Moon at birth", nakAtBirth: "Nakshatra", bornIn: "Born in", nowRun: "Running now",
      remaining: "{p} mahadasha, {y} left", nowLine: "{m} mahadasha · {a} antardasha", until: "until {d}",
      mdTitle: "Mahadashas", mdHint: "Tap a period to see its sub-periods (antardashas).", nowTag: "now",
      yrs: "years", yShort: "y", mShort: "m", pada: "pada",
      pTitle: "The nine planets · navagraha", pIntro: "Jyotish works with nine grahas, “those that seize”: the seven visible planets and the two lunar nodes, Rahu and Ketu. Uranus, Neptune and Pluto are modern additions, shown in the transits for reference.",
      rules: "Rules", exalted: "Exalted", debil: "Debilitated", dayW: "Day", dasha: "Mahadasha", shadow: "shadow planet", noneSigns: "no sign of its own",
      sTitle: "Twelve signs · rashi", sIntro: "The same twelve signs as in Western astrology, measured from the fixed stars. Each has a ruling planet, an element and a quality.",
      ruler: "Ruler", element: "Element", quality: "Quality", el: { fire: "fire", earth: "earth", air: "air", water: "water" }, q: { mov: "movable (chara)", fix: "fixed (sthira)", dual: "dual (dvisvabhava)" },
      nkTitle: "27 nakshatras", nkIntro: "The lunar mansions: the zodiac divided into 27 parts of 13°20′, one for each day of the Moon's monthly journey. Each has a ruling planet (which starts the dasha sequence), a deity and a symbol, and four quarters (padas) of 3°20′.",
      nkRuler: "Ruler", nkDeity: "Deity", nkSymbol: "Symbol", moonToday: "Moon today",
      perTitle: "Mahadasha lengths", perIntro: "The nine periods always follow the same order, starting from the ruler of the Moon's nakshatra at birth, and add up to 120 years, the traditional full human life.", total: "Total",
      hTitle: "Twelve houses · bhava", hIntro: "Houses show where in life things happen. The 1st house is the sign rising on the eastern horizon at birth (the lagna); the rest follow in order of the signs.",
      gTitle: "How to read a North Indian chart",
      guide: ["The top diamond is always the 1st house, the lagna.", "Houses run counter-clockwise: 2 top-left, 3 left, 4 the left diamond, down to 7 the bottom diamond and 10 the right diamond.", "The places of the houses never change. The small number in each house is the sign sitting there (1 Aries … 12 Pisces).", "Planets are written in the house they occupy, with their degree in the sign."],
      ssTitle: "Sade Sati", ssIntro: "Sade Sati, “seven and a half”, is the roughly 7½ years when Saturn passes through the sign before your Moon sign, your Moon sign itself and the sign after it. It is a time of maturing, responsibility and slow, real results, not a curse.",
      moonSign: "Your Moon sign", ssHint: "Not sure? Use the dasha calculator above and your Moon sign fills in here.", choose: "Choose…",
      ssNow: "You are in Sade Sati now: {p}.", ssNot: "You are not in Sade Sati now.", ssNext: "Next Sade Sati: {a} to {b}.",
      ssPhase: ["first phase (Saturn in the 12th from the Moon)", "peak (Saturn over the Moon)", "last phase (Saturn in the 2nd from the Moon)"],
      ssList: "Sade Sati periods", ssSat: "Saturn now: {s}",
      vwTitle: "Why your Vedic sign may differ", vwIntro: "Western astrology uses the tropical zodiac, tied to the seasons: 0° Aries is the spring equinox. Jyotish uses the sidereal zodiac, tied to the stars. Because the equinox slowly drifts against the stars (about 1° every 72 years), the two zodiacs are now about 24° apart, so most people's Vedic Sun is in the sign before their Western one.",
      ayLabel: "The difference today (Lahiri ayanamsa)", tropical: "Western (tropical)", sidereal: "Vedic (sidereal)", sunToday: "The Sun today",
      vwPoints: [["The Moon and the lagna come first", "Vedic readings centre on the Moon sign, its nakshatra and the rising sign, more than on the Sun sign."], ["Timing through dashas", "Planetary periods show when themes of the chart come alive, alongside the transits."], ["Nine grahas", "The classical system uses the seven visible planets and the lunar nodes, Rahu and Ketu."], ["Divisional charts", "Charts such as the Navamsa (D9) look closer at marriage, career and spiritual life."]],
      closeTitle: "Book a Jyotish reading", closeText: "A two-hour Vedic astrology reading with Mila: your birth chart, your dashas and the current transits, in person in North Raleigh or on Zoom.", closeBtn: "Book a Jyotish reading",
      disclaimer: "For learning and self-reflection. Positions are calculated in your browser (sidereal, Lahiri ayanamsa; Rahu and Ketu by the mean node) and may differ by a few minutes of arc from other software. This is not a prediction of events, nor medical, legal or financial advice.",
      footer: "Vedic astrology · Jyotish", loadErr: "The planet calculator couldn't load. Please check your connection and refresh the page.",
    },
    ru: {
      title: "Ведическая астрология · Джйотиш", desc: "Живые сидерические транзиты, калькулятор даш и путеводитель по планетам, знакам, накшатрам и домам Джйотиша.",
      h1: "Ведическая астрология · Джйотиш",
      lead: "Джйотиш, «наука света», — астрология Индии. Она использует сидерический зодиак, привязанный к звёздам, и читает жизнь через планеты, знаки, 27 лунных стоянок (накшатр) и большие планетарные периоды — даши.",
      heroBtn: "Транзиты сегодня", wheelCap: "Небо сейчас, в сидерическом зодиаке",
      nTransits: "Транзиты", nDasha: "Калькулятор даш", nPlanets: "Планеты", nSigns: "Знаки", nNak: "Накшатры", nPeriods: "Периоды", nHouses: "Дома", nSade: "Саде Сати", nVW: "Ведическая и западная",
      liveLabel: "Онлайн · расчёт в вашем браузере",
      trIntro: "Где находятся планеты в любую дату, в сидерическом зодиаке (Лахири). Выберите свою лагну (асцендент), чтобы увидеть, по какому дому вашей карты идёт каждая планета.",
      date: "Дата", time: "Время", tz: "Часовой пояс", yourLagna: "Ваша лагна", table: "Таблица", chart: "Карта",
      trTitle: "Транзиты · {d}", subTable: "Сидерический зодиак (Лахири) · {t} {z} · {m}", subChart: "Северный ромб · лагна {l} · сидерический зодиак (Лахири) · {t} {z}",
      cPlanet: "Планета", cSign: "Знак", cDeg: "Градус", cNak: "Накшатра", cHouse: "Дом",
      footHouse: "Дом — от лагны {l}. R — ретроградная.", next: "Дальше:", noNext: "смен знаков в ближайшие 60 дней нет",
      signsByHouse: "Знаки по домам:", numsNote: "Цифры в домах — номера знаков (1 Овен … 12 Рыбы). R — ретроградная.",
      moonAll: "Луна весь день в {s}", moonEnters: "Луна → {s} в {t}", lagnaWord: "ЛАГНА",
      calcLabel: "Калькулятор", dTitle: "Ваши даши (Вимшоттари)",
      dIntro: "Вимшоттари-даша делит 120-летний цикл между девятью планетами. Накшатра, в которой стояла Луна в момент рождения, определяет, в каком периоде вы родились и сколько от него оставалось. Каждый период окрашивает свои годы.",
      bDate: "Дата рождения", bTime: "Время рождения", bTz: "Часовой пояс места рождения", calc: "Рассчитать",
      dNote: "Время рождения важно: Луна проходит около 1° за 2 часа, и это может сдвинуть даты даш на несколько месяцев. Ваши данные остаются в вашем браузере.",
      dNeed: "Пожалуйста, укажите дату и время рождения.",
      moonAtBirth: "Луна при рождении", nakAtBirth: "Накшатра", bornIn: "Рождение в", nowRun: "Сейчас идёт",
      remaining: "махадаша {p}, осталось {y}", nowLine: "махадаша {m} · антардаша {a}", until: "до {d}",
      mdTitle: "Махадаши", mdHint: "Нажмите на период, чтобы увидеть подпериоды (антардаши).", nowTag: "сейчас",
      yrs: "лет", yShort: "г", mShort: "мес", pada: "пада",
      pTitle: "Девять планет · наваграха", pIntro: "Джйотиш работает с девятью грахами, «захватывающими»: семь видимых планет и два лунных узла, Раху и Кету. Уран, Нептун и Плутон — современные дополнения, они показаны в транзитах для справки.",
      rules: "Управляет", exalted: "Экзальтация", debil: "Падение", dayW: "День", dasha: "Махадаша", shadow: "теневая планета", noneSigns: "своего знака нет",
      sTitle: "Двенадцать знаков · раши", sIntro: "Те же двенадцать знаков, что и в западной астрологии, но отсчитанные от неподвижных звёзд. У каждого есть управитель, стихия и качество.",
      ruler: "Управитель", element: "Стихия", quality: "Качество", el: { fire: "огонь", earth: "земля", air: "воздух", water: "вода" }, q: { mov: "подвижный (чара)", fix: "фиксированный (стхира)", dual: "двойственный (двисвабхава)" },
      nkTitle: "27 накшатр", nkIntro: "Лунные стоянки: зодиак, разделённый на 27 частей по 13°20′, по одной на каждый день месячного пути Луны. У каждой есть управитель (с него начинается порядок даш), божество, символ и четыре четверти (пады) по 3°20′.",
      nkRuler: "Управитель", nkDeity: "Божество", nkSymbol: "Символ", moonToday: "Луна сегодня",
      perTitle: "Длительность махадаш", perIntro: "Девять периодов всегда идут в одном порядке, начиная с управителя накшатры Луны при рождении, и в сумме дают 120 лет — традиционную полную жизнь человека.", total: "Всего",
      hTitle: "Двенадцать домов · бхава", hIntro: "Дома показывают, в какой сфере жизни что происходит. 1-й дом — знак, восходящий на востоке в момент рождения (лагна); остальные идут по порядку знаков.",
      gTitle: "Как читать северную (ромбовую) карту",
      guide: ["Верхний ромб — всегда 1-й дом, лагна.", "Дома идут против часовой стрелки: 2 — вверху слева, 3 — слева, 4 — левый ромб, далее до 7 — нижнего ромба и 10 — правого ромба.", "Места домов никогда не меняются. Маленькая цифра в доме — знак, который в нём стоит (1 Овен … 12 Рыбы).", "Планеты пишутся в том доме, где они находятся, с градусом в знаке."],
      ssTitle: "Саде Сати", ssIntro: "Саде Сати, «семь с половиной», — около 7½ лет, когда Сатурн проходит знак перед вашим знаком Луны, сам знак Луны и знак после него. Это время взросления, ответственности и медленных, но настоящих результатов, а не проклятие.",
      moonSign: "Ваш знак Луны", ssHint: "Не знаете? Воспользуйтесь калькулятором даш выше — знак Луны подставится сюда.", choose: "Выберите…",
      ssNow: "Сейчас у вас Саде Сати: {p}.", ssNot: "Сейчас у вас нет Саде Сати.", ssNext: "Следующая Саде Сати: с {a} по {b}.",
      ssPhase: ["первая фаза (Сатурн в 12-м от Луны)", "пик (Сатурн над Луной)", "последняя фаза (Сатурн во 2-м от Луны)"],
      ssList: "Периоды Саде Сати", ssSat: "Сатурн сейчас: {s}",
      vwTitle: "Почему ведический знак может отличаться", vwIntro: "Западная астрология использует тропический зодиак, привязанный к сезонам: 0° Овна — весеннее равноденствие. Джйотиш использует сидерический зодиак, привязанный к звёздам. Точка равноденствия медленно смещается относительно звёзд (примерно на 1° за 72 года), поэтому сейчас зодиаки расходятся примерно на 24°, и у большинства людей ведическое Солнце стоит в знаке перед западным.",
      ayLabel: "Разница сегодня (айанамша Лахири)", tropical: "Западный (тропический)", sidereal: "Ведический (сидерический)", sunToday: "Солнце сегодня",
      vwPoints: [["Главное — Луна и лагна", "Ведическое толкование опирается на знак Луны, её накшатру и восходящий знак больше, чем на знак Солнца."], ["Время через даши", "Планетарные периоды показывают, когда темы карты оживают, вместе с транзитами."], ["Девять грах", "Классическая система использует семь видимых планет и лунные узлы, Раху и Кету."], ["Дробные карты", "Карты вроде Навамши (D9) подробнее раскрывают брак, карьеру и духовную жизнь."]],
      closeTitle: "Записаться на консультацию по Джйотишу", closeText: "Двухчасовой разбор ведической карты с Милой: ваша натальная карта, даши и текущие транзиты, лично в North Raleigh или в Zoom.", closeBtn: "Записаться на Джйотиш",
      disclaimer: "Для обучения и самопознания. Положения планет рассчитываются в вашем браузере (сидерический зодиак, айанамша Лахири; Раху и Кету по среднему узлу) и могут отличаться от других программ на несколько угловых минут. Это не предсказание событий и не медицинский, юридический или финансовый совет.",
      footer: "Ведическая астрология · Джйотиш", loadErr: "Не удалось загрузить расчёт планет. Проверьте подключение и обновите страницу.",
    },
  };
  var lang = "en";
  try { lang = localStorage.getItem("va-lang") || ((navigator.language || "").toLowerCase().indexOf("ru") === 0 ? "ru" : "en"); } catch (e) {}
  // a link can choose the language: ?lang=ru or ?lang=en (used by the articles in the Serene Portal)
  var qlang = (location.search.match(/[?&]lang=(en|ru)\b/) || [])[1];
  if (qlang) { lang = qlang; try { localStorage.setItem("va-lang", lang); } catch (e) {} }
  if (lang !== "ru") lang = "en";
  var t = function (k) { return T[lang][k]; };
  var fill = function (s, o) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ""; }); };
  var esc = function (v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var $ = function (id) { return document.getElementById(id); };
  var sname = function (i) { return SIGNS[i][lang]; };
  var pname = function (k) { return PK[k][lang]; };
  var glyph = function (g) { return g + VS; };

  // ---------- time zones ----------
  var myTz = "America/New_York";
  try { myTz = Intl.DateTimeFormat().resolvedOptions().timeZone || myTz; } catch (e) {}
  function tzParts(ms, tz) {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value; });
    return p;
  }
  function tzOffset(ms, tz) { var p = tzParts(ms, tz); return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - ms; }
  function zonedToUtc(y, mo, d, h, mi, tz) {
    var g = Date.UTC(y, mo - 1, d, h, mi), o = tzOffset(g, tz), u = g - o, o2 = tzOffset(u, tz);
    if (o2 !== o) u = g - o2;
    return new Date(u);
  }
  function zoneLabel(tz) { var z = ZONES.filter(function (x) { return x[0] === tz; })[0]; return z ? (lang === "ru" ? z[2] : z[1]) : tz.split("/").pop().replace(/_/g, " "); }
  function fillZones(sel, def) {
    var list = ZONES.slice();
    if (!list.some(function (x) { return x[0] === myTz; })) list.unshift([myTz, myTz.split("/").pop().replace(/_/g, " "), myTz.split("/").pop().replace(/_/g, " ")]);
    var cur = sel.value || def;
    sel.innerHTML = list.map(function (z) { return '<option value="' + z[0] + '">' + esc(lang === "ru" ? z[2] : z[1]) + "</option>"; }).join("");
    sel.value = cur;
  }
  var LOCALE = function () { return lang === "ru" ? "ru-RU" : "en-US"; };
  function fmtDay(date, tz) { return date.toLocaleDateString(LOCALE(), { timeZone: tz, day: "numeric", month: "long", year: "numeric" }); }
  function fmtShort(date) { return date.toLocaleDateString(LOCALE(), { day: "numeric", month: "short", year: "numeric" }); }
  function fmtHM(date, tz) { return date.toLocaleTimeString(lang === "ru" ? "ru-RU" : "en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" }); }
  function fmtDM(date, tz) { var p = tzParts(date.getTime(), tz); return (+p.day) + "." + p.month; }

  // ---------- positions (sidereal, Lahiri) ----------
  var norm = function (x) { return ((x % 360) + 360) % 360; };
  var NAKW = 40 / 3;
  function jd(date) { return date.getTime() / 864e5 + 2440587.5; }
  function ayanamsa(date) { return 23.853 + (50.2876 / 3600) * ((jd(date) - 2451545) / 365.25); } // Lahiri (approximation, arc-minute level)
  function meanNode(date) {
    var T_ = (jd(date) - 2451545) / 36525;
    return norm(125.0445479 - 1934.1362891 * T_ + 0.0020754 * T_ * T_ + Math.pow(T_, 3) / 467441 - Math.pow(T_, 4) / 60616000);
  }
  function tropical(k, date) {
    if (k === "Ra") return meanNode(date);
    if (k === "Ke") return norm(meanNode(date) + 180);
    if (k === "Mo") return A.Ecliptic(A.GeoMoon(date)).elon;
    return A.Ecliptic(A.GeoVector(PK[k].body, date, true)).elon;
  }
  function sid(k, date) { return norm(tropical(k, date) - ayanamsa(date)); }
  function info(k, date) {
    var lon = sid(k, date);
    var before = sid(k, new Date(date.getTime() - 432e5)), after = sid(k, new Date(date.getTime() + 432e5));
    var d = norm(after - before); var retro = (k === "Ra" || k === "Ke") ? true : (k === "Su" || k === "Mo") ? false : d > 180;
    var s = Math.floor(lon / 30), deg = lon - s * 30, n = Math.floor(lon / NAKW);
    return { k: k, lon: lon, sign: s, deg: deg, nak: n, pada: Math.floor((lon - n * NAKW) / (NAKW / 4)) + 1, retro: retro };
  }
  function dms(deg) { var d = Math.floor(deg), m = Math.floor((deg - d) * 60 + 1e-9); return d + "°" + String(m).padStart(2, "0") + "′"; }
  // time when planet k leaves its current sign, searched between a and b (a in one sign, b in another)
  function crossing(k, a, b) {
    var sa = Math.floor(sid(k, a) / 30);
    for (var i = 0; i < 30; i++) {
      var m = new Date((a.getTime() + b.getTime()) / 2);
      if (Math.floor(sid(k, m) / 30) === sa) a = m; else b = m;
    }
    return b;
  }

  // ---------- transits ----------
  var view = "table";
  function trDate() {
    var dv = $("trDate").value, tv = $("trTime").value || "12:00", tz = $("trTz").value;
    var p = dv.split("-").map(Number), q = tv.split(":").map(Number);
    return { date: zonedToUtc(p[0], p[1], p[2], q[0], q[1], tz), tz: tz, y: p[0], mo: p[1], d: p[2], time: tv };
  }
  function moonDay(tr) {
    var start = zonedToUtc(tr.y, tr.mo, tr.d, 0, 0, tr.tz), end = new Date(start.getTime() + 864e5 - 6e4);
    var s0 = Math.floor(sid("Mo", start) / 30), s1 = Math.floor(sid("Mo", end) / 30);
    if (s0 === s1) return fill(t("moonAll"), { s: lang === "ru" ? SIGNS[s0].inRu : sname(s0) });
    var x = crossing("Mo", start, end);
    return fill(t("moonEnters"), { s: sname(s1), t: fmtHM(x, tr.tz) });
  }
  function nextChanges(tr) {
    var out = [], step = 6 * 36e5, keys = ["Su", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ur", "Ne", "Pl"];
    keys.forEach(function (k) {
      var a = tr.date, sa = Math.floor(sid(k, a) / 30);
      for (var i = 1; i <= 60 * 4; i++) {
        var b = new Date(tr.date.getTime() + i * step), sb = Math.floor(sid(k, b) / 30);
        if (sb !== sa) { var x = crossing(k, a, b); out.push({ k: k, at: x, to: Math.floor(sid(k, new Date(x.getTime() + 6e4)) / 30) }); break; }
        a = b;
      }
    });
    out.sort(function (a, b) { return a.at - b.at; });
    var parts = [];
    out.slice(0, 5).forEach(function (c) {
      if (c.k === "Ra") parts.push(fmtDM(c.at, tr.tz) + " " + pname("Ra") + " → " + sname(c.to) + ", " + pname("Ke") + " → " + sname((c.to + 6) % 12));
      else parts.push(fmtDM(c.at, tr.tz) + " " + pname(c.k) + " → " + sname(c.to));
    });
    return parts.length ? parts.join(" · ") : t("noNext");
  }
  function renderTransits() {
    var b = $("board"); if (!A) { b.innerHTML = '<p class="err">' + esc(t("loadErr")) + "</p>"; return; }
    var tr = trDate(); if (isNaN(tr.date)) return;
    var L = +$("trLagna").value, rows = PL.map(function (p) { return info(p.k, tr.date); });
    var title = fill(t("trTitle"), { d: fmtDay(tr.date, tr.tz).replace(/ г\.$/, "") });
    var h = "<h3>" + esc(title) + "</h3>";
    if (view === "table") {
      h += '<p class="sub">' + esc(fill(t("subTable"), { t: tr.time, z: zoneLabel(tr.tz), m: moonDay(tr) })) + "</p><hr>";
      h += '<table class="ttable"><thead><tr><th></th><th>' + esc(t("cPlanet")) + "</th><th>" + esc(t("cSign")) + "</th><th>" + esc(t("cDeg")) + '</th><th class="nkcol">' + esc(t("cNak")) + "</th><th>" + esc(t("cHouse")) + "</th></tr></thead><tbody>";
      rows.forEach(function (r) {
        h += '<tr><td class="g" aria-hidden="true">' + glyph(PK[r.k].g) + '</td><td class="pl">' + esc(pname(r.k)) + '</td><td class="sg"><span aria-hidden="true">' + glyph(SIGNS[r.sign].g) + "</span>" + esc(sname(r.sign)) +
          '</td><td class="dg">' + dms(r.deg) + (r.retro ? '<span class="rpill" title="retrograde">R</span>' : "") + '</td><td class="nk nkcol">' + esc(NAK[r.nak][lang === "ru" ? 1 : 0]) + '</td><td class="hs">' + (((r.sign - L + 12) % 12) + 1) + "</td></tr>";
      });
      h += "</tbody></table>";
      h += '<p class="foot">' + esc(fill(t("footHouse"), { l: sname(L) })) + "<br><b>" + esc(t("next")) + "</b> " + esc(nextChanges(tr)) + "</p>";
    } else {
      h += '<p class="sub">' + esc(fill(t("subChart"), { l: sname(L), t: tr.time, z: zoneLabel(tr.tz) })) + "</p>";
      h += chartSvg(L, rows);
      var list = []; for (var i = 0; i < 12; i++) list.push((i + 1) + " " + sname((L + i) % 12));
      h += '<p class="foot"><b>' + esc(t("signsByHouse")) + "</b> " + esc(list.join(" · ")) + "<br>" + esc(t("numsNote")) + "</p>";
    }
    b.innerHTML = h;
  }
  // North Indian chart geometry (viewBox 0 0 400 400): house -> polygon, sign-number spot, planet-text spot
  var NI = [
    { poly: "200,0 300,100 200,200 100,100", num: [200, 182], txt: [200, 92] },
    { poly: "0,0 200,0 100,100", num: [100, 82], txt: [100, 34] },
    { poly: "0,0 100,100 0,200", num: [90, 104], txt: [38, 100] },
    { poly: "0,200 100,100 200,200 100,300", num: [178, 204], txt: [100, 196] },
    { poly: "0,200 100,300 0,400", num: [90, 304], txt: [38, 300] },
    { poly: "0,400 100,300 200,400", num: [100, 326], txt: [100, 368] },
    { poly: "200,400 100,300 200,200 300,300", num: [200, 226], txt: [200, 300] },
    { poly: "200,400 300,300 400,400", num: [300, 326], txt: [300, 368] },
    { poly: "400,400 300,300 400,200", num: [310, 304], txt: [362, 300] },
    { poly: "400,200 300,300 200,200 300,100", num: [222, 204], txt: [300, 196] },
    { poly: "400,200 300,100 400,0", num: [310, 104], txt: [362, 100] },
    { poly: "400,0 300,100 200,0", num: [300, 82], txt: [300, 34] },
  ];
  function chartSvg(L, rows) {
    var s = '<svg class="nchart" viewBox="-8 -8 416 416" role="img" aria-label="North Indian chart">';
    s += '<polygon class="lag" points="' + NI[0].poly + '"/>';
    s += '<rect class="ln" x="0" y="0" width="400" height="400"/><path class="ln" d="M0,0L400,400M400,0L0,400M200,0L400,200L200,400L0,200Z"/>';
    s += '<text class="lg" x="200" y="22" text-anchor="middle">' + esc(t("lagnaWord")) + "</text>";
    for (var h = 0; h < 12; h++) {
      var sign = (L + h) % 12, g = NI[h];
      s += '<text class="num" x="' + g.num[0] + '" y="' + g.num[1] + '" text-anchor="middle">' + (sign + 1) + " " + glyph(SIGNS[sign].g) + "</text>";
      var here = rows.filter(function (r) { return r.sign === sign; });
      var y0 = g.txt[1] - (here.length - 1) * 8 + 4;
      here.forEach(function (r, i) {
        s += '<text class="pt" x="' + g.txt[0] + '" y="' + (y0 + i * 16) + '" text-anchor="middle"><tspan class="ab">' + esc(PK[r.k].ab[lang]) + "</tspan> " + dms(r.deg) + (r.retro ? ' <tspan class="r">R</tspan>' : "") + "</text>";
      });
    }
    return s + "</svg>";
  }

  // ---------- hero wheel ----------
  function renderWheel() {
    var w = $("wheel"), now = new Date(), s = '<g class="spin">';
    s += '<circle cx="200" cy="200" r="190" fill="none" stroke="#dcb97a" stroke-width="1"/><circle cx="200" cy="200" r="150" fill="none" stroke="#dcb97a" stroke-width=".8"/><circle cx="200" cy="200" r="132" fill="none" stroke="rgba(220,185,122,.45)" stroke-width=".6"/>';
    var pt = function (r, lon) { var a = (180 - lon) * Math.PI / 180; return [200 + r * Math.cos(a), 200 + r * Math.sin(a)]; };
    for (var i = 0; i < 12; i++) {
      // sign segment of the belt, tinted by its element
      var o1 = pt(190, i * 30), o2 = pt(190, i * 30 + 30), i2 = pt(150, i * 30 + 30), i1 = pt(150, i * 30), el = SIGNS[i].el;
      var sl = sname(i) + " · " + EL_TEXT[lang][el];
      s += '<path class="ws" tabindex="0" role="img" aria-label="' + esc(sl) + '" data-l="' + esc(sl) + '" d="M' + o1 + "A190,190 0 0 0 " + o2 + "L" + i2 + "A150,150 0 0 1 " + i1 + 'Z" fill="' + EL_COL[el] + '" fill-opacity=".36"/>';
    }
    for (i = 0; i < 12; i++) {
      var a = pt(150, i * 30), b = pt(190, i * 30), c = pt(170, i * 30 + 15);
      s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="#dcb97a" stroke-width=".8" pointer-events="none"/>';
      s += '<text x="' + c[0] + '" y="' + (c[1] + 6) + '" text-anchor="middle" font-size="17" fill="#f4e8c8" pointer-events="none">' + glyph(SIGNS[i].g) + "</text>";
    }
    for (var n = 0; n < 27; n++) { var p1 = pt(132, n * NAKW), p2 = pt(150, n * NAKW); s += '<line x1="' + p1[0] + '" y1="' + p1[1] + '" x2="' + p2[0] + '" y2="' + p2[1] + '" stroke="rgba(220,185,122,.55)" stroke-width=".6"/>'; }
    if (A) {
      var used = [];
      PL.slice(0, 9).forEach(function (p) {
        var lon = sid(p.k, now), r = 110;
        used.forEach(function (u) { if (Math.abs(norm(u.lon - lon + 180) - 180) < 8 && u.r === r) r -= 22; });
        used.push({ lon: lon, r: r });
        var q = pt(r, lon), m = pt(130, lon);
        var inf = info(p.k, now), lbl = pname(p.k) + " · " + sname(inf.sign) + " " + dms(inf.deg) + (inf.retro ? " R" : "");
        s += '<line x1="' + m[0] + '" y1="' + m[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" stroke="rgba(143,196,184,.5)" stroke-width=".6"/><g class="wp" tabindex="0" role="img" aria-label="' + esc(lbl) + '" data-l="' + esc(lbl) + '">' + (IMG[p.k]
          ? '<circle class="hit" cx="' + q[0] + '" cy="' + q[1] + '" r="14" fill="transparent"/><image href="' + IMG[p.k] + '" x="' + (q[0] - (p.k === "Sa" ? 19 : 13)) + '" y="' + (q[1] - (p.k === "Sa" ? 19 : 13)) + '" width="' + (p.k === "Sa" ? 38 : 26) + '" height="' + (p.k === "Sa" ? 38 : 26) + '"/>'
          : '<circle class="hit" cx="' + q[0] + '" cy="' + q[1] + '" r="13" fill="#170b29" stroke="#dcb97a" stroke-width=".8"/><text x="' + q[0] + '" y="' + (q[1] + 5) + '" text-anchor="middle" font-size="13" fill="#f0d9a0">' + glyph(p.g) + "</text>") + "</g>";
      });
    }
    s += '</g><circle cx="200" cy="200" r="4" fill="#dcb97a"/>';
    w.innerHTML = s; w.setAttribute("aria-label", t("wheelCap"));
    var lg = $("elLegend");
    if (lg) lg.innerHTML = EL_ORDER.map(function (e) { return '<button type="button" class="wl" data-l="' + esc(EL_TEXT[lang][e]) + '"><i style="background:' + EL_COL[e] + '"></i>' + esc(t("el")[e]) + "</button>"; }).join("");
    hideTip();
  }
  // little label with the planet's name and degree when pointing at (or tapping) a planet on the wheel
  var tip = null, tipOn = null;
  function showTip(g) {
    var w = $("wheel"), box = w.parentNode;
    if (!tip) { tip = document.createElement("div"); tip.className = "wtip"; tip.setAttribute("role", "tooltip"); box.appendChild(tip); }
    tipOn = g; w.classList.add("held");
    tip.textContent = g.getAttribute("data-l");
    var c = (g.querySelector(".hit") || g).getBoundingClientRect(), b = box.getBoundingClientRect();
    // keep the label on screen; the little arrow still points at the planet or sign
    var cx = c.left + c.width / 2, half = tip.offsetWidth / 2, vw = document.documentElement.clientWidth;
    var x = Math.min(Math.max(cx, half + 8), vw - half - 8);
    tip.style.left = (x - b.left) + "px"; tip.style.top = (c.top - b.top) + "px"; tip.style.setProperty("--ax", (cx - x) + "px");
    tip.classList.add("on");
  }
  function hideTip() { if (tip) tip.classList.remove("on"); tipOn = null; var w = $("wheel"); if (w) w.classList.remove("held"); }
  (function () {
    var box = $("wheel").parentNode, SEL = ".wp,.ws,.wl";
    box.addEventListener("pointerover", function (e) { var g = e.target.closest(SEL); if (g) showTip(g); });
    box.addEventListener("pointerout", function (e) { var g = e.target.closest(SEL); if (g && !g.contains(e.relatedTarget)) hideTip(); });
    box.addEventListener("click", function (e) { var g = e.target.closest(SEL); if (g) showTip(g); else hideTip(); });
    box.addEventListener("focusin", function (e) { var g = e.target.closest(SEL); if (g) showTip(g); });
    box.addEventListener("focusout", hideTip);
    document.addEventListener("pointerdown", function (e) { if (tipOn && !e.target.closest(SEL)) hideTip(); });
  })();

  // ---------- dasha ----------
  var YEAR = 365.25 * 864e5, lastDasha = null, openMd = null;
  function dur(ms) { var y = Math.floor(ms / YEAR), m = Math.round((ms - y * YEAR) / (YEAR / 12)); if (m === 12) { y++; m = 0; } return y + " " + t("yShort") + " " + m + " " + t("mShort"); }
  function dashas(birth) {
    var lon = sid("Mo", birth), n = Math.floor(lon / NAKW), frac = (lon - n * NAKW) / NAKW, first = n % 9;
    var start = birth.getTime() - frac * DYRS[DORDER[first]] * YEAR, list = [];
    for (var i = 0; i < 10; i++) {
      var L = DORDER[(first + i) % 9], len = DYRS[L] * YEAR, s0 = start, ads = [], a = s0;
      for (var j = 0; j < 9; j++) { var S = DORDER[(first + i + j) % 9], al = DYRS[L] * DYRS[S] / 120 * YEAR; ads.push({ k: S, s: new Date(a), e: new Date(a + al) }); a += al; }
      list.push({ k: L, s: new Date(s0), e: new Date(s0 + len), ads: ads });
      start += len;
    }
    return { lon: lon, nak: n, pada: Math.floor((lon - n * NAKW) / (NAKW / 4)) + 1, list: list, birth: birth, balance: list[0].e - birth };
  }
  function renderDasha() {
    var r = $("dRes"); if (!lastDasha) { r.innerHTML = ""; return; }
    var D = lastDasha, now = Date.now(), sign = Math.floor(D.lon / 30);
    var cur = D.list.filter(function (m) { return m.s <= now && now < m.e; })[0], curA = cur ? cur.ads.filter(function (a) { return a.s <= now && now < a.e; })[0] : null;
    var h = '<div class="facts">';
    h += '<div class="fact"><b>' + esc(t("moonAtBirth")) + "</b><span>" + glyph(SIGNS[sign].g) + " " + esc(sname(sign)) + " " + dms(D.lon - sign * 30) + "</span></div>";
    h += '<div class="fact"><b>' + esc(t("nakAtBirth")) + "</b><span>" + esc(NAK[D.nak][lang === "ru" ? 1 : 0]) + ", " + esc(t("pada")) + " " + D.pada + "</span></div>";
    h += '<div class="fact"><b>' + esc(t("bornIn")) + "</b><span>" + esc(fill(t("remaining"), { p: pname(D.list[0].k), y: dur(D.balance) })) + "</span></div>";
    if (cur) h += '<div class="fact"><b>' + esc(t("nowRun")) + "</b><span>" + esc(fill(t("nowLine"), { m: pname(cur.k), a: curA ? pname(curA.k) : "—" })) + (curA ? "<br><small>" + esc(fill(t("until"), { d: fmtShort(curA.e) })) + "</small>" : "") + "</span></div>";
    h += "</div><h3 style=\"font-family:var(--serif);font-weight:500;font-size:1.6rem;margin:.6rem 0 0\">" + esc(t("mdTitle")) + '</h3><p class="note" style="margin:0 0 .4rem">' + esc(t("mdHint")) + '</p><div class="mdlist">';
    if (openMd === null && cur) openMd = D.list.indexOf(cur);
    D.list.forEach(function (m, i) {
      var isNow = m === cur, open = i === openMd;
      h += '<div class="md' + (isNow ? " now" : "") + '"><button type="button" data-md="' + i + '" aria-expanded="' + open + '"><span class="gl" aria-hidden="true">' + glyph(PK[m.k].g) + '</span><span class="nm">' + esc(pname(m.k)) + (isNow ? '<span class="now-tag">' + esc(t("nowTag")) + "</span>" : "") + '</span><span class="dt">' + fmtShort(i === 0 ? D.birth : m.s) + " – " + fmtShort(m.e) + "</span></button>";
      if (open) h += '<div class="ads">' + m.ads.map(function (a) { var n = a.s <= now && now < a.e; return '<div class="' + (n ? "now" : "") + '"><span>' + esc(pname(a.k)) + "</span><span>" + fmtShort(a.s) + " – " + fmtShort(a.e) + "</span></div>"; }).join("") + "</div>";
      h += "</div>";
    });
    r.innerHTML = h + "</div>";
  }

  // ---------- Sade Sati ----------
  var satCache = null;
  function saturnSigns() {
    if (satCache) return satCache;
    var out = [], step = 3 * 864e5, d = Date.UTC(1930, 0, 1), end = Date.UTC(2091, 0, 1), prev = null;
    for (; d <= end; d += step) { var s = Math.floor(sid("Sa", new Date(d)) / 30); if (s !== prev) { out.push({ t: d, s: s }); prev = s; } }
    return (satCache = out);
  }
  function sadeWindows(moon) {
    var seg = saturnSigns(), wins = [], cur = null, inSet = function (s) { return s === (moon + 11) % 12 || s === moon || s === (moon + 1) % 12; };
    for (var i = 0; i < seg.length; i++) {
      var on = inSet(seg[i].s), end = i + 1 < seg.length ? seg[i + 1].t : Date.UTC(2091, 0, 1);
      if (on && !cur) cur = { a: seg[i].t, b: end }; else if (on && cur) cur.b = end;
      else if (!on && cur) {
        // short exits by retrograde (less than a year) don't end the period
        var back = seg.slice(i + 1).filter(function (x) { return inSet(x.s); })[0];
        if (back && back.t - seg[i].t < 365 * 864e5) continue;
        wins.push(cur); cur = null;
      }
    }
    // a period still running at the end of the scan is incomplete, so leave it out
    return wins;
  }
  function renderSade() {
    var r = $("ssRes"), v = $("ssMoon").value; if (!A) return;
    var nowSat = info("Sa", new Date()), h = '<p class="label">' + esc(fill(t("ssSat"), { s: sname(nowSat.sign) + " " + dms(nowSat.deg) })) + "</p>";
    if (v === "") { r.innerHTML = h; return; }
    var moon = +v, wins = sadeWindows(moon), now = Date.now(), cur = wins.filter(function (w) { return w.a <= now && now < w.b; })[0], next = wins.filter(function (w) { return w.a > now; })[0];
    if (cur) { var rel = (nowSat.sign - moon + 12) % 12, ph = rel === 11 ? 0 : rel === 0 ? 1 : 2; h += '<p class="status">' + esc(fill(t("ssNow"), { p: t("ssPhase")[ph] })) + "</p>"; }
    else h += '<p class="status">' + esc(t("ssNot")) + (next ? " " + esc(fill(t("ssNext"), { a: fmtShort(new Date(next.a)), b: fmtShort(new Date(next.b)) })) : "") + "</p>";
    var from = Date.UTC(1950, 0, 1);
    h += '<p class="label">' + esc(t("ssList")) + '</p><ul class="wins">' + wins.filter(function (w) { return w.b > from; }).map(function (w) {
      var n = w.a <= now && now < w.b;
      return '<li class="' + (n ? "now" : "") + '"><span>' + fmtShort(new Date(w.a)) + " – " + fmtShort(new Date(w.b)) + "</span><small>" + dur(w.b - w.a) + "</small></li>";
    }).join("") + "</ul>";
    r.innerHTML = h;
  }

  // ---------- reference sections ----------
  function renderRef() {
    var tmo = A ? info("Mo", new Date()) : null;
    $("pGrid").innerHTML = GRAHA.map(function (g) {
      var p = PK[g.k], own = g.own.length ? g.own.map(sname).join(", ") : t("noneSigns");
      var ex = sname(g.ex[0]) + (g.ex[1] != null ? " " + g.ex[1] + "°" : ""), de = sname(g.deb[0]) + (g.deb[1] != null ? " " + g.deb[1] + "°" : "");
      return '<article class="card"><h3><span class="gl" aria-hidden="true">' + glyph(p.g) + "</span>" + esc(p[lang]) + '</h3><p class="sk">' + esc(g.sk) + (g.day == null ? " · " + esc(t("shadow")) : "") + "</p><p>" + esc(g[lang]) + "</p><dl>" +
        "<dt>" + esc(t("rules")) + "</dt><dd>" + esc(own) + "</dd><dt>" + esc(t("exalted")) + "</dt><dd>" + esc(ex) + "</dd><dt>" + esc(t("debil")) + "</dt><dd>" + esc(de) + "</dd>" +
        (g.day != null ? "<dt>" + esc(t("dayW")) + "</dt><dd>" + esc(DAYS[lang][g.day]) + "</dd>" : "") + "<dt>" + esc(t("dasha")) + "</dt><dd>" + g.yrs + " " + esc(t("yrs")) + "</dd></dl></article>";
    }).join("");
    $("sGrid").innerHTML = SIGNS.map(function (s, i) {
      return '<article class="card"><h3><span class="gl" aria-hidden="true">' + glyph(s.g) + "</span>" + esc(s[lang]) + '</h3><p class="sk">' + esc(s.sk) + " · " + (i * 30) + "°–" + (i * 30 + 30) + "°</p><p>" + esc(SIGN_TEXT[lang][i]) + "</p><dl><dt>" + esc(t("ruler")) + "</dt><dd>" + esc(pname(s.ruler)) + "</dd><dt>" + esc(t("element")) + "</dt><dd>" + esc(t("el")[s.el]) + "</dd><dt>" + esc(t("quality")) + "</dt><dd>" + esc(t("q")[s.q]) + "</dd></dl></article>";
    }).join("");
    $("nkGrid").innerHTML = NAK.map(function (n, i) {
      var a = i * NAKW, b = a + NAKW, sa = Math.floor(a / 30), sb = Math.floor((b - 1e-6) / 30);
      var span = sname(sa) + " " + dms(a - sa * 30) + " – " + (sb !== sa ? sname(sb) + " " : "") + dms(b - sb * 30);
      var today = tmo && tmo.nak === i;
      return '<article class="nak' + (today ? " today" : "") + '"><h3><small>' + (i + 1) + "</small>" + esc(n[lang === "ru" ? 1 : 0]) + (today ? '<span class="tag">' + esc(t("moonToday")) + "</span>" : "") + '</h3><p class="span">' + esc(span) + "</p><p><b>" + esc(t("nkRuler")) + ":</b> " + esc(pname(DORDER[i % 9])) + " · <b>" + esc(t("nkDeity")) + ":</b> " + esc(n[lang === "ru" ? 3 : 2]) + "</p><p><b>" + esc(t("nkSymbol")) + ":</b> " + esc(n[lang === "ru" ? 5 : 4]) + "</p></article>";
    }).join("");
    $("pTable").innerHTML = DORDER.map(function (k) { return '<tr><td aria-hidden="true">' + glyph(PK[k].g) + "</td><td>" + esc(pname(k)) + '</td><td class="y">' + DYRS[k] + " " + esc(t("yrs")) + "</td></tr>"; }).join("") + '<tr class="tot"><td></td><td>' + esc(t("total")) + '</td><td class="y">120 ' + esc(t("yrs")) + "</td></tr>";
    // ring of the 120 years
    var s = "", a0 = -90, cols = ["#dcb97a", "#8fc4b8", "#c9b2f0", "#f0d9a0", "#e6a08c", "#7aa6c9", "#e8c66b", "#9b8fb8", "#a7d3a0"];
    DORDER.forEach(function (k, i) {
      var a1 = a0 + DYRS[k] * 3, r = 150, R = 190, f = function (rad, ang) { var x = ang * Math.PI / 180; return [200 + rad * Math.cos(x), 200 + rad * Math.sin(x)]; };
      var p1 = f(R, a0), p2 = f(R, a1), p3 = f(r, a1), p4 = f(r, a0), big = a1 - a0 > 180 ? 1 : 0, mid = f(170, (a0 + a1) / 2), lab = f(122, (a0 + a1) / 2);
      s += '<path d="M' + p1 + "A" + R + "," + R + " 0 " + big + " 1 " + p2 + "L" + p3 + "A" + r + "," + r + " 0 " + big + " 0 " + p4 + 'Z" fill="' + cols[i] + '" fill-opacity=".85" stroke="#170b29" stroke-width="2"/>';
      s += '<text x="' + mid[0] + '" y="' + (mid[1] + 5) + '" text-anchor="middle" font-size="14" fill="#170b29">' + glyph(PK[k].g) + "</text>";
      s += '<text x="' + lab[0] + '" y="' + (lab[1] + 4) + '" text-anchor="middle" font-size="11" fill="#f4e8c8">' + DYRS[k] + "</text>";
      a0 = a1;
    });
    s += '<text x="200" y="196" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="46" fill="#f0d9a0">120</text><text x="200" y="222" text-anchor="middle" font-size="12" letter-spacing="2" fill="#bfaedb">' + esc(t("yrs").toUpperCase()) + "</text>";
    $("ring").innerHTML = s; $("ring").setAttribute("aria-label", t("perTitle"));
    // houses
    $("hList").innerHTML = HOUSES.map(function (h, i) { return "<div><b><span>" + (i + 1) + "</span>" + esc(h[0]) + "</b><p>" + esc(h[lang === "ru" ? 2 : 1]) + "</p></div>"; }).join("");
    var g = '<polygon class="lag" points="' + NI[0].poly + '"/><rect class="ln" x="0" y="0" width="400" height="400"/><path class="ln" d="M0,0L400,400M400,0L0,400M200,0L400,200L200,400L0,200Z"/>';
    NI.forEach(function (n, i) { var x = n.txt[0], y = n.txt[1]; g += '<text class="hn" x="' + x + '" y="' + (y + 4) + '">' + (i + 1) + '</text><text class="hs" x="' + x + '" y="' + (y + 18) + '">' + esc(HOUSES[i][0]) + "</text>"; });
    $("gChart").innerHTML = g; $("gChart").setAttribute("aria-label", t("gTitle"));
    $("gList").innerHTML = t("guide").map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    // vedic vs western
    if (A) {
      var now = new Date(), ay = ayanamsa(now), tro = norm(tropical("Su", now)), si = norm(tro - ay), ts = Math.floor(tro / 30), ss = Math.floor(si / 30);
      $("ayNow").textContent = dms(ay);
      $("vwCompare").innerHTML = '<div><b>' + esc(t("tropical")) + "</b><span>" + glyph(SIGNS[ts].g) + " " + esc(sname(ts)) + " " + dms(tro - ts * 30) + '</span></div><div><b>' + esc(t("sidereal")) + "</b><span>" + glyph(SIGNS[ss].g) + " " + esc(sname(ss)) + " " + dms(si - ss * 30) + "</span></div>";
    }
    $("vwPoints").innerHTML = t("vwPoints").map(function (p) { return '<div class="card" style="margin-bottom:.8rem"><h3>' + esc(p[0]) + "</h3><p style=\"margin:0\">" + esc(p[1]) + "</p></div>"; }).join("");
  }

  // ---------- language ----------
  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t("title");
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", t("desc"));
    document.querySelectorAll("[data-t]").forEach(function (el) { var v = t(el.getAttribute("data-t")); if (typeof v === "string") el.textContent = v; });
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    fillZones($("trTz"), "America/New_York"); fillZones($("bTz"), myTz);
    var lagSel = $("trLagna"), lv = lagSel.value || (function () { try { return localStorage.getItem("va-lagna") || "0"; } catch (e) { return "0"; } })();
    lagSel.innerHTML = SIGNS.map(function (s, i) { return '<option value="' + i + '">' + esc(s[lang]) + "</option>"; }).join(""); lagSel.value = lv;
    var ms = $("ssMoon"), mv = ms.value;
    ms.innerHTML = '<option value="">' + esc(t("choose")) + "</option>" + SIGNS.map(function (s, i) { return '<option value="' + i + '">' + esc(s[lang]) + "</option>"; }).join(""); ms.value = mv;
    renderAll();
  }
  function renderAll() { renderWheel(); renderTransits(); renderRef(); renderDasha(); renderSade(); }

  // ---------- events ----------
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { lang = b.getAttribute("data-lang"); try { localStorage.setItem("va-lang", lang); } catch (e) {} applyLang(); });
  });
  ["trDate", "trTime", "trTz"].forEach(function (id) { $(id).addEventListener("change", renderTransits); });
  $("trLagna").addEventListener("change", function () { try { localStorage.setItem("va-lagna", this.value); } catch (e) {} renderTransits(); });
  document.querySelectorAll("[data-view]").forEach(function (b) {
    b.addEventListener("click", function () { view = b.getAttribute("data-view"); document.querySelectorAll("[data-view]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); renderTransits(); });
  });
  $("dForm").addEventListener("submit", function (e) {
    e.preventDefault(); if (!A) return;
    var dv = $("bDate").value, tv = $("bTime").value;
    if (!dv || !tv) { $("dRes").innerHTML = '<p class="err">' + esc(t("dNeed")) + "</p>"; return; }
    var p = dv.split("-").map(Number), q = tv.split(":").map(Number);
    lastDasha = dashas(zonedToUtc(p[0], p[1], p[2], q[0], q[1], $("bTz").value)); openMd = null;
    renderDasha();
    $("ssMoon").value = String(Math.floor(lastDasha.lon / 30)); renderSade();
  });
  $("dRes").addEventListener("click", function (e) { var b = e.target.closest("[data-md]"); if (!b) return; var i = +b.getAttribute("data-md"); openMd = openMd === i ? -1 : i; renderDasha(); });
  $("ssMoon").addEventListener("change", renderSade);

  // start: today in New York at 12:00, like the transit pictures
  var todayNY = tzParts(Date.now(), "America/New_York");
  $("trDate").value = todayNY.year + "-" + todayNY.month + "-" + todayNY.day;
  if (!A) document.querySelectorAll("#board,#dRes").forEach(function (x) { x.innerHTML = '<p class="err">' + esc(T[lang].loadErr) + "</p>"; });
  applyLang();
  setInterval(renderWheel, 10 * 60e3);
})();
