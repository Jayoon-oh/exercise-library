import { useAuth0 } from "@auth0/auth0-react"
import { Carousel } from "./components/Carousel"
import { MainHeroBanner } from "./components/MainHeroBanner"
import { TodayRoutineSummary } from "./components/TodayRoutineSummary"
import { WeeklyProgress } from "./components/WeeklyProgress"
import { RecentHistory } from "./components/RecentHistory"

export const HomePage = () => {
    const { isAuthenticated } = useAuth0();

    return (
        <>
            {isAuthenticated ? (
                <div className="container mt-4 my-5">
                    <WeeklyProgress />
                    <TodayRoutineSummary />
                    <RecentHistory />
                </div>
            ) : (
                <>
                    <MainHeroBanner />
                    <Carousel />
                </>
            )}
        </>
    )
}