export type Team = {
  name: string;
  short: string;
  primary: string;
  secondary: string;
  pattern: "stripes" | "halves" | "sash" | "solid" | "hoops";
};

export const TEAMS: Team[] = [
  { name: "A", short: "A", primary: "#111111", secondary: "#FFFFFF", pattern: "sash" },
  { name: "B", short: "B", primary: "#D62828", secondary: "#111111", pattern: "halves" },
  { name: "Los Papus", short: "LP", primary: "#0E9F4F", secondary: "#FFFFFF", pattern: "stripes" },
  { name: "Tercero", short: "3º", primary: "#D62828", secondary: "#FFFFFF", pattern: "stripes" },
  { name: "Auxi", short: "AX", primary: "#FFC93C", secondary: "#FFFFFF", pattern: "hoops" },
  { name: "Matadores", short: "M", primary: "#B00020", secondary: "#121212", pattern: "stripes" },
];
