import { action, type KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

@action({ UUID: "com.espocabot.streaks.reset" })
export class ResetCounter extends SingletonAction<CounterSettings> {
	override async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
		const { settings } = ev.payload;

		if (!settings.apiKey) {
			ev.action.showAlert();
			return;
		}

		try {
			const headers = new Headers();
			headers.append("x-api-token", settings.apiKey);
			const res = await fetch(
				"http://localhost:3000/api/streaks/active/reset",
				{
					method: "PATCH",
					headers,
				},
			);

			if (!res.ok) {
				ev.action.showAlert();
				return;
			}

			ev.action.showOk();
		} catch (_error) {
			ev.action.showAlert();
		}
	}
}

type CounterSettings = {
	apiKey?: string;
};
