import { useAuth0 } from "@auth0/auth0-react"
import { Carousel } from "./components/Carousel"
import { ExploreTopWorkouts } from "./components/ExploreTopWorkouts"
import { Heros } from "./components/Heros"
import { WorkoutServices } from "./components/WorkoutServies"
import { TodayRoutineSummary } from "./components/TodayRoutineSummary"
import { WeeklyProgress } from "./components/WeeklyProgress"

export const HomePage = () => {
    const { isAuthenticated } = useAuth0();

    return (
        <>
            {isAuthenticated ? (
                <div className="container mt-4">
                    <WeeklyProgress />
                    <TodayRoutineSummary />
                </div>
            ) : (
                <ExploreTopWorkouts />

            )}
            <Carousel />
            <Heros />
            <WorkoutServices />
        </>
    )
}