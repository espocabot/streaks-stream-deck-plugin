import { action, type KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { incrementCounter } from "./api";
import type { CounterSettings } from "./types";

@action({ UUID: "com.espocabot.streaks.increment" })
export class IncrementCounter extends SingletonAction<CounterSettings> {
	override async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
		const { settings } = ev.payload;

		if (!settings.apiKey) {
			ev.action.showAlert();
			return;
		}

		const result = await incrementCounter(settings.apiKey);

		if (!result.success) {
			ev.action.showAlert();
			return;
		}

		ev.action.showOk();
	}
}
