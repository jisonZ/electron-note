import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const dataFormatter = new Intl.DateTimeFormat(window.context.locale, {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'UTC'
})

export const formatDateFromMs = (ms: number) => dataFormatter.format(ms)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
