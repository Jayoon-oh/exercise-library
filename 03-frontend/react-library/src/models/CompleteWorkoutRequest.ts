export class CompleteWorkoutRequest {
    workoutIds: number[];
    actualReps: number;
    actualSets: number;
    memo: string;

    constructor(workoutIds: number[], actualReps: number, actualSets: number, memo: string) {
        this.workoutIds = workoutIds;
        this.actualReps = actualReps;
        this.actualSets = actualSets;
        this.memo = memo;
    }
}

export default CompleteWorkoutRequest;