class HistoryModel {
    id: number;
    userEmail: string;
    startDate: string;
    completedDate: string;
    title: string;
    source: string;
    description: string;
    img: string;
    actualSets: number;
    actualReps: number;
    targetSets: number;
    workoutMemo: string;

    constructor(id: number, userEmail: string, startDate: string, completedDate: string, title: string,
        source: string, description: string, img: string, actualSets: number, actualReps: number, targetSets: number, workoutMemo: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.startDate = startDate;
        this.completedDate = completedDate;
        this.title = title;
        this.source = source;
        this.description = description;
        this.img = img;
        this.actualReps = actualReps;
        this.actualSets = actualSets;
        this.targetSets = targetSets;
        this.workoutMemo = workoutMemo;
    }
}

export default HistoryModel;