export const getFirstBy = <T extends Record<string, string | number>>(
  array: T[],
  property: keyof T,
): T | undefined => {
  switch (array.length) {
    case 0:
      return;
    case 1:
      return array[0];
    default: {
      if (!property) {
        return array.sort()[0];
      }
      const compareFn = (x: T, y: T): number => {
        const xValue = x[property];
        const yValue = y[property];
        const xNumber: number = typeof xValue === 'string' ? parseFloat(xValue) : xValue;
        const yNumber: number = typeof yValue === 'string' ? parseFloat(yValue) : yValue;
        return yNumber - xNumber;
      };
      return array.sort(compareFn)[0];
    }
  }
};
