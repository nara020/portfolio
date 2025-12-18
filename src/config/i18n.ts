import { getRequestConfig } from "next-intl/server";

export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale은 미들웨어에서 전달됨
  let locale = await requestLocale;

  // locale이 없거나 유효하지 않으면 기본값 사용
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
