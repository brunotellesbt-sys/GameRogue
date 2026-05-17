(() => {
  'use strict';

  const STORAGE_KEY = 'pokelike-github-pages-save-v1';
  const META_KEY = 'pokelike-github-pages-meta-v1';
  const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/';
  const FALLBACK_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  const $app = document.getElementById('app');
  const $template = document.getElementById('pokemon-card-template');

  const TYPES = ['normal','fire','water','grass','electric','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','steel','fairy'];
  const TYPE_EFFECT = {
    fire: { grass: 2, ice: 2, bug: 2, steel: 2, water: .5, rock: .5, fire: .5, dragon: .5 },
    water: { fire: 2, ground: 2, rock: 2, water: .5, grass: .5, dragon: .5 },
    grass: { water: 2, ground: 2, rock: 2, fire: .5, grass: .5, poison: .5, flying: .5, bug: .5, dragon: .5, steel: .5 },
    electric: { water: 2, flying: 2, electric: .5, grass: .5, dragon: .5, ground: 0 },
    ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: .5, water: .5, ice: .5, steel: .5 },
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: .5, flying: .5, psychic: .5, bug: .5, fairy: .5, ghost: 0 },
    poison: { grass: 2, fairy: 2, poison: .5, ground: .5, rock: .5, ghost: .5, steel: 0 },
    ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: .5, bug: .5, flying: 0 },
    flying: { grass: 2, fighting: 2, bug: 2, electric: .5, rock: .5, steel: .5 },
    psychic: { fighting: 2, poison: 2, psychic: .5, steel: .5, dark: 0 },
    bug: { grass: 2, psychic: 2, fire: .5, fighting: .5, poison: .5, flying: .5, ghost: .5, steel: .5, fairy: .5 },
    rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: .5, ground: .5, steel: .5 },
    ghost: { psychic: 2, ghost: 2, dark: .5, normal: 0 },
    dragon: { dragon: 2, steel: .5, fairy: 0 },
    steel: { ice: 2, rock: 2, fairy: 2, fire: .5, water: .5, electric: .5, steel: .5 },
    fairy: { fighting: 2, dragon: 2, fire: .5, poison: .5, steel: .5 }
  };

  const POKEMON = [
    {id:1,name:'Bulbasaur',types:['grass','poison'],hp:45,atk:49,def:49,spd:45,evo:{level:16,to:2}},
    {id:2,name:'Ivysaur',types:['grass','poison'],hp:60,atk:62,def:63,spd:60,evo:{level:32,to:3}},
    {id:3,name:'Venusaur',types:['grass','poison'],hp:80,atk:82,def:83,spd:80},
    {id:4,name:'Charmander',types:['fire'],hp:39,atk:52,def:43,spd:65,evo:{level:16,to:5}},
    {id:5,name:'Charmeleon',types:['fire'],hp:58,atk:64,def:58,spd:80,evo:{level:36,to:6}},
    {id:6,name:'Charizard',types:['fire','flying'],hp:78,atk:84,def:78,spd:100},
    {id:7,name:'Squirtle',types:['water'],hp:44,atk:48,def:65,spd:43,evo:{level:16,to:8}},
    {id:8,name:'Wartortle',types:['water'],hp:59,atk:63,def:80,spd:58,evo:{level:36,to:9}},
    {id:9,name:'Blastoise',types:['water'],hp:79,atk:83,def:100,spd:78},
    {id:10,name:'Caterpie',types:['bug'],hp:45,atk:30,def:35,spd:45,evo:{level:7,to:11}},
    {id:11,name:'Metapod',types:['bug'],hp:50,atk:20,def:55,spd:30,evo:{level:10,to:12}},
    {id:12,name:'Butterfree',types:['bug','flying'],hp:60,atk:45,def:50,spd:70},
    {id:16,name:'Pidgey',types:['normal','flying'],hp:40,atk:45,def:40,spd:56,evo:{level:18,to:17}},
    {id:17,name:'Pidgeotto',types:['normal','flying'],hp:63,atk:60,def:55,spd:71,evo:{level:36,to:18}},
    {id:18,name:'Pidgeot',types:['normal','flying'],hp:83,atk:80,def:75,spd:101},
    {id:19,name:'Rattata',types:['normal'],hp:30,atk:56,def:35,spd:72,evo:{level:20,to:20}},
    {id:20,name:'Raticate',types:['normal'],hp:55,atk:81,def:60,spd:97},
    {id:21,name:'Spearow',types:['normal','flying'],hp:40,atk:60,def:30,spd:70,evo:{level:20,to:22}},
    {id:22,name:'Fearow',types:['normal','flying'],hp:65,atk:90,def:65,spd:100},
    {id:23,name:'Ekans',types:['poison'],hp:35,atk:60,def:44,spd:55,evo:{level:22,to:24}},
    {id:24,name:'Arbok',types:['poison'],hp:60,atk:95,def:69,spd:80},
    {id:25,name:'Pikachu',types:['electric'],hp:35,atk:55,def:40,spd:90,evo:{level:26,to:26}},
    {id:26,name:'Raichu',types:['electric'],hp:60,atk:90,def:55,spd:110},
    {id:27,name:'Sandshrew',types:['ground'],hp:50,atk:75,def:85,spd:40,evo:{level:22,to:28}},
    {id:28,name:'Sandslash',types:['ground'],hp:75,atk:100,def:110,spd:65},
    {id:29,name:'Nidoran♀',types:['poison'],hp:55,atk:47,def:52,spd:41,evo:{level:16,to:30}},
    {id:30,name:'Nidorina',types:['poison'],hp:70,atk:62,def:67,spd:56,evo:{level:32,to:31}},
    {id:31,name:'Nidoqueen',types:['poison','ground'],hp:90,atk:92,def:87,spd:76},
    {id:32,name:'Nidoran♂',types:['poison'],hp:46,atk:57,def:40,spd:50,evo:{level:16,to:33}},
    {id:33,name:'Nidorino',types:['poison'],hp:61,atk:72,def:57,spd:65,evo:{level:32,to:34}},
    {id:34,name:'Nidoking',types:['poison','ground'],hp:81,atk:102,def:77,spd:85},
    {id:35,name:'Clefairy',types:['fairy'],hp:70,atk:45,def:48,spd:35,evo:{level:28,to:36}},
    {id:36,name:'Clefable',types:['fairy'],hp:95,atk:70,def:73,spd:60},
    {id:37,name:'Vulpix',types:['fire'],hp:38,atk:41,def:40,spd:65,evo:{level:28,to:38}},
    {id:38,name:'Ninetales',types:['fire'],hp:73,atk:76,def:75,spd:100},
    {id:39,name:'Jigglypuff',types:['normal','fairy'],hp:115,atk:45,def:20,spd:20,evo:{level:28,to:40}},
    {id:40,name:'Wigglytuff',types:['normal','fairy'],hp:140,atk:70,def:45,spd:45},
    {id:41,name:'Zubat',types:['poison','flying'],hp:40,atk:45,def:35,spd:55,evo:{level:22,to:42}},
    {id:42,name:'Golbat',types:['poison','flying'],hp:75,atk:80,def:70,spd:90},
    {id:43,name:'Oddish',types:['grass','poison'],hp:45,atk:50,def:55,spd:30,evo:{level:21,to:44}},
    {id:44,name:'Gloom',types:['grass','poison'],hp:60,atk:65,def:70,spd:40,evo:{level:32,to:45}},
    {id:45,name:'Vileplume',types:['grass','poison'],hp:75,atk:80,def:85,spd:50},
    {id:48,name:'Venonat',types:['bug','poison'],hp:60,atk:55,def:50,spd:45,evo:{level:31,to:49}},
    {id:49,name:'Venomoth',types:['bug','poison'],hp:70,atk:65,def:60,spd:90},
    {id:50,name:'Diglett',types:['ground'],hp:10,atk:55,def:25,spd:95,evo:{level:26,to:51}},
    {id:51,name:'Dugtrio',types:['ground'],hp:35,atk:100,def:50,spd:120},
    {id:52,name:'Meowth',types:['normal'],hp:40,atk:45,def:35,spd:90,evo:{level:28,to:53}},
    {id:53,name:'Persian',types:['normal'],hp:65,atk:70,def:60,spd:115},
    {id:54,name:'Psyduck',types:['water'],hp:50,atk:52,def:48,spd:55,evo:{level:33,to:55}},
    {id:55,name:'Golduck',types:['water'],hp:80,atk:82,def:78,spd:85},
    {id:56,name:'Mankey',types:['fighting'],hp:40,atk:80,def:35,spd:70,evo:{level:28,to:57}},
    {id:57,name:'Primeape',types:['fighting'],hp:65,atk:105,def:60,spd:95},
    {id:58,name:'Growlithe',types:['fire'],hp:55,atk:70,def:45,spd:60,evo:{level:32,to:59}},
    {id:59,name:'Arcanine',types:['fire'],hp:90,atk:110,def:80,spd:95},
    {id:60,name:'Poliwag',types:['water'],hp:40,atk:50,def:40,spd:90,evo:{level:25,to:61}},
    {id:61,name:'Poliwhirl',types:['water'],hp:65,atk:65,def:65,spd:90,evo:{level:36,to:62}},
    {id:62,name:'Poliwrath',types:['water','fighting'],hp:90,atk:95,def:95,spd:70},
    {id:63,name:'Abra',types:['psychic'],hp:25,atk:20,def:15,spd:90,evo:{level:16,to:64}},
    {id:64,name:'Kadabra',types:['psychic'],hp:40,atk:35,def:30,spd:105,evo:{level:36,to:65}},
    {id:65,name:'Alakazam',types:['psychic'],hp:55,atk:50,def:45,spd:120},
    {id:66,name:'Machop',types:['fighting'],hp:70,atk:80,def:50,spd:35,evo:{level:28,to:67}},
    {id:67,name:'Machoke',types:['fighting'],hp:80,atk:100,def:70,spd:45,evo:{level:40,to:68}},
    {id:68,name:'Machamp',types:['fighting'],hp:90,atk:130,def:80,spd:55},
    {id:69,name:'Bellsprout',types:['grass','poison'],hp:50,atk:75,def:35,spd:40,evo:{level:21,to:70}},
    {id:70,name:'Weepinbell',types:['grass','poison'],hp:65,atk:90,def:50,spd:55,evo:{level:32,to:71}},
    {id:71,name:'Victreebel',types:['grass','poison'],hp:80,atk:105,def:65,spd:70},
    {id:72,name:'Tentacool',types:['water','poison'],hp:40,atk:40,def:35,spd:70,evo:{level:30,to:73}},
    {id:73,name:'Tentacruel',types:['water','poison'],hp:80,atk:70,def:65,spd:100},
    {id:74,name:'Geodude',types:['rock','ground'],hp:40,atk:80,def:100,spd:20,evo:{level:25,to:75}},
    {id:75,name:'Graveler',types:['rock','ground'],hp:55,atk:95,def:115,spd:35,evo:{level:40,to:76}},
    {id:76,name:'Golem',types:['rock','ground'],hp:80,atk:120,def:130,spd:45},
    {id:79,name:'Slowpoke',types:['water','psychic'],hp:90,atk:65,def:65,spd:15,evo:{level:37,to:80}},
    {id:80,name:'Slowbro',types:['water','psychic'],hp:95,atk:75,def:110,spd:30},
    {id:81,name:'Magnemite',types:['electric','steel'],hp:25,atk:35,def:70,spd:45,evo:{level:30,to:82}},
    {id:82,name:'Magneton',types:['electric','steel'],hp:50,atk:60,def:95,spd:70},
    {id:92,name:'Gastly',types:['ghost','poison'],hp:30,atk:35,def:30,spd:80,evo:{level:25,to:93}},
    {id:93,name:'Haunter',types:['ghost','poison'],hp:45,atk:50,def:45,spd:95,evo:{level:38,to:94}},
    {id:94,name:'Gengar',types:['ghost','poison'],hp:60,atk:65,def:60,spd:110},
    {id:95,name:'Onix',types:['rock','ground'],hp:35,atk:45,def:160,spd:70},
    {id:102,name:'Exeggcute',types:['grass','psychic'],hp:60,atk:40,def:80,spd:40,evo:{level:30,to:103}},
    {id:103,name:'Exeggutor',types:['grass','psychic'],hp:95,atk:95,def:85,spd:55},
    {id:104,name:'Cubone',types:['ground'],hp:50,atk:50,def:95,spd:35,evo:{level:28,to:105}},
    {id:105,name:'Marowak',types:['ground'],hp:60,atk:80,def:110,spd:45},
    {id:113,name:'Chansey',types:['normal'],hp:250,atk:5,def:5,spd:50},
    {id:120,name:'Staryu',types:['water'],hp:30,atk:45,def:55,spd:85,evo:{level:30,to:121}},
    {id:121,name:'Starmie',types:['water','psychic'],hp:60,atk:75,def:85,spd:115},
    {id:123,name:'Scyther',types:['bug','flying'],hp:70,atk:110,def:80,spd:105},
    {id:124,name:'Jynx',types:['ice','psychic'],hp:65,atk:50,def:35,spd:95},
    {id:125,name:'Electabuzz',types:['electric'],hp:65,atk:83,def:57,spd:105},
    {id:126,name:'Magmar',types:['fire'],hp:65,atk:95,def:57,spd:93},
    {id:127,name:'Pinsir',types:['bug'],hp:65,atk:125,def:100,spd:85},
    {id:128,name:'Tauros',types:['normal'],hp:75,atk:100,def:95,spd:110},
    {id:129,name:'Magikarp',types:['water'],hp:20,atk:10,def:55,spd:80,evo:{level:20,to:130}},
    {id:130,name:'Gyarados',types:['water','flying'],hp:95,atk:125,def:79,spd:81},
    {id:131,name:'Lapras',types:['water','ice'],hp:130,atk:85,def:80,spd:60},
    {id:133,name:'Eevee',types:['normal'],hp:55,atk:55,def:50,spd:55,evo:{level:24,to:134}},
    {id:134,name:'Vaporeon',types:['water'],hp:130,atk:65,def:60,spd:65},
    {id:135,name:'Jolteon',types:['electric'],hp:65,atk:65,def:60,spd:130},
    {id:136,name:'Flareon',types:['fire'],hp:65,atk:130,def:60,spd:65},
    {id:143,name:'Snorlax',types:['normal'],hp:160,atk:110,def:65,spd:30},
    {id:147,name:'Dratini',types:['dragon'],hp:41,atk:64,def:45,spd:50,evo:{level:30,to:148}},
    {id:148,name:'Dragonair',types:['dragon'],hp:61,atk:84,def:65,spd:70,evo:{level:55,to:149}},
    {id:149,name:'Dragonite',types:['dragon','flying'],hp:91,atk:134,def:95,spd:80},
    {id:150,name:'Mewtwo',types:['psychic'],hp:106,atk:110,def:90,spd:130},
    {id:151,name:'Mew',types:['psychic'],hp:100,atk:100,def:100,spd:100},
    {id:152,name:'Chikorita',types:['grass'],hp:45,atk:49,def:65,spd:45,evo:{level:16,to:153}},
    {id:153,name:'Bayleef',types:['grass'],hp:60,atk:62,def:80,spd:60,evo:{level:32,to:154}},
    {id:154,name:'Meganium',types:['grass'],hp:80,atk:82,def:100,spd:80},
    {id:155,name:'Cyndaquil',types:['fire'],hp:39,atk:52,def:43,spd:65,evo:{level:14,to:156}},
    {id:156,name:'Quilava',types:['fire'],hp:58,atk:64,def:58,spd:80,evo:{level:36,to:157}},
    {id:157,name:'Typhlosion',types:['fire'],hp:78,atk:84,def:78,spd:100},
    {id:158,name:'Totodile',types:['water'],hp:50,atk:65,def:64,spd:43,evo:{level:18,to:159}},
    {id:159,name:'Croconaw',types:['water'],hp:65,atk:80,def:80,spd:58,evo:{level:30,to:160}},
    {id:160,name:'Feraligatr',types:['water'],hp:85,atk:105,def:100,spd:78},
    {id:172,name:'Pichu',types:['electric'],hp:20,atk:40,def:15,spd:60,evo:{level:18,to:25}},
    {id:175,name:'Togepi',types:['fairy'],hp:35,atk:20,def:65,spd:20,evo:{level:24,to:176}},
    {id:176,name:'Togetic',types:['fairy','flying'],hp:55,atk:40,def:85,spd:40},
    {id:179,name:'Mareep',types:['electric'],hp:55,atk:40,def:40,spd:35,evo:{level:15,to:180}},
    {id:180,name:'Flaaffy',types:['electric'],hp:70,atk:55,def:55,spd:45,evo:{level:30,to:181}},
    {id:181,name:'Ampharos',types:['electric'],hp:90,atk:75,def:85,spd:55},
    {id:196,name:'Espeon',types:['psychic'],hp:65,atk:65,def:60,spd:110},
    {id:197,name:'Umbreon',types:['dark'],hp:95,atk:65,def:110,spd:65},
    {id:208,name:'Steelix',types:['steel','ground'],hp:75,atk:85,def:200,spd:30},
    {id:212,name:'Scizor',types:['bug','steel'],hp:70,atk:130,def:100,spd:65},
    {id:230,name:'Kingdra',types:['water','dragon'],hp:75,atk:95,def:95,spd:85},
    {id:243,name:'Raikou',types:['electric'],hp:90,atk:85,def:75,spd:115},
    {id:244,name:'Entei',types:['fire'],hp:115,atk:115,def:85,spd:100},
    {id:245,name:'Suicune',types:['water'],hp:100,atk:75,def:115,spd:85}
  ];

  const BY_ID = Object.fromEntries(POKEMON.map(p => [p.id, p]));

  const GYM_LEADERS = [
    {name:'Brock', badge:'Boulder', type:'rock', team:[{id:74,level:12},{id:95,level:14}]},
    {name:'Misty', badge:'Cascade', type:'water', team:[{id:120,level:22},{id:121,level:24}]},
    {name:'Lt. Surge', badge:'Thunder', type:'electric', team:[{id:25,level:30},{id:26,level:32},{id:81,level:31}]},
    {name:'Erika', badge:'Rainbow', type:'grass', team:[{id:43,level:38},{id:71,level:40},{id:45,level:41}]},
    {name:'Koga', badge:'Soul', type:'poison', team:[{id:49,level:47},{id:89,level:48},{id:42,level:49}]},
    {name:'Sabrina', badge:'Marsh', type:'psychic', team:[{id:64,level:54},{id:65,level:56},{id:122,level:55}]},
    {name:'Blaine', badge:'Volcano', type:'fire', team:[{id:38,level:62},{id:126,level:63},{id:59,level:65}]},
    {name:'Giovanni', badge:'Earth', type:'ground', team:[{id:31,level:70},{id:34,level:71},{id:112,level:72},{id:76,level:74}]}
  ];

  const ELITE = [
    {name:'Lorelei', team:[{id:124,level:76},{id:80,level:76},{id:131,level:78}]},
    {name:'Bruno', team:[{id:95,level:78},{id:68,level:80},{id:76,level:79}]},
    {name:'Agatha', team:[{id:94,level:81},{id:42,level:80},{id:94,level:82}]},
    {name:'Lance', team:[{id:130,level:83},{id:148,level:82},{id:149,level:85}]},
    {name:'Champion', team:[{id:59,level:86},{id:65,level:86},{id:130,level:87},{id:149,level:88},{id:150,level:90}]}
  ];

  const TOWER_STAGES = [
    {name:'Kanto Champion', unlock:0, team:[{id:25,level:50},{id:6,level:52},{id:143,level:53},{id:149,level:55}]},
    {name:'Johto Champion', unlock:1, team:[{id:181,level:64},{id:212,level:64},{id:230,level:66},{id:149,level:68}]},
    {name:'Legend Trial', unlock:2, team:[{id:243,level:74},{id:244,level:74},{id:245,level:74},{id:150,level:76}]}
  ];

  const ITEMS = [
    {key:'potion', name:'Potion', icon:'🧪', desc:'Cura 45% de HP do primeiro Pokémon ferido.', use:'heal'},
    {key:'maxPotion', name:'Max Potion', icon:'💊', desc:'Cura todo o time.', use:'fullheal'},
    {key:'rareCandy', name:'Rare Candy', icon:'🍬', desc:'+3 níveis no Pokémon líder.', use:'level'},
    {key:'protein', name:'Protein', icon:'💪', desc:'+8 ATK permanente no líder.', use:'atk'},
    {key:'iron', name:'Iron', icon:'🛡️', desc:'+8 DEF permanente no líder.', use:'def'},
    {key:'carbos', name:'Carbos', icon:'⚡', desc:'+8 SPD permanente no líder.', use:'spd'},
    {key:'revive', name:'Revive', icon:'✨', desc:'Revive o primeiro Pokémon caído com 50% de HP.', use:'revive'},
    {key:'leftovers', name:'Leftovers', icon:'🍱', desc:'Item passivo: cura pequena após batalhas.', use:'passive'},
    {key:'focusSash', name:'Focus Sash', icon:'🎗️', desc:'Item passivo: uma vez por run evita derrota do líder.', use:'passive'},
    {key:'luckyEgg', name:'Lucky Egg', icon:'🥚', desc:'Item passivo: mais EXP após vitórias.', use:'passive'}
  ];

  const ACHIEVEMENTS = [
    {key:'first_battle', title:'First Step', desc:'Vença sua primeira batalha.'},
    {key:'boulder', title:'Boulder Basher', desc:'Derrote Brock.'},
    {key:'cascade', title:'Cascade Crusher', desc:'Derrote Misty.'},
    {key:'thunder', title:'Thunder Tamer', desc:'Derrote Lt. Surge.'},
    {key:'rainbow', title:'Rainbow Ranger', desc:'Derrote Erika.'},
    {key:'soul', title:'Soul Crusher', desc:'Derrote Koga.'},
    {key:'marsh', title:'Mind Breaker', desc:'Derrote Sabrina.'},
    {key:'volcano', title:'Volcano Victor', desc:'Derrote Blaine.'},
    {key:'earth', title:'Earth Shaker', desc:'Derrote Giovanni.'},
    {key:'champion', title:'Pokemon Master', desc:'Derrote a Elite Four e o Champion.'},
    {key:'nuzlocke', title:'True Master', desc:'Vença uma run em Nuzlocke.'},
    {key:'shiny', title:'Shiny Spark', desc:'Capture um shiny.'},
    {key:'tower_1', title:'Kanto Champion', desc:'Vença o primeiro estágio da Battle Tower.'},
    {key:'collector_25', title:'Pokédex Rookie', desc:'Registre 25 Pokémon capturados.'}
  ];

  let meta = loadMeta();
  let state = loadState();

  function loadMeta() {
    try {
      const parsed = JSON.parse(localStorage.getItem(META_KEY) || '{}');
      return {
        wins: parsed.wins || 0,
        towerClears: parsed.towerClears || 0,
        seen: parsed.seen || {},
        caught: parsed.caught || {},
        achievements: parsed.achievements || {},
        hallOfFame: parsed.hallOfFame || [],
        settings: { light: false, fast: false, ...(parsed.settings || {}) }
      };
    } catch {
      return { wins:0, towerClears:0, seen:{}, caught:{}, achievements:{}, hallOfFame:[], settings:{ light:false, fast:false } };
    }
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch { return null; }
  }

  function saveAll() {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
    if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    document.body.classList.toggle('light', !!meta.settings.light);
    const hasPlayableRun = !!(state && Array.isArray(state.team) && state.team.length);
    document.getElementById('continueRunBtn').disabled = !hasPlayableRun || state.mode === 'tower' || state.gameOver || state.champion;
    document.getElementById('continueTowerBtn').disabled = !hasPlayableRun || state.mode !== 'tower' || state.gameOver;
  }

  function resetRun() {
    state = null;
    localStorage.removeItem(STORAGE_KEY);
    saveAll();
  }

  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[rand(0, arr.length - 1)]; }
  function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function title(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function uid() { return Math.random().toString(36).slice(2, 10); }
  function safe(p) { return p || BY_ID[25]; }

  function spriteUrl(id, shiny = false) {
    return `${SPRITE_BASE}${shiny ? 'shiny/' : ''}${id}.gif`;
  }

  function fallbackSpriteUrl(id, shiny = false) {
    return `${FALLBACK_SPRITE_BASE}${shiny ? 'shiny/' : ''}${id}.png`;
  }

  function speciesPool() {
    const max = state?.gen === 2 ? 251 : 151;
    return POKEMON.filter(p => p.id <= max && p.id !== 150 && p.id !== 151 && p.id !== 243 && p.id !== 244 && p.id !== 245);
  }

  function createPokemon(id, level = 5, opts = {}) {
    const sp = safe(BY_ID[id]);
    const shiny = opts.shiny ?? Math.random() < (opts.boss ? 0.01 : 0.025);
    const bonus = opts.bonus || { hp:0, atk:0, def:0, spd:0 };
    const mon = {
      uid: uid(),
      id: sp.id,
      name: sp.name,
      types: sp.types,
      level,
      xp: 0,
      shiny,
      fainted: false,
      bonus,
      held: opts.held || null,
      ability: pick(['Torrent','Blaze','Overgrow','Guts','Focus','Swift','Guard'])
    };
    refreshStats(mon, true);
    return mon;
  }

  function refreshStats(mon, fill = false) {
    const sp = safe(BY_ID[mon.id]);
    mon.name = sp.name;
    mon.types = sp.types;
    mon.bonus = mon.bonus || { hp:0, atk:0, def:0, spd:0 };
    const scale = mon.level / 50;
    mon.maxHp = Math.max(12, Math.round((sp.hp * scale) + mon.level * 2 + 18 + mon.bonus.hp));
    mon.atk = Math.max(5, Math.round(sp.atk * scale + mon.level + mon.bonus.atk));
    mon.def = Math.max(5, Math.round(sp.def * scale + mon.level * .75 + mon.bonus.def));
    mon.spd = Math.max(5, Math.round(sp.spd * scale + mon.level * .8 + mon.bonus.spd));
    if (fill || !Number.isFinite(mon.hp)) mon.hp = mon.maxHp;
    mon.hp = clamp(mon.hp, 0, mon.maxHp);
    mon.fainted = mon.hp <= 0;
  }

  function healTeam(percent = 1) {
    state.team.forEach(m => {
      refreshStats(m);
      m.hp = clamp(m.hp + Math.round(m.maxHp * percent), 1, m.maxHp);
      m.fainted = false;
    });
  }

  function recordSeen(mon) { meta.seen[mon.id] = true; }
  function recordCaught(mon) {
    meta.seen[mon.id] = true;
    meta.caught[mon.id] = true;
    if (mon.shiny) unlock('shiny');
    if (Object.keys(meta.caught).length >= 25) unlock('collector_25');
  }
  function unlock(key) { meta.achievements[key] = true; }

  function teamPower(team = state.team) {
    return team.reduce((sum, m) => {
      refreshStats(m);
      return sum + m.maxHp + m.atk * 1.4 + m.def + m.spd;
    }, 0);
  }

  function startNewRun(mode = 'normal', gen = state?.gen || 1, avatar = 'boy') {
    state = {
      mode,
      gen,
      avatar,
      team: [],
      items: [],
      badges: [],
      map: 1,
      step: 0,
      route: [],
      currentBattle: null,
      pendingChoices: null,
      pendingReplace: null,
      eliteIndex: 0,
      gameOver: false,
      champion: false,
      log: [],
      towerStage: 0,
      towerOpponent: 0,
      nuzlockeDeaths: []
    };
    saveAll();
    renderStarter();
  }

  function generateRoute() {
    const nodes = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let type = roll < .34 ? 'battle' : roll < .58 ? 'catch' : roll < .76 ? 'item' : roll < .88 ? 'heal' : roll < .95 ? 'trade' : 'tutor';
      if (i === count - 1) type = 'boss';
      nodes.push({ id: uid(), type, completed: false, locked: i !== 0 });
    }
    state.route = nodes;
    state.step = 0;
  }

  function chooseStarter(id) {
    const starter = createPokemon(id, 8, { shiny: Math.random() < .05 });
    state.team = [starter];
    recordCaught(starter);
    state.items = [ITEMS.find(i => i.key === 'potion')];
    generateRoute();
    saveAll();
    renderMap();
  }

  function startTower(stageIndex = 0) {
    const baseStarter = state?.team?.[0] ? cloneMon(state.team[0]) : createPokemon(25, 50);
    state = {
      mode:'tower', gen:2, avatar:'boy', team:[baseStarter], items:[ITEMS.find(i => i.key === 'maxPotion'), ITEMS.find(i => i.key === 'rareCandy')],
      badges:[], map:1, step:0, route:[], currentBattle:null, pendingChoices:null, pendingReplace:null, eliteIndex:0,
      gameOver:false, champion:false, log:[], towerStage:stageIndex, towerOpponent:0, nuzlockeDeaths:[]
    };
    healTeam(1);
    saveAll();
    renderTower();
  }

  function cloneMon(m) {
    const n = JSON.parse(JSON.stringify(m));
    n.uid = uid();
    refreshStats(n);
    return n;
  }

  function availableStarters() {
    return state?.gen === 2 ? [152,155,158,1,4,7] : [1,4,7];
  }

  function renderHome() {
    saveAll();
    const gen = state?.gen || Number(localStorage.getItem('pokelike-last-gen') || 1);
    $app.innerHTML = `
      <section class="screen">
        <div class="layout">
          <div>
            <h2>Escolha sua run</h2>
            <p class="small">Um roguelike autobattler estilo Pokémon, todo em HTML/CSS/JS, com save local e pronto para GitHub Pages.</p>
            <div class="panel">
              <p class="small"><strong>Gen:</strong></p>
              <div class="pill-row">
                <button class="small-btn ${gen === 1 ? '' : 'ghost'}" data-gen="1">I</button>
                <button class="small-btn ${gen === 2 ? '' : 'ghost'}" data-gen="2">II</button>
              </div>
            </div>
            <div class="menu-grid" style="margin-top:14px">
              <button data-mode="normal">Normal Mode</button>
              <button class="blue" data-mode="nuzlocke">Nuzlocke</button>
              <button class="green" id="towerHomeBtn" ${meta.wins ? '' : 'disabled'}>Battle Tower</button>
              <button class="ghost" data-open="pokedex">Pokédex</button>
              <button class="ghost" data-open="achievements">Achievements</button>
              <button class="ghost" data-open="hof">Hall of Fame</button>
              <button class="ghost" data-open="patch">Patch Notes</button>
              <button class="ghost" data-open="settings">⚙️ Settings</button>
              <button class="ghost" data-open="savecode">☁ Save Code</button>
            </div>
          </div>
          <aside class="side-stack">
            <div class="panel">
              <h3>Seu progresso</h3>
              <p class="small">Wins: <strong>${meta.wins}</strong></p>
              <p class="small">Battle Tower clears: <strong>${meta.towerClears}</strong></p>
              <p class="small">Pokédex: <strong>${Object.keys(meta.caught).length}</strong> capturados / <strong>${Object.keys(meta.seen).length}</strong> vistos</p>
            </div>
            <div class="panel">
              <h3>Como jogar</h3>
              <p class="small">Escolha caminhos, capture Pokémon, pegue itens e vença os líderes. As batalhas são automáticas; sua função é montar o melhor time.</p>
            </div>
          </aside>
        </div>
      </section>`;

    $app.querySelectorAll('[data-gen]').forEach(btn => btn.addEventListener('click', () => {
      localStorage.setItem('pokelike-last-gen', btn.dataset.gen);
      renderHome();
    }));
    $app.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', () => renderAvatar(btn.dataset.mode, Number(localStorage.getItem('pokelike-last-gen') || gen))));
    $app.querySelector('#towerHomeBtn')?.addEventListener('click', () => startTower(0));
    bindOpeners();
  }

  function renderAvatar(mode, gen) {
    $app.innerHTML = `
      <section class="screen">
        <h2>Who are you?</h2>
        <p class="small">Modo: <strong>${mode === 'nuzlocke' ? 'Nuzlocke' : 'Normal Mode'}</strong> · Gen ${gen}</p>
        <div class="choice-row">
          <button class="avatar-card" data-avatar="boy"><span class="avatar">🧢</span>BOY</button>
          <button class="avatar-card" data-avatar="girl"><span class="avatar">🎀</span>GIRL</button>
        </div>
        <div class="action-row" style="margin-top:18px"><button class="ghost" data-back>← Back</button></div>
      </section>`;
    $app.querySelectorAll('[data-avatar]').forEach(btn => btn.addEventListener('click', () => startNewRun(mode, gen, btn.dataset.avatar)));
    $app.querySelector('[data-back]').addEventListener('click', renderHome);
  }

  function renderStarter() {
    const starters = availableStarters();
    $app.innerHTML = `
      <section class="screen">
        <h2>Choose Your Starter!</h2>
        <p class="small">Escolha o primeiro Pokémon da run. Chance pequena de vir shiny.</p>
        <div class="pokemon-grid">${starters.map(id => renderPokemonChoice(createPokemon(id, 8), 'starter')).join('')}</div>
      </section>`;
    $app.querySelectorAll('[data-starter]').forEach(btn => btn.addEventListener('click', () => chooseStarter(Number(btn.dataset.starter))));
  }

  function renderPokemonChoice(mon, context = 'choice') {
    refreshStats(mon, true);
    const action = context === 'starter' ? `data-starter="${mon.id}"` : `data-choice="${mon.uid}"`;
    return `
      <button class="poke-card" ${action}>
        <div class="sprite-wrap"><img src="${spriteUrl(mon.id, mon.shiny)}" onerror="this.src='${fallbackSpriteUrl(mon.id, mon.shiny)}'" alt="${mon.name}"></div>
        <div class="poke-meta">
          <h3>${mon.shiny ? '<span class="shiny">✦</span> ' : ''}${mon.name}</h3>
          <p class="small">Lv.${mon.level} · ${mon.ability}</p>
          <div class="type-row">${mon.types.map(t => `<span class="type ${t}">${t}</span>`).join('')}</div>
          <p class="stats">HP ${mon.maxHp} · ATK ${mon.atk} · DEF ${mon.def} · SPD ${mon.spd}</p>
        </div>
      </button>`;
  }

  function renderMap() {
    if (!state?.team?.length) return renderHome();
    if (!state.route?.length) generateRoute();
    saveAll();
    $app.innerHTML = `
      <section class="screen">
        <div class="layout">
          <div>
            <h2>${state.mode === 'tower' ? '⚔ Battle Tower' : `Map ${state.map}`}</h2>
            <p class="small">${state.mode === 'nuzlocke' ? 'Nuzlocke ativo: Pokémon derrotado fica fora da run.' : 'Escolha uma rota. Batalhas e eventos fortalecem o time até o líder.'}</p>
            ${renderBadges()}
            <div class="map-grid">
              ${state.route.map((node, i) => renderNode(node, i)).join('')}
            </div>
          </div>
          ${renderSidebar()}
        </div>
      </section>`;
    $app.querySelectorAll('[data-node]').forEach(btn => btn.addEventListener('click', () => enterNode(btn.dataset.node)));
    bindTeamControls();
  }

  function renderBadges() {
    if (state.mode === 'tower') return '';
    return `<div class="progress-track">${GYM_LEADERS.map((g, i) => `<div class="badge-slot ${state.badges.includes(g.badge) ? 'done' : ''}">${i+1}<br>${g.badge}</div>`).join('')}</div>`;
  }

  function renderNode(node, i) {
    const label = {
      battle:['⚔️','Battle','Vença um treinador selvagem.'],
      catch:['⬟','Catch','Escolha um Pokémon para o time.'],
      item:['✦','Item','Pegue um item.'],
      heal:['➕','Heal','Recupere seu time.'],
      trade:['⇄','Trade','Troque um Pokémon por outro.'],
      tutor:['📚','Tutor','Ganhe níveis no time.'],
      boss:['🏅','Boss','Derrote o líder do ginásio.']
    }[node.type];
    return `<button class="node-card ${node.locked ? 'locked' : ''}" data-node="${node.id}" ${node.locked || node.completed ? 'disabled' : ''}>
      <span class="icon">${label[0]}</span>
      <strong>${label[1]}</strong>
      <span class="small">${node.completed ? 'Completo' : label[2]}</span>
    </button>`;
  }

  function renderSidebar() {
    return `<aside class="side-stack">
      <div class="panel">
        <h3>TEAM</h3>
        <div class="team-list">${state.team.map((m, i) => renderMonCard(m, { compact:true, index:i })).join('')}</div>
      </div>
      <div class="panel">
        <h3>ITEMS</h3>
        ${state.items.length ? `<div class="item-list">${state.items.map((it, i) => `<button class="item-card ghost" data-use-item="${i}"><span class="item-icon">${it.icon}</span><strong>${it.name}</strong><span class="tiny">${it.desc}</span></button>`).join('')}</div>` : `<p class="small">Nenhum item.</p>`}
      </div>
      <div class="panel">
        <h3>Menu</h3>
        <div class="action-row">
          <button class="ghost small-btn" data-open="pokedex">Pokédex</button>
          <button class="ghost small-btn" data-open="achievements">Achievements</button>
          <button class="ghost small-btn" data-open="settings">Settings</button>
          <button class="red small-btn" id="abandonBtn">Abandonar</button>
        </div>
      </div>
    </aside>`;
  }

  function renderMonCard(mon, opts = {}) {
    refreshStats(mon);
    const hpPct = Math.round((mon.hp / mon.maxHp) * 100);
    return `<article class="poke-card ${mon.fainted ? 'fainted' : ''}" draggable="${opts.compact ? 'true' : 'false'}" data-team-index="${opts.index ?? ''}">
      <div class="sprite-wrap"><img src="${spriteUrl(mon.id, mon.shiny)}" onerror="this.src='${fallbackSpriteUrl(mon.id, mon.shiny)}'" alt="${mon.name}"></div>
      <div class="poke-meta">
        <h3>${mon.shiny ? '<span class="shiny">✦</span> ' : ''}${mon.name}</h3>
        <p class="small">Lv.${mon.level}${mon.held ? ` · ${mon.held.name}` : ''}</p>
        <div class="type-row">${mon.types.map(t => `<span class="type ${t}">${t}</span>`).join('')}</div>
        <div class="hpbar"><span style="width:${hpPct}%;"></span></div>
        <p class="stats">HP ${Math.ceil(mon.hp)}/${mon.maxHp} · ATK ${mon.atk} · DEF ${mon.def} · SPD ${mon.spd}</p>
        ${opts.compact ? `<div class="action-row"><button class="ghost small-btn" data-up="${opts.index}">↑</button><button class="ghost small-btn" data-down="${opts.index}">↓</button></div>` : ''}
      </div>
    </article>`;
  }

  function bindTeamControls() {
    $app.querySelectorAll('[data-use-item]').forEach(btn => btn.addEventListener('click', () => useItem(Number(btn.dataset.useItem))));
    $app.querySelectorAll('[data-up]').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); moveTeam(Number(btn.dataset.up), -1); }));
    $app.querySelectorAll('[data-down]').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); moveTeam(Number(btn.dataset.down), 1); }));
    $app.querySelector('#abandonBtn')?.addEventListener('click', () => confirmModal('Abandonar run?', 'Isso apaga a run atual salva neste navegador.', () => { resetRun(); renderHome(); }));
    bindOpeners();
  }

  function moveTeam(i, delta) {
    const j = i + delta;
    if (j < 0 || j >= state.team.length) return;
    [state.team[i], state.team[j]] = [state.team[j], state.team[i]];
    saveAll(); renderMap();
  }

  function enterNode(nodeId) {
    const node = state.route.find(n => n.id === nodeId);
    if (!node || node.locked || node.completed) return;
    if (node.type === 'battle') return startBattle(randomEnemyTeam(false), 'Wild Battle!', () => afterNode(node));
    if (node.type === 'boss') return startBossBattle(node);
    if (node.type === 'catch') return showCatch(node);
    if (node.type === 'item') return showItem(node);
    if (node.type === 'heal') return doHeal(node);
    if (node.type === 'trade') return showTrade(node);
    if (node.type === 'tutor') return doTutor(node);
  }

  function afterNode(node) {
    node.completed = true;
    const idx = state.route.findIndex(n => n.id === node.id);
    if (state.route[idx + 1]) state.route[idx + 1].locked = false;
    if (node.type !== 'boss') state.step++;
    applyPassiveAfterBattle();
    saveAll();
    renderMap();
  }

  function startBossBattle(node) {
    const leader = GYM_LEADERS[state.map - 1];
    if (!leader) return startEliteBattle();
    const team = leader.team.map(x => createPokemon(x.id, x.level + (state.mode === 'nuzlocke' ? 2 : 0), { boss:true }));
    startBattle(team, `Gym Leader ${leader.name}`, () => {
      state.badges.push(leader.badge);
      unlock(leader.badge.toLowerCase());
      afterNode(node);
      showBadge(leader);
    });
  }

  function startEliteBattle() {
    const elite = ELITE[state.eliteIndex];
    if (!elite) return winGame();
    const team = elite.team.map(x => createPokemon(x.id, x.level, { boss:true }));
    startBattle(team, `Elite Four: ${elite.name}`, () => {
      state.eliteIndex++;
      applyPassiveAfterBattle();
      if (state.eliteIndex >= ELITE.length) winGame();
      else renderEliteContinue();
    });
  }

  function renderEliteContinue() {
    saveAll();
    $app.innerHTML = `<section class="screen"><h2>Elite Four</h2><p class="small">Você venceu a batalha. Prepare-se para o próximo oponente.</p><div class="layout"><div>${state.team.map(m => renderMonCard(m)).join('')}</div>${renderSidebar()}</div><div class="action-row" style="margin-top:18px"><button id="nextElite">Continue →</button><button class="ghost" id="healSmall">Usar cura leve</button></div></section>`;
    $app.querySelector('#nextElite').addEventListener('click', startEliteBattle);
    $app.querySelector('#healSmall').addEventListener('click', () => { healTeam(.25); renderEliteContinue(); });
    bindTeamControls();
  }

  function showBadge(leader) {
    modal(`Badge Earned!`, `<p>Você recebeu a badge <strong>${leader.badge}</strong>.</p><p class="small">Badges: ${state.badges.length}/8</p>`, [
      {label: state.badges.length >= 8 ? 'Elite Four →' : 'Next Map →', action: () => {
        closeModal();
        if (state.badges.length >= 8) { state.map = 9; state.route = []; startEliteBattle(); }
        else { state.map++; generateRoute(); saveAll(); renderMap(); }
      }}
    ]);
  }

  function randomEnemyTeam(boss = false) {
    const size = boss ? rand(2, 4) : rand(1, Math.min(3, Math.ceil(state.map / 2)));
    const baseLevel = 7 + state.map * 8 + state.step * 2;
    const pool = speciesPool().filter(p => p.id < 140 || Math.random() < .15);
    return Array.from({ length:size }, () => createPokemon(pick(pool).id, rand(baseLevel - 2, baseLevel + 3), { boss }));
  }

  function startBattle(enemyTeam, titleText, onWin) {
    enemyTeam.forEach(recordSeen);
    state.currentBattle = {
      title: titleText,
      enemyTeam,
      log: [`${titleText}: o combate começou!`],
      turn: 0,
      over: false,
      onWin: onWin ? 'node' : null
    };
    state._battleWinCallback = onWin;
    renderBattle();
  }

  function living(team) { return team.find(m => !m.fainted && m.hp > 0); }

  function renderBattle() {
    const b = state.currentBattle;
    if (!b) return renderMap();
    $app.innerHTML = `
      <section class="screen">
        <div class="action-row" style="justify-content:space-between;align-items:center">
          <div><h2>${b.title}</h2><p class="small">Skip · Continue</p></div>
          <div class="action-row"><button class="ghost" id="skipAnim">Skip</button><button id="battleStep">Continue</button></div>
        </div>
        <div class="battlefield">
          <div class="panel"><h3>Your Team</h3><div class="team-list">${state.team.map(m => renderMonCard(m)).join('')}</div></div>
          <div class="panel"><h3>Enemy</h3><div class="team-list">${b.enemyTeam.map(m => renderMonCard(m)).join('')}</div></div>
        </div>
        <div class="panel" style="margin-top:14px"><h3>Battle Log</h3><div class="log">${b.log.slice(-14).map(x => `<p>${x}</p>`).join('')}</div></div>
      </section>`;
    document.getElementById('battleStep').addEventListener('click', battleTick);
    document.getElementById('skipAnim').addEventListener('click', () => { while(state.currentBattle && !state.currentBattle.over) simulateTurn(); renderBattle(); });
    if (meta.settings.fast && !b.over) setTimeout(() => { if (state.currentBattle) battleTick(); }, 220);
  }

  function battleTick() {
    simulateTurn();
    if (state.currentBattle?.over) return finishBattle();
    saveAll();
    renderBattle();
  }

  function simulateTurn() {
    const b = state.currentBattle;
    if (!b || b.over) return;
    const a = living(state.team);
    const e = living(b.enemyTeam);
    if (!a) { b.over = true; b.winner = 'enemy'; return; }
    if (!e) { b.over = true; b.winner = 'player'; return; }
    const first = a.spd + rand(-10, 10) >= e.spd + rand(-10, 10) ? [a,e,'player'] : [e,a,'enemy'];
    const second = first[2] === 'player' ? [e,a,'enemy'] : [a,e,'player'];
    attack(first[0], first[1], first[2]);
    if (first[1].hp > 0) attack(second[0], second[1], second[2]);
    b.turn++;
    if (!living(state.team)) { b.over = true; b.winner = 'enemy'; }
    if (!living(b.enemyTeam)) { b.over = true; b.winner = 'player'; }
  }

  function attack(attacker, defender, side) {
    const b = state.currentBattle;
    refreshStats(attacker); refreshStats(defender);
    const moveType = pick(attacker.types);
    const stab = attacker.types.includes(moveType) ? 1.18 : 1;
    const eff = effectiveness(moveType, defender.types);
    const crit = Math.random() < .08 ? 1.7 : 1;
    const variance = rand(88, 112) / 100;
    const raw = (((attacker.atk * 1.4) / Math.max(8, defender.def)) * (attacker.level * 1.75) + 5) * stab * eff * crit * variance;
    const damage = Math.max(1, Math.round(raw));
    defender.hp = clamp(defender.hp - damage, 0, defender.maxHp);
    defender.fainted = defender.hp <= 0;
    const effText = eff > 1 ? ' É super efetivo!' : eff < 1 && eff > 0 ? ' Não foi muito efetivo.' : eff === 0 ? ' Não teve efeito.' : '';
    const critText = crit > 1 ? ' Golpe crítico!' : '';
    b.log.push(`<strong>${attacker.name}</strong> usou golpe ${title(moveType)} e causou ${damage} dano.${effText}${critText}`);
    if (defender.fainted) {
      b.log.push(`<strong>${defender.name}</strong> caiu!`);
      if (side === 'enemy' && state.mode === 'nuzlocke') state.nuzlockeDeaths.push(defender.uid);
    }
  }

  function effectiveness(type, defenderTypes) {
    return defenderTypes.reduce((mult, dt) => mult * ((TYPE_EFFECT[type] && TYPE_EFFECT[type][dt] !== undefined) ? TYPE_EFFECT[type][dt] : 1), 1);
  }

  function finishBattle() {
    const b = state.currentBattle;
    if (!b) return renderMap();
    if (b.winner === 'player') {
      unlock('first_battle');
      grantXp(b.enemyTeam);
      const cb = state._battleWinCallback;
      state.currentBattle = null;
      state._battleWinCallback = null;
      saveAll();
      if (cb) cb(); else renderMap();
    } else {
      const sashIndex = state.items.findIndex(i => i.key === 'focusSash');
      if (sashIndex >= 0) {
        state.items.splice(sashIndex, 1);
        const lead = state.team[0];
        refreshStats(lead);
        lead.hp = 1; lead.fainted = false;
        b.log.push('<strong>Focus Sash</strong> salvou sua run!');
        b.over = false;
        saveAll(); renderBattle(); return;
      }
      state.gameOver = true;
      state.currentBattle = null;
      saveAll();
      renderGameOver();
    }
  }

  function grantXp(enemyTeam) {
    const amount = enemyTeam.reduce((s, m) => s + m.level, 0) + 10;
    const egg = state.items.some(i => i.key === 'luckyEgg') ? 1.4 : 1;
    state.team.forEach(m => {
      if (m.fainted && state.mode === 'nuzlocke') return;
      m.xp += Math.round(amount * egg);
      while (m.xp >= 30 + m.level * 6) {
        m.xp -= 30 + m.level * 6;
        m.level++;
        maybeEvolve(m);
      }
      refreshStats(m);
      if (!m.fainted) m.hp = Math.min(m.maxHp, m.hp + Math.round(m.maxHp * .22));
    });
  }

  function maybeEvolve(mon) {
    const sp = safe(BY_ID[mon.id]);
    if (sp.evo && mon.level >= sp.evo.level && BY_ID[sp.evo.to]) {
      mon.id = sp.evo.to;
      mon.name = BY_ID[mon.id].name;
      mon.types = BY_ID[mon.id].types;
      recordSeen(mon);
      recordCaught(mon);
    }
    // Eevee special roulette
    if (mon.id === 134 && Math.random() < .5) {
      const evo = pick([134,135,136,196,197]);
      mon.id = evo; mon.name = BY_ID[evo].name; mon.types = BY_ID[evo].types;
    }
  }

  function applyPassiveAfterBattle() {
    if (!state?.team) return;
    if (state.items.some(i => i.key === 'leftovers')) {
      state.team.forEach(m => { refreshStats(m); if (!m.fainted) m.hp = clamp(m.hp + Math.round(m.maxHp * .16), 1, m.maxHp); });
    }
  }

  function showCatch(node) {
    const base = 7 + state.map * 7 + state.step * 2;
    const choices = shuffle(speciesPool()).slice(0, 3).map(sp => createPokemon(sp.id, rand(base - 3, base + 3)));
    choices.forEach(recordSeen);
    state.pendingChoices = choices;
    saveAll();
    $app.innerHTML = `<section class="screen"><h2>⬟ Wild Pokemon Appeared!</h2><p class="small">Choose one Pokemon to add to your team</p><div class="pokemon-grid">${choices.map(mon => renderPokemonChoice(mon)).join('')}</div><div class="action-row" style="margin-top:16px"><button class="ghost" id="skipCatch">Skip (flee)</button></div></section>`;
    $app.querySelectorAll('[data-choice]').forEach(btn => btn.addEventListener('click', () => addCaught(btn.dataset.choice, node)));
    $app.querySelector('#skipCatch').addEventListener('click', () => { state.pendingChoices = null; afterNode(node); });
  }

  function addCaught(uidValue, node) {
    const mon = state.pendingChoices.find(m => m.uid === uidValue);
    if (!mon) return;
    recordCaught(mon);
    if (state.team.length < 6) {
      state.team.push(mon);
      state.pendingChoices = null;
      afterNode(node);
    } else {
      state.pendingReplace = { mon, nodeId: node.id };
      renderReplace(mon, node);
    }
  }

  function renderReplace(newMon, node) {
    $app.innerHTML = `<section class="screen"><h2>Team Full!</h2><p class="small">Escolha quem sai do time ou mantenha o time atual.</p><div class="pokemon-grid">${state.team.map((m, i) => `<button class="poke-card" data-replace="${i}">${renderMonCardInner(m)}</button>`).join('')}</div><div class="panel" style="margin-top:16px"><h3>Novo Pokémon</h3>${renderMonCard(newMon)}</div><div class="action-row" style="margin-top:16px"><button id="keepTeam" class="ghost">Keep team as-is</button></div></section>`;
    $app.querySelectorAll('[data-replace]').forEach(btn => btn.addEventListener('click', () => {
      state.team[Number(btn.dataset.replace)] = newMon;
      state.pendingChoices = null; state.pendingReplace = null; afterNode(node);
    }));
    $app.querySelector('#keepTeam').addEventListener('click', () => { state.pendingChoices = null; state.pendingReplace = null; afterNode(node); });
  }

  function renderMonCardInner(mon) {
    refreshStats(mon);
    return `<div class="sprite-wrap"><img src="${spriteUrl(mon.id, mon.shiny)}" onerror="this.src='${fallbackSpriteUrl(mon.id, mon.shiny)}'" alt="${mon.name}"></div><div class="poke-meta"><h3>${mon.name}</h3><p class="small">Lv.${mon.level}</p><div class="type-row">${mon.types.map(t => `<span class="type ${t}">${t}</span>`).join('')}</div><p class="stats">HP ${mon.hp}/${mon.maxHp}</p></div>`;
  }

  function showItem(node) {
    const choices = shuffle(ITEMS).slice(0, 3);
    $app.innerHTML = `<section class="screen"><h2>✦ Item Found!</h2><p class="small">Choose one item to keep</p><div class="item-list">${choices.map((it, i) => `<button class="item-card" data-item="${i}"><span class="item-icon">${it.icon}</span><strong>${it.name}</strong><span class="small">${it.desc}</span></button>`).join('')}</div><div class="action-row" style="margin-top:16px"><button class="ghost" id="skipItem">Skip</button></div></section>`;
    $app.querySelectorAll('[data-item]').forEach(btn => btn.addEventListener('click', () => { state.items.push(choices[Number(btn.dataset.item)]); afterNode(node); }));
    $app.querySelector('#skipItem').addEventListener('click', () => afterNode(node));
  }

  function doHeal(node) {
    healTeam(1);
    modal('Pokémon Center', '<p>Seu time foi totalmente curado.</p>', [{label:'Continue →', action:() => { closeModal(); afterNode(node); }}]);
  }

  function doTutor(node) {
    state.team.forEach(m => { m.level += rand(1,2); maybeEvolve(m); refreshStats(m); });
    modal('Move Tutor', '<p>Todo o time ganhou experiência e alguns Pokémon podem ter evoluído.</p>', [{label:'Continue →', action:() => { closeModal(); afterNode(node); }}]);
  }

  function showTrade(node) {
    if (!state.team.length) return afterNode(node);
    const offered = createPokemon(pick(speciesPool()).id, Math.max(8, Math.round(teamAverageLevel() + rand(-2, 4))));
    recordSeen(offered);
    $app.innerHTML = `<section class="screen"><h2>⇄ Trade Offer</h2><p class="small">Escolha um Pokémon para trocar pelo oferecido.</p><div class="panel"><h3>Oferta</h3>${renderMonCard(offered)}</div><h3 style="margin-top:16px">Seu time</h3><div class="pokemon-grid">${state.team.map((m, i) => `<button class="poke-card" data-trade="${i}">${renderMonCardInner(m)}</button>`).join('')}</div><div class="action-row" style="margin-top:16px"><button class="ghost" id="declineTrade">Decline</button></div></section>`;
    $app.querySelectorAll('[data-trade]').forEach(btn => btn.addEventListener('click', () => {
      state.team[Number(btn.dataset.trade)] = offered;
      recordCaught(offered);
      afterNode(node);
    }));
    $app.querySelector('#declineTrade').addEventListener('click', () => afterNode(node));
  }

  function teamAverageLevel() {
    return Math.round(state.team.reduce((s,m)=>s+m.level,0)/Math.max(1,state.team.length));
  }

  function useItem(index) {
    const item = state.items[index];
    if (!item) return;
    if (item.use === 'passive') {
      state.team[0].held = item;
      state.items.splice(index, 1);
      saveAll(); renderMap(); return;
    }
    const lead = state.team[0];
    if (!lead) return;
    if (item.use === 'heal') {
      const target = state.team.find(m => m.hp < m.maxHp && !m.fainted) || lead;
      refreshStats(target);
      target.hp = clamp(target.hp + Math.round(target.maxHp * .45), 1, target.maxHp);
      target.fainted = false;
    } else if (item.use === 'fullheal') {
      healTeam(1);
    } else if (item.use === 'level') {
      lead.level += 3; maybeEvolve(lead); refreshStats(lead); lead.hp = lead.maxHp;
    } else if (item.use === 'atk') {
      lead.bonus.atk += 8; refreshStats(lead);
    } else if (item.use === 'def') {
      lead.bonus.def += 8; refreshStats(lead);
    } else if (item.use === 'spd') {
      lead.bonus.spd += 8; refreshStats(lead);
    } else if (item.use === 'revive') {
      const target = state.team.find(m => m.fainted || m.hp <= 0);
      if (target) { refreshStats(target); target.hp = Math.round(target.maxHp * .5); target.fainted = false; }
      else return;
    }
    state.items.splice(index, 1);
    saveAll();
    if (state.currentBattle) renderBattle(); else renderMap();
  }

  function renderGameOver() {
    $app.innerHTML = `<section class="screen"><h2>GAME OVER</h2><p class="small">Sua run terminou. O save da run atual foi mantido como histórico local até você iniciar outra.</p><div class="action-row"><button id="tryAgain">Try Again</button><button class="ghost" id="homeBtn">Menu</button></div><div class="panel" style="margin-top:16px"><h3>Seu time final</h3><div class="pokemon-grid">${state.team.map(m => renderMonCard(m)).join('')}</div></div></section>`;
    $app.querySelector('#tryAgain').addEventListener('click', () => { const gen = state.gen; const mode = state.mode; resetRun(); renderAvatar(mode, gen); });
    $app.querySelector('#homeBtn').addEventListener('click', () => { resetRun(); renderHome(); });
  }

  function winGame() {
    state.champion = true;
    meta.wins += 1;
    unlock('champion');
    if (state.mode === 'nuzlocke') unlock('nuzlocke');
    const record = {
      date: new Date().toLocaleString('pt-BR'),
      mode: state.mode,
      badges: state.badges.length,
      team: state.team.map(cloneMon),
      win: meta.wins
    };
    meta.hallOfFame.unshift(record);
    meta.hallOfFame = meta.hallOfFame.slice(0, 20);
    saveAll();
    renderChampionScreen(meta.wins);
  }

  function renderChampionScreen(winNumber = meta.wins) {
    $app.innerHTML = `<section class="screen"><h2>YOU ARE THE CHAMPION!</h2><p>Congratulations! You defeated the Elite Four!</p><p class="small">Championship #${winNumber}</p><div class="pokemon-grid">${state.team.map(m => renderMonCard(m)).join('')}</div><div class="action-row" style="margin-top:18px"><button id="playAgain">Play Again</button><button class="ghost" id="shareRun">Share</button><button class="green" id="climbTower">Climb the Tower</button></div></section>`;
    $app.querySelector('#playAgain').addEventListener('click', () => { resetRun(); renderHome(); });
    $app.querySelector('#shareRun').addEventListener('click', shareRun);
    $app.querySelector('#climbTower').addEventListener('click', () => startTower(0));
  }

  function shareRun() {
    const text = `🏆 Championship #${meta.wins} on Pokelike!\nMy team: ${state.team.map(m => `${m.name} Lv.${m.level}`).join(', ')}\n${state.mode} · ${state.badges.length} Badges`;
    navigator.clipboard?.writeText(text);
    modal('Share Your Run', `<textarea readonly>${text}</textarea>`, [{label:'Fechar', action: closeModal}]);
  }

  function renderTower() {
    saveAll();
    const unlocked = Math.max(1, meta.towerClears + 1);
    $app.innerHTML = `<section class="screen"><h2>⚔ Battle Tower</h2><p class="small">Choose a stage to begin</p><div class="map-grid">${TOWER_STAGES.map((s, i) => `<button class="node-card" data-stage="${i}" ${i >= unlocked ? 'disabled' : ''}><span class="icon">${i+1}</span><strong>${s.name}</strong><span class="small">${i < unlocked ? 'Disponível' : 'Bloqueado'}</span></button>`).join('')}</div><div class="action-row" style="margin-top:16px"><button class="ghost" id="towerBack">← Back</button></div></section>`;
    $app.querySelectorAll('[data-stage]').forEach(btn => btn.addEventListener('click', () => towerBattle(Number(btn.dataset.stage))));
    $app.querySelector('#towerBack').addEventListener('click', renderHome);
  }

  function towerBattle(stageIdx) {
    const stage = TOWER_STAGES[stageIdx];
    if (!stage) return renderTower();
    state.mode = 'tower';
    state.towerStage = stageIdx;
    state.team.forEach(m => { if (m.level < 50 + stageIdx * 10) { m.level = 50 + stageIdx * 10; refreshStats(m, true); } });
    startBattle(stage.team.map(x => createPokemon(x.id, x.level, { boss:true })), `Battle Tower — ${stage.name}`, () => {
      meta.towerClears = Math.max(meta.towerClears, stageIdx + 1);
      unlock(`tower_${stageIdx + 1}`);
      state.gameOver = false;
      saveAll();
      modal('Stage Clear!', `<p>Você venceu <strong>${stage.name}</strong>.</p>`, [{label:'Stage Select →', action:() => { closeModal(); renderTower(); }}]);
    });
  }

  function renderPokedex() {
    const all = POKEMON.filter(p => p.id <= (state?.gen === 2 ? 251 : 151));
    modal('Pokédex', `<div class="pokemon-grid">${all.map(p => {
      const caught = meta.caught[p.id];
      const seen = meta.seen[p.id] || caught;
      return `<article class="poke-card ${seen ? '' : 'fainted'}"><div class="sprite-wrap">${seen ? `<img src="${spriteUrl(p.id)}" onerror="this.src='${fallbackSpriteUrl(p.id)}'" alt="${p.name}">` : '❔'}</div><div class="poke-meta"><h3>#${p.id} ${seen ? p.name : '???'}</h3><p class="small">${caught ? 'Capturado' : seen ? 'Visto' : 'Desconhecido'}</p><div class="type-row">${seen ? p.types.map(t => `<span class="type ${t}">${t}</span>`).join('') : ''}</div></div></article>`;
    }).join('')}</div>`, [{label:'Fechar', action:closeModal}]);
  }

  function renderAchievements() {
    modal('Achievements', `<div class="achievement-list">${ACHIEVEMENTS.map(a => `<article class="achievement ${meta.achievements[a.key] ? 'unlocked' : 'locked'}"><h3>${meta.achievements[a.key] ? '🏆' : '🔒'} ${a.title}</h3><p class="small">${a.desc}</p></article>`).join('')}</div>`, [{label:'Fechar', action:closeModal}]);
  }

  function renderHallOfFame() {
    modal('Hall of Fame', meta.hallOfFame.length ? `<div class="hof-grid">${meta.hallOfFame.map(r => `<article class="hof-card"><h3>Championship #${r.win}</h3><p class="small">${r.date} · ${r.mode} · ${r.badges} badges</p><div class="pokemon-grid">${r.team.map(m => renderMonCard(m)).join('')}</div></article>`).join('')}</div>` : '<p class="small">Nenhuma vitória salva ainda.</p>', [{label:'Fechar', action:closeModal}]);
  }

  function renderPatchNotes() {
    modal('Patch Notes', `<div class="panel"><h3>v1.5.1 — GitHub Pages Edition</h3><p class="small">Versão estática criada para rodar direto no navegador, sem Node, sem servidor e sem banco de dados.</p><ul><li>Normal Mode, Nuzlocke e Battle Tower.</li><li>Save local, exportação/importação por código.</li><li>Pokédex, conquistas, Hall of Fame e Share Run.</li><li>Autobatalha com tipos, crítico, evolução, itens e rotas aleatórias.</li></ul></div>`, [{label:'Fechar', action:closeModal}]);
  }

  function renderSettings() {
    modal('Settings', `<div class="settings-grid">
      <label class="panel"><strong>Tema</strong><p class="small">Alterna claro/escuro.</p><select id="themeSelect"><option value="dark">Dark</option><option value="light">Light</option></select></label>
      <label class="panel"><strong>Batalha rápida</strong><p class="small">Avança turnos automaticamente.</p><select id="fastSelect"><option value="off">Off</option><option value="on">On</option></select></label>
      <div class="panel"><strong>Reset total</strong><p class="small">Apaga progresso, conquistas e Hall of Fame.</p><button class="red" id="resetAll">Resetar tudo</button></div>
    </div>`, [{label:'Salvar', action:() => {
      meta.settings.light = document.getElementById('themeSelect').value === 'light';
      meta.settings.fast = document.getElementById('fastSelect').value === 'on';
      saveAll(); closeModal(); renderCurrent();
    }}]);
    document.getElementById('themeSelect').value = meta.settings.light ? 'light' : 'dark';
    document.getElementById('fastSelect').value = meta.settings.fast ? 'on' : 'off';
    document.getElementById('resetAll').addEventListener('click', () => confirmModal('Resetar tudo?', 'Isso apaga todo o progresso salvo neste navegador.', () => { localStorage.removeItem(META_KEY); localStorage.removeItem(STORAGE_KEY); meta = loadMeta(); state = null; closeModal(); renderHome(); }));
  }

  function renderSaveCode() {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ meta, state }))));
    modal('☁ Save Code', `<p class="small">Copie o código para levar seu progresso para outro navegador. Cole um código válido e clique em Importar.</p><textarea id="saveText">${payload}</textarea><div class="action-row" style="margin-top:12px"><button id="copySave" class="ghost">Copiar</button><button id="importSave">Importar</button></div>`, [{label:'Fechar', action:closeModal}]);
    document.getElementById('copySave').addEventListener('click', () => navigator.clipboard?.writeText(document.getElementById('saveText').value));
    document.getElementById('importSave').addEventListener('click', () => {
      try {
        const imported = JSON.parse(decodeURIComponent(escape(atob(document.getElementById('saveText').value.trim()))));
        if (!imported.meta) throw new Error('invalid');
        meta = imported.meta;
        state = imported.state || null;
        saveAll(); closeModal(); renderCurrent();
      } catch {
        alert('Código inválido.');
      }
    });
  }

  function bindOpeners() {
    document.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => {
      const target = btn.dataset.open;
      if (target === 'pokedex') renderPokedex();
      if (target === 'achievements') renderAchievements();
      if (target === 'hof') renderHallOfFame();
      if (target === 'patch') renderPatchNotes();
      if (target === 'settings') renderSettings();
      if (target === 'savecode') renderSaveCode();
    }));
  }

  function renderCurrent() {
    if (state?.currentBattle) return renderBattle();
    if (state?.gameOver) return renderGameOver();
    if (state?.champion) return renderChampionScreen();
    if (state?.team?.length && state.mode === 'tower') return renderTower();
    if (state?.team?.length) return renderMap();
    return renderHome();
  }

  function modal(titleText, body, actions = []) {
    closeModal();
    const wrapper = document.createElement('div');
    wrapper.className = 'modal-backdrop';
    wrapper.innerHTML = `<div class="modal"><div class="action-row" style="justify-content:space-between;align-items:center"><h2>${titleText}</h2><button class="ghost small-btn" data-close-modal>✕</button></div><div>${body}</div><div class="action-row" style="margin-top:18px">${actions.map((a, i) => `<button data-modal-action="${i}" class="${a.className || ''}">${a.label}</button>`).join('')}</div></div>`;
    document.body.appendChild(wrapper);
    wrapper.querySelector('[data-close-modal]').addEventListener('click', closeModal);
    wrapper.addEventListener('click', e => { if (e.target === wrapper) closeModal(); });
    wrapper.querySelectorAll('[data-modal-action]').forEach(btn => btn.addEventListener('click', () => actions[Number(btn.dataset.modalAction)].action()));
  }

  function confirmModal(titleText, text, onYes) {
    modal(titleText, `<p>${text}</p>`, [{label:'Cancelar', className:'ghost', action:closeModal}, {label:'Confirmar', className:'red', action:onYes}]);
  }

  function closeModal() {
    document.querySelector('.modal-backdrop')?.remove();
  }

  document.getElementById('continueRunBtn').addEventListener('click', () => {
    state = loadState();
    if (state && state.mode !== 'tower') renderCurrent(); else renderHome();
  });
  document.getElementById('continueTowerBtn').addEventListener('click', () => {
    state = loadState();
    if (state && state.mode === 'tower') renderCurrent(); else renderHome();
  });

  // Fix species that can appear in boss teams but are not otherwise in pool.
  [{id:89,name:'Muk',types:['poison'],hp:105,atk:105,def:75,spd:50},{id:112,name:'Rhydon',types:['ground','rock'],hp:105,atk:130,def:120,spd:40},{id:122,name:'Mr. Mime',types:['psychic','fairy'],hp:40,atk:45,def:65,spd:90}].forEach(p => { if (!BY_ID[p.id]) { POKEMON.push(p); BY_ID[p.id] = p; } });

  saveAll();
  renderHome();
})();
