export class AuthenticatedUser {
    public id: string;
    public username: string;
    public token: string;

    constructor(id: string, username: string, token: string) {
        this.id = id;
        this.username = username;
        this.token = token;
    }
}