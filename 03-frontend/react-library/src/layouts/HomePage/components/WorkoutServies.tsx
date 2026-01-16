import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"

export const WorkoutServices = () => {
    const { isAuthenticated } = useAuth0();

    return (
        <div className='container my-5'>
            <div className='row p-4 align-items-center border shadow-lg'>
                <div className='col-lg-7 p-3'>
                    <h1 className='display-6 fw-bold'>
                        찾으시는 정보가 없으신가요?
                    </h1>
                    <p className='lead'>
                        원하는 루틴이나 특정 기구 사용법을 찾기 어려우시다면,
                        직접 문의해 주세요! 여러분의 피드백으로 더욱 풍성한 가이드를 만들어갑니다.
                    </p>
                    <div className='d-grigap-2 justify-content-md-start mb-4 mb-lg-3'>
                        {isAuthenticated ?
                            <Link type='button' className='btn main-color btn-lg text-white'
                                to='search'>문의하기</Link>
                            :
                            <Link className='btn main-color btn-lg text-white' to='/login'>로그인</Link>
                        }
                    </div>
                </div>
                <div className='col-lg-4 offset-lg-1 shadow-lg lost-image'></div>
            </div>
        </div>
    )
}