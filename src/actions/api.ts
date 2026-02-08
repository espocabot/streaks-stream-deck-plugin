const API_BASE_URL = __API_BASE_URL__;

export async function resetCounter(apiKey: string) {
	const headers = new Headers();
	headers.append("x-api-token", apiKey);

	const res = await fetch(`${API_BASE_URL}/api/streaks/active/reset`, {
		method: "PATCH",
		headers,
	});

	if (!res.ok) {
		return { success: false, error: "Failed to reset streak" };
	}

	return { success: true };
}

export async function incrementCounter(apiKey: string) {
	const headers = new Headers();
	headers.append("x-api-token", apiKey);

	const res = await fetch(`${API_BASE_URL}/api/streaks/active/increment`, {
		method: "PATCH",
		headers,
	});

	if (!res.ok) {
		return { success: false, error: "Failed to increment streak" };
	}

	return { success: true };
}
