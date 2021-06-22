export class UpdateVerificationRequestStatus {
    public id: number;
    public approved: boolean;

    constructor(id: number, approved: boolean) {
        this.id = id;
        this.approved = approved;
    }
}