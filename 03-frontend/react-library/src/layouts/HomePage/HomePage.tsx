import { Carousel } from "./components/Carousel"
import { ExploreTopBooks } from "./components/ExploreTopBook"
import { Heros } from "./components/Heros"
import { LibraryServices } from "./components/LibraryServies"

export const HomePage = () => {
    return (
        <>
            <ExploreTopBooks />
            <Carousel />
            <Heros />
            <LibraryServices />
        </>
    )
}