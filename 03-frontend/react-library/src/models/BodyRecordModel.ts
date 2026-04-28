class BodyRecordModel {
    id: number;
    userEmail: string;
    weight: number;
    height: number;
    recordedDate: string;
    bmi?: number;
    bmr?: number;
    muscleMass?: number;
    bodyFatPercentage?: number;


    constructor(id: number, userEmail: string, weight: number, height: number,
        recordedDate: string, bmi: number, bmr: number,
        muscleMass: number, bodyFatPercentage: number) {
        this.id = id;
        this.userEmail = userEmail;
        this.weight = weight;
        this.height = height;
        this.recordedDate = recordedDate;
        this.bmi = bmi;
        this.bmr = bmr;
        this.muscleMass = muscleMass;
        this.bodyFatPercentage = bodyFatPercentage;
    }
}

export default BodyRecordModel;