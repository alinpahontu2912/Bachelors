export class EurostatData {
  constructor(id, countryCode, education, age, sex, quarter, val ) {
    this.countryCode = countryCode;
    this.education = education;
    this.age = age;
    this.sex = sex;
    this.quarter = quarter;
    this.val = val;
  }
}
