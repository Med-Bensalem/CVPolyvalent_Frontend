// RegisterPage.js

import React, {useEffect, useState} from 'react';
import NavbarPage from "../layouts/Navbar";
import FooterPage from "../layouts/Footer";
import {getAllOffres} from "../Services/offreService";
import {getUserById} from "../Services/authService";
import {Link} from "react-router-dom";
import moment from "moment";
import {getTypeExperienceById} from "../Services/typeExperienceService";

const HomePage = () => {
    const [offres, setOffres] = useState([]);

    const fetchOffres = async () => {

        try {
            const fetchedOffres = await getAllOffres();
            // Map through fetched offres and fetch user's email for each offre
            const updatedOffres = await Promise.all(
                fetchedOffres.map(async (offre) => {
                    const user = await getUserById(offre.userId);
                    const typeExperience = await getTypeExperienceById(offre.experience)
                    return {
                        ...offre,
                        adresse: user.adress ,
                        nom:user.nom,
                        userImage: `http://localhost:5000${user.image}`,
                        titreTypeExperience: typeExperience.titre
                    };
                })
            );
            const limitedOffres = updatedOffres.slice(0, 5);
            setOffres(limitedOffres);


        } catch (error) {
            console.error('Error fetching offre:', error);

        }
    };
    useEffect(() => {
        fetchOffres();
    }, []);

    const getDifference = (date) => {
        const currentDate = moment();
        const creationDate = moment(date);
        const diffMinutes = currentDate.diff(creationDate, 'minutes');
        const diffHours = currentDate.diff(creationDate, 'hours');
        const diffDays = currentDate.diff(creationDate, 'days');
        const diffWeeks = currentDate.diff(creationDate, 'weeks');
        const diffMonths = currentDate.diff(creationDate, 'months');
        const diffYears = currentDate.diff(creationDate, 'years');

        if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
        } else if (diffHours < 24) {
            return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
        } else if (diffDays < 7) {
            return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        } else if (diffWeeks < 4) {
            return `${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`;
        } else if (diffMonths < 12) {
            return `${diffMonths} mois`;
        } else {
            return `${diffYears} an${diffYears > 1 ? 's' : ''}`;
        }
    };

    return (
        <div>
            <NavbarPage/>
            <main>
                <section className="bg-light py-8 bg-cover">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-12">
                                <div>
                                    <div className="text-center text-md-start">
                                        <h1 className="display-2 fw-bold mb-3">Trouvez le travail de vos rêves que vous aimez faire..</h1>
                                        <p className="lead">La plus grande communauté de travail à distance au monde. publiez une offre d'emploi ou créez votre profil de développeur.</p>
                                    </div>

                                </div>
                            </div>
                            <div className="offset-lg-1 col-lg-5 col-12 text-center">
                                <div className="position-relative d-none d-lg-block">
                                    <img src="assets/images/job/png/job-hero-section.png" className="img-fluid"
                                         alt="img"/>
                                    <div className="position-absolute top-0 mt-7 ms-n6 ms-md-n6 ms-lg-n12 start-0">
                                        <img src="assets/images/job/job-hero-block-1.svg" className="img-fluid"
                                             alt="img"/>
                                    </div>
                                    <div className="position-absolute bottom-0 mb-8 me-n6 me-md-n4 me-lg-n12 end-0">
                                        <img src="assets/images/job/job-hero-block-2.svg" className="img-fluid"
                                             alt="img"/>
                                    </div>
                                    <div className="position-absolute bottom-0 mb-n4 ms-n1 ms-md-n4 ms-lg-n7 start-0">
                                        <img src="assets/images/job/job-hero-block-3.svg" className="img-fluid"
                                             alt="img"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-8 bg-white">
                    <div className="container">
                        <div className="row">
                            <div className="offset-xl-1 col-xl-10 col-md-12 col-12">
                                <div className="row text-center">

                                    <div className="col">
                                        <div className="mb-3 mt-3">
                                            <img src="assets/images/brand/gray-logo-airbnb.svg" alt="logo"/>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="mb-3 mt-3">
                                            <img src="assets/images/brand/gray-logo-discord.svg" alt="logo"/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="mb-3 mt-3">
                                            <img src="assets/images/brand/gray-logo-intercom.svg" alt="logo"/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="mb-3 mt-3">
                                            <img src="assets/images/brand/gray-logo-stripe.svg" alt="logo"/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="mb-3 mt-3">
                                            <img src="assets/images/brand/gray-logo-netflix.svg" alt="logo"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-lg-8 pb-8 bg-white">

                    <div className="container">

                        <div className="row">
                            <div className="offset-xl-2 col-xl-8 col-md-12 col-12">
                                <div className="text-center mb-8">

                                    <span
                                        className="text-uppercase text-primary fw-semibold ls-md">DERNIÈRE OUVERTURE D'EMPLOI</span>
                                    <h2 className="h1 fw-bold mt-3">Explorez un emploi flexible </h2>
                                </div>


                                {offres.map((offre, index) => (

                                    <div className="card card-bordered mb-3 card-hover cursor-pointer" key={offre._id}>
                                        <div className="card-body">
                                            <div className="d-xl-flex">

                                                <img src={offre.userImage} alt="user"
                                                     style={{
                                                         height: '80px',
                                                         width: '80px',
                                                         marginTop: '20px'
                                                     }}/>

                                                <div className="ms-xl-3 w-100 mt-3 mt-xl-1">
                                                    <div className="d-flex justify-content-between mb-5">
                                                        <div>
                                                            <h3 className="mb-1 fs-4">
                                                                <Link to={`/single-job/${offre._id}`}
                                                                      className="text-inherit">
                                                                    <h3 className="mb-1 fs-4">{offre.titre}</h3>
                                                                </Link>

                                                            </h3>

                                                            <div>
                                                                <span>{offre.nom}</span>


                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="d-md-flex justify-content-between">
                                                        <div className="mb-2 mb-md-0">
                                                    <span className="me-2">
                                                        <i className="fe fe-briefcase"></i>
                                                        <span className="ms-1">{offre.titreTypeExperience} </span>
                                                    </span>
                                                            <span className="me-2">
                                                        <i className="fe fe-dollar-sign"></i>
                                                        <span className="ms-1">{offre.remuneration}</span>
                                                    </span>
                                                            <span className="me-2">
                                                        <i className="fe fe-map-pin"></i>
                                                        <span className="ms-1">{offre.adresse}</span>
                                                    </span>
                                                        </div>
                                                        <div>
                                                            <i className="fe fe-clock mx-2"></i>
                                                            <span>{getDifference(offre.dateCreation)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}


                                <div className="mt-6 text-center">
                                    <a href="/jobs" className="btn btn-outline-primary"> Tous les emplois </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="py-8 bg-light">
                    <div className="container">
                        <div className="row">
                            <div className="offset-xl-1 col-xl-10 col-md-12 col-12">
                                <div className="row text-center">

                                    <div className="col-md-12 px-lg-8 mb-8 mt-6">
                                        <h2 className="h1 fw-bold mt-3">Comment ça fonctionne</h2>
                                    </div>
                                </div>
                                <div className="row gy-6">
                                    <div className="col-md-4 col-12">
                                        <div className="text-center">
                                            <div
                                                className="icon-shape icon-lg border border-primary border-2 fs-3 rounded-circle mb-4 process-line text-primary smooth-shadow-md">1
                                            </div>
                                            <h3>Click on 'Post a job'</h3>
                                            <p className="mb-0 px-4">Fill in the details of the job be sure to include
                                                your location restrictions if you have em!</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-12">
                                        <div className="text-center">
                                            <div
                                                className="icon-shape icon-lg border border-primary border-2 fs-3 rounded-circle mb-4 process-line text-primary smooth-shadow-md">2
                                            </div>
                                            <h3>Select an upgrade if required</h3>
                                            <p className="mb-0 px-2">
                                                The base price for a job listing on Geeks is $29 per month. Choose one
                                                of our optional upgrades to gain more visibility to your listing.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-12">
                                        <div className="text-center">
                                            <div
                                                className="icon-shape icon-lg border border-primary border-2 fs-3 rounded-circle mb-4 text-primary smooth-shadow-md">3
                                            </div>
                                            <h3>Purchase the listing</h3>
                                            <p className="mb-0 px-3">Preview your listing and once you are ready to post
                                                it you can add your billing information.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <FooterPage/>




        </div>


    );
};

export default HomePage;
