import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom";

export const MyPage = () => {
    const { user } = useAuth0();

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <div className="d-flex align-items-center mb-4">
                    {/* user profile */}
                    <img
                        src={user?.picture}
                        alt="Profile"
                        className="rounded-circle me-3"
                        width="80"
                    />
                    <div>
                        <h3>{user?.nickname || user?.name}님, 안녕하세요!</h3>
                        <p className="text-muted">{user?.email}</p>
                    </div>
                </div>

                <hr />

                <div className="row mt-4">
                    <div className="col-md-6 mb-3">
                        <div className="card h-100 bg-light">
                            <div className="card-body text-center">
                                <h5 className="card-title">나의 Q/A 내역</h5>
                                <p className="card-text">작성한 질문과 답변을 확인하세요.</p>
                                <Link to='/messages' className="btn btn-primary">이동하기</Link>
                            </div>
                        </div>
                    </div>
                    {/* activated workouts */}
                </div>

            </div>
        </div >

    )
}