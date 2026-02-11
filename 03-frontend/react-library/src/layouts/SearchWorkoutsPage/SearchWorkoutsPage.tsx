import { useEffect, useState } from "react";
import WorkoutModel from "../../models/WorkoutModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchWorkout } from "./components/SearchWorkout";
import { Pagination } from "../Utils/Pagination";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const SearchWorkoutsPage = () => {

    const { isAuthenticated } = useAuth0();
    const [workouts, setWorkouts] = useState<WorkoutModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [workoutsPerPage] = useState(5);
    const [totalAmountOfWorkouts, setTotalAmountOfWorkouts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('부위별검색');

    useEffect(() => {
        const fetchWorkouts = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/workouts`;

            let url: string = ``;

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${workoutsPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`)
                url = baseUrl + searchWithPage;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.workouts;

            setTotalAmountOfWorkouts(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedworkouts: WorkoutModel[] = [];

            for (const key in responseData) {
                loadedworkouts.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    source: responseData[key].source,
                    description: responseData[key].description,
                    recommendedSets: responseData[key].recommendedSets,
                    muscleGroup: responseData[key].muscleGroup,
                    img: responseData[key].img,
                });
            }

            setWorkouts(loadedworkouts);
            setIsLoading(false);
        };

        fetchWorkouts().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${workoutsPerPage}`)
        }
        setCategorySelection('부위별검색')
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);

        const categoryMap: { [key: string]: string } = {
            '하체': 'Lower Body',
            '등': 'Back',
            '가슴': 'Chest',
            '어깨': 'Shoulder',
            '팔': 'Arm'
        };

        const dbValue = categoryMap[value];

        if (dbValue) {
            setCategorySelection(value);
            setSearchUrl(`/search/findByMuscleGroup?muscleGroup=${encodeURIComponent(dbValue)}&page=<pageNumber>&size=${workoutsPerPage}`)
        } else {
            setCategorySelection('모두');
            setSearchUrl(`?page=<pageNumber>&size=${workoutsPerPage}`)
        }
    }

    const indexOfLastWorkout: number = currentPage * workoutsPerPage;
    const indexOfFirstWorkout: number = indexOfLastWorkout - workoutsPerPage;
    let lastItem = workoutsPerPage * currentPage <= totalAmountOfWorkouts ?
        workoutsPerPage * currentPage : totalAmountOfWorkouts;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <form onSubmit={(e) => {
                                e.preventDefault(); searchHandleChange();
                            }}>

                                <div className='input-group'>
                                    <input className='form-control me-2'
                                        type='search'
                                        placeholder='검색하기'
                                        aria-labelledby='Search'
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                    <button className='btn btn-outline-success'
                                        type='submit'>
                                        검색
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                    {categorySelection}
                                </button>
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li onClick={() => categoryField('모두')}>
                                        <a className='dropdown-item' href='#'>
                                            모두
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('하체')}>
                                        <a className='dropdown-item' href='#'>
                                            하체
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('등')}>
                                        <a className='dropdown-item' href='#'>
                                            등
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('가슴')}>
                                        <a className='dropdown-item' href='#'>
                                            가슴
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('어깨')}>
                                        <a className='dropdown-item' href='#'>
                                            어깨
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('팔')}>
                                        <a className='dropdown-item' href='#'>
                                            팔
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfWorkouts > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5>결과: ({totalAmountOfWorkouts})</h5>
                            </div>
                            <p>
                                전체 {totalAmountOfWorkouts}개 ({indexOfFirstWorkout + 1}-{lastItem})
                            </p>
                            {workouts.map(workout => (
                                <SearchWorkout workout={workout} key={workout.id} />
                            ))}
                        </>
                        :
                        <div className='container my-5'>
                            <div className="card shadow-sm border-0 rounded-4 text-center p-5 bg-light">
                                <div className="card-body py-5">
                                    {isAuthenticated ?
                                        <>
                                            <h3 className='display-6 fw-bold mb-3'>
                                                찾으시는 정보가 없으신가요?
                                            </h3>
                                            <p className="lead text-muted mb-4">
                                                원하시는 운동 정보가 없다면 관리자에게 직접 문의하여 제안하실 수 있습니다.
                                            </p>
                                            <Link type='button' className='btn main-color btn-lg px-5 shadow-sm fw-bold text-white' to='/messages'>
                                                문의하기
                                            </Link></>
                                        :
                                        <><h3 className='display-6 fw-bold mb-3'>
                                            더 많은 정보를 원하시나요?
                                        </h3>
                                            <p className="lead text-muted mb-4">
                                                로그인 후 관리자 문의가 가능합니다.
                                            </p>
                                            <Link className='btn main-color btn-lg px-5 shadow-sm fw-bold text-white' to='/login'>
                                                로그인하기
                                            </Link>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
                </div>
            </div>
        </div>
    )
}