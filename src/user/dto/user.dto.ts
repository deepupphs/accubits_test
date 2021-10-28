//import { IFiles } from 'src/shared/file-storage/file-storage.interface';


export interface IUserInfoEntry {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    age: string;
}

export class UserInfoEntry implements IUserInfoEntry {
    constructor(userInfoEntry?: IUserInfoEntry) {
        if (userInfoEntry) {
            this.userId = userInfoEntry.userId;
            this.firstName = userInfoEntry.firstName;
            this.lastName = userInfoEntry.lastName;
            this.email = userInfoEntry.email;
            this.age = userInfoEntry.age;
        }
    }
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    age: string;
}