/**
 * FiguSwap — Test de lógica de figuritas (sin servidor)
 * Corre con: node scripts/test-stickers.mjs
 *
 * Prueba: carga, búsqueda, comparación entre usuarios, agregar/borrar
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ──────────────────────────────────────────────
// Copiar la lógica de sticker-data y utils
// (sin imports de TS — versión pura JS para testing)
// ──────────────────────────────────────────────

const TEAMS = [
  { code: "ARG", name: "Argentina" }, { code: "BRA", name: "Brasil" },
  { code: "COL", name: "Colombia" }, { code: "URU", name: "Uruguay" },
  { code: "ECU", name: "Ecuador" }, { code: "PAR", name: "Paraguay" },
  { code: "FRA", name: "Francia" },  { code: "ESP", name: "España" },
  { code: "ENG", name: "Inglaterra" },{ code: "GER", name: "Alemania" },
  { code: "POR", name: "Portugal" }, { code: "NED", name: "Países Bajos" },
  { code: "BEL", name: "Bélgica" },  { code: "ITA", name: "Italia" },
  { code: "SUI", name: "Suiza" },    { code: "AUT", name: "Austria" },
  { code: "TUR", name: "Turquía" },  { code: "CRO", name: "Croacia" },
  { code: "DEN", name: "Dinamarca" },{ code: "SCO", name: "Escocia" },
  { code: "SVK", name: "Eslovaquia" },{ code: "SRB", name: "Serbia" },
  { code: "USA", name: "Estados Unidos" },{ code: "MEX", name: "México" },
  { code: "CAN", name: "Canadá" },   { code: "PAN", name: "Panamá" },
  { code: "CRC", name: "Costa Rica" },{ code: "JAM", name: "Jamaica" },
  { code: "MAR", name: "Marruecos" },{ code: "SEN", name: "Senegal" },
  { code: "NGA", name: "Nigeria" },  { code: "CMR", name: "Camerún" },
  { code: "GHA", name: "Ghana" },    { code: "EGY", name: "Egipto" },
  { code: "CIV", name: "Costa de Marfil" },{ code: "MLI", name: "Mali" },
  { code: "TUN", name: "Túnez" },    { code: "JPN", name: "Japón" },
  { code: "KOR", name: "Corea del Sur" },{ code: "AUS", name: "Australia" },
  { code: "SAU", name: "Arabia Saudita" },{ code: "IRN", name: "Irán" },
  { code: "QAT", name: "Qatar" },    { code: "IND", name: "India" },
  { code: "UZB", name: "Uzbekistán" },{ code: "NZL", name: "Nueva Zelanda" },
  { code: "UKR", name: "Ucrania" },  { code: "VEN", name: "Venezuela" },
];

function buildStickers() {
  const stickers = [];
  let number = 1;
  for (const team of TEAMS) {
    for (let pos = 1; pos <= 20; pos++) {
      stickers.push({ code: `${team.code}${pos}`, number, section: team.code, position: pos });
      number++;
    }
  }
  for (let pos = 1; pos <= 20; pos++) {
    stickers.push({ code: `FWC${pos}`, number, section: "FWC", position: pos });
    number++;
  }
  return stickers;
}

const STICKERS = buildStickers();
const BY_CODE = new Map(STICKERS.map(s => [s.code, s]));
const BY_NUMBER = new Map(STICKERS.map(s => [s.number, s]));

function findSticker(q) {
  q = q.trim().toUpperCase();
  if (BY_CODE.has(q)) return BY_CODE.get(q);
  const n = parseInt(q, 10);
  if (!isNaN(n)) return BY_NUMBER.get(n);
  return undefined;
}

function computeMatch(myHave, myNeed, theirHave, theirNeed) {
  const iCanGive = myHave.filter(s => theirNeed.includes(s));
  const theyCanGive = theirHave.filter(s => myNeed.includes(s));
  const isPerfect = iCanGive.length > 0 && theyCanGive.length > 0;
  const isPartial = !isPerfect && (iCanGive.length > 0 || theyCanGive.length > 0);
  return { iCanGive, theyCanGive, isPerfect, isPartial };
}

// ──────────────────────────────────────────────
// Test runner
// ──────────────────────────────────────────────

let pass = 0, fail = 0;

function assert(label, condition, detail = "") {
  if (condition) {
    console.log(`  \x1b[32m✓\x1b[0m ${label}`);
    pass++;
  } else {
    console.log(`  \x1b[31m✗\x1b[0m ${label}${detail ? " — " + detail : ""}`);
    fail++;
  }
}

function section(title) {
  console.log(`\n\x1b[33m━━━ ${title} ━━━\x1b[0m`);
}

// ──────────────────────────────────────────────
// 1. Catálogo
// ──────────────────────────────────────────────
section("1. Catálogo de 980 figuritas");

assert("Total = 980", STICKERS.length === 980, `tiene ${STICKERS.length}`);
assert("48 equipos × 20 = 960 figuritas de equipo",
  STICKERS.filter(s => s.section !== "FWC").length === 960);
assert("20 FWC especiales",
  STICKERS.filter(s => s.section === "FWC").length === 20);
assert("Primera figurita: ARG1 = número 1",
  STICKERS[0].code === "ARG1" && STICKERS[0].number === 1);
assert("Última figurita: FWC20 = número 980",
  STICKERS[979].code === "FWC20" && STICKERS[979].number === 980);
assert("Numeración secuencial sin huecos",
  STICKERS.every((s, i) => s.number === i + 1));
assert("Sin códigos duplicados",
  new Set(STICKERS.map(s => s.code)).size === 980);

// ──────────────────────────────────────────────
// 2. Búsqueda por código
// ──────────────────────────────────────────────
section("2. Búsqueda por código / número");

assert("ARG1 encontrado por código", findSticker("ARG1")?.code === "ARG1");
assert("arg1 (minúscula) encontrado", findSticker("arg1")?.code === "ARG1");
assert("BRA20 es la figurita 40", findSticker("BRA20")?.number === 40);
assert("FWC1 encontrado", findSticker("FWC1")?.section === "FWC");
assert("FWC20 encontrado", findSticker("FWC20")?.code === "FWC20");
assert("Búsqueda por número 1 → ARG1", findSticker("1")?.code === "ARG1");
assert("Búsqueda por número 980 → FWC20", findSticker("980")?.code === "FWC20");
assert("Búsqueda por número 961 → FWC1", findSticker("961")?.code === "FWC1");
assert("Código inválido → undefined", findSticker("ZZZ99") === undefined);
assert("Número 0 → undefined", findSticker("0") === undefined);
assert("Número 981 → undefined", findSticker("981") === undefined);

// Todos los equipos tienen sus 20 figuritas
for (const team of TEAMS) {
  const codes = Array.from({length: 20}, (_, i) => `${team.code}${i+1}`);
  const allFound = codes.every(c => BY_CODE.has(c));
  assert(`Equipo ${team.code}: las 20 figuritas existen`, allFound);
}

// ──────────────────────────────────────────────
// 3. Simulación de álbum de usuario
// ──────────────────────────────────────────────
section("3. Álbum de usuario — agregar y quitar");

class FakeUser {
  constructor(name) {
    this.name = name;
    this.stickersHave = [];
    this.stickersNeed = [];
    this.stickersPasted = [];
  }

  addHave(codes) {
    this.stickersHave = [...new Set([...this.stickersHave, ...codes])];
  }

  addNeed(codes) {
    this.stickersNeed = [...new Set([...this.stickersNeed, ...codes])];
  }

  markPasted(codes) {
    this.stickersPasted = [...new Set([...this.stickersPasted, ...codes])];
    this.stickersNeed = this.stickersNeed.filter(c => !codes.includes(c));
  }

  removeHave(codes) {
    this.stickersHave = this.stickersHave.filter(c => !codes.includes(c));
  }

  removeNeed(codes) {
    this.stickersNeed = this.stickersNeed.filter(c => !codes.includes(c));
  }
}

const juan = new FakeUser("Juan");
juan.addHave(["ARG1", "ARG2", "ARG3", "BRA1", "BRA2"]);
juan.addNeed(["FRA1", "FRA2", "FWC1", "FWC2"]);

assert("Juan tiene 5 repetidas", juan.stickersHave.length === 5);
assert("Juan tiene 4 faltantes", juan.stickersNeed.length === 4);

// Agregar duplicados no aumenta el array
juan.addHave(["ARG1", "ARG2"]);
assert("No hay duplicados al agregar repetidas", juan.stickersHave.length === 5);

// Quitar figurita
juan.removeHave(["ARG1"]);
assert("Quitar repetida funciona", juan.stickersHave.length === 4);
assert("ARG1 ya no está en repetidas", !juan.stickersHave.includes("ARG1"));

// Marcar como pegada
juan.markPasted(["FRA1"]);
assert("FRA1 está en pegadas", juan.stickersPasted.includes("FRA1"));
assert("FRA1 sale de faltantes al pegar", !juan.stickersNeed.includes("FRA1"));
assert("Faltantes ahora son 3", juan.stickersNeed.length === 3);

// ──────────────────────────────────────────────
// 4. Sistema de matching
// ──────────────────────────────────────────────
section("4. Sistema de matching entre usuarios");

const user1 = new FakeUser("Pepe");
user1.addHave(["ARG1", "ARG2", "BRA5", "MEX3"]);
user1.addNeed(["FRA1", "FRA2", "ENG1"]);

const user2 = new FakeUser("María");
user2.addHave(["FRA1", "FRA2", "FRA3", "ENG1"]);
user2.addNeed(["ARG1", "ARG2", "BRA5"]);

const match12 = computeMatch(
  user1.stickersHave, user1.stickersNeed,
  user2.stickersHave, user2.stickersNeed
);

assert("Match perfecto detectado", match12.isPerfect === true);
assert("María le puede dar a Pepe: FRA1, FRA2, ENG1 (3 figus)",
  match12.theyCanGive.length === 3);
assert("Pepe le puede dar a María: ARG1, ARG2, BRA5 (3 figus)",
  match12.iCanGive.length === 3);
assert("FRA1 está en 'theyCanGive'", match12.theyCanGive.includes("FRA1"));
assert("ARG1 está en 'iCanGive'", match12.iCanGive.includes("ARG1"));

// Match parcial (solo una dirección)
const user3 = new FakeUser("Carlos");
user3.addHave(["FRA1"]);
user3.addNeed(["ZZZ1"]); // No existe en el catálogo — ignorado

const match13 = computeMatch(
  user1.stickersHave, user1.stickersNeed,
  user3.stickersHave, user3.stickersNeed
);

assert("Match parcial detectado (Carlos tiene lo que Pepe necesita)",
  match13.isPartial === true);
assert("theyCanGive tiene FRA1", match13.theyCanGive.includes("FRA1"));
assert("iCanGive vacío (Carlos no necesita nada de Pepe)", match13.iCanGive.length === 0);

// Sin match
const user4 = new FakeUser("Ana");
user4.addHave(["FWC10", "FWC11"]);
user4.addNeed(["ARG10", "ARG11"]);

const match14 = computeMatch(
  user1.stickersHave, user1.stickersNeed,
  user4.stickersHave, user4.stickersNeed
);

assert("Sin match: isPerfect = false", match14.isPerfect === false);
assert("Sin match: isPartial = false", match14.isPartial === false);

// ──────────────────────────────────────────────
// 5. Carga masiva (bulk input)
// ──────────────────────────────────────────────
section("5. Carga masiva de figuritas");

function parseBulk(input) {
  const parts = input.split(/[\s,;\n]+/).filter(Boolean);
  return parts.map(p => findSticker(p)).filter(Boolean);
}

// Por código
const byCode = parseBulk("ARG1, ARG2, ARG3, BRA1 BRA2 FWC1");
assert("Carga por códigos separados por coma/espacio", byCode.length === 6);

// Por número
const byNum = parseBulk("1 2 3 40 961 980");
assert("Carga por números (1,2,3,40,961,980)", byNum.length === 6);
assert("Número 1 → ARG1", byNum[0].code === "ARG1");
assert("Número 961 → FWC1", byNum[4].code === "FWC1");
assert("Número 980 → FWC20", byNum[5].code === "FWC20");

// Mixto
const mixed = parseBulk("ARG1 2 3 BRA20 FWC5 invalid_code");
assert("Carga mixta (código + número + inválido)", mixed.length === 5);
assert("El código inválido se ignora", mixed.every(s => s !== undefined));

// Por newlines (como si pegasen una lista)
const newlines = parseBulk("ARG1\nARG2\nBRA1\nFWC3");
assert("Carga separada por saltos de línea", newlines.length === 4);

// ──────────────────────────────────────────────
// 6. Códigos por selección
// ──────────────────────────────────────────────
section("6. Códigos por selección");

const argStickers = STICKERS.filter(s => s.section === "ARG");
assert("Argentina tiene exactamente 20 figuritas", argStickers.length === 20);
assert("ARG1 es posición 1", argStickers[0].position === 1);
assert("ARG20 es posición 20", argStickers[19].position === 20);

const fwcStickers = STICKERS.filter(s => s.section === "FWC");
assert("FWC tiene 20 figuritas especiales", fwcStickers.length === 20);

// ──────────────────────────────────────────────
// Resumen
// ──────────────────────────────────────────────
console.log(`\n${"━".repeat(50)}`);
console.log(`\x1b[33mResultados:\x1b[0m \x1b[32m${pass} pasaron\x1b[0m / \x1b[31m${fail} fallaron\x1b[0m`);
if (fail === 0) {
  console.log("\x1b[32m✅ Todos los tests pasaron\x1b[0m");
  process.exit(0);
} else {
  console.log(`\x1b[31m❌ ${fail} test(s) fallaron\x1b[0m`);
  process.exit(1);
}
