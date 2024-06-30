import { Dispatch, ReactNode, SetStateAction } from 'react';

export enum Tools {
    Pointer = 'pointer',
    Pan = 'pan',
}

export enum Keys {
    Z = 'z',
    Y = 'y',
}

export enum ShortCutKeys {
    H = 'h',
    A = 'a',
    C = 'c',
}

export enum Cursor {
    Crosshair = 'crosshair',
    Default = 'default',
    Move = 'move',
    Grab = 'grab',
    Grabbing = 'grabbing',
}

export type InitialValueType<T> = T | ((prev?: T) => T);

export type ReturnValueType<T> = [
    T,
    (value: InitialValueType<T>) => void,
    (value: InitialValueType<T>) => void,
];

export interface CoordinateInterface {
    x: number;
    y: number;
}

export interface TopBarProps {
    setTool: Dispatch<SetStateAction<Tools>>;
    setCursor: Dispatch<SetStateAction<Cursor>>;
    tool: Tools;
}

export interface ChainsElement {
    id: string;
    startPoint: CoordinateInterface;
    endPoint: CoordinateInterface;
    shape: string;
}

export interface SideBarProps {
    tool?: Tools;
}

export interface ShowProps {
    children: ReactNode;
}

export interface ActionButtonsProps {
    undo: () => void;
    redo: () => void;
}
