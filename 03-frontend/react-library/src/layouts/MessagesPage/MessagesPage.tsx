import { useEffect, useState } from "react"
import { PostNewMessage } from "./components/PostNewMessage"
import { Messages } from "./components/Messages"
import { useAuth0 } from "@auth0/auth0-react"
import { useLocation } from "react-router-dom"

export const MessagesPage = () => {
    const location = useLocation();
    const { getAccessTokenSilently } = useAuth0();

    const locationState = location.state as { tab?: string };
    // Change state as true if it's from mypage to Q/A
    const [messagesClick, setMessagesClick] = useState(locationState?.tab === 'qna');

    useEffect(() => {
        const markAsRead = async () => {
            const token = await getAccessTokenSilently();
            await fetch(`${process.env.REACT_APP_API}/messages/secure/read/messages`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
        };

        // markAsRead if Q/A tab is activated
        if (messagesClick) {
            markAsRead();
        }
    }, [messagesClick, getAccessTokenSilently]);

    return (
        <div className="container">
            <div className="mt-3 mb-2">
                <nav>
                    <div className="nav nav-tabs" id='nav-tab' role='tablist'>
                        <button onClick={() => setMessagesClick(false)}
                            className={`nav-link ${!messagesClick ? 'active' : ''}`}
                            type='button' role='tab'>
                            문의하기
                        </button>
                        <button onClick={() => setMessagesClick(true)}
                            className={`nav-link ${messagesClick ? 'active' : ''}`}
                            type='button' role='tab'>
                            Q/A 대기중
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id='nav-tabContent'>
                    <div className={`tab-pane fade ${!messagesClick ? 'show active' : ''}`} id='nav-send-message' role='tabpanel'
                        aria-labelledby="nav-send-message-tab">
                        <PostNewMessage />
                    </div>
                    <div className={`tab-pane fade ${messagesClick ? 'show active' : ''}`} id='nav-message' role='tabpanel' aria-labelledby="nav-message-tab">
                        {messagesClick ? <Messages /> : <></>}
                    </div>
                </div>
            </div>
        </div>
    )
}