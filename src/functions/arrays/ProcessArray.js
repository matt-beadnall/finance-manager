export const getLastInArray = (array) => {
  return Array.isArray(array) ? array[array.length - 1] : null
}

export const getUniqueValues = (array) => {
  return [...new Set(array)]
}