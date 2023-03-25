export class User {
  constructor(email, hashpass, jobId) {
    this.email = email
    this.hashPassword = hashpass
    this.job = jobId
    this.permission = 1;
  }
}
