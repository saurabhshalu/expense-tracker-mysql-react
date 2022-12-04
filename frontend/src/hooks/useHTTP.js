import { useCallback, useState } from "react";
import axios from "axios";

const useHTTP = ({ url, method, body, headers, initialValue = [], params }) => {
  const [data, setData] = useState(initialValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const call = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        method: method,
        url: url,
        data: body,
        headers: headers,
        params: params,
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [url, headers, body, method]);

  return { data, loading, error, call };
};

export default useHTTP;
