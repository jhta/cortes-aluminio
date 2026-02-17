export type SystemResult = Record<string, number>;

export type SystemFormula = (w: number, h: number) => SystemResult;

const formulas: Record<string, SystemFormula> = {
  '520': (w, h) => ({
    cabezal: w,
    sillar: w,
    horizontal: w / 2 - 1.5,
    jamba: h - 1.5,
    eganche: h - 3,
    traslape: h - 3,
    vidrio_ancho: w / 2 - 3.3,
    vidrio_alto: h - 9.3,
  }),
  '744': (w, h) => ({
    cabezal: w,
    sillar: w,
    horizontal: w / 2,
    jamba: h - 1,
    eganche: h - 2,
    traslape: h - 2,
    vidrio_ancho: w / 2 - 5.3,
    vidrio_alto: h - 9.3,
  }),
};

export function calculate(
  systemId: string,
  width: number,
  height: number,
): SystemResult | null {
  const formula = formulas[systemId];
  if (!formula || width <= 0 || height <= 0) return null;
  return formula(width, height);
}

export function capitalize(s: string): string {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.replace(/_/g, ' ').slice(1);
}

export function formatMeasure(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}
