
import "./HomePage.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import FormatedText from "../../components/FormatedText/FormatedText";
import OutStandingBook from "../Book/OutStandingBook";
import ComicBook from "../Book/ComicBook";
import ReferenceBook from "../Book/ReferenceBook";
import TextBooks from "../Book/TextBooks";
import SkillBook from "../Book/SkillBook";

function HomePage() {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <>
            <div className="homepage-container">
                <HomeHeader />

                <Slider {...settings} className="container">
                    <div className="slider container">
                        <img src="https://cdn.pixabay.com/photo/2017/10/31/19/05/web-design-2906159_960_720.jpg" />
                    </div>
                    <div className="slider container">
                        <img src="https://cdn.pixabay.com/photo/2017/10/02/12/55/book-2808775_960_720.jpg" />
                    </div>
                    <div className="slider container">
                        <img src="https://cdn.pixabay.com/photo/2017/06/24/09/48/coffee-2437190_960_720.jpg" />
                    </div>
                    <div className="slider container">
                        <img src="https://cdn.pixabay.com/photo/2020/02/15/05/15/cup-of-coffee-4850059_960_720.jpg" />
                    </div>
                    <div className="slider container">
                        <img src="https://cdn.pixabay.com/photo/2017/06/20/23/42/coffee-2425388_960_720.jpg" />
                    </div>
                    <div className="slider container">
                        <img src="https://cdn.pixabay.com/photo/2017/12/29/12/09/note-3047435_960_720.jpg" />
                    </div>
                </Slider>

                <div className="marquee-container container ">
                    <div className="marquee-content  col-12">
                        <marquee><FormatedText id="homePage.welCome" /></marquee>
                    </div>
                </div>
                <OutStandingBook />
                <ComicBook />
                <ReferenceBook />
                <SkillBook />
                <TextBooks />
                <HomeFooter />
            </div>

        </>
    );
}

export default HomePage;
