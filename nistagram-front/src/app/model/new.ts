export class New {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;


    constructor(name: string, surname: string, username: string, email: string, password: string) {
            this.firstname = name;
            this.lastname = surname;
            this.username = username;
            this.email = email;
            this.password = password;
	}
}
