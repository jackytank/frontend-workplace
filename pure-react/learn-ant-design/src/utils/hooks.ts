import { useState, useEffect } from "react";

export const useLoading = (loading: boolean, delay = 500) => {
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    return () => {
      setTimeout(() => setIsLoading(true), delay);
    };
  }, [loading, delay]);

  return isLoading;
};
