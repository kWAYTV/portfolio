import { config } from "../config";
import type { Messages } from "../types";

function mergeDeep<T extends object>(base: T, over: Partial<T>): T {
	const out = { ...base };
	for (const k of Object.keys(over) as (keyof T)[]) {
		const a = out[k];
		const b = over[k];
		if (
			b != null &&
			typeof b === "object" &&
			!Array.isArray(b) &&
			a != null &&
			typeof a === "object" &&
			!Array.isArray(a)
		) {
			(out as Record<keyof T, unknown>)[k] = mergeDeep(
				a as object,
				b as object,
			) as T[keyof T];
		} else if (b !== undefined) {
			(out as Record<keyof T, unknown>)[k] = b;
		}
	}
	return out;
}

async function load(loc: string): Promise<Messages> {
	const m = await import(/* @vite-ignore */ `../../translations/${loc}.json`);
	return m.default as Messages;
}

export async function getMessagesForLocale(loc: string): Promise<Messages> {
	const base = await load(config.defaultLocale);
	if (loc === config.defaultLocale) {
		return base;
	}
	return mergeDeep(base, await load(loc));
}
