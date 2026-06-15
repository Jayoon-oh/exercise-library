import { Link } from "react-router-dom"

export const MainHeroBanner = () => {
    return (
        <div className='p-5 mb-4 bg-dark header'>
            <div className='container-fluid py-5 text-white
                d-flex justify-content-center align-items-center text-center text-md-start'>
                <div>
                    <h1 className='display-6 display-md-5 fw-bold'>나만의 스마트한 운동 일지, Gym Rat</h1>
                    <p className='col-12 col-md-8 fs-5 fs-md-4 mt-3'>당신의 성장을 기록하고 변화를 확인하세요.</p>
                    <Link type='button' className='btn main-color btn-lg text-white mt-2' to='/search'>
                        운동찾기
                    </Link>
                </div>
            </div>
        </div>
    )
}