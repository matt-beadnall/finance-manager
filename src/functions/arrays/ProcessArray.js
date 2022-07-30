export const getLastInArray= (array) => {
    return Array.isArray(array) ? array[array.length - 1] : null
  }