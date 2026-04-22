import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";

export const ProfileCard = () => {
    const { user, getAccessTokenSilently } = useAuth0();

    const [gender, setGender] = useState<boolean | null>(null);
    const [birthDate, setBirthDate] = useState<string>('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/profiles/secure/profile`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (!response.ok) throw new Error('Failed to fetch count');

                const profile = await response.json();
                if (profile) {
                    setGender(profile.gender);
                    setBirthDate(profile.birthDate);
                }
            } catch (error) {
                console.error("Erorr fetching unread count:", error);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user, getAccessTokenSilently])


    async function saveProfile() {
        const token = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/profiles/secure/saveProfile`;

        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gender, birthDate })
        };

        const response = await fetch(url, requestOptions)
        if (!response.ok) throw new Error('Something went wrong');

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    }
    return (
        <div className="card bg-light p-3 mt-4">
            <h5 className="card-title">나의 프로필</h5>
            <div className="row mt-3">
                {/* gender */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">성별</label>
                    <select
                        className="form-select"
                        value={gender === null ? '' : gender ? 'male' : 'female'}
                        onChange={(e) => setGender(e.target.value === 'male')}
                    >
                        <option value="">선택하세요</option>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                    </select>
                </div>

                {/* birth */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">생년월일</label>
                    <input
                        type="date"
                        className="form-control"
                        value={birthDate || ''}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                </div>
            </div>

            <button className="btn btn-success" onClick={saveProfile}>
                저장하기
            </button>
            {saveSuccess && (
                <div className="alert alert-success mt-2">저장됐습니다!</div>
            )}
        </div>
    )
}