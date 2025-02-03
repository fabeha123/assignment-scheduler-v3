"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const useClientSearchParams = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const paramsObj = {};
      for (const [key, value] of searchParams.entries()) {
        paramsObj[key] = value;
      }
      setParams(paramsObj);
    }
  }, [searchParams]); // Ensure this runs when searchParams change

  return params;
};

export default useClientSearchParams;
