import { useCallback, useState } from "react";

const useHttp = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const request = useCallback(async (url, method = "GET", body, headers = { 'Content-type': 'application/json' }) => {
		setLoading(true);
		setError(false)

		try {
			const response = await fetch(url, { method, body, headers })

			if (!response.ok) throw new Error(`Could not fetch ${url}, status: ${response.status}`);

			setLoading(false);
			return await response.json();

		} catch (error) {
			setLoading(false);
			setError(true);
			throw error
		}
	}, [])

	return { loading, error, request }
}

export default useHttp;