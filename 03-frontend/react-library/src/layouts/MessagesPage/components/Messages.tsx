import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";

export const Messages = () => {

    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [displaySuccess, setDisplaySuccess] = useState(false);

    // Messages
    const [messages, setMessages] = useState<MessageModel[]>([]);

    // Edit messages
    const [editMessageId, setEditMessageId] = useState<number | null>(null);

    // field state for Editing
    const [editTitle, setEditTitle] = useState('');
    const [editQuestion, setEditQuestion] = useState('');

    // Pagination
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/messages/secure/search/message?page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong');
                }
                const messagesResponseJson = await messagesResponse.json();
                setMessages(messagesResponseJson.content);
                setTotalPages(messagesResponseJson.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.messages)
        })
        window.scrollTo(0, 0);
    }, [isAuthenticated, user, getAccessTokenSilently, currentPage]);

    const startEdit = (message: MessageModel) => {
        setEditMessageId(message.id!);
        setEditTitle(message.title);
        setEditQuestion(message.question);
    };

    const cancelEdit = () => {
        setEditMessageId(null);
    };

    const deleteMessage = async (id?: number) => {
        if (id === undefined) {
            return;
        }

        if (!window.confirm("질문을 삭제하시겠습니까?")) return;

        const accessToken = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/messages/secure/delete/message?messageId=${id}`;

        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error("삭제에 실패했습니다.");
        }

        // reload messages except deleted messages
        setMessages(messages.filter(message => message.id !== id));

        // display alert
        setDisplaySuccess(true);

        // close alert alarming after 3s
        setTimeout(() => {
            setDisplaySuccess(false);
        }, 3000);

    };


    const submitEdit = async (id: number) => {

        if (!window.confirm("질문을 수정하시겠습니까?")) return;

        const accessToken = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/messages/secure/update/message?messageId=${id}`;

        const messageRequestModel = {
            title: editTitle,
            question: editQuestion
        };

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageRequestModel)
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error("수정에 실패했습니다.")
        }

        // 1. Update list for existing messages 
        setMessages(messages.map(m =>
            m.id === id ? { ...m, title: editTitle, question: editQuestion } : m
        ));

        // 2. finish editing mode
        setEditMessageId(null);
        setDisplaySuccess(true);
        setTimeout(() => setDisplaySuccess(false), 3000);
    }


    if (isLoadingMessages) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-3">

            {displaySuccess && (
                <div className="alert alert-success mt-3" role="alert">
                    요청이 성공적으로 처리되었습니다.
                </div>
            )}

            <div className="mt-2">
                {messages.length > 0 ? (
                    <>
                        <h5>현재 Q/A: </h5>
                        {messages.map(message => (
                            <div key={message.id}>
                                <div className="card mt-2 shadow p-3">
                                    {editMessageId === message.id ? (
                                        // Editing mode
                                        <>
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">제목 수정</label>
                                                <input type="text"
                                                    className="form-control" placeholder="제목을 입력해주세요" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">내용 수정</label>
                                                <textarea className="form-control mb-2"
                                                    rows={3} value={editQuestion} placeholder="질문 내용을 입력해주세요" onChange={e => setEditQuestion(e.target.value)}
                                                />
                                            </div>
                                            <div className="d-flex justify-content-end">
                                                <button className="btn btn-sm btn-success me-2" onClick={() => submitEdit(message.id!)}>저장</button>
                                                <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>취소</button>
                                            </div>
                                        </>
                                    ) : (
                                        // Viewing mode
                                        <>
                                            <h5>제목: {message.title}</h5>
                                            {message.createdAt && (
                                                <span className="text-muted-small">{message.createdAt.substring(0, 10)}</span>
                                            )}
                                            <h6>{message.userEmail}</h6>
                                            <p>{message.question}</p>
                                            <hr />
                                            <div>
                                                <h5>응답: </h5>
                                                {message.response && message.adminEmail ? (
                                                    <>
                                                        <h6>{message.adminEmail} (관리자)</h6>
                                                        <p>{message.response}</p>
                                                    </>
                                                ) : (
                                                    <p><i>관리자가 응답을 확인중입니다. 대기 부탁드립니다.</i></p>
                                                )}
                                            </div>
                                            <div className="d-flex justify-content-end mt-2">
                                                {!message.closed ? (
                                                    <>
                                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(message)}>수정</button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => deleteMessage(message.id)}
                                                        >
                                                            삭제
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="badge bg-light text-dark">답변 완료 후에는 수정/삭제가 불가능합니다.</span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <h5>모든 질문은 이곳에 보여집니다.</h5>
                )}
                {/* pagination */}
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
            </div>
        </div>
    );
}