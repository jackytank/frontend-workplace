import { Skeleton, message } from "antd";
import { ComponentType, useState, useCallback, useEffect, useRef } from "react";

export function withTimer<T>(Component: ComponentType<T>) {
    return (hocProps: Omit<T, 'count' | 'startTimer' | 'endTimer'>) => {
        const count = useRef(0);
        const [timer, setTimer] = useState(-1);

        const startTimer = useCallback(() => {
            const timer = setInterval(
                () => {
                    count.current += 1;
                },
                1000
            );
            setTimer(timer);
        }, []);

        const endTimer = useCallback(() => {
            clearInterval(timer);
            count.current = 0;
        }, [timer]);

        useEffect(() => {
            void message.info(`withTimer::count is: ${count.current}`);
        }, [count]);

        return (
            <>
                <Component
                    {...(hocProps as T)}
                    startTimer={startTimer}
                    endTimer={endTimer}
                    count={count}
                />
            </>
        );
    };
}

export function withLoading<T>(Component: ComponentType<T>) {
    return (hocProps: T) => {
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            void message.info('Please wait for ~2s');
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }, []);

        if (loading) {
            return <Skeleton active paragraph={{ rows: 3 }} />;
        }
        return (
            <>
                <Component
                    {...(hocProps as any)}
                />
            </>
        );
    };
}