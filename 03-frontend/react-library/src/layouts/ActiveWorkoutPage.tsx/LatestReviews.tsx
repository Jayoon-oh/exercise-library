import ReviewModel from "../../models/ReviewModel";
import { Link } from "react-router-dom"
import { Review } from "../Utils/Review"

export const LatestReviews: React.FC<{
    reviews: ReviewModel[], workoutId: number | undefined, mobile: boolean
}> = (props) => {

    return (
        <div className={props.mobile ? 'mt-3' : 'row mt-5'}>
            <div className={props.mobile ? '' : 'col-sm-2 col-md-2'}>
                <h2>최근 후기: </h2>
            </div>
            <div className='col-sm-10 col-md-10'>
                {props.reviews.length > 0 ?
                    <>
                        {props.reviews.slice(0, 3).map(eachReview => (
                            <Review review={eachReview} key={eachReview.id}></Review>
                        ))}

                        <div className='m-3'>
                            <Link type='button' className='btn main-color btn-md text-white'
                                to='#'>
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