export class User {
    public firstname: string
    public lastname: string
    public username: string
    public email: string
    public password: string

    constructor(firstname: string, lastname: string, username: string, email: string, password: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}