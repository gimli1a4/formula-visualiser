/**
 * elements.js — Pure element data module. No imports.
 *
 * Contains data for all 118 elements. Keys are the canonical element symbol
 * (title-case, e.g. "H", "He", "Na", "Cl"). Accurate data for the ~53 most
 * chemically relevant elements; reasonable values for the rest.
 *
 * CPK colors follow the Jmol standard.
 *
 * Fields per element:
 *   symbol       — canonical symbol string (matches the key)
 *   name         — full element name
 *   atomicNumber — Z value (integer)
 *   mass         — standard atomic weight (u)
 *   cpk          — Jmol CPK hex color string
 *   vdwRadius    — van der Waals radius in Ångströms
 *   group        — IUPAC group number 1-18, or null for lanthanides/actinides
 *   period       — period number 1-7
 */

export const ELEMENTS = {
  // --- Period 1 ---
  H: {
    symbol: 'H', name: 'Hydrogen', atomicNumber: 1, mass: 1.008,
    cpk: '#ffffff', vdwRadius: 1.20, group: 1, period: 1,
  },
  He: {
    symbol: 'He', name: 'Helium', atomicNumber: 2, mass: 4.0026,
    cpk: '#d9ffff', vdwRadius: 1.40, group: 18, period: 1,
  },

  // --- Period 2 ---
  Li: {
    symbol: 'Li', name: 'Lithium', atomicNumber: 3, mass: 6.941,
    cpk: '#cc80ff', vdwRadius: 1.82, group: 1, period: 2,
  },
  Be: {
    symbol: 'Be', name: 'Beryllium', atomicNumber: 4, mass: 9.0122,
    cpk: '#c2ff00', vdwRadius: 1.53, group: 2, period: 2,
  },
  B: {
    symbol: 'B', name: 'Boron', atomicNumber: 5, mass: 10.81,
    cpk: '#ffb5b5', vdwRadius: 1.92, group: 13, period: 2,
  },
  C: {
    symbol: 'C', name: 'Carbon', atomicNumber: 6, mass: 12.011,
    cpk: '#909090', vdwRadius: 1.70, group: 14, period: 2,
  },
  N: {
    symbol: 'N', name: 'Nitrogen', atomicNumber: 7, mass: 14.007,
    cpk: '#3050f8', vdwRadius: 1.55, group: 15, period: 2,
  },
  O: {
    symbol: 'O', name: 'Oxygen', atomicNumber: 8, mass: 15.999,
    cpk: '#ff0d0d', vdwRadius: 1.52, group: 16, period: 2,
  },
  F: {
    symbol: 'F', name: 'Fluorine', atomicNumber: 9, mass: 18.998,
    cpk: '#90e050', vdwRadius: 1.47, group: 17, period: 2,
  },
  Ne: {
    symbol: 'Ne', name: 'Neon', atomicNumber: 10, mass: 20.180,
    cpk: '#b3e3f5', vdwRadius: 1.54, group: 18, period: 2,
  },

  // --- Period 3 ---
  Na: {
    symbol: 'Na', name: 'Sodium', atomicNumber: 11, mass: 22.990,
    cpk: '#ab5cf2', vdwRadius: 2.27, group: 1, period: 3,
  },
  Mg: {
    symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, mass: 24.305,
    cpk: '#8aff00', vdwRadius: 1.73, group: 2, period: 3,
  },
  Al: {
    symbol: 'Al', name: 'Aluminium', atomicNumber: 13, mass: 26.982,
    cpk: '#bfa6a6', vdwRadius: 1.84, group: 13, period: 3,
  },
  Si: {
    symbol: 'Si', name: 'Silicon', atomicNumber: 14, mass: 28.085,
    cpk: '#f0c8a0', vdwRadius: 2.10, group: 14, period: 3,
  },
  P: {
    symbol: 'P', name: 'Phosphorus', atomicNumber: 15, mass: 30.974,
    cpk: '#ff8000', vdwRadius: 1.80, group: 15, period: 3,
  },
  S: {
    symbol: 'S', name: 'Sulfur', atomicNumber: 16, mass: 32.06,
    cpk: '#ffff30', vdwRadius: 1.80, group: 16, period: 3,
  },
  Cl: {
    symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, mass: 35.45,
    cpk: '#1ff01f', vdwRadius: 1.75, group: 17, period: 3,
  },
  Ar: {
    symbol: 'Ar', name: 'Argon', atomicNumber: 18, mass: 39.948,
    cpk: '#80d1e3', vdwRadius: 1.88, group: 18, period: 3,
  },

  // --- Period 4 ---
  K: {
    symbol: 'K', name: 'Potassium', atomicNumber: 19, mass: 39.098,
    cpk: '#8f40d4', vdwRadius: 2.75, group: 1, period: 4,
  },
  Ca: {
    symbol: 'Ca', name: 'Calcium', atomicNumber: 20, mass: 40.078,
    cpk: '#3dff00', vdwRadius: 2.31, group: 2, period: 4,
  },
  Sc: {
    symbol: 'Sc', name: 'Scandium', atomicNumber: 21, mass: 44.956,
    cpk: '#e6e6e6', vdwRadius: 2.15, group: 3, period: 4,
  },
  Ti: {
    symbol: 'Ti', name: 'Titanium', atomicNumber: 22, mass: 47.867,
    cpk: '#bfc2c7', vdwRadius: 2.11, group: 4, period: 4,
  },
  V: {
    symbol: 'V', name: 'Vanadium', atomicNumber: 23, mass: 50.942,
    cpk: '#a6a6ab', vdwRadius: 2.07, group: 5, period: 4,
  },
  Cr: {
    symbol: 'Cr', name: 'Chromium', atomicNumber: 24, mass: 51.996,
    cpk: '#8a99c7', vdwRadius: 2.06, group: 6, period: 4,
  },
  Mn: {
    symbol: 'Mn', name: 'Manganese', atomicNumber: 25, mass: 54.938,
    cpk: '#9c7ac7', vdwRadius: 2.05, group: 7, period: 4,
  },
  Fe: {
    symbol: 'Fe', name: 'Iron', atomicNumber: 26, mass: 55.845,
    cpk: '#e06633', vdwRadius: 2.04, group: 8, period: 4,
  },
  Co: {
    symbol: 'Co', name: 'Cobalt', atomicNumber: 27, mass: 58.933,
    cpk: '#f090a0', vdwRadius: 2.00, group: 9, period: 4,
  },
  Ni: {
    symbol: 'Ni', name: 'Nickel', atomicNumber: 28, mass: 58.693,
    cpk: '#50d050', vdwRadius: 1.97, group: 10, period: 4,
  },
  Cu: {
    symbol: 'Cu', name: 'Copper', atomicNumber: 29, mass: 63.546,
    cpk: '#c88033', vdwRadius: 1.96, group: 11, period: 4,
  },
  Zn: {
    symbol: 'Zn', name: 'Zinc', atomicNumber: 30, mass: 65.38,
    cpk: '#7d80b0', vdwRadius: 2.01, group: 12, period: 4,
  },
  Ga: {
    symbol: 'Ga', name: 'Gallium', atomicNumber: 31, mass: 69.723,
    cpk: '#c28f8f', vdwRadius: 1.87, group: 13, period: 4,
  },
  Ge: {
    symbol: 'Ge', name: 'Germanium', atomicNumber: 32, mass: 72.630,
    cpk: '#668f8f', vdwRadius: 2.11, group: 14, period: 4,
  },
  As: {
    symbol: 'As', name: 'Arsenic', atomicNumber: 33, mass: 74.922,
    cpk: '#bd80e3', vdwRadius: 1.85, group: 15, period: 4,
  },
  Se: {
    symbol: 'Se', name: 'Selenium', atomicNumber: 34, mass: 78.971,
    cpk: '#ffa100', vdwRadius: 1.90, group: 16, period: 4,
  },
  Br: {
    symbol: 'Br', name: 'Bromine', atomicNumber: 35, mass: 79.904,
    cpk: '#a62929', vdwRadius: 1.85, group: 17, period: 4,
  },
  Kr: {
    symbol: 'Kr', name: 'Krypton', atomicNumber: 36, mass: 83.798,
    cpk: '#5cb8d1', vdwRadius: 2.02, group: 18, period: 4,
  },

  // --- Period 5 ---
  Rb: {
    symbol: 'Rb', name: 'Rubidium', atomicNumber: 37, mass: 85.468,
    cpk: '#702eb0', vdwRadius: 3.03, group: 1, period: 5,
  },
  Sr: {
    symbol: 'Sr', name: 'Strontium', atomicNumber: 38, mass: 87.62,
    cpk: '#00ff00', vdwRadius: 2.49, group: 2, period: 5,
  },
  Y: {
    symbol: 'Y', name: 'Yttrium', atomicNumber: 39, mass: 88.906,
    cpk: '#94ffff', vdwRadius: 2.32, group: 3, period: 5,
  },
  Zr: {
    symbol: 'Zr', name: 'Zirconium', atomicNumber: 40, mass: 91.224,
    cpk: '#94e0e0', vdwRadius: 2.23, group: 4, period: 5,
  },
  Nb: {
    symbol: 'Nb', name: 'Niobium', atomicNumber: 41, mass: 92.906,
    cpk: '#73c2c9', vdwRadius: 2.18, group: 5, period: 5,
  },
  Mo: {
    symbol: 'Mo', name: 'Molybdenum', atomicNumber: 42, mass: 95.95,
    cpk: '#54b5b5', vdwRadius: 2.17, group: 6, period: 5,
  },
  Tc: {
    symbol: 'Tc', name: 'Technetium', atomicNumber: 43, mass: 98,
    cpk: '#3b9e9e', vdwRadius: 2.16, group: 7, period: 5,
  },
  Ru: {
    symbol: 'Ru', name: 'Ruthenium', atomicNumber: 44, mass: 101.07,
    cpk: '#248f8f', vdwRadius: 2.13, group: 8, period: 5,
  },
  Rh: {
    symbol: 'Rh', name: 'Rhodium', atomicNumber: 45, mass: 102.91,
    cpk: '#0a7d8c', vdwRadius: 2.10, group: 9, period: 5,
  },
  Pd: {
    symbol: 'Pd', name: 'Palladium', atomicNumber: 46, mass: 106.42,
    cpk: '#006985', vdwRadius: 2.10, group: 10, period: 5,
  },
  Ag: {
    symbol: 'Ag', name: 'Silver', atomicNumber: 47, mass: 107.87,
    cpk: '#c0c0c0', vdwRadius: 2.11, group: 11, period: 5,
  },
  Cd: {
    symbol: 'Cd', name: 'Cadmium', atomicNumber: 48, mass: 112.41,
    cpk: '#ffd98f', vdwRadius: 2.18, group: 12, period: 5,
  },
  In: {
    symbol: 'In', name: 'Indium', atomicNumber: 49, mass: 114.82,
    cpk: '#a67573', vdwRadius: 1.93, group: 13, period: 5,
  },
  Sn: {
    symbol: 'Sn', name: 'Tin', atomicNumber: 50, mass: 118.71,
    cpk: '#668080', vdwRadius: 2.17, group: 14, period: 5,
  },
  Sb: {
    symbol: 'Sb', name: 'Antimony', atomicNumber: 51, mass: 121.76,
    cpk: '#9e63b5', vdwRadius: 2.06, group: 15, period: 5,
  },
  Te: {
    symbol: 'Te', name: 'Tellurium', atomicNumber: 52, mass: 127.60,
    cpk: '#d47a00', vdwRadius: 2.06, group: 16, period: 5,
  },
  I: {
    symbol: 'I', name: 'Iodine', atomicNumber: 53, mass: 126.90,
    cpk: '#940094', vdwRadius: 1.98, group: 17, period: 5,
  },
  Xe: {
    symbol: 'Xe', name: 'Xenon', atomicNumber: 54, mass: 131.29,
    cpk: '#429eb0', vdwRadius: 2.16, group: 18, period: 5,
  },

  // --- Period 6 ---
  Cs: {
    symbol: 'Cs', name: 'Caesium', atomicNumber: 55, mass: 132.91,
    cpk: '#57178f', vdwRadius: 3.43, group: 1, period: 6,
  },
  Ba: {
    symbol: 'Ba', name: 'Barium', atomicNumber: 56, mass: 137.33,
    cpk: '#00c900', vdwRadius: 2.68, group: 2, period: 6,
  },
  // Lanthanides (Z 57-71) — group null
  La: {
    symbol: 'La', name: 'Lanthanum', atomicNumber: 57, mass: 138.91,
    cpk: '#70d4ff', vdwRadius: 2.43, group: null, period: 6,
  },
  Ce: {
    symbol: 'Ce', name: 'Cerium', atomicNumber: 58, mass: 140.12,
    cpk: '#ffffc7', vdwRadius: 2.42, group: null, period: 6,
  },
  Pr: {
    symbol: 'Pr', name: 'Praseodymium', atomicNumber: 59, mass: 140.91,
    cpk: '#d9ffc7', vdwRadius: 2.40, group: null, period: 6,
  },
  Nd: {
    symbol: 'Nd', name: 'Neodymium', atomicNumber: 60, mass: 144.24,
    cpk: '#c7ffc7', vdwRadius: 2.39, group: null, period: 6,
  },
  Pm: {
    symbol: 'Pm', name: 'Promethium', atomicNumber: 61, mass: 145,
    cpk: '#a3ffc7', vdwRadius: 2.38, group: null, period: 6,
  },
  Sm: {
    symbol: 'Sm', name: 'Samarium', atomicNumber: 62, mass: 150.36,
    cpk: '#8fffc7', vdwRadius: 2.36, group: null, period: 6,
  },
  Eu: {
    symbol: 'Eu', name: 'Europium', atomicNumber: 63, mass: 151.96,
    cpk: '#61ffc7', vdwRadius: 2.35, group: null, period: 6,
  },
  Gd: {
    symbol: 'Gd', name: 'Gadolinium', atomicNumber: 64, mass: 157.25,
    cpk: '#45ffc7', vdwRadius: 2.34, group: null, period: 6,
  },
  Tb: {
    symbol: 'Tb', name: 'Terbium', atomicNumber: 65, mass: 158.93,
    cpk: '#30ffc7', vdwRadius: 2.33, group: null, period: 6,
  },
  Dy: {
    symbol: 'Dy', name: 'Dysprosium', atomicNumber: 66, mass: 162.50,
    cpk: '#1fffc7', vdwRadius: 2.31, group: null, period: 6,
  },
  Ho: {
    symbol: 'Ho', name: 'Holmium', atomicNumber: 67, mass: 164.93,
    cpk: '#00ff9c', vdwRadius: 2.30, group: null, period: 6,
  },
  Er: {
    symbol: 'Er', name: 'Erbium', atomicNumber: 68, mass: 167.26,
    cpk: '#00e675', vdwRadius: 2.29, group: null, period: 6,
  },
  Tm: {
    symbol: 'Tm', name: 'Thulium', atomicNumber: 69, mass: 168.93,
    cpk: '#00d452', vdwRadius: 2.27, group: null, period: 6,
  },
  Yb: {
    symbol: 'Yb', name: 'Ytterbium', atomicNumber: 70, mass: 173.05,
    cpk: '#00bf38', vdwRadius: 2.26, group: null, period: 6,
  },
  Lu: {
    symbol: 'Lu', name: 'Lutetium', atomicNumber: 71, mass: 174.97,
    cpk: '#00ab24', vdwRadius: 2.24, group: 3, period: 6,
  },
  Hf: {
    symbol: 'Hf', name: 'Hafnium', atomicNumber: 72, mass: 178.49,
    cpk: '#4dc2ff', vdwRadius: 2.23, group: 4, period: 6,
  },
  Ta: {
    symbol: 'Ta', name: 'Tantalum', atomicNumber: 73, mass: 180.95,
    cpk: '#4da6ff', vdwRadius: 2.22, group: 5, period: 6,
  },
  W: {
    symbol: 'W', name: 'Tungsten', atomicNumber: 74, mass: 183.84,
    cpk: '#2194d6', vdwRadius: 2.18, group: 6, period: 6,
  },
  Re: {
    symbol: 'Re', name: 'Rhenium', atomicNumber: 75, mass: 186.21,
    cpk: '#267dab', vdwRadius: 2.16, group: 7, period: 6,
  },
  Os: {
    symbol: 'Os', name: 'Osmium', atomicNumber: 76, mass: 190.23,
    cpk: '#266696', vdwRadius: 2.16, group: 8, period: 6,
  },
  Ir: {
    symbol: 'Ir', name: 'Iridium', atomicNumber: 77, mass: 192.22,
    cpk: '#175487', vdwRadius: 2.13, group: 9, period: 6,
  },
  Pt: {
    symbol: 'Pt', name: 'Platinum', atomicNumber: 78, mass: 195.08,
    cpk: '#d0d0e0', vdwRadius: 2.13, group: 10, period: 6,
  },
  Au: {
    symbol: 'Au', name: 'Gold', atomicNumber: 79, mass: 196.97,
    cpk: '#ffd123', vdwRadius: 2.14, group: 11, period: 6,
  },
  Hg: {
    symbol: 'Hg', name: 'Mercury', atomicNumber: 80, mass: 200.59,
    cpk: '#b8b8d0', vdwRadius: 2.23, group: 12, period: 6,
  },
  Tl: {
    symbol: 'Tl', name: 'Thallium', atomicNumber: 81, mass: 204.38,
    cpk: '#a6544d', vdwRadius: 1.96, group: 13, period: 6,
  },
  Pb: {
    symbol: 'Pb', name: 'Lead', atomicNumber: 82, mass: 207.2,
    cpk: '#575961', vdwRadius: 2.02, group: 14, period: 6,
  },
  Bi: {
    symbol: 'Bi', name: 'Bismuth', atomicNumber: 83, mass: 208.98,
    cpk: '#9e4fb5', vdwRadius: 2.07, group: 15, period: 6,
  },
  Po: {
    symbol: 'Po', name: 'Polonium', atomicNumber: 84, mass: 209,
    cpk: '#ab5c00', vdwRadius: 1.97, group: 16, period: 6,
  },
  At: {
    symbol: 'At', name: 'Astatine', atomicNumber: 85, mass: 210,
    cpk: '#754f45', vdwRadius: 2.02, group: 17, period: 6,
  },
  Rn: {
    symbol: 'Rn', name: 'Radon', atomicNumber: 86, mass: 222,
    cpk: '#428296', vdwRadius: 2.20, group: 18, period: 6,
  },

  // --- Period 7 ---
  Fr: {
    symbol: 'Fr', name: 'Francium', atomicNumber: 87, mass: 223,
    cpk: '#420066', vdwRadius: 3.48, group: 1, period: 7,
  },
  Ra: {
    symbol: 'Ra', name: 'Radium', atomicNumber: 88, mass: 226,
    cpk: '#007d00', vdwRadius: 2.83, group: 2, period: 7,
  },
  // Actinides (Z 89-103) — group null
  Ac: {
    symbol: 'Ac', name: 'Actinium', atomicNumber: 89, mass: 227,
    cpk: '#70abfa', vdwRadius: 2.60, group: null, period: 7,
  },
  Th: {
    symbol: 'Th', name: 'Thorium', atomicNumber: 90, mass: 232.04,
    cpk: '#00baff', vdwRadius: 2.37, group: null, period: 7,
  },
  Pa: {
    symbol: 'Pa', name: 'Protactinium', atomicNumber: 91, mass: 231.04,
    cpk: '#00a1ff', vdwRadius: 2.43, group: null, period: 7,
  },
  U: {
    symbol: 'U', name: 'Uranium', atomicNumber: 92, mass: 238.03,
    cpk: '#008fff', vdwRadius: 2.41, group: null, period: 7,
  },
  Np: {
    symbol: 'Np', name: 'Neptunium', atomicNumber: 93, mass: 237,
    cpk: '#0080ff', vdwRadius: 2.39, group: null, period: 7,
  },
  Pu: {
    symbol: 'Pu', name: 'Plutonium', atomicNumber: 94, mass: 244,
    cpk: '#006bff', vdwRadius: 2.43, group: null, period: 7,
  },
  Am: {
    symbol: 'Am', name: 'Americium', atomicNumber: 95, mass: 243,
    cpk: '#545cf2', vdwRadius: 2.44, group: null, period: 7,
  },
  Cm: {
    symbol: 'Cm', name: 'Curium', atomicNumber: 96, mass: 247,
    cpk: '#785ce3', vdwRadius: 2.45, group: null, period: 7,
  },
  Bk: {
    symbol: 'Bk', name: 'Berkelium', atomicNumber: 97, mass: 247,
    cpk: '#8a4fe3', vdwRadius: 2.44, group: null, period: 7,
  },
  Cf: {
    symbol: 'Cf', name: 'Californium', atomicNumber: 98, mass: 251,
    cpk: '#a136d4', vdwRadius: 2.45, group: null, period: 7,
  },
  Es: {
    symbol: 'Es', name: 'Einsteinium', atomicNumber: 99, mass: 252,
    cpk: '#b31fd4', vdwRadius: 2.45, group: null, period: 7,
  },
  Fm: {
    symbol: 'Fm', name: 'Fermium', atomicNumber: 100, mass: 257,
    cpk: '#b31fba', vdwRadius: 2.45, group: null, period: 7,
  },
  Md: {
    symbol: 'Md', name: 'Mendelevium', atomicNumber: 101, mass: 258,
    cpk: '#b30da6', vdwRadius: 2.46, group: null, period: 7,
  },
  No: {
    symbol: 'No', name: 'Nobelium', atomicNumber: 102, mass: 259,
    cpk: '#bd0d87', vdwRadius: 2.46, group: null, period: 7,
  },
  Lr: {
    symbol: 'Lr', name: 'Lawrencium', atomicNumber: 103, mass: 266,
    cpk: '#c70066', vdwRadius: 2.46, group: 3, period: 7,
  },
  Rf: {
    symbol: 'Rf', name: 'Rutherfordium', atomicNumber: 104, mass: 267,
    cpk: '#cc0059', vdwRadius: 2.00, group: 4, period: 7,
  },
  Db: {
    symbol: 'Db', name: 'Dubnium', atomicNumber: 105, mass: 268,
    cpk: '#d1004f', vdwRadius: 2.00, group: 5, period: 7,
  },
  Sg: {
    symbol: 'Sg', name: 'Seaborgium', atomicNumber: 106, mass: 269,
    cpk: '#d90045', vdwRadius: 2.00, group: 6, period: 7,
  },
  Bh: {
    symbol: 'Bh', name: 'Bohrium', atomicNumber: 107, mass: 270,
    cpk: '#e00038', vdwRadius: 2.00, group: 7, period: 7,
  },
  Hs: {
    symbol: 'Hs', name: 'Hassium', atomicNumber: 108, mass: 277,
    cpk: '#e6002e', vdwRadius: 2.00, group: 8, period: 7,
  },
  Mt: {
    symbol: 'Mt', name: 'Meitnerium', atomicNumber: 109, mass: 278,
    cpk: '#eb0026', vdwRadius: 2.00, group: 9, period: 7,
  },
  Ds: {
    symbol: 'Ds', name: 'Darmstadtium', atomicNumber: 110, mass: 281,
    cpk: '#ff69b4', vdwRadius: 2.00, group: 10, period: 7,
  },
  Rg: {
    symbol: 'Rg', name: 'Roentgenium', atomicNumber: 111, mass: 282,
    cpk: '#ff69b4', vdwRadius: 2.00, group: 11, period: 7,
  },
  Cn: {
    symbol: 'Cn', name: 'Copernicium', atomicNumber: 112, mass: 285,
    cpk: '#ff69b4', vdwRadius: 2.00, group: 12, period: 7,
  },
  Nh: {
    symbol: 'Nh', name: 'Nihonium', atomicNumber: 113, mass: 286,
    cpk: '#ff69b4', vdwRadius: 2.00, group: 13, period: 7,
  },
  Fl: {
    symbol: 'Fl', name: 'Flerovium', atomicNumber: 114, mass: 289,
    cpk: '#ff69b4', vdwRadius: 2.00, group: 14, period: 7,
  },
  Mc: {
    symbol: 'Mc', name: 'Moscovium', atomicNumber: 115, mass: 290,
    cpk: '#ff69b4', vdwRadius: 2.00, group: 15, period: 7,
  },
  Lv: {
    symbol: 'Lv', name: 'Livermorium', atomicNumber: 116, mass: 293,
    cpk: '#ff69b4', vdwRadius: 2.00, group: 16, period: 7,
  },
  Ts: {
    symbol: 'Ts', name: 'Tennessine', atomicNumber: 117, mass: 294,
    cpk: '#ff69b4', vdwRadius: 2.00, group: 17, period: 7,
  },
  Og: {
    symbol: 'Og', name: 'Oganesson', atomicNumber: 118, mass: 294,
    cpk: '#ff69b4', vdwRadius: 2.00, group: 18, period: 7,
  },
};

/**
 * Noble gas symbols (Group 18). The 3D renderer uses cube geometry for these.
 * @type {Set<string>}
 */
export const NOBLE_GAS_SYMBOLS = new Set(['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn']);

/**
 * Returns element data by symbol.
 *
 * Lookup is tolerant of casing: "cl", "CL", and "Cl" all resolve to chlorine.
 * If the element is unknown, returns a hot-pink fallback descriptor.
 *
 * @param {string} symbol - Element symbol (any casing)
 * @returns {object} Element data object
 */
export function getElement(symbol) {
  if (!symbol || typeof symbol !== 'string') {
    return {
      symbol: '',
      name: '',
      atomicNumber: 0,
      mass: 0,
      cpk: '#ff69b4',
      vdwRadius: 1.5,
      group: null,
      period: null,
    };
  }

  const trimmed = symbol.trim();
  // Normalise to title-case: first char upper, rest lower (e.g. "cL" → "Cl")
  const normalised = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();

  if (Object.prototype.hasOwnProperty.call(ELEMENTS, normalised)) {
    return ELEMENTS[normalised];
  }

  // Fallback for unknown elements
  return {
    symbol: trimmed,
    name: trimmed,
    atomicNumber: 0,
    mass: 0,
    cpk: '#ff69b4',
    vdwRadius: 1.5,
    group: null,
    period: null,
  };
}
