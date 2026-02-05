import WorkoutModel from "./WorkoutModel";

class ShelfCurrentActivities {
    workout: WorkoutModel;
    daysLeft: number;
    maxSets?: number;
    maxReps?: number;

    constructor(workout: WorkoutModel, daysLeft: number, maxSets?: number, maxReps?: number) {
        this.workout = workout;
        this.daysLeft = daysLeft;
        this.maxSets = maxSets;
        this.maxReps = maxReps;
    }
}

export default ShelfCurrentActivities;

