import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useRef, useState } from "react";
import AddWorkoutRequest from "../../../models/AddWorkoutRequest";

export const AddNewWorkout = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    // New Workout
    const [title, setTitle] = useState('');
    const [source, setSource] = useState('');
    const [description, setDescription] = useState('');
    const [recommendedSets, setRecommendedSets] = useState(0);
    const [muscleGroup, setMuscleGroup] = useState('부위');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    //file
    const fileInputRef = useRef<HTMLInputElement>(null)

    function categoryField(value: string) {
        setMuscleGroup(value)
    }

    async function base64ConversionForImages(e: any) {
        const file = e.target.files?.[0];

        if (e.target.files && e.target.files[0]) {
            try {
                const result = await getBase64(e.target.files[0]);
                setSelectedImage(result);
            } catch (error) {
                console.error("이미지 변환 실패:", error);
                setSelectedImage(null);
            }
        } else {
            // 파일 선택 취소했을 경우 처리
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    function getBase64(file: any): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resolve(reader.result);

            };
            reader.onerror = function (error) {
                reject(error);
            };
        });
    }

    async function submitNewWorkout(e: any) {
        e.preventDefault(); // 페이지 새로고침 방지

        setDisplaySuccess(false);
        setDisplayWarning(false);

        if (!isAuthenticated ||
            title.trim() === '' ||
            source.trim() === '' ||
            muscleGroup === '부위' ||
            description.trim() === '' ||
            recommendedSets < 0 ||
            selectedImage === null) {

            setDisplayWarning(true);
            return;
        }

        const accessToken = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/admin/secure/add/workout`;
        const workout: AddWorkoutRequest = new AddWorkoutRequest(title, source, description, recommendedSets, muscleGroup);
        workout.img = selectedImage;

        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workout)
        };

        const response = await fetch(url, requestOptions);

        if (response.ok) {
            setTitle('');
            setSource('');
            setDescription('');
            setRecommendedSets(0);
            setMuscleGroup('부위');
            setSelectedImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }

    }

    return (
        <div className="container mt-5 mb-5">
            {displaySuccess &&
                <div className="alert alert-success" role='alert'>
                    운동이 성공적으로 추가 되었습니다.
                </div>
            }
            {displayWarning &&
                <div className="alert alert-danger" role='alert'>
                    모든 항목이 반드시 채워져야 합니다.
                </div>
            }
            <div className="card">
                <div className="card-header">
                    새로운 운동 추가
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">제목</label>
                            <input type="text" className="form-control" name='title' required
                                onChange={e => setTitle(e.target.value)} value={title} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">출처</label>
                            <input type="text" className="form-control" name='title' required
                                onChange={e => setSource(e.target.value)} value={source} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">분류</label>
                            <button className="form-control btn btn-secondary dropdown-toggle" type='button'
                                id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                {muscleGroup}
                            </button>
                            <ul id='addNewWorkoutId' className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a onClick={() => categoryField('하체')} className="dropdown-item">하체</a></li>
                                <li><a onClick={() => categoryField('등')} className="dropdown-item">등</a></li>
                                <li><a onClick={() => categoryField('가슴')} className="dropdown-item">가슴</a></li>
                                <li><a onClick={() => categoryField('어깨')} className="dropdown-item">어깨</a></li>
                                <li><a onClick={() => categoryField('팔')} className="dropdown-item">팔</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-12 mb-3">
                        <label className="form-label">설명</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}
                            onChange={e => setDescription(e.target.value)} value={description}></textarea>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">권장 세트수</label>
                        <input type="number" className="form-control" placeholder="5" name='세트수' required
                            onChange={e => setRecommendedSets(Number(e.target.value))} value={recommendedSets} />
                    </div>
                    <div className="mt-3 mb-3">
                        <label className="form-label">이미지 미리보기</label>
                        <div className="d-block">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    width='200'
                                    height='300'
                                    alt='Preview'
                                    className="img-thumbnail shadow-sm"
                                />
                            ) : (
                                <div
                                    className="border d-flex align-items-center justify-content-center bg-light"
                                    style={{ width: '200px', height: '300px', color: '#ccc' }}
                                >
                                    이미지를 선택해주세요
                                </div>
                            )}
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={e => base64ConversionForImages(e)} />
                    <div>
                        <button type='button' className="btn btn-primary mt-3" onClick={(e) => submitNewWorkout(e)} >
                            추가
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}