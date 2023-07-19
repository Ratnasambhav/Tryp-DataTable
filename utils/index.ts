export const getLocale = () => {
  return navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;
}

export const formatDate = (date: string) => new Date(date)
  .toLocaleDateString(getLocale(), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export const compareObjects = (objA: any, objB: any) => JSON.stringify(objA).localeCompare(objB)