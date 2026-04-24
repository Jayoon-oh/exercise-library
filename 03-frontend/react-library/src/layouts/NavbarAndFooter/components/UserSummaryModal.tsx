// NavBar/components/UserSummaryModal.tsx

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import UserSummary from '../../../models/UserSummary';

interface Props {
    userSummary: UserSummary | null;
    onClose: () => void;
    onLogout: () => void;
}

export const UserSummaryModal: React.FC<Props> = ({ userSummary, onClose, onLogout }) => {
    return (
        <>
            {/* close modal if user clicks background */}
            <div
                style={{
                    position: 'fixed', top: 0, left: 0,
                    width: '100%', height: '100%', zIndex: 999
                }}
                onClick={onClose}
            />

            {/* Modal */}
            <div style={{
                position: 'absolute', right: '16px', top: '60px',
                background: 'white', borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                padding: '16px', minWidth: '220px', zIndex: 1000,
                color: '#333'
            }}>
                {/* unread Q&A */}
                <div className='mb-2'>
                    <Link
                        to={{ pathname: '/messages', state: { tab: 'qna' } } as any}
                    >
                        📬 미읽은 답변{' '}
                    </Link>
                    <strong>{userSummary?.unreadMessageCount ?? 0}개</strong>
                </div>

                {/* points */}
                <div className='mb-2'>
                    💰 포인트{' '}
                    <strong>{userSummary?.points ?? 0}P</strong>
                </div>

                {/* workout list for today */}
                <div className='mb-3'>
                    <div>🏋️ 오늘의 운동</div>
                    {userSummary?.todayWorkouts && userSummary.todayWorkouts.length > 0 ? (
                        <ul style={{ paddingLeft: '16px', margin: '4px 0' }}>
                            {userSummary.todayWorkouts.map((w, i) => (
                                <li key={i} style={{ fontSize: '13px' }}>
                                    {w.title} {w.actualSets}세트 x {w.actualReps}회
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div style={{ fontSize: '13px', color: '#999' }}>
                            오늘 운동이 없어요
                        </div>
                    )}
                    <div className='mb-3'>
                        <NavLink to='/shelf' onClick={onClose}
                            style={{ fontSize: '13px' }}>
                            상세보기 →
                        </NavLink>
                    </div>
                    <div className='mb-3'>
                        <NavLink to='/profile' onClick={onClose}
                            style={{ fontSize: '16px' }}>
                            마이페이지
                        </NavLink>
                    </div>
                </div>

                <hr style={{ margin: '8px 0' }} />

                {/* logout */}
                <button
                    className='btn btn-sm btn-outline-danger w-100'
                    onClick={onLogout}
                >
                    로그아웃
                </button>
            </div>
        </>
    );
};