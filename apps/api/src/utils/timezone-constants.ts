/**
 * Interface para opções de timezone com suporte multi-idioma
 */
export interface TimezoneOption {
  offset: string;
  zone: string;
  continent: string;
  pt: string;
  en: string;
}

/**
 * Lista de timezones IANA com suporte a horário de verão automático
 * Organizado por continente para melhor UX
 * 
 * IMPORTANTE: Sempre salve o 'zone' no banco de dados, não o 'offset'
 * O offset é apenas para exibição visual. A zona IANA garante que
 * o horário de verão seja calculado automaticamente.
 */
export const TIMEZONES: TimezoneOption[] = [
  // AMÉRICA
  { offset: "-10", zone: "Pacific/Honolulu", continent: "América", pt: "-10h Havaí", en: "-10h Hawaii" },
  { offset: "-9", zone: "America/Anchorage", continent: "América", pt: "-9h Alasca", en: "-9h Alaska" },
  { offset: "-8", zone: "America/Los_Angeles", continent: "América", pt: "-8h Los Angeles / Vancouver", en: "-8h Los Angeles / Vancouver" },
  { offset: "-7", zone: "America/Denver", continent: "América", pt: "-7h Denver / Phoenix", en: "-7h Denver / Phoenix" },
  { offset: "-6", zone: "America/Mexico_City", continent: "América", pt: "-6h Cidade do México / Chicago", en: "-6h Mexico City / Chicago" },
  { offset: "-5", zone: "America/New_York", continent: "América", pt: "-5h Nova York / Miami", en: "-5h New York / Miami" },
  { offset: "-4", zone: "America/Manaus", continent: "América", pt: "-4h Manaus / Cuiabá", en: "-4h Manaus / Cuiaba" },
  { offset: "-3", zone: "America/Sao_Paulo", continent: "América", pt: "-3h Brasília / São Paulo", en: "-3h Brasilia / Sao Paulo" },
  { offset: "-3", zone: "America/Argentina/Buenos_Aires", continent: "América", pt: "-3h Buenos Aires", en: "-3h Buenos Aires" },
  { offset: "-2", zone: "America/Noronha", continent: "América", pt: "-2h Fernando de Noronha", en: "-2h Fernando de Noronha" },

  // EUROPA / ÁFRICA
  { offset: "0", zone: "UTC", continent: "Europa/África", pt: "0h Londres / Lisboa / Dublin", en: "0h London / Lisbon / Dublin" },
  { offset: "+1", zone: "Europe/Paris", continent: "Europa/África", pt: "+1h Berlim / Paris / Madri", en: "+1h Berlin / Paris / Madrid" },
  { offset: "+2", zone: "Africa/Johannesburg", continent: "Europa/África", pt: "+2h Joanesburgo / Cairo / Atenas", en: "+2h Johannesburg / Cairo / Athens" },
  { offset: "+3", zone: "Europe/Moscow", continent: "Europa/África", pt: "+3h Moscou / Riade / Istambul", en: "+3h Moscow / Riyadh / Istanbul" },

  // ÁSIA / OCEANIA
  { offset: "+4", zone: "Asia/Dubai", continent: "Ásia/Oceania", pt: "+4h Dubai / Baku", en: "+4h Dubai / Baku" },
  { offset: "+5:30", zone: "Asia/Kolkata", continent: "Ásia/Oceania", pt: "+5:30h Mumbai / Nova Deli", en: "+5:30h Mumbai / New Delhi" },
  { offset: "+7", zone: "Asia/Bangkok", continent: "Ásia/Oceania", pt: "+7h Bangkok / Jacarta", en: "+7h Bangkok / Jakarta" },
  { offset: "+8", zone: "Asia/Singapore", continent: "Ásia/Oceania", pt: "+8h Pequim / Singapura / Perth", en: "+8h Beijing / Singapore / Perth" },
  { offset: "+9", zone: "Asia/Tokyo", continent: "Ásia/Oceania", pt: "+9h Tóquio / Seul", en: "+9h Tokyo / Seoul" },
  { offset: "+9:30", zone: "Australia/Adelaide", continent: "Ásia/Oceania", pt: "+9:30h Adelaide", en: "+9:30h Adelaide" },
  { offset: "+10", zone: "Australia/Sydney", continent: "Ásia/Oceania", pt: "+10h Sydney / Melbourne", en: "+10h Sydney / Melbourne" },
  { offset: "+12", zone: "Pacific/Auckland", continent: "Ásia/Oceania", pt: "+12h Auckland / Fiji", en: "+12h Auckland / Fiji" },
];

/**
 * Retorna timezones com labels no idioma especificado
 */
export function getTimezonesByLanguage(lang: 'pt' | 'en' = 'pt') {
  return TIMEZONES.map(tz => ({
    value: tz.zone,
    label: tz[lang],
    offset: tz.offset,
    country: tz.continent,
  }));
}

/**
 * Detecta o timezone do navegador
 */
export function detectBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

/**
 * Agrupa timezones por continente no idioma especificado
 */
export function groupTimezonesByContinent(
  lang: 'pt' | 'en' = 'pt'
): Record<string, Array<{value: string; label: string}>> {
  return TIMEZONES.reduce((acc, tz) => {
    const continent = tz.continent;
    if (!acc[continent]) acc[continent] = [];
    acc[continent].push({
      value: tz.zone,
      label: tz[lang],
    });
    return acc;
  }, {} as Record<string, Array<{value: string; label: string}>>);
}
