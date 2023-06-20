function getNextPoint()
{
const x = data.map(d => d.x);
const y = data.map(d => d.y);

// Calculate the slope and y-intercept using linear regression
const sumX = x.reduce((acc, val) => acc + val, 0);
const sumY = y.reduce((acc, val) => acc + val, 0);
const sumXY = data.reduce((acc, val) => acc + val.x * val.y, 0);
const sumX2 = data.reduce((acc, val) => acc + val.x * val.x, 0);
const n = data.length;

const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
const yIntercept = (sumY - slope * sumX) / n;

// Predict the next point in the array
const nextX = data[data.length - 1].x + 1; // next quarter
const nextY = slope * nextX + yIntercept;

return nextY
}
export default function() {
  return {
    getNextPoint
  }
}
