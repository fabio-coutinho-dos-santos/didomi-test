export class User {
  private emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  private _events: any;
  constructor(private _email: string) {
    this.validate();
  }

  private validate() {
    if (!this._email) {
      throw new Error('Email is required');
    }
    if (!this.emailPattern.test(this._email)) {
      throw new Error('Invalid email format');
    }
  }

  get email(): string {
    return this._email;
  }

  get events(): any {
    return this._events;
  }
}
