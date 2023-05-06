export default function() {
  function getAgeId(age) {
    switch (age) {
      case '15-24':
        return 1
      case '25-54':
        return 2
      case '55-64':
        return 3
      case '25-34':
        return 4
      case '35-49':
        return 5
      case '50-54':
        return 6
      case '55-59':
        return 7
      case '60-64':
        return 8
      default:
        return -1
  }
}

  function getEducationId(education) {
    switch (education) {
      case '0-2':
        return 1
      case '3-4':
        return 2
      case '5-8':
        return 3
      case 'PRIMAR':
        return 4
      case 'GIMNAZIU':
        return 5
      case 'LICEU':
        return 6
      case 'UNIVERSITAR':
        return 7
      default:
        return -1
    }
  }

  function generateYearQuarters(start, end) {
    let result = []
    for (let i = 0; i < end - start; i++) {
      for (let j = 1; j <= 4; j++) {
        result.push(start + i + "-Q" + j)
      }
    }
    return (result)
}

const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

  return {
    getAgeId,
    getEducationId,
    generateYearQuarters,
    randomColor
  }

}
