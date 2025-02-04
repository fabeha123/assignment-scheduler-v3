import { useState, useEffect } from "react";

export const useFetchData = (fetchFunction) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [fetchFunction]);

  return { data, error };
};
