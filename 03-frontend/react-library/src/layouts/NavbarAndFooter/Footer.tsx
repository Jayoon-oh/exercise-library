export const Footer = () => {
    return (
        <div className='main-color'>
            <footer className='container d-flex flex-wrap justify-content-between align-items-center py-5 main-color'>
                <p className='col-md-4 mb-0 text-white'> © Exercise diary App, Inc</p>
                <ul className='nav navbar-dark col-md-4 justify-content-end'>
                    <li className='nav-item'>
                        <a href='#' className='nav-link px-2 text-white'>
                            홈
                        </a>
                    </li>
                    <a className='nav-item'>
                        <a href='#' className='nav-link px-2 text-white'>
                            검색
                        </a>
                    </a>
                </ul>
            </footer>
        </div>
    )
}