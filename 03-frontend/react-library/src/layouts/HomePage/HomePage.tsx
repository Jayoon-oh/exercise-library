import { Carousel } from "./components/Carousel"
import { ExploreTopWorkouts } from "./components/ExploreTopWorkouts"
import { Heros } from "./components/Heros"
import { LibraryServices } from "./components/LibraryServies"

export const HomePage = () => {
    return (
        <>
            <ExploreTopWorkouts />
            <Carousel />
            <Heros />
            <LibraryServices />
        </>
    )
}