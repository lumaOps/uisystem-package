// hooks/useCustomTranslation.ts
import { useTranslations, useLocale, useMessages } from 'next-intl';

type TranslationOptions = {
  [key: string]: string | number;
};

type MessageType = Record<string, unknown>;

export function useCustomTranslation() {
  const t = useTranslations();
  const messages = useMessages();
  const locale = useLocale();

  const customT = (key: string, options: TranslationOptions = {}) => {
    if (locale === 'en') {
      return key;
    }
    const escapedKey = escapeDotKey(key);
    const keyExists = checkIfKeyExists(messages, escapedKey);
    if (!keyExists) {
      return key;
    }
    try {
      return t(escapedKey, options);
    } catch {
      return key;
    }
  };

  customT.locale = locale;

  return customT as typeof customT & { locale: string };
}

function checkIfKeyExists(messages: MessageType, key: string): boolean {
  return key in messages;
}

function escapeDotKey(key: string) {
  return key.replace(/\./g, '__DOT__');
}

// function unescapeDotKey(key: string) {
//   return key.replace(/__DOT__/g, '.');
// }
