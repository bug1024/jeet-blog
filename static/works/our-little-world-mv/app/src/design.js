// Design system for 我们的小小世界. Every colour, typeface, size and timing constant lives here (see DESIGN.md).

export const TITLE = '我们的小小世界';
// The song file starts 0.09 s earlier than the one the LRC was timed on, so it plays 0.09 s late:
// film time = file time + AUDIO_OFFSET. Lyrics, beats and shots all stay in LRC time.
export const AUDIO_OFFSET = 0.09;
export const DURATION = 210.5;
export const FPS = 30;

// 73.5 BPM, measured from the master; BEAT0 is the first beat after the intro swell.
export const BEAT = 60 / 73.5;
export const BEAT0 = 14.204;

export const C = {
    paper: '#ECE3CF',
    paperLight: '#F4EEDF',
    paperDark: '#DDD1B6',
    kraft: '#CDB78F',
    kraftDark: '#B39B72',
    ink: '#262523',
    inkSoft: '#4A4744',
    blue: '#5F7A8C',
    blueLight: '#9DB0BA',
    blueDeep: '#34495A',
    night: '#1F2A36',
    brick: '#A9503A',
    brickLight: '#C97A5C',
    green: '#3F5B4A',
    greenLight: '#7F9378',
    orange: '#D9893A',
    sand: '#D8C49B',
    cream: '#F2EAD8',
};

export const FONT = {
    family: '"MV Serif", "Source Han Serif SC", "Songti SC", "STSong", "Noto Serif CJK SC", serif',
    files: [
        ['fonts/serif-light.woff2', '300'],
        ['fonts/serif-regular.woff2', '400'],
        ['fonts/serif-semibold.woff2', '600'],
    ],
};

// Typographic hierarchy.
export const TYPE = {
    logo: { weight: 600, size: 76, tracking: 0.38, color: C.ink },
    verse: { weight: 400, size: 36, tracking: 0.14, color: C.ink },
    chorus: { weight: 400, size: 38, tracking: 0.24, color: C.ink },
    outro: { weight: 300, size: 34, tracking: 0.3, color: C.ink },
    label: { weight: 300, size: 18, tracking: 0.3, color: C.inkSoft },
    reveal: 0.55,
    exit: 0.35,
};

// Grid: 12 columns inside 96px margins; baseline at two thirds of the frame.
export const GRID = { margin: 96, cols: 12, gutter: 24, baseline: 720 };
export const col = (n) => GRID.margin + n * ((1920 - GRID.margin * 2 + GRID.gutter) / GRID.cols);

// Where lyrics sit in each part of the song. mode: 'h' horizontal or 'v' vertical.
export const LYRIC_LAYOUT = {
    verse: { style: 'verse', mode: 'h', x: col(1), y: 930, align: 'left', rule: true },
    pre: { style: 'verse', mode: 'h', x: col(1), y: 930, align: 'left', rule: true },
    chorus: { style: 'chorus', mode: 'v', x: 1800, y: 290, align: 'top' },
    bridge: { style: 'verse', mode: 'h', x: col(1), y: 930, align: 'left' },
    outro: { style: 'outro', mode: 'h', x: 960, y: 958, align: 'center' },
    logo: { x: 960, y: 150 },
};

// Song structure from the LRC (seconds).
export const SECTIONS = [
    { name: 'intro', from: 0, to: 13.69 },
    { name: 'verse', from: 13.69, to: 39.83 },
    { name: 'pre', from: 39.83, to: 52.25 },
    { name: 'chorus', n: 1, from: 52.25, to: 80.32 },
    { name: 'verse', n: 2, from: 80.32, to: 93.81 },
    { name: 'pre', n: 2, from: 93.81, to: 101.24 },
    { name: 'chorus', n: 2, from: 101.24, to: 128.62 },
    { name: 'bridge', from: 128.62, to: 153.48 },
    { name: 'chorus', n: 3, from: 153.48, to: 180.02 },
    { name: 'outro', from: 180.02, to: DURATION },
];
export const sectionAt = (T) => SECTIONS.find((s) => T >= s.from && T < s.to) || SECTIONS[SECTIONS.length - 1];
