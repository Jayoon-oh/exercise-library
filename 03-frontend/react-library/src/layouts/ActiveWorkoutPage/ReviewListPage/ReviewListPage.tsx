import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ReviewRequestModel from "../../../models/ReviewRequestModel";
import { StarsReview } from "../../Utils/StarsReview";

export const ReviewListPage = () => {

    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    // for editing
    const [editReviewId, setEditReviewId] = useState<number | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editDescription, setEditDescription] = useState('');
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { workoutId } = useParams<{ workoutId: string }>();

    console.log("추출된 ID 확인:", workoutId);

    useEffect(() => {

        const fetchWorkReviews = async () => {

            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByWorkoutId?workoutId=${workoutId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    workoutId: responseData[key].workoutId,
                    reviewDescription: responseData[key].reviewDescription
                });
            }

            setReviews(loadedReviews);
            setIsLoading(false);
        };

        fetchWorkReviews().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage]);

    const startEdit = (review: ReviewModel) => {
        setEditReviewId(review.id);
        setEditRating(review.rating);
        setEditDescription(review.reviewDescription || '');
    };


    async function updateReview(starInput: number, reviewDescription: string) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/update/review`;
        const accessToken = await getAccessTokenSilently();

        const reviewRequestModel = new ReviewRequestModel(starInput, Number(workoutId), reviewDescription);

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error('수정 실패');

        // update list: addapt corrected review
        setReviews(prev => prev.map(r =>
            r.id === editReviewId ? { ...r, rating: starInput, reviewDescription } : r
        ));
        setEditReviewId(null); // close editing mode

        setDisplaySuccess(true);
        setTimeout(() => setDisplaySuccess(false), 3000);
    }


    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="container -5">
                <p>{httpError}</p>
            </div>
        )
    }

    async function deleteReview(reviewId: number) {
        if (!window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) return;

        const url = `${process.env.REACT_APP_API}/reviews/secure/delete/review?reviewId=${reviewId}`;
        const accessToken = await getAccessTokenSilently();

        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error('삭제 실패');

        // UI에서 즉시 제거
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        setTotalAmountOfReviews(prev => prev - 1);

        setDisplaySuccess(true);
        setTimeout(() => setDisplaySuccess(false), 3000);
    }
    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid my-3 my-md-5 px-3">
            {displaySuccess && (
                <div className="alert alert-success" role="alert">
                    리뷰가 처리되었습니다.
                </div>
            )}

            {/* ... Title part ... */}
            <div className="row">
                {reviews.map(review => (
                    <div key={review.id} className="col-12 mb-3">
                        {editReviewId === review.id ? (
                            /* editing mode */
                            <div className="card p-3 shadow-sm">
                                <StarsReview rating={editRating} setRating={setEditRating} size={20} />
                                <textarea
                                    className="form-control mt-2"
                                    rows={3}
                                    value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}
                                />
                                <div className="d-flex justify-content-end mt-2">
                                    <button className="btn btn-sm btn-success me-2" onClick={() => updateReview(editRating, editDescription)}>저장</button>
                                    <button className="btn btn-sm btn-secondary" onClick={() => setEditReviewId(null)}>취소</button>
                                </div>
                            </div>
                        ) : (
                            /* existing review */
                            <div className="card p-2 shadow-sm">
                                <Review review={review} />
                                {isAuthenticated && user?.email === review.userEmail && (
                                    <div className="d-flex justify-content-end gap-2 mt-1 flex-wrap">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(review)}>수정</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteReview(review.id)}>
                                            삭제
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}

