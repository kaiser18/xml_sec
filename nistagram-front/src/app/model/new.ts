export class New {
    username: string;
    password: string;
    name: string;
    surnamename: string;
    email: string;
    //clientURI: string;


    constructor(name: string, surname: string, username: string, email: string, password: string) {
            this.name = name;
            this.surname = surname;
            this.username = username;
            this.email = email;
            this.password = password;
            //this.clientURI = clientURI;
	}
}
