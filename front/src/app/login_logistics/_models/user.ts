import { Role } from './role';

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    authdata?: string;
    accessToken?: string;
    authorities: Array<any>;
    //authority: string;
    public authority : Role;
}
