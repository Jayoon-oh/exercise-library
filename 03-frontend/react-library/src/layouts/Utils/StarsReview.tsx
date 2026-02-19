export const StarsReview: React.FC<{ rating: number, size: number, setRating?: (value: number) => void }> = (props) => {

    const { rating, size, setRating } = props;

    const handleStarClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (!setRating) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; // 클릭된 위치의 x좌표

        // 별 하나(rect.width)의 절반보다 왼쪽이면 0.5, 오른쪽이면 1.0 추가
        const value = x < rect.width / 2 ? index + 0.5 : index + 1.0;
        setRating(value);
    };

    return (
        <div className='d-inline-flex align-items-center'>
            {/* 5개의 별을 순회하며 생성 (index: 0, 1, 2, 3, 4) */}
            {[...Array(5)].map((_, i) => {
                const starIndex = i; // 현재 별의 인덱스
                const starValue = i + 1; // 현재 별이 나타내는 정수 값

                return (
                    <div
                        key={i}
                        onClick={(e) => handleStarClick(e, starIndex)}
                        style={{
                            cursor: setRating ? "pointer" : "default",
                            display: "inline-flex",
                            width: size,
                            height: size
                        }}
                    >
                        {/* 1. 꽉 찬 별: 평점이 현재 별 값보다 크거나 같을 때 */}
                        {rating >= starValue ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-star-fill" style={{ color: "gold" }} viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                        )
                            /* 2. 반 별: 평점이 현재 별 값보다 0.5 작을 때 (예: 평점 3.5인데 4번째 별일 때) */
                            : rating >= starValue - 0.5 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-star-half" style={{ color: "gold" }} viewBox="0 0 16 16">
                                    <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z" />
                                </svg>
                            )
                                /* 3. 빈 별: 그 외의 경우 */
                                : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-star" style={{ color: "gold" }} viewBox="0 0 16 16">
                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                                    </svg>
                                )}
                    </div>
                );
            })}
        </div>
    );
};