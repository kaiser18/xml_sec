export class AllVerificationRequests {
    public id: number;
    public name: string;
    public surname: string;
    public category: string;
    public approved: boolean;
    // idImage

    constructor(id: number, name: string, surname: string, category: string, approved: boolean) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.category = category;
        this.approved = approved;
    }
}