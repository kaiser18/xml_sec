export class New {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    clientURI: string;


    constructor(firstname: string, lastname: string, username: string, email: string, password: string, clientURI: string) {
            this.firstname = firstname;
            this.lastname = lastname;
            this.username = username;
            this.email = email;
            this.password = password;
            this.clientURI = clientURI;
	}
}
