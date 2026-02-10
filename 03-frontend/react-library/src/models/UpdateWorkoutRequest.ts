class UpdateWorkoutRequest {
    id: number;
    title: string;
    source: string;
    description: string;
    slots: number;
    muscleGroup: string;
    img?: string;

    constructor(id: number, title: string, source: string, description: string, slots: number, muscleGroup: string) {
        this.id = id;
        this.title = title;
        this.source = source;
        this.description = description;
        this.slots = slots;
        this.muscleGroup = muscleGroup;
    }
}

export default UpdateWorkoutRequest;

