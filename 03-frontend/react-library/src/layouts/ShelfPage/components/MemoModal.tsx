import { useState } from "react";

interface Props {
    onClose: () => void;
    onComplete: (memo: string, actualReps: number, actualSets: number) => void;
    targetReps?: number;
    targetSets?: number;
}

export const MemoModal: React.FC<Props> = ({ onClose, onComplete, targetReps, targetSets }) => {
    const [inputMemo, setInputMemo] = useState('');
    const [inputSets, setInputSets] = useState(targetSets ?? '');
    const [inputReps, setInputReps] = useState(targetReps ?? '');


    const addMemo = () => {
        onComplete(inputMemo, Number(inputReps), Number(inputSets));
        onClose();
    }

    return (
        <>
            {/* background */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 999, background: 'rgba(0,0,0,0.5)' }}
                onClick={onClose} />

            {/* Modal */}
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', borderRadius: '12px', padding: '24px', minWidth: '400px', zIndex: 1000 }}>

                {/* header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">🏋️ 오늘 운동 어땠나요?</h5>
                    <button className="btn-close" onClick={onClose} />
                </div>

                <hr className="mb-3" />

                {/* input actualSets */}
                <input
                    type="number"
                    className="form-control"
                    placeholder="세트 수"
                    value={inputSets}
                    onChange={(e) => setInputSets(e.target.value)}
                />

                {/* input actualReps */}
                <input
                    type="number"
                    className="form-control"
                    placeholder="수행 횟수"
                    value={inputReps}
                    onChange={(e) => setInputReps(e.target.value)}
                />

                {/* input memo */}
                <textarea
                    className="form-control"
                    rows={4}
                    placeholder="(선택)오늘 컨디션, 좋았던 점, 아쉬운 점을 기록해보세요 💪"
                    value={inputMemo}
                    onChange={(e) => setInputMemo(e.target.value)}
                />

                {/* button */}
                <div className="d-flex gap-2 mt-3 justify-content-end">
                    <button className="btn btn-outline-secondary" onClick={onClose}>취소</button>
                    <button className="btn btn-success px-4" onClick={addMemo}>기록 저장 ✅</button>
                </div>
            </div>
        </>
    )
}