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
    roles: Array<any>;
    //authority: string;
    public name : Role;

}
