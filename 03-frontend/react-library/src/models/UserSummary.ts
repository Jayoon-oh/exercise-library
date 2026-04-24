export class TodayWorkout {
    title: string;
    actualReps: number;
    actualSets: number;

    constructor(title: string, actualReps: number, actualSets: number) {
        this.title = title;
        this.actualReps = actualReps;
        this.actualSets = actualSets;
    }
}

class UserSummary {
    unreadMessageCount: number;
    points: number;
    todayWorkouts: TodayWorkout[];

    constructor(unreadMessageCount: number, points: number, todayWorkouts: TodayWorkout[]) {
        this.unreadMessageCount = unreadMessageCount;
        this.points = points;
        this.todayWorkouts = todayWorkouts;
    }
}


export default UserSummary;