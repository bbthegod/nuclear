import { useEffect, useState } from 'react';
import Connector from '@Utils/connection';

const request = new Connector();

export const useRequest = (url: string) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        setLoading(true);
        request.get(url)
            .then((response) => {
                setLoading(false);
                setData(response.data);
            })
            .catch((err) => {
                setError(err)
            })
            .finally(() => {
                setLoading(false);
            })
    }, [url])
    return { data, loading, error };
}

export default request;