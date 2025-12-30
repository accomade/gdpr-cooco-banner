// Reexport your entry components here
import Banner from "./components/Banner.svelte";
import { DefaultTranslations } from "./translations";

import type {
  CookieChoice,
  CookieSelection,
  Translation,
  CookieType,
} from "./types/cookie";

export { Banner, DefaultTranslations };

export type { CookieSelection, CookieChoice, Translation, CookieType };

