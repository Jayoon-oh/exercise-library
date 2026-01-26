import { Activies } from "./components/Activities"

export const ShelfPage = () => {
    return (
        <div className="container">
            <div className="mt-3">
                <nav>
                    <div className="nav nav-tabs" id='nav-tabs' role='tablist'>
                        <button className="nav-link active" id='nav-loans-tab' data-bs-toggle='tab'
                            data-bs-target='#nav-loans' type='button' role='tab' aria-controls='nav-loans'
                            aria-selected='true'>
                            운동리스트
                        </button>
                        <button className="nav-link" id='nav-history-tab' data-bs-toggle='tab'
                            data-bs-target='#nav-history' type='button' role='tab' aria-controls='nav-history'
                            aria-selected='false'>
                            지난 기록
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id='nav-tabContent'>
                    <div className="tab-pane fade show active" id='nav-loans' role='tabpanel'
                        aria-labelledby="nav-loans-tab">
                        <Activies />
                    </div>
                    <div className="tab-pane fade" id='nav-history' role='tabpanel'
                        aria-labelledby="nav-history-tab">
                        <p>지난 기록</p>
                    </div>
                </div>
            </div>
        </div>
    )
}