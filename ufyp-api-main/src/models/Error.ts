class UserRegisterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserRegisterError";
  }
}

export class AddStudentToClassError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AddStudentToClassError";
  }
}


export { UserRegisterError };
