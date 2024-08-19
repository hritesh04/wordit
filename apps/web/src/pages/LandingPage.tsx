import { ReactTyped } from "react-typed"
import { Banner } from "../components/landing/Banner"

export const LandingPage = () => {
    return(
            <Banner>
                <div className="flex justify-end">
                <ReactTyped
                    strings={["sta","attrac","celebra"]}
                    typeSpeed={50}
                    backSpeed={70}
                    loop
                    cursorChar=""
                    />
                </div>
            </Banner>
    )
}