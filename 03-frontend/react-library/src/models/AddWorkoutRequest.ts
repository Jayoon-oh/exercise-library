class AddWorkoutRequest {
    title: string;
    source: string;
    description: string;
    slots: number;
    muscleGroup: string;
    img?: string;

    constructor(title: string, source: string, description: string, slots: number, muscleGroup: string) {
        this.title = title;
        this.source = source;
        this.description = description;
        this.slots = slots;
        this.muscleGroup = muscleGroup;
    }
}

export default AddWorkoutRequest;

