import { Carousel } from "./components/Carousel"
import { ExploreTopWorkouts } from "./components/ExploreTopWorkouts"
import { Heros } from "./components/Heros"
import { WorkoutServices } from "./components/WorkoutServies"

export const HomePage = () => {
    return (
        <>
            <ExploreTopWorkouts />
            <Carousel />
            <Heros />
            <WorkoutServices />
        </>
    )
}