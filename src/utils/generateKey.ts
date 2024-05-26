export const generateKey = (() => {
  let count = 0;

  return () => {
    return count++;
  };
})();
