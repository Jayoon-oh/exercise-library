import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";

export const HistoryPage = () => {

    const { isAuthenticated, user } = useAuth0();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Histories
    const [Histories, setHistories] = useState<HistoryModel[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (isAuthenticated) {
                // 24라인 부근 수정
                const url = `http://localhost:8080/api/histories/search/findByUserEmail?userEmail=${user?.email}&page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const historyResponse = await fetch(url, requestOptions);
                if (!historyResponse.ok) {
                    throw new Error("Something went wrong!");
                }
                const historyResponseJson = await historyResponse.json();

                setHistories(historyResponseJson._embedded.histories);
                setTotalPages(historyResponseJson.page.totalPages);
            }
            setIsLoadingHistory(false);

        }
        fetchUserHistory().catch((error: any) => {
            setIsLoadingHistory(false);
            setHttpError(error.message);
        })
    }, [isAuthenticated, currentPage, user])

    if (isLoadingHistory) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>(httpError)</p>
            </div>
        )
    }


    // 이미지 경로 처리 함수
    const getWorkoutImage = (imgName?: string) => {
        try {
            if (imgName) {
                return require(`./../../../Images/ExerciseImages/${imgName}`);
            }
        } catch (error) {
            // 이미지 로드 실패 시 기본 이미지
        }
        return require('./../../../Images/ExerciseImages/barbellrow.jpg');
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-2">
            {Histories.length > 0 ?
                <>
                    <h5>최근 기록</h5>

                    {Histories.map(history => (
                        <div key={history.id}>
                            <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <div className="d-none d-lg-block">
                                            <img src={getWorkoutImage(history.img)} width='123' height='196' alt='Workout' />
                                        </div>
                                        <div className="d-lg-none d-flex justify-content-center align-items-center">
                                            <img src={getWorkoutImage(history.img)} width='123' height='196' alt='Workout' />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card-body">
                                            <h5 className="card-title"> {history.source}</h5>
                                            <h4>{history.title}</h4>
                                            <p className="card-text">{history.description}</p>
                                            <hr />
                                            <p className="card-text"> 시작일: {history.startDate}</p>
                                            <p> 완료일: {history.completedDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))}
                </>
                :
                <>
                    <h3 className="mt-3">현재 기록이 없습니다: </h3>
                    <Link className="btn btn-primary" to={'search'}>
                        운동 추가하기
                    </Link>
                </>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}