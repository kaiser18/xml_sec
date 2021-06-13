export class Authentication {
    email: string;
    password: string;
    verificationCode: string;

    constructor(email: string, password: string, verificationCode: string) {
        this.email = email;
        this.password = password;
        this.verificationCode = verificationCode;
    }
}