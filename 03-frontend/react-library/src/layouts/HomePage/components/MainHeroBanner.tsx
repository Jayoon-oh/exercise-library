import { Link } from "react-router-dom"

interface MainHeroBannerProps {
    title?: string;
    description?: string;
    buttonText?: string;
}

export const MainHeroBanner = ({
    title = "나만의 스마트한 운동 일지, Gym Rat",
    description = "당신의 성장을 기록하고 변화를 확인하세요.",
    buttonText = "운동찾기"
}: MainHeroBannerProps) => {
    return (
        <div className='p-4 py-4 py-md-5 mb-4 bg-dark header d-flex align-items-center'>
            <div className='container-fluid text-white text-start'>
                <div>
                    <h1 className='display-6 display-md-5 fw-bold ln-base'>{title}</h1>
                    <p className='col-12 col-md-8 fs-5 fs-md-4 mt-2'>{description}</p>
                    <Link type='button' className='btn main-color btn-md text-white mt-2' to='/search'>
                        {buttonText}
                    </Link>
                </div>
            </div>
        </div>
    )
}