import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const AdminMessage: React.FC<{
    message: MessageModel,
    submitResponseToQuestion: any
}> = (props, key) => {

    const [displayWarning, setDisplayWarning] = useState(false);
    const [response, setResponse] = useState('');

    function submitBtn() {
        if (props.message.id !== null && response !== '') {
            props.submitResponseToQuestion(props.message.id, response);
            setDisplayWarning(false);
        } else {
            setDisplayWarning(true);
        }
    }

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    return (
        <div key={props.message.id}>
            <div className="card mt-2 shadow p-3 bg-body rounded">
                {/* title + state */}
                <div className="d-flex justify-content-between">
                    <h5>#{props.message.id}: {props.message.title}</h5>
                    {props.message.closed
                        ? <span className="badge bg-success">답변완료</span>
                        : <span className="badge bg-danger">답변필요</span>
                    }
                </div>
                <h6>{props.message.userEmail}</h6>
                <p>{props.message.question}</p>
                <p>{formatDate(props.message.createdAt)}</p>
                <hr />

                {props.message.closed ? (
                    // clased repsonse → indicate reponse
                    <div>
                        <h5>💬 답변</h5>
                        <p>{props.message.response}</p>
                    </div>
                ) : (
                    // need response (input form)
                    <div>
                        <h5>답변: </h5>
                        <form action="PUT">
                            {displayWarning &&
                                <div className="alert alert-danger" role='alert'>
                                    모든 항목이 채워져야 합니다.
                                </div>
                            }
                            <div className="col-md-12 mb-3">
                                <textarea className="form-control" rows={3}
                                    onChange={e => setResponse(e.target.value)}
                                    value={response}>
                                </textarea>
                            </div>
                            <div>
                                <button type='button' className="btn btn-primary mt-3" onClick={submitBtn}>
                                    답변 제출하기
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}