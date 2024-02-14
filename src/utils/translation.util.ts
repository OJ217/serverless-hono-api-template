import { z } from 'zod';

import { ApiErrorMessage } from './error.util';
import enTranslation from './localization/en';
import mnTranslation from './localization/mn';

export enum Locale {
	MONGOLIAN = 'mn',
	ENGLISH = 'en',
}

const translationKeys = [] as const;

export type TranslationKey = (typeof translationKeys)[number] | ApiErrorMessage;
export type TranslationData = Record<TranslationKey, string>;
export type Translations = Record<TranslationKey, { [Locale.MONGOLIAN]: string; [Locale.ENGLISH]: string }>;

export const translations: Partial<Translations> = (Object.keys(mnTranslation) as Array<TranslationKey>).reduce<Partial<Translations>>((obj, key) => {
	obj[key] = {
		[Locale.MONGOLIAN]: mnTranslation[key],
		[Locale.ENGLISH]: enTranslation[key] ?? mnTranslation[key],
	};
	return obj;
}, {});

type Translate = (key: TranslationKey, locale?: string) => string;
export const translate: Translate = (key, locale = Locale.MONGOLIAN) => {
	const localeSchema = z.nativeEnum(Locale).optional().default(Locale.MONGOLIAN).catch(Locale.MONGOLIAN);
	const parsedLocale = localeSchema.parse(locale);

	return translations[key]?.[parsedLocale] ?? key;
};
