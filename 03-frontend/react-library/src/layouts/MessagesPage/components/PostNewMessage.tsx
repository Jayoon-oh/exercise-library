import { useAuth0 } from "@auth0/auth0-react"
import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    async function submitNewQuestion() {
        const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
        const accessToken = await getAccessTokenSilently();
        if (isAuthenticated && title !== '' && question !== '') {
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };

            const submitNewQuestionResponse = await fetch(url, requestOptions)
            if (!submitNewQuestionResponse.ok) {
                throw new Error("Something went wrong");
            }

            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className="card mt-3">
            <div className="card-header">
                관리자에게 문의
            </div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning &&
                        <div className="alert alert-danger" role='alert'>
                            모든 항목이 채워져야 합니다.
                        </div>
                    }
                    {displaySuccess &&
                        <div className="alert alert-success" role='alert'>
                            문의가 관리자에게 전달 되었습니다.
                        </div>
                    }
                    <div className="mb-3">
                        <label className="form-label">
                            제목
                        </label>
                        <input type="text" className="form-control" id='exampleFormControlInput1'
                            placeholder="제목을 작성해주세요." onChange={e => setTitle(e.target.value)} value={title} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            문의사항
                        </label>
                        <textarea className="form-control" id="exampleFormControlTextarea1"
                            rows={3} onChange={e => setQuestion(e.target.value)} value={question}>
                        </textarea>
                    </div>
                    <div>
                        <button type='button' className="btn btn-primary mt-3" onClick={submitNewQuestion}>
                            문의하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}