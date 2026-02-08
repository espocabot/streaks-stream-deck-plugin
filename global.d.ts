/** biome-ignore-all lint/suspicious/noExplicitAny: -- IGNORE -- */

declare const __API_BASE_URL__: string;

declare const SDPIComponents: {
	streamDeckClient: {
		getSettings(): Promise<{ settings: any }>;
		setSettings(settings: any): Promise<void>;
		sendToPlugin(payload: any): void;
	};
};
