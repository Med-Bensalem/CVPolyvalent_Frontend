// RegisterPage.js

import React from 'react';

const FooterPage = () => {
    return (

            <footer className="pt-lg-8 pt-5 footer bg-white">
                <div className="container mt-lg-2">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-12">

                            <div className="mb-4">
                                <img src="../assets/images/brand/logo/logo.svg" alt="Geeks" className="logo-inverse"/>
                                <div className="mt-4">
                                    <p>Geek is feature-rich components and beautifully Bootstrap UIKit for developers,
                                        built
                                        with bootstrap responsive framework.</p>

                                </div>
                            </div>
                        </div>
                        <div className="offset-lg-1 col-lg-2 col-md-3 col-6">
                            <div className="mb-4">

                                <h3 className="fw-bold mb-3">Company</h3>
                                <ul className="list-unstyled nav nav-footer flex-column nav-x-0">
                                    <li><a href="#" className="nav-link">About</a></li>
                                    <li><a href="#" className="nav-link">Pricing</a></li>
                                    <li><a href="#" className="nav-link">Blog</a></li>
                                    <li><a href="#" className="nav-link">Careers</a></li>
                                    <li><a href="#" className="nav-link">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-3 col-6">
                            <div className="mb-4">

                                <h3 className="fw-bold mb-3">Support</h3>
                                <ul className="list-unstyled nav nav-footer flex-column nav-x-0">
                                    <li><a href="#" className="nav-link">Help and Support</a></li>
                                    <li><a href="#" className="nav-link">Become Instructor</a></li>
                                    <li><a href="#" className="nav-link">Get the app</a></li>
                                    <li><a href="#" className="nav-link">FAQ’s</a></li>
                                    <li><a href="#" className="nav-link">Tutorial</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-12">

                            <div className="mb-4">
                                <h3 className="fw-bold mb-3">Get in touch</h3>
                                <p>339 McDermott Points Hettingerhaven, NV 15283</p>
                                <p className="mb-1">
                                    Email:
                                    <a href="#">support@geeksui.com</a>
                                </p>
                                <p>
                                    Phone:
                                    <span className="text-dark fw-semibold">(000) 123 456 789</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center g-0 border-top py-2 mt-6">

                        <div className="col-lg-4 col-md-5 col-12">
                <span>
                    ©
                    <span id="copyright2">
                        <script>
                            document.getElementById("copyright2").appendChild(document.createTextNode(new Date().getFullYear()));
                        </script>
                    </span>
                    Geeks-UI, Inc. All Rights Reserved
                </span>
                        </div>


                    </div>
                </div>
            </footer>




    );
};

export default FooterPage;
