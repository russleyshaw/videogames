import { useState, useRef, useEffect } from "react";

export function useAsyncState<T>(getter: () => Promise<T>, deps: any[]): [T | undefined, boolean, any] {
    const [value, setValue] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const getterRef = useRef(getter);

    useEffect(() => {
        getterRef.current = getter;
    }, [getter]);

    useEffect(() => {
        setLoading(true);
        getterRef
            .current()
            .then(v => {
                setError(undefined);
                setValue(v);
                setLoading(false);
            })
            .catch(e => {
                setError(e);
                setLoading(false);
            });
    }, deps);

    return [value, loading, error];
}
