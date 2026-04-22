class BodyRecordModel {
    id: number;
    userEmail: string;
    weight: number;
    height: number;
    recordedDate: string;

    constructor(id: number, userEmail: string, weight: number, height: number, recordedDate: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.weight = weight;
        this.height = height;
        this.recordedDate = recordedDate;
    }
}

export default BodyRecordModel;