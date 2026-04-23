class PointsHistoryModel {
    id: number;
    userEmail: string;
    points: number;
    reason: string;
    createdDate: string;

    constructor(id: number, userEmail: string, points: number, reason: string, createdDate: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.points = points;
        this.reason = reason;
        this.createdDate = createdDate;
    }
}

export default PointsHistoryModel;