import { useCallback, useState } from 'react';
import { InitialValueType, ReturnValueType } from './types';

const useHistoryState: <T>(
    initialValue: InitialValueType<T>
) => ReturnValueType<T> = <T>(initialValue: InitialValueType<T>) => {
    const [chains, _setChains] = useState<T>(initialValue);
    const [pointer, setPointer] = useState<number>(
        initialValue !== undefined && initialValue !== null ? 0 : -1
    );

    const setChains: (value: InitialValueType<T>) => void = useCallback(
        (value: InitialValueType<T>) => {
            let valueToAdd = value;
            if (typeof value === 'function') {
                valueToAdd = (value as (prev?: T) => T)(chains);
            }
            setPointer((prev) => prev + 1);
            _setChains(value);
        },
        [setPointer, _setChains, chains, pointer]
    );

    return [chains, setChains, _setChains, ];
};

export default useHistoryState;
