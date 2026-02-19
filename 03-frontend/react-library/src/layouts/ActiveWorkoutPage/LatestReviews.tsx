import ReviewModel from "../../models/ReviewModel";
import { Link } from "react-router-dom"
import { Review } from "../Utils/Review"
import { useState } from "react";
import { StarsReview } from "../Utils/StarsReview"

export const LatestReviews: React.FC<{
    reviews: ReviewModel[], workoutId: number | undefined, mobile: boolean, userEmail: string | undefined, updateReview: (StarInput: number, reviewDescription: string) => Promise<void>,
    deleteReview: (reviewId: number) => Promise<void>
}> = (props) => {

    // for editing
    const [editReviewId, setEditReviewId] = useState<number | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editDescription, setEditDescription] = useState('');

    const startEdit = (review: ReviewModel) => {
        setEditReviewId(review.id);
        setEditRating(review.rating);
        setEditDescription(review.reviewDescription || '');
    };

    const cancelEdit = () => {
        setEditReviewId(null);
    };


    return (
        <div className={props.mobile ? 'mt-3' : 'row mt-5'}>
            <div className={props.mobile ? '' : 'col-sm-2 col-md-2'}>
                <h2>최근 후기: </h2>
            </div>
            <div className='col-sm-10 col-md-10'>
                {props.reviews.length > 0 ?
                    <>
                        {props.reviews.slice(0, 3).map(eachReview => (
                            <div key={eachReview.id} className="mb-3">
                                {editReviewId === eachReview.id ? (
                                    /* Editing mode */
                                    <div className="card p-3 shadow-sm">
                                        <h5>리뷰 수정하기</h5>
                                        <StarsReview rating={editRating} setRating={setEditRating} size={20} />
                                        <textarea
                                            className="form-control mt-2"
                                            rows={3}
                                            value={editDescription}
                                            onChange={e => setEditDescription(e.target.value)}
                                        />
                                        <div className="d-flex justify-content-end mt-2">
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => props.updateReview(editRating, editDescription).then(() => setEditReviewId(null))}
                                            >
                                                저장
                                            </button>
                                            <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>취소</button>
                                        </div>
                                    </div>
                                ) : (
                                    /* exsting review */
                                    <div className="card p-2 shadow-sm">
                                        <Review review={eachReview} />
                                        {/* expose editing button if user's review */}
                                        {props.userEmail === eachReview.userEmail && (
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary mt-1"
                                                    onClick={() => startEdit(eachReview)}
                                                >
                                                    리뷰 수정
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger mt-1"
                                                    onClick={() => props.deleteReview(eachReview.id)}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className='m-3'>
                            <Link type='button' className='btn main-color btn-md text-white'
                                to={`/reviewlist/${props.workoutId}`}>
                                전체 후기보기.
                            </Link>
                        </div>
                    </>
                    : <div className='m-3'>
                        <p className='lead'>
                            현재 남겨진 후기가 없습니다.
                        </p>
                    </div>
                }
            </div>
        </div>
    );
}