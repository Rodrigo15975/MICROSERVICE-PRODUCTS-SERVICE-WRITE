import { isSameDay, parseISO } from 'date-fns'

export function isDuplicateStartDate(
  startDate: string,
  existingCoupons: { start_date: string }[],
): boolean {
  // Convierte `startDate` a un objeto Date para compararlo
  const parsedStartDate = parseISO(startDate)

  // Compara con cada cupón existente si hay alguno con la misma `start_date`
  for (const coupon of existingCoupons) {
    const existingStartDate = parseISO(coupon.start_date)
    if (isSameDay(parsedStartDate, existingStartDate)) return true // Devuelve true si encuentra una coincidencia
  }

  return false // Devuelve false si no encuentra duplicados
}
