/**
 * Normaliza una cadena eliminando espacios al inicio y al final,
 * y convirtiéndola a minúsculas.
 * @param str La cadena a normalizar.
 * @returns La cadena normalizada.
 */

export const normalizeString = (str: string | undefined): string =>
  str ? str.trim().toLowerCase() : `Not found value to normalize ${str}`
