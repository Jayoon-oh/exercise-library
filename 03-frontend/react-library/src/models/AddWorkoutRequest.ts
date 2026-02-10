class AddWorkoutRequest {
    title: string;
    source: string;
    description: string;
    recommendedSets: number;
    muscleGroup: string;
    img?: string;

    constructor(title: string, source: string, description: string, recommendedSets: number, muscleGroup: string) {
        this.title = title;
        this.source = source;
        this.description = description;
        this.recommendedSets = recommendedSets;
        this.muscleGroup = muscleGroup;
    }
}

export default AddWorkoutRequest;

