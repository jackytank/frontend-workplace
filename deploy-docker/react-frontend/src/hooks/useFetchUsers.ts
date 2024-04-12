/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";

export type UseFetchUsersType = {
    data: UserType[];
    loading: boolean;
    error: Error | null;
    refetch: () => void;
};

export const useFetchUsers = (url: string): UseFetchUsersType => {
    const [data, setData] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [shouldRefetch, setShouldRefetch] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch(url, {
            });
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const users: UserType[] = await res.json();
            setData(users);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [url, shouldRefetch]);

    const refetch = () => setShouldRefetch((prev) => !prev);
    return { data, loading, error, refetch };
};