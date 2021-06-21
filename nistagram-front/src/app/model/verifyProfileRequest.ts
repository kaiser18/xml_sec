export class VerifyProfileRequest {
    Name: string;
    Surname: string;
    Category: string;
    //IdImage: string;
    username: string;

    constructor(name: string, surname: string, category: string, username: string) {//, idimage: string) {
        this.Name = name;
        this.Surname = surname;
        this.Category = category;
        //this.IdImage = idimage;
        this.username = username;
    }
}