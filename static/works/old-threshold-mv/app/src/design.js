// Design system for 那道旧门槛: palette, type, timing. See DESIGN.md.
export const TITLE = '那道旧门槛';
export const AUDIO_OFFSET = 0;
export const DURATION = 259.8;
export const FPS = 30;

// Gouache palette: rice white, earth yellow, grey green, pale blue; navy and ink for weight.
export const C = {
    paper: '#F2EBDC',
    paperWarm: '#E9DCC2',
    ink: '#2E2B27',
    inkSoft: '#57514A',
    ochre: '#C69A55',
    ochreLight: '#E2C893',
    ochreDeep: '#9C7340',
    sage: '#8C9B7C',
    sageLight: '#B9C3A5',
    sageDeep: '#5C6C55',
    forest: '#4A5D46',
    sky: '#B7CCD3',
    skyLight: '#D8E3E3',
    blueGrey: '#7E96A0',
    blueDeep: '#55707D',
    navy: '#2F3C4E',
    wood: '#8A6A4C',
    woodLight: '#B08E68',
    woodDark: '#5A4535',
    tile: '#4B5152',
    stone: '#ABA698',
    plaster: '#DCD2BE',
    earth: '#B9A27E',
    iron: '#2C2C2D',
    skin: '#E3BB95',
    skinShade: '#C99770',
    hair: '#2B2724',
    grey: '#9A9A94',
    blush: '#D99A86',
};

// Three kinds of text, three treatments: the lyrics belong to the viewer (a plain handwritten regular script,
// soft, no outline); chalk belongs to the classroom (the same hand, rendered as chalk on the board);
// the chat belongs to the phone (the device's own sans-serif). The title keeps the serif.
export const FONT = {
    family: '"MV Serif", "Source Han Serif SC", "Songti SC", "STSong", "Noto Serif CJK SC", serif',
    hand: '"MV Hand", "LXGW WenKai", "Kaiti SC", "STKaiti", "KaiTi", serif',
    ui: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif',
    files: [
        ['MV Serif', 'fonts/serif-regular.woff2', '400'],
        ['MV Serif', 'fonts/serif-semibold.woff2', '600'],
        ['MV Hand', 'fonts/hand-regular.woff2', '400'],
        ['MV Hand', 'fonts/hand-medium.woff2', '500'],
    ],
};

export const TYPE = {
    title: { weight: 600, size: 72, tracking: 0.4 },
    lyric: { weight: 400, size: 44, tracking: 0.02, family: 'hand' },
    label: { weight: 400, size: 22, tracking: 0.12 },
    ink: '#433E35',
    fadeIn: 0.4,
    fadeOut: 0.35,
};

// Song structure from the LRC (seconds).
export const SECTIONS = [
    { name: 'intro', from: 0, to: 17.26 },
    { name: 'verse', n: 1, from: 17.26, to: 44.05 },
    { name: 'verse', n: 2, from: 44.05, to: 71.77 },
    { name: 'chorus', n: 1, from: 71.77, to: 101.2 },
    { name: 'verse', n: 3, from: 101.2, to: 127.2 },
    { name: 'chorus', n: 2, from: 127.2, to: 156.54 },
    { name: 'verse', n: 4, from: 156.54, to: 183.21 },
    { name: 'bridge', from: 183.21, to: 197.69 },
    { name: 'chorus', n: 3, from: 197.69, to: 226.22 },
    { name: 'outro', from: 226.22, to: DURATION },
];
export const sectionAt = (T) => SECTIONS.find((s) => T >= s.from && T < s.to) || SECTIONS[SECTIONS.length - 1];
