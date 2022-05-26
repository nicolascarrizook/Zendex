import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type Response<T> = T

export function useQueryParams<T>(): Response<T> {
    const [queries, setQueries] = useState<T>({} as T);
    const {search} = useLocation();
    
    const onDecodeParams = useCallback((params: string) => {
        const replaceFirstCharacter = params.replace(/^\?/, '');
        const splitParams = replaceFirstCharacter.split('&');

        const formattedQueries = {} as T;

        splitParams.forEach(query => {
            const [key, value] = query.split('=');
            Object.assign(formattedQueries, {[key]: value});
        });
        setQueries(formattedQueries);
    }, []);

    useEffect(() => {
        if(search.trim()){
            onDecodeParams(search)
        }
    }, [search]);

    return queries;
}