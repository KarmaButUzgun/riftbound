/* V36 vocabulary aliases stay inside the existing V31.1 tactical grammar. */
const RIFT_V36_BASE_TOKENS_FOR=RIFT_V311_TOKENS_FOR;
RIFT_V311_TOKENS_FOR=function RIFT_V36_TOKENS_FOR(pattern){const normalized=String(pattern||``).replaceAll(`archive`,`copy`).replaceAll(`cleanse`,`dispel`).replaceAll(`route`,`line`).replaceAll(`destruction`,`impact`).replaceAll(`ultimate`,`command`);return RIFT_V36_BASE_TOKENS_FOR(normalized)};
