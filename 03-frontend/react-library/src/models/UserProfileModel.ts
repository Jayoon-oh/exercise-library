class UserProfileModel {
    id: number;
    userEmail: string;
    gender: boolean;
    birthDate: string;

    constructor(id: number, userEmail: string, gender: boolean, birthDate: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.gender = gender;
        this.birthDate = birthDate;
    }
}

export default UserProfileModel;