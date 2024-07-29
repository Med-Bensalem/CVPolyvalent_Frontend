// RegisterPage.js

import React, {useEffect, useState} from 'react';


const NavbarPage = () => {
    const [token, setToken] = useState(null);


    const fetchOffres = async () => {
        try {

            const token = localStorage.getItem("token");
            setToken(token);

        } catch (error) {
            console.error('Error fetching Token:', error);

        }
    };
    useEffect(() => {
        fetchOffres();
    }, []);
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container px-0">
                <a className="navbar-brand" href="/"><img src="../assets/images/brand/logo/logo.svg"
                                                                         alt="Geeks"/></a>
                {token === null && (
                    <div className="d-flex align-items-center order-lg-3 ms-lg-3">
                        <div className="d-flex align-items-center">
                            <a href="/login" className="btn btn-outline-primary mx-2 d-none d-md-block">Se connecter</a>
                            <a href="/register" className="btn btn-primary d-none d-md-block">S'inscrire</a>
                        </div>
                    </div>
                )}




                <div className="collapse navbar-collapse" id="navbar-default">
                    <ul className="navbar-nav " style={{marginLeft: '300px'}}>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="/jobs">Trouver un travail</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/contact">Contact</a>
                        </li>

                        {token !== null && (
                            <li className="nav-item mx-4">
                                <a className="nav-link" href="/dashboard">Dashboard</a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarPage;
