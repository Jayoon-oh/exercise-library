import { useState } from "react";
import WorkoutModel from "../../../models/WorkoutModel"

export const UpdateWorkoutModal: React.FC<{
    workout: WorkoutModel,
    submitUpdate: any
}> = (props) => {

    // update workouts
    const [editTitle, setEditTitle] = useState<string>(props.workout.title || '')
    const [editSource, setEditSource] = useState<string>(props.workout.source || '');
    const [editDescription, setEditDescription] = useState<string>(props.workout.description || '');
    const [editMuscleGroup, setEditMuscleGroup] = useState<string>(props.workout.muscleGroup || '');
    const [editImage, setEditImage] = useState<any>(props.workout.img);

    // existing image
    const getWorkoutImage = (img?: string) => {
        if (!img) return require('./../../../Images/ExerciseImages/barbellrow.jpg');
        if (img.startsWith('data:')) return img;
        try {
            return require(`./../../../Images/ExerciseImages/${img}`);
        } catch (e) {
            return require('./../../../Images/ExerciseImages/barbellrow.jpg');
        }
    };

    // change image
    async function onImageChange(e: any) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => setEditImage(reader.result);
        }
    }

    return (
        <div className="modal fade" id={`modal${props.workout.id}`}
            data-bs-backdrop='static' data-bs-keyboard='false' aria-hidden='true'>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">운동 정보 수정</h5>
                        <button type='button' className="btn-close" data-bs-dismiss='modal'></button>
                    </div>

                    <div className="modal-body">
                        <div className="container">
                            {/* top: existing image, source */}
                            <div className="row mb-3">
                                <div className="col-4">
                                    <img src={editImage ? (editImage.startsWith('data:') ? editImage : getWorkoutImage(editImage)) : getWorkoutImage()}
                                        width='100' height='150' alt='Workout' className="img-thumbnail" />
                                </div>
                                <div className="col-8">
                                    <label className="form-label">운동 제목</label>
                                    <input type="text" className="form-control" value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)} />
                                    <label className="form-label mt-2">출처</label>
                                    <input type="text" className="form-control" value={editSource}
                                        onChange={e => setEditSource(e.target.value)} />
                                </div>
                            </div>

                            <hr />

                            {/* below: description, muscleGroue, image */}
                            <div className="mb-3">
                                <label className="form-label">상세 설명</label>
                                <textarea className="form-control" rows={3} value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">운동 부위 (Muscle Group)</label>
                                <select className="form-select" value={editMuscleGroup}
                                    onChange={e => setEditMuscleGroup(e.target.value)}>
                                    <option value="Back">등 (Back)</option>
                                    <option value="Chest">가슴 (Chest)</option>
                                    <option value="Legs">하체 (Legs)</option>
                                    <option value="Shoulder">어깨 (Shoulder)</option>
                                    <option value="Arms">팔 (Arms)</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">사진 변경</label>
                                <input type="file" className="form-control" onChange={onImageChange} />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss='modal'>취소</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss='modal'
                            onClick={() => {
                                const finalImage = editImage;

                                props.submitUpdate(editTitle, editSource, editDescription, editMuscleGroup, finalImage);
                            }}>
                            수정 완료
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}