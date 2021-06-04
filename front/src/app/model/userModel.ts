export class UserModel {
    public name: string;
    public surname: string;
    public username: string;
    public email: string;
    public password: string;

    constructor(fName: string, fSurname: string, fUsername: string,
        fEmail: string, fPassword: string) {
            this.name = fName;
            this.surname = fSurname;
            this.username = fUsername;
            this.email = fEmail;
            this.password = fPassword;
        }
}
