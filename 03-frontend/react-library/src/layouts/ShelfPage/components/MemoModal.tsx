import { useState } from "react";

interface Props {
    onClose: () => void;
    onComplete: (memo: string) => void;
}

export const MemoModal: React.FC<Props> = ({ onClose, onComplete }) => {
    const [inputMemo, setInputMemo] = useState('');

    const addMemo = () => {
        onComplete(inputMemo);
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