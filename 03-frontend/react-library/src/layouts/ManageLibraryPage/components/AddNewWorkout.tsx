import { useAuth0 } from "@auth0/auth0-react"
import { useRef, useState } from "react";
import AddWorkoutRequest from "../../../models/AddWorkoutRequest";

export const AddNewWorkout = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    // New Workout
    const [title, setTitle] = useState('');
    const [source, setSource] = useState('');
    const [description, setDescription] = useState('');
    const [slots, setSlots] = useState(0);
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
        setSelectedImage(null);

        if (e.target.files[0]) {
            getBase64(e.target.files[0]);
        }
    }

    function getBase64(file: any) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            if (reader.result) {
                setSelectedImage(reader.result);
                console.log("새 이미지 변환 완료")
            }
        };
        reader.onerror = function (error) {
            console.log('Error', error);
            setSelectedImage(null); // 에러 발생 시 초기화
        }
    }

    async function submitNewWorkout() {
        const url = `http://localhost:8080/api/admin/secure/add/workout`;
        const accessToken = await getAccessTokenSilently();
        if (isAuthenticated && title !== '' && source !== '' && muscleGroup !== '부위'
            && description !== '' && slots >= 0 && selectedImage !== null) {
            const workout: AddWorkoutRequest = new AddWorkoutRequest(title, source, description, slots, muscleGroup);
            workout.img = selectedImage;
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workout)
            };

            const submitNewWorkoutResponse = await fetch(url, requestOptions);
            if (!submitNewWorkoutResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setTitle('');
            setSource('');
            setDescription('');
            setSlots(0);
            setMuscleGroup('Category');
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
                    <form action="POST">
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
                            <label className="form-label">세트수</label>
                            <input type="number" className="form-control" name='세트수' required
                                onChange={e => setSlots(Number(e.target.value))} value={slots} />
                        </div>
                        <input type="file" ref={fileInputRef} onChange={e => base64ConversionForImages(e)} />
                        <div>
                            <button type='button' className="btn btn-primary mt-3" onClick={submitNewWorkout}>
                                추가
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}