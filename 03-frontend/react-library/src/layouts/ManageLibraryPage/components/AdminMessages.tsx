import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react"
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

export const AdminMessages = () => {

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [btnSubmit, setBtnSubmit] = useState(false);

    // filter response
    const [filter, setFilter] = useState<boolean | null>(null);


    useEffect(() => {
        const fetchUserMessages = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                let url = `${process.env.REACT_APP_API}/messages/secure/messages?page=${currentPage - 1}&size=${messagesPerPage}`;
               if (filter  !== null) {
                     url += `&closed=${filter}`;
                }

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const messagesResponseJson = await messagesResponse.json();

                setMessages(messagesResponseJson.content);
                setTotalPages(messagesResponseJson.totalPages);
            }
            setIsLoadingMessages(false);
        }



        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [isAuthenticated, getAccessTokenSilently, currentPage, btnSubmit, filter]);



    if (isLoadingMessages) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div >
        )
    }

    async function submitResponseToQuestion(id: number, response: string) {
        const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;
        const accessToken = await getAccessTokenSilently();
        if (isAuthenticated && id !== null && response !== '') {
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            };

            const messageAdminRequestModelResponse = await fetch(url, requestOptions);
            if (!messageAdminRequestModelResponse.ok) {
                throw Error('Something went wrong!');
            }
            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div className="mt-3">
                {/* tap button */}
            <div className="mb-3">
                <button 
                    className={`btn btn-sm me-2 ${filter === null ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {setFilter(null); setCurrentPage(1)}}>
                    전체
                </button>
                <button 
                    className={`btn btn-sm me-2 ${filter === false ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => {setFilter(false); setCurrentPage(1)}}>
                    답변필요
                </button>
                <button 
                    className={`btn btn-sm ${filter === true ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => {setFilter(true); setCurrentPage(1)}}>
                    답변완료
                </button>
            </div>

            {messages.length > 0 ?
                <>
                    <h5>대기중 Q/A</h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}/>
                    ))}
                </>
                : <h5>대기중인 Q/A가 없습니다.</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    )
}