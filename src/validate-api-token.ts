const errorMapping: Record<string, string> = {
	missing: "You forgot to provide an API key. Please enter it in the settings.",
	not_found:
		"The provided API key does not exist. Please check for typos and try again.",
	expired:
		"The provided API key has expired. Please generate a new one and update your settings.",
	wrong_type:
		"The provided API key is of the wrong type. Please ensure you are using a Stream Deck API key and not another type of token.",
	inactive:
		"The provided API key is inactive. Please check your account and ensure the key is active.",
};

async function validateApiKey() {
	const API_BASE_URL = __API_BASE_URL__;

	const { settings } = await SDPIComponents.streamDeckClient.getSettings();
	const apiKey = settings.apiKey;

	if (!apiKey) {
		alert("❌ API key not configured");
		return;
	}

	try {
		const res = await fetch(`${API_BASE_URL}/api/stream-deck/token/check`, {
			body: JSON.stringify({ token: apiKey }),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			alert("❌ API key is invalid!");
			return;
		}
		const json = (await res.json()) as { valid: boolean; reason?: string };

		if (!json.valid && json.reason) {
			alert(
				`❌ API key is invalid! Reason: ${errorMapping[json.reason] || "Unknown error"}`,
			);
		} else {
			alert("✅ Token is valid!");
		}
	} catch (_err) {
		alert(
			"❌ Oops, something went wrong while validating the API key. Please try again later.",
		);
	}
}

window.validateApiKey = validateApiKey;
