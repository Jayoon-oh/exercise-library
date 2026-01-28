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

    return (
        <div key={props.message.id}>
            <div className="card mt-2 shadow p-3 bg-body rounded">
                <h5>#{props.message.id}: {props.message.title}</h5>
                <h6>{props.message.userEmail}</h6>
                <p>{props.message.question}</p>
                <hr />
                <div>
                    <h5>답변: </h5>
                    <form action="PUT">
                        {displayWarning &&
                            <div className="alert alert-danger" role='alert'>
                                모든 항목이 채워져야 합니다.
                            </div>
                        }
                        <div className="col-md-12 mb-3">
                            <label className="form-label"> 설명 </label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}
                                onChange={e => setResponse(e.target.value)} value={response}></textarea>
                        </div>
                        <div>
                            <button type='button' className="btn btn-primary mt-3" onClick={submitBtn}>
                                답변 제출하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}