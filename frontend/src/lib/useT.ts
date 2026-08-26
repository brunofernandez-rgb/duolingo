import { translate, type UiLang } from "@/lib/i18n";
import { useDB } from "@/lib/store";

export function useT() {
  const db = useDB();
  const lang = db.uiLang as UiLang;
  const t = (key: string) => translate(lang, key);
  return { t, lang };
}
