import WorkoutModel from "./WorkoutModel";

class ShelfCurrentActivities {
    workout: WorkoutModel;
    daysLeft: number;
    maxSets: number;

    constructor(workout: WorkoutModel, daysLeft: number, maxSets: number) {
        this.workout = workout;
        this.daysLeft = daysLeft;
        this.maxSets = maxSets;
    }
}

export default ShelfCurrentActivities;

