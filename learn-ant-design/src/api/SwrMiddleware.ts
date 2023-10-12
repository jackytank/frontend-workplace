import { Arguments, BareFetcher, SWRConfiguration, SWRHook } from "swr";
import { Config } from "../Config";

export const concatDomain = (useSWRNext: SWRHook): unknown => {
    return (key: unknown, fetcher: BareFetcher | null, config: SWRConfiguration) => {
        if (typeof key === "string" && key.startsWith("/")) {
            key = Config.REACT_APP_API_URL + key;
        }
        return typeof key === 'function'
            ? useSWRNext(key, fetcher, config)
            : useSWRNext(key as Arguments, fetcher, config);
    };
};

export const logger = (useSWRNext: SWRHook): unknown => {
    return (key: unknown, fetcher: BareFetcher | null, config: SWRConfiguration) => {
        let nextFetcher = fetcher;
        if (fetcher) {
            nextFetcher = (...args: unknown[]) => {
                const started = Date.now();
                const checkArray = Array.isArray(key) ? key.join(", ") : key;
                const label: unknown = typeof key === "function" ? key() : checkArray;
                console.info("SWR Request", label);
                const response = fetcher(...args);
                if (response instanceof Promise) {
                    return response.then(result => {
                        console.info("SWR Request complete", label, "elapsed", Date.now() - started, "ms");
                        return result as unknown;
                    });
                } else {
                    console.info("SWR Request complete", label, "elapsed", Date.now() - started, "ms");
                    return response;
                }
            };
        }
        return typeof key === "function"
            ? useSWRNext(key, nextFetcher, config)
            : useSWRNext(key as Arguments, nextFetcher, config);
    };
};