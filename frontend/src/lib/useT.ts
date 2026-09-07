import { translate, type UiLang } from "@/lib/i18n";

export function useT() {
  const lang: UiLang = "es";
  const t = (key: string) => translate("es", key);
  return { t, lang };
}
