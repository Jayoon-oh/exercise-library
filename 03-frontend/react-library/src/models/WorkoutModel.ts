class WorkoutModel {
    id: number;
    title: string;
    source?: string;
    description?: string;
    recommendedSets?: number;
    slotsAvailable?: number;
    muscleGroup?: string;
    img?: string;

    constructor(id: number, title: string, source: string, description: string,
        slots: number, recommendedSets: number, muscleGroup: string, img: string) {
        this.id = id;
        this.title = title;
        this.source = source;
        this.description = description;
        this.recommendedSets = recommendedSets;
        this.muscleGroup = muscleGroup;
        this.img = img;
    }
}

export default WorkoutModel;