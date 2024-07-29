// RegisterPage.js

import React from 'react';

const NoPage = () => {
    return (
        <div>
            <main>
                <section className="container d-flex flex-column vh-100">
                    <div className="row align-items-center justify-content-center g-0 h-lg-100 py-10">
                        <div className="offset-xl-1 col-xl-4 col-lg-6 col-md-12 col-12 text-center text-lg-start">
                            <h1 className="display-1 mb-3">404</h1>

                            <p className="mb-5 lead px-4 px-md-0">
                                Oops! Sorry, we couldn’t find the page you were looking for. If you think this is a
                                problem with us
                            </p>
                            <a href="/" className="btn btn-primary me-2">Back to Home</a>
                        </div>
                        <div className="offset-xl-1 col-xl-6 col-lg-6 col-md-12 col-12 mt-8 mt-lg-0">
                            <img src="assets/images/error/404-error-img.svg" alt="error" className="w-100"/>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
};

export default NoPage;
