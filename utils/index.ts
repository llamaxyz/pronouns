export const formatDate = (date: string | Date): string =>
  new Intl.DateTimeFormat('default', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date ? new Date(date) : new Date())
