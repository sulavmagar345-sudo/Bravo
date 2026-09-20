/**
 * Image map for Bravo assets
 * Each key describes the content, value is the path relative to /assets/
 */

export const IMAGES = {
 // HERO - best barista/coffee action for hero
 hero: '/assets/480592470_2057539678065157_7113948264099985469_n.jpg',
 // Hero backup (student at espresso machine - portrait)
 heroAlt: '/assets/480787915_2055576728261452_1840383711896698557_n.jpg',

 // BARISTA TRAINING section - student practicing at espresso machine
 baristaTraining1: '/assets/480787915_2055576728261452_1840383711896698557_n.jpg',
 baristaTraining2: '/assets/484409073_1218195503640319_510089849103428637_n.jpg',
 baristaTraining3: '/assets/485043801_1218195666973636_5419268445019256995_n.jpg',
 baristaStudent: '/assets/480592470_2057539678065157_7113948264099985469_n.jpg',

 // LATTE ART / COFFEE CLOSE-UPS
 latteArt: '/assets/481229767_2056954608123664_2678765361145993487_n.jpg',
 latteArtRow: '/assets/109346175_932352530583883_3561815099209872014_n.jpg',

 // CAFÉ & BAR - interior, atmosphere
 cafeInterior: '/assets/119116164_984810605338075_1097223667637434888_n.jpg',
 cafeBar: '/assets/480816279_2055576588261466_6237295885905362791_n.jpg',
 cafeEvent1: '/assets/480553068_2056193844866407_2721820247566848945_n.jpg',
 cafeEvent2: '/assets/480540481_2056193804866411_9175541717800793380_n.jpg',
 cafeLive: '/assets/480670013_2055564068262718_2096599669859853065_n.jpg',

 // DRINKS
 milkshakes: '/assets/476275965_2049122522240206_8502688404134947262_n.jpg',
 shakes2: '/assets/476835393_2049108378908287_3962650230453400255_n.jpg',
 cocktailPour: '/assets/480670013_2055564068262718_2096599669859853065_n.jpg',
 barCocktail: '/assets/515437496_1339816701478198_4624130474529648107_n.jpg',
 hotChocolate: '/assets/image1.jpg',

 // TRAINING / GROUP
 groupTraining1: '/assets/473005016_2027201254432333_223289293506585473_n.jpg',
 groupTraining2: '/assets/486279029_1224952272964642_705145699539085004_n.jpg',
 groupTraining3: '/assets/486362285_1224952486297954_6247054914801504378_n.jpg',

 // CERTIFICATION
 certificates: '/assets/certificate.png',
 certificateIndividual: '/assets/certificate 2.png',

// ABOUT / TEAM
  team: '/assets/96404465_871493560003114_9097596256053624832_n.jpg',
  teamGroup: '/assets/98377402_881994065619730_8370993961161981952_n.jpg',
  teamCafe: '/assets/492356765_1256858429774026_3620093556861238375_n.jpg',

  // TRAINERS - individual portrait candidates
  trainer1: '/assets/486100383_1223723583087511_4505845927975402134_n.jpg',
  trainer2: '/assets/494197463_1262717105854825_2298219446583537736_n.jpg',
  trainer3: '/assets/494549997_1262481455878390_5202487372607401708_n.jpg',

  // VIDEO
  welcomeVideo: '/assets/AQMMqaPfj01ksylGcqLS_dIJNYi5oHxrzMI-ZmQyJ0KAOH95JilAIPO9Ruy3gukWc1ORwiUwbP8UmkBD0_nPDIsJrz_38RN6aBEwZKtrzV1g8w.mp4',

  // BAR TRAINING
 barTraining: '/assets/480670013_2055564068262718_2096599669859853065_n.jpg',
 barAction: '/assets/480816279_2055576588261466_6237295885905362791_n.jpg',

 // LOGO
 logo: '/assets/bravo Logo.jpg',
};

/**
 * Gallery images with metadata for filtering
 */
export interface GalleryImage {
 src: string;
 alt: string;
 category: 'barista' | 'cafe' | 'bar' | 'training' | 'events';
}

export const GALLERY_IMAGES: GalleryImage[] = [
 { src: '/assets/480592470_2057539678065157_7113948264099985469_n.jpg', alt: 'Barista student practicing latte art', category: 'barista' },
 { src: '/assets/480787915_2055576728261452_1840383711896698557_n.jpg', alt: 'Student working at espresso machine', category: 'barista' },
 { src: '/assets/484409073_1218195503640319_510089849103428637_n.jpg', alt: 'Barista training session', category: 'training' },
 { src: '/assets/485043801_1218195666973636_5419268445019256995_n.jpg', alt: 'Student learning coffee preparation', category: 'training' },
 { src: '/assets/109346175_932352530583883_3561815099209872014_n.jpg', alt: 'Latte art display', category: 'barista' },
 { src: '/assets/481229767_2056954608123664_2678765361145993487_n.jpg', alt: 'Bravo coffee selection', category: 'barista' },
 { src: '/assets/119116164_984810605338075_1097223667637434888_n.jpg', alt: 'Bravo Café interior', category: 'cafe' },
 { src: '/assets/476275965_2049122522240206_8502688404134947262_n.jpg', alt: 'Café milkshakes', category: 'cafe' },
 { src: '/assets/476835393_2049108378908287_3962650230453400255_n.jpg', alt: 'Café drinks showcase', category: 'cafe' },
 { src: '/assets/480816279_2055576588261466_6237295885905362791_n.jpg', alt: 'Bar flair performance', category: 'bar' },
 { src: '/assets/480670013_2055564068262718_2096599669859853065_n.jpg', alt: 'Bar training session', category: 'bar' },
 { src: '/assets/515437496_1339816701478198_4624130474529648107_n.jpg', alt: 'Bar drinks showcase', category: 'bar' },
 { src: '/assets/473005016_2027201254432333_223289293506585473_n.jpg', alt: 'Bravo team with coffee', category: 'training' },
 { src: '/assets/486279029_1224952272964642_705145699539085004_n.jpg', alt: 'Group barista training', category: 'training' },
 { src: '/assets/486362285_1224952486297954_6247054914801504378_n.jpg', alt: 'Coffee training class', category: 'training' },
 { src: '/assets/480780572_1201389565320913_4342714385305022373_n.jpg', alt: 'Graduation & certificates', category: 'events' },
 { src: '/assets/481260176_2057942934691498_7314790278999501264_n.jpg', alt: 'Student receiving certificate', category: 'events' },
 { src: '/assets/480553068_2056193844866407_2721820247566848945_n.jpg', alt: 'Live music at Bravo Café', category: 'events' },
 { src: '/assets/480787915_2055576728261452_1840383711896698557_n.jpg', alt: 'Bravo Café & Bar event', category: 'events' },
 { src: '/assets/492356765_1256858429774026_3620093556861238375_n.jpg', alt: 'Bravo team members', category: 'events' },
 { src: '/assets/98377402_881994065619730_8370993961161981952_n.jpg', alt: 'Bravo training team', category: 'training' },
 { src: '/assets/96404465_871493560003114_9097596256053624832_n.jpg', alt: 'Bravo Barista School team', category: 'training' },
 { src: '/assets/image1.jpg', alt: 'Special hot chocolate creation', category: 'cafe' },
 { src: '/assets/486382726_1224952572964612_3609707227445801998_n.jpg', alt: 'Barista training practice', category: 'barista' },
];
