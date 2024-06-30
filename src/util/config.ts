import { Cursor, ShortCutKeys, Tools } from './types';


export const backgroundColors = [
    '#f1f1f1',
    '#a6a6a6',
    '#080808',
    '#a5d8ff',
    '#371f76',
];

export const transparentBackgroundUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==';

export const shortCutMap = {
    [ShortCutKeys.H]: Tools.Pan,
    [ShortCutKeys.A]: Tools.Pointer,
    // [ShortCutKeys.C]: Tools.Circle,
};

export const cursorMap = {
    [ShortCutKeys.H]: Cursor.Grab,
    [ShortCutKeys.A]: Cursor.Default,
    // [ShortCutKeys.C]: Cursor.Crosshair,
};

export const invertedShortCutMap: Record<Tools, ShortCutKeys> = {
    [Tools.Pointer]: ShortCutKeys.A,
    [Tools.Pan]: ShortCutKeys.H,
    // [Tools.Circle]: ShortCutKeys.C,
};
