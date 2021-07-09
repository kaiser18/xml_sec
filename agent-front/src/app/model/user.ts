export class User {
    public email: string
    public password: string
    public address: string

    constructor(email: string, password: string, address: string) {
        this.email = email;
        this.password = password;
        this.address = address;
    }
}