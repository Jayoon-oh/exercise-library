class userPointsModel {
    id: number;
    userEmail: string;
    totalPoints: number;

    constructor(id: number, userEmail: string, totalPoints: number) {
        this.id = id;
        this.userEmail = userEmail;
        this.totalPoints = totalPoints;
    }
}

export default userPointsModel;