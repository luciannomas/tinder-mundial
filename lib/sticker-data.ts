export interface StickerDef {
  code: string;       // e.g. "ARG1", "FWC3"
  number: number;     // sequential 1-980 in album
  section: string;    // team code or "FWC"
  position: number;   // 1-20 within section (1-20 FWC)
  type: "team" | "special";
  description: string;
  team?: string;      // full team name
  flag?: string;      // emoji flag
}

export interface ExtraStickerDef {
  code: string;       // e.g. "EXT-ORO-01"
  variant: "morado" | "bronce" | "plata" | "oro";
  playerNumber: number; // 1-20
  description: string;
}

// 48 teams for 2026 World Cup
export const TEAMS = [
  // CONMEBOL (6)
  { code: "ARG", name: "Argentina", flag: "🇦🇷", conf: "CONMEBOL" },
  { code: "BRA", name: "Brasil", flag: "🇧🇷", conf: "CONMEBOL" },
  { code: "COL", name: "Colombia", flag: "🇨🇴", conf: "CONMEBOL" },
  { code: "URU", name: "Uruguay", flag: "🇺🇾", conf: "CONMEBOL" },
  { code: "ECU", name: "Ecuador", flag: "🇪🇨", conf: "CONMEBOL" },
  { code: "PAR", name: "Paraguay", flag: "🇵🇾", conf: "CONMEBOL" },
  // UEFA (16)
  { code: "FRA", name: "Francia", flag: "🇫🇷", conf: "UEFA" },
  { code: "ESP", name: "España", flag: "🇪🇸", conf: "UEFA" },
  { code: "ENG", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", conf: "UEFA" },
  { code: "GER", name: "Alemania", flag: "🇩🇪", conf: "UEFA" },
  { code: "POR", name: "Portugal", flag: "🇵🇹", conf: "UEFA" },
  { code: "NED", name: "Países Bajos", flag: "🇳🇱", conf: "UEFA" },
  { code: "BEL", name: "Bélgica", flag: "🇧🇪", conf: "UEFA" },
  { code: "ITA", name: "Italia", flag: "🇮🇹", conf: "UEFA" },
  { code: "SUI", name: "Suiza", flag: "🇨🇭", conf: "UEFA" },
  { code: "AUT", name: "Austria", flag: "🇦🇹", conf: "UEFA" },
  { code: "TUR", name: "Turquía", flag: "🇹🇷", conf: "UEFA" },
  { code: "CRO", name: "Croacia", flag: "🇭🇷", conf: "UEFA" },
  { code: "DEN", name: "Dinamarca", flag: "🇩🇰", conf: "UEFA" },
  { code: "SCO", name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", conf: "UEFA" },
  { code: "SVK", name: "Eslovaquia", flag: "🇸🇰", conf: "UEFA" },
  { code: "SRB", name: "Serbia", flag: "🇷🇸", conf: "UEFA" },
  // CONCACAF (6)
  { code: "USA", name: "Estados Unidos", flag: "🇺🇸", conf: "CONCACAF" },
  { code: "MEX", name: "México", flag: "🇲🇽", conf: "CONCACAF" },
  { code: "CAN", name: "Canadá", flag: "🇨🇦", conf: "CONCACAF" },
  { code: "PAN", name: "Panamá", flag: "🇵🇦", conf: "CONCACAF" },
  { code: "CRC", name: "Costa Rica", flag: "🇨🇷", conf: "CONCACAF" },
  { code: "JAM", name: "Jamaica", flag: "🇯🇲", conf: "CONCACAF" },
  // CAF (9)
  { code: "MAR", name: "Marruecos", flag: "🇲🇦", conf: "CAF" },
  { code: "SEN", name: "Senegal", flag: "🇸🇳", conf: "CAF" },
  { code: "NGA", name: "Nigeria", flag: "🇳🇬", conf: "CAF" },
  { code: "CMR", name: "Camerún", flag: "🇨🇲", conf: "CAF" },
  { code: "GHA", name: "Ghana", flag: "🇬🇭", conf: "CAF" },
  { code: "EGY", name: "Egipto", flag: "🇪🇬", conf: "CAF" },
  { code: "CIV", name: "Costa de Marfil", flag: "🇨🇮", conf: "CAF" },
  { code: "MLI", name: "Mali", flag: "🇲🇱", conf: "CAF" },
  { code: "TUN", name: "Túnez", flag: "🇹🇳", conf: "CAF" },
  // AFC (8)
  { code: "JPN", name: "Japón", flag: "🇯🇵", conf: "AFC" },
  { code: "KOR", name: "Corea del Sur", flag: "🇰🇷", conf: "AFC" },
  { code: "AUS", name: "Australia", flag: "🇦🇺", conf: "AFC" },
  { code: "SAU", name: "Arabia Saudita", flag: "🇸🇦", conf: "AFC" },
  { code: "IRN", name: "Irán", flag: "🇮🇷", conf: "AFC" },
  { code: "QAT", name: "Qatar", flag: "🇶🇦", conf: "AFC" },
  { code: "IND", name: "India", flag: "🇮🇳", conf: "AFC" },
  { code: "UZB", name: "Uzbekistán", flag: "🇺🇿", conf: "AFC" },
  // OFC (1)
  { code: "NZL", name: "Nueva Zelanda", flag: "🇳🇿", conf: "OFC" },
  // Repechaje (2)
  { code: "UKR", name: "Ucrania", flag: "🇺🇦", conf: "UEFA" },
  { code: "VEN", name: "Venezuela", flag: "🇻🇪", conf: "CONMEBOL" },
] as const;

// Position labels within each team (1-20)
const POSITION_LABELS: Record<number, string> = {
  1: "Escudo",
  2: "Foto grupal",
  3: "Jugador 1 (Arquero)",
  4: "Jugador 2 (Defensor)",
  5: "Jugador 3 (Defensor)",
  6: "Jugador 4 (Defensor)",
  7: "Jugador 5 (Defensor)",
  8: "Jugador 6 (Mediocampista)",
  9: "Jugador 7 (Mediocampista)",
  10: "Jugador 8 (Mediocampista)",
  11: "Jugador 9 (Mediocampista)",
  12: "Jugador 10 (Mediocampista)",
  13: "Jugador 11 (Mediocampista)",
  14: "Jugador 12 (Delantero)",
  15: "Jugador 13 (Delantero)",
  16: "Jugador 14 (Delantero)",
  17: "Jugador 15 (Delantero)",
  18: "Jugador 16 (Delantero)",
  19: "Jugador 17 (Delantero)",
  20: "Jugador 18 (Estrella)",
};

// FWC special stickers descriptions
const FWC_DESCRIPTIONS: Record<number, string> = {
  1: "Portada del Álbum",
  2: "Trofeo FIFA World Cup",
  3: "Mascota Oficial",
  4: "Logo FIFA World Cup 2026",
  5: "Estadio MetLife (Nueva York)",
  6: "Estadio AT&T (Dallas)",
  7: "Estadio SoFi (Los Ángeles)",
  8: "Estadio Azteca (Ciudad de México)",
  9: "Estadio Akron (Guadalajara)",
  10: "Estadio BC Place (Vancouver)",
  11: "Historia: 1930 Uruguay",
  12: "Historia: 1970 México",
  13: "Historia: 1978 Argentina",
  14: "Historia: 1986 Argentina",
  15: "Historia: 1994 USA",
  16: "Historia: 2006 Alemania",
  17: "Historia: 2014 Brasil",
  18: "Historia: 2022 Qatar",
  19: "Calendario Fase de Grupos",
  20: "Calendario Fase Final",
};

// Generate full sticker catalog
function generateStickers(): StickerDef[] {
  const stickers: StickerDef[] = [];
  let number = 1;

  // Team stickers: 48 teams × 20 = 960
  for (const team of TEAMS) {
    for (let pos = 1; pos <= 20; pos++) {
      stickers.push({
        code: `${team.code}${pos}`,
        number,
        section: team.code,
        position: pos,
        type: "team",
        description: POSITION_LABELS[pos],
        team: team.name,
        flag: team.flag,
      });
      number++;
    }
  }

  // FWC special stickers: 20
  for (let pos = 1; pos <= 20; pos++) {
    stickers.push({
      code: `FWC${pos}`,
      number,
      section: "FWC",
      position: pos,
      type: "special",
      description: FWC_DESCRIPTIONS[pos],
    });
    number++;
  }

  return stickers;
}

export const STICKERS: StickerDef[] = generateStickers();

// Extra stickers (not in album, collectibles)
const EXTRA_VARIANTS = ["morado", "bronce", "plata", "oro"] as const;
export const EXTRA_STICKERS: ExtraStickerDef[] = [];
for (const variant of EXTRA_VARIANTS) {
  for (let i = 1; i <= 20; i++) {
    const num = String(i).padStart(2, "0");
    EXTRA_STICKERS.push({
      code: `EXT-${variant.toUpperCase()}-${num}`,
      variant,
      playerNumber: i,
      description: `Extra Sticker ${variant} #${num}`,
    });
  }
}

// Lookup helpers
export const STICKER_BY_CODE = new Map(STICKERS.map((s) => [s.code, s]));
export const STICKER_BY_NUMBER = new Map(STICKERS.map((s) => [s.number, s]));

export function findSticker(query: string): StickerDef | undefined {
  const q = query.trim().toUpperCase();
  // Try by code first
  if (STICKER_BY_CODE.has(q)) return STICKER_BY_CODE.get(q);
  // Try by number
  const num = parseInt(q, 10);
  if (!isNaN(num)) return STICKER_BY_NUMBER.get(num);
  return undefined;
}

// Parse multiple sticker codes separated by commas, spaces, or newlines
export function parseMultipleCodes(input: string): StickerDef[] {
  const parts = input.split(/[\s,;\n]+/).filter(Boolean);
  const found: StickerDef[] = [];
  for (const part of parts) {
    const s = findSticker(part);
    if (s) found.push(s);
  }
  return found;
}

export const TOTAL_ALBUM_STICKERS = 980;
export const TEAM_LIST = TEAMS;
