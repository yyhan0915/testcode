import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import deepEqual from 'deep-equal';

const { CancelToken } = axios;

/**
 * @todo
 * total_page: number;
 * current_page: number;
 * total_count: number;
 * list_count: number;
 * 위의 새로운 API의 props로 변경될 예정
 */
export interface AxiosResponseDataPagination {
    total_pages: number;
    total_elements: number;
    current_page: number;
    current_elements: number;
    // 새로운 API의 props
    total_page: number;
    // current_page: number;
    total_count: number;
    list_count: number;
}

interface AxiosProps<P> {
    response: AxiosResponse<P>;
    error: AxiosError;
    isLoading: boolean;
}

export interface AxiosState<P> {
    data: P;
    response: AxiosResponse<P>;
    error: AxiosError;
    isLoading: boolean;
    refetch: (config?: AxiosRequestConfig) => Promise<AxiosResponse<P>>;
}

/**
 * @param {string} url : url address
 * @param {AxiosRequestConfig} [axiosConfig={}]
 * @param {boolean} [manualFetch=false]
 */

export function useAxios<P>(url: string, axiosConfig: AxiosRequestConfig = {}, manualFetch = false): AxiosState<P> {
    const [axiosState, setAxiosState] = useState<AxiosProps<P>>({
        response: null,
        error: null,
        isLoading: !manualFetch,
    });
    const configRef = useRef(axiosConfig);
    const manualFetchRef = useRef(manualFetch);
    const jwtTokenRef = useRef('');

    const configEqual: boolean = useMemo(() => deepEqual(configRef.current, axiosConfig, { strict: true }), [
        axiosConfig,
    ]);
    if (!configEqual) configRef.current = axiosConfig;

    const fetch = useCallback(
        async (config: AxiosRequestConfig) => {
            setAxiosState(state => ({ ...state, isLoading: true }));
            let response = null;
            jwtTokenRef.current = localStorage.getItem('jwt-token');

            try {
                response = await axios({
                    url,
                    ...config,
                    headers: jwtTokenRef.current ? { Authorization: `Bearer ${jwtTokenRef.current}` } : {},
                    cancelToken: CancelToken?.source()?.token,
                });
                setAxiosState({ response, error: null, isLoading: false });
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled by cleanup: ', error.message);
                } else {
                    setAxiosState({ error, response: null, isLoading: false });
                    console.log(error.message);
                }
                return error.message;
            }

            return response;
        },
        [url],
    );

    useEffect(() => {
        jwtTokenRef.current = localStorage.getItem('jwt-token');
    }, []);

    const refetch = useCallback(
        async (config?: AxiosRequestConfig) => {
            configRef.current = { ...configRef.current, ...config };
            return await fetch(configRef.current);
        },
        [fetch],
    );

    useEffect(() => {
        if (manualFetchRef.current) return;

        fetch(configRef.current);

        return () => {
            CancelToken?.source()?.cancel('useEffect cleanup');
        };
    }, [fetch]);

    const { response, error, isLoading } = axiosState;
    const data = response?.data;

    return { data, response, error, isLoading, refetch };
}
