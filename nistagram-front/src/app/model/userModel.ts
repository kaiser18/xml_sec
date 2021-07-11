export class UserModel {
    public user_id: number;
    public Name: string;
    public Surname: string;
    public Username: string;
    public Email: string;
    public password: string;
    public Gender: string;
    public Date_of_birth: string;
    public Phone: string;
    public Website: string;
    public Biography: string;
    public data: any;

    constructor(id: number, name: string, surname: string, username: string, email: string, /*fPassword: string,*/
         gender: string, date_of_birth: string, phone: string, website: string, biography: string) {
            this.user_id = id;
            this.Name = name;
            this.Surname = surname;
            this.Username = username;
            this.Email = email;
            //this.password = fPassword;
            this.Gender = gender;
            this.Date_of_birth = date_of_birth;
            this.Phone = phone;
            this.Website = website;
            this.Biography = biography;
        }
}
