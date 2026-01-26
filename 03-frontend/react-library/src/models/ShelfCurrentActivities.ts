import WorkoutModel from "./WorkoutModel";

class ShelfCurrentActivities {
    workout: WorkoutModel;
    daysLeft: number;

    constructor(workout: WorkoutModel, daysLeft: number) {
        this.workout = workout;
        this.daysLeft = daysLeft;
    }
}

export default ShelfCurrentActivities;

