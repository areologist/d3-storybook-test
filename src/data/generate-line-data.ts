export function generateLineData(weeks: number) {
  const days = (weeks || 6) * 7;
  const min = 12000;
  const max = 85000;
  const result = [];
  // seed values with random value within range
  let confirmed = Math.random() * (max - min) + min;
  let unconfirmed = Math.random() * (max - min) + min;

  for (let i = 0; i < days; i++) {
    const date = new Date(2017, 5, 11);
    const seed = Math.random() * 3000 + 1000;
    date.setDate(date.getDate() + i);
    confirmed = Math.random() * (confirmed + seed - min) + min;
    unconfirmed = Math.random() * (unconfirmed + seed - min) + min;
    result.push({
      date,
      confirmed,
      unconfirmed
    });
  }
  return result;
}