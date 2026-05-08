export class TodayWorkout {
    title: string;
    actualReps: number;
    actualSets: number;
    img: string;

    constructor(title: string, actualReps: number, actualSets: number, img: string) {
        this.title = title;
        this.actualReps = actualReps;
        this.actualSets = actualSets;
        this.img = img;
    }
}

class UserSummary {
    unreadMessageCount: number;
    points: number;
    todayWorkouts: TodayWorkout[];
    todayRoutineCount: number;
    recentMemos: string[];
    recentMemoDates: string[];

    constructor(unreadMessageCount: number, points: number, todayWorkouts: TodayWorkout[], todayRoutineCount: number,
        recentMemos: string[], recentMemoDates: string[]
    ) {
        this.unreadMessageCount = unreadMessageCount;
        this.points = points;
        this.todayWorkouts = todayWorkouts;
        this.todayRoutineCount = todayRoutineCount;
        this.recentMemos = recentMemos;
        this.recentMemoDates = recentMemoDates;
    }
}

export default UserSummary;