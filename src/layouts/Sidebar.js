// Template1.js
import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";

const Sidebar = () => {
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            setUserRole(user.role)

        }
    }, []);
    return (
        <nav className="navbar-vertical navbar">
            <div className="vh-100" data-simplebar>
                <a className="navbar-brand" href="/">
                    <img src="../assets/images/brand/logo/logo-inverse.svg" alt="Geeks"/>
                </a>
                <ul className="navbar-nav flex-column" id="sideNavbar">
                    {userRole === 'admin' && (
                        <>
                            <li className="nav-item">
                                <a
                                    className="nav-link "
                                    href="/dashboard"
                                >
                                    <i className="nav-icon fe fe-home me-2"></i>
                                    Dashboard
                                </a>

                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link "
                                    href="/comptes"
                                >
                                    <i className="nav-icon fe fe-user me-2"></i>
                                    Gestion Comptes
                                </a>

                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link "
                                    href="/contacts"
                                >
                                    <i className="nav-icon fe fe-message-square me-2"></i>
                                    Gestion Contacts
                                </a>

                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link "
                                    href="/secteurs"
                                >
                                    <i className="nav-icon fe fe-file me-2"></i>
                                    Gestion Secteur Activité
                                </a>

                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link "
                                    href="/type-emplois"
                                >
                                    <i className="nav-icon fe fe-layout me-2"></i>
                                    Gestion Type Emplois
                                </a>

                            </li>


                            <li className="nav-item">
                                <a
                                    className="nav-link "
                                    href="/type-experiences"
                                >
                                    <i className="nav-icon fe fe-book me-2"></i>
                                    Gestion Type Experience
                                </a>

                            </li>

                            <li className="nav-item">
                                <a
                                    className="nav-link "
                                    href="/niveau-etudes"
                                >
                                    <i className="nav-icon fe fe-book-open me-2"></i>
                                    Gestion Niveau Etudes
                                </a>

                            </li>
                        </>
                    )}

                    {userRole === 'candidat' && (
                        <>
                            <li className="nav-item">
                                <a
                                    className="nav-link "
                                    href="/profile"
                                >
                                    <i className="nav-icon fe fe-user me-2"></i>
                                    Profile
                                </a>

                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/cv">
                                    <i className="nav-icon fe fe-file me-2"></i>
                                    Mon CV
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/candidat-Suivie">
                                    <i className="nav-icon fe fe-book-open me-2"></i>
                                    Suivie Candidature
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/visualiser">
                                    <i className="nav-icon fe fe-eye me-2"></i>
                                    Visualiser CV
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/jobs">
                                    <i className="nav-icon fe fe-layout me-2"></i>
                                    Liste Offres
                                </a>
                            </li>

                        </>
                    )}
                    {/* Afficher le lien "Offres" et "Suivie Candidature" si l'utilisateur est une entreprise */}
                    {userRole === 'entreprise' && (
                        <>
                            <li className="nav-item">
                            <a
                                    className="nav-link "
                                    href="/profile"
                                >
                                    <i className="nav-icon fe fe-user me-2"></i>
                                    Profile
                                </a>

                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/offres">
                                    <i className="nav-icon fe fe-home me-2"></i>
                                    Gestion Offres
                                </a>
                            </li>

                        </>
                    )}


                </ul>

            </div>
        </nav>

    );
};

export default Sidebar;
