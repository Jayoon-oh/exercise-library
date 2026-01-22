class ReviewRequestModel {
    rating: number;
    workoutId: number;
    reviewDescription?: string;

    constructor(rating: number, workoutId: number, reviewDescription: string) {
        this.rating = rating;
        this.workoutId = workoutId;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewRequestModel;