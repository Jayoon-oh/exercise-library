class ReviewModel {
    id: number;
    userEmail: string;
    date: string;
    rating: number;
    workoutId: number;
    reviewDescription?: string;

    constructor(id: number, userEmail: string, date: string,
                rating: number, workoutId: number, reviewDescription: string) {
                    this.id = id;
                    this.userEmail = userEmail;
                    this.date = date;
                    this.rating = rating;
                    this.workoutId = workoutId;
                    this.reviewDescription = reviewDescription;
                }
}

export default ReviewModel;