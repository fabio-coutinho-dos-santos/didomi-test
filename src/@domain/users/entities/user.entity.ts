export class User {
  private _events: any;
  private _id?: string;
  constructor(private _email: string) {
    this.validate();
  }

  private validate() {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if (!this._email) {
      throw new Error('Email is required');
    }
    if (!emailPattern.test(this._email)) {
      throw new Error('Invalid email format');
    }
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get email(): string {
    return this._email;
  }

  get events(): any {
    return this._events;
  }
}
