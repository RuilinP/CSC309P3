import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

function Landing() {

    return (
        <div>
            <Header />

            <main>
                <div className="container-fluid p-0">
                    <div className="masthead mw-100 py-5 text-white text-center" style={{ backgroundImage: 'url("assets/images/header-image.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <h1 className="masthead-title text-white">Rescue, Love, Repeat: Adopt a Pet Today!</h1>
                        <div className="py-3 d-flex gap-3 justify-content-center align-items-center">
                            <div className="d-none d-lg-inline text-end landing-top-image"><img className="image" src="assets/images/landing-top2.jpg" /></div>
                            <div className="d-none d-lg-inline landing-top-image landing-top-image-main"><img className="image" src="assets/images/landing-top1.png" /></div>
                            <div className="d-none d-lg-inline text-start landing-top-image"><img className="image" src="assets/images/landing-top3.jpg" /></div>
                            <div className="d-lg-none landing-top-image"><img className="image" src="assets/images/landing-top1.png" /></div>
                        </div>
                    </div>

                    <div className="d-flex align-items-stretch bg-primary">
                        <img className="d-none d-lg-inline-block landing-row-thumb" src="assets/images/landing-1.jpg" />
                        <div className="p-5 d-flex flex-column justify-content-center">
                            <h1 className="pb-3">Looking to adopt a pet?</h1>
                            <p className="fs-5">Ready to bring a new furry friend into your life? Explore pet adoption! Find your perfect companion and provide a loving forever home to a pet in need. Start your journey today!</p>
                            <div className="pt-3">
                                <Link to="/signup/seeker" className="btn btn-dark" role="button">Signup as a Pet Seeker</Link>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex bg-white">
                        <div className="p-5 d-flex flex-column justify-content-center">
                            <h1 className="pb-3">Looking to put a pet up for adoption?</h1>
                            <p className="fs-5">Seeking a loving home for your beloved pet? Consider pet adoption. Help your pet find a caring family that will cherish them as much as you do. Get started today!</p>
                            <div className="pt-3">
                                <Link to="/signup/shelter" className="btn btn-dark" role="button">Signup as a Pet Shelter</Link>
                            </div>
                        </div>
                        <img className="d-none d-lg-inline-block landing-row-thumb img-responsive ms-auto" src="assets/images/landing-2.png" />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Landing;
