import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"

export const Heros = () => {

    const { isAuthenticated } = useAuth0();

    return (
        <div>
            <div className='d-none d-lg-block'>
                <div className='row g-0 mt-5'>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-left'></div>
                    </div>
                    <div className='col-4 col-md-4 container d-flex justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>최근 어떤 운동에 집중하고 계신가요?</h1>
                            <p className='lead'>
                                Gym Rat 팀은 여러분의 운동 기록이 궁금합니다.
                                새로운 종목과 기존 루틴을 마스터하는 과정을 기록해 보세요.
                                여러분에게 딱 맞는 최고의 운동 콘텐츠를 추천해 드립니다!
                            </p>
                            {isAuthenticated ?
                                <Link type='button' className='btn main-color btn-lg text-white'
                                    to='search'>운동찾기 </Link>
                                :
                                <Link className='btn main-color btn-lg text-white' to='/login'>회원가입</Link>
                            }
                        </div>
                    </div>
                </div>
                <div className='row g-0'>
                    <div className='col-4 col-md-4 container d-flex
                    justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>매일 새로운 운동 루틴!</h1>
                            <p className='lead'>
                                매일 새로운 운동법이 추가되니 확인해 보세요!
                                저희는 Gym Rat 멤버들에게 가장 정확하고 효과적인 운동 정보를 제공하기 위해 쉬지 않고 연구합니다.
                                여러분의 성장은 저희의 최우선 과제입니다.
                            </p>
                        </div>
                    </div>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-right'></div>
                    </div>
                </div>
            </div>

            {/* Mobile Heros */}
            <div className='d-lg-none'>
                <div className='container'>
                    <div className='m-2'>
                        <div className='col-image-left'></div>
                        <div className='mt-2'>
                            <h1>최근 어떤 운동에 집중하고 계신가요?</h1>
                            <p className='lead'>
                                Gym Rat 팀은 여러분의 운동 기록이 궁금합니다.
                                새로운 종목을 배우는 과정이든,
                                기존 루틴을 마스터하는 과정이든 기록해 보세요.
                                여러분에게 딱 맞는 최고의 운동 콘텐츠를 추천해 드립니다!
                            </p>
                            {isAuthenticated ?
                                <Link type='button' className='btn main-color btn-lg text-white'
                                    to='search'>운동찾기</Link>
                                :
                                <Link className='btn main-color btn-lg text-white' to='/login'>회원가입</Link>
                            }
                        </div>
                    </div>
                    <div className='m-2'>
                        <div className='col-image-right'></div>
                        <div className='mt-2'>
                            <h1>매일 업데이트되는 새로운 운동 루틴!</h1>
                            <p className='lead'>
                                매일 새로운 운동법이 추가되니 자주 확인해 보세요!
                                저희는 Gym Rat 멤버들에게 가장 정확하고 효과적인 운동 정보를 제공하기 위해 쉬지 않고 연구합니다.
                                여러분의 성장이 저희의 최우선 과제입니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}