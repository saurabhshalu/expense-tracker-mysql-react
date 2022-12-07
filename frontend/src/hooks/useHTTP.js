import { useCallback, useState } from "react";
import axios from "axios";
import { getAuthTokenWithUID } from "../helper";

const useHTTP = ({ url, method, body, headers, initialValue = [], params }) => {
  const [data, setData] = useState(initialValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const call = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const authTokens = await getAuthTokenWithUID();
      const response = await axios({
        method: method,
        url: url,
        data: body,
        headers: { ...authTokens, headers },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, headers, body, method]);

  return { data, loading, error, call };
};

export default useHTTP;
