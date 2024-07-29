import React, {useEffect, useState} from 'react';
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import {getUsersApproved, getUsersByRole, getUsersNotApproved} from "../Services/authService";
import {getAllContacts} from "../Services/contactService";
import {getAllNiveauEtudes} from "../Services/niveauEtudeService";
import {getAllSecteurs} from "../Services/secteurService";
import {getAllTypeEmplois} from "../Services/typeEmploisService";
import {jwtDecode} from "jwt-decode";
import {getAllTypeExperiences} from "../Services/typeExperienceService";
import ContenuProfile from "./contenu-profile";

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [etudes, setEtudes] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [usersApproved, setUsersApprouved] = useState([]);
    const [usersNotApproved, setUsersNotApprouved] = useState([]);
    const [secteurs, setSecteurs] = useState([]);
    const [typesEmplois, setTypeEmplois] = useState([]);
    const [typesExperience, setTypeExperience] = useState([]);
    const [userRole, setUserRole] = useState('');
    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const fetchedUsers = await getUsersByRole();
                const fetchedApprovedUsers = await getUsersApproved();
                const fetchedNotApprovedUsers = await getUsersNotApproved();
                const secteurs = await getAllSecteurs();
                const contacts = await getAllContacts();
                const etudes = await getAllNiveauEtudes();
                const emplois = await getAllTypeEmplois();
                const experiences = await getAllTypeExperiences();
                setTypeEmplois(emplois.length);
                setEtudes(etudes.length);
                setUsers(fetchedUsers.length);
                setUsersApprouved(fetchedApprovedUsers.length);
                setUsersNotApprouved(fetchedNotApprovedUsers.length);
                setSecteurs(secteurs.length);
                setContacts(contacts.length);
                setTypeExperience(experiences.length)
                const token = localStorage.getItem("token");
                if (token) {
                    const user = jwtDecode(token);
                    setUserRole(user.role)

                }

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);
    return (
        <div id="db-wrapper">
             <Sidebar/>

            <main id="page-content">
                <div className="header">
                    <Header/>
                </div>

                <section className="container-fluid p-4">

                    <div className="row">

                        {userRole === 'candidat' && (
                            <ContenuProfile/>
                        )}

                        {userRole === 'entreprise' && (
                            <ContenuProfile/>
                    )}

                        {userRole === 'admin' && (
                            <>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-12">
                                        <div
                                            className="border-bottom pb-3 mb-3 d-lg-flex justify-content-between align-items-center">
                                            <div className="mb-3 mb-lg-0">
                                                <h1 className="mb-0 h2 fw-bold">Dashboard</h1>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-lg-6 col-md-12 col-12">
                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div
                                                className="d-flex align-items-center justify-content-between mb-3 lh-1">
                                                <div>
                                                    <span
                                                        className="fs-6 text-uppercase fw-semibold ls-md">Compte </span>
                                                </div>
                                                <div>
                                                    <span className="fe fe-user fs-3 text-primary"></span>
                                                </div>
                                            </div>
                                            <h2 className="fw-bold mb-1">{users}</h2>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-6 col-md-12 col-12">
                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div
                                                className="d-flex align-items-center justify-content-between mb-3 lh-1">
                                                <div>
                                            <span
                                                className="fs-6 text-uppercase fw-semibold ls-md">Compte Approuvéé</span>
                                                </div>
                                                <div>
                                                    <span className="fe fe-user-check fs-3 text-primary"></span>
                                                </div>
                                            </div>
                                            <h2 className="fw-bold mb-1">{usersApproved}</h2>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-6 col-md-12 col-12">
                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div
                                                className="d-flex align-items-center justify-content-between mb-3 lh-1">
                                                <div>
                                            <span
                                                className="fs-6 text-uppercase fw-semibold ls-md">Compte en Attente</span>
                                                </div>
                                                <div>
                                                    <span className="fe fe-user-x fs-3 text-primary"></span>
                                                </div>
                                            </div>
                                            <h2 className="fw-bold mb-1">{usersNotApproved}</h2>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-6 col-md-12 col-12">
                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div
                                                className="d-flex align-items-center justify-content-between mb-3 lh-1">
                                                <div>
                                                    <span
                                                        className="fs-6 text-uppercase fw-semibold ls-md">Contacts</span>
                                                </div>
                                                <div>
                                                    <span className="fe fe-message-square fs-3 text-primary"></span>
                                                </div>
                                            </div>
                                            <h2 className="fw-bold mb-1">{contacts}</h2>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-6 col-md-12 col-12">
                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div
                                                className="d-flex align-items-center justify-content-between mb-3 lh-1">
                                                <div>
                                            <span
                                                className="fs-6 text-uppercase fw-semibold ls-md">Secteur Activité</span>
                                                </div>
                                                <div>
                                                    <span className="fe fe-file fs-3 text-primary"></span>
                                                </div>
                                            </div>
                                            <h2 className="fw-bold mb-1">{secteurs}</h2>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-6 col-md-12 col-12">
                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div
                                                className="d-flex align-items-center justify-content-between mb-3 lh-1">
                                                <div>
                                                    <span
                                                        className="fs-6 text-uppercase fw-semibold ls-md">Type Emplois</span>
                                                </div>
                                                <div>
                                                    <span className="fe fe-layout fs-3 text-primary"></span>
                                                </div>
                                            </div>
                                            <h2 className="fw-bold mb-1">{typesEmplois}</h2>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-6 col-md-12 col-12">
                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div
                                                className="d-flex align-items-center justify-content-between mb-3 lh-1">
                                                <div>
                                                    <span
                                                        className="fs-6 text-uppercase fw-semibold ls-md">Type Experiences</span>
                                                </div>
                                                <div>
                                                    <span className="fe fe-layout fs-3 text-primary"></span>
                                                </div>
                                            </div>
                                            <h2 className="fw-bold mb-1">{typesExperience}</h2>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-6 col-md-12 col-12">
                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div
                                                className="d-flex align-items-center justify-content-between mb-3 lh-1">
                                                <div>
                                                    <span className="fs-6 text-uppercase fw-semibold ls-md">Niveau Etudes</span>
                                                </div>
                                                <div>
                                                    <span className="fe fe-book-open fs-3 text-primary"></span>
                                                </div>
                                            </div>
                                            <h2 className="fw-bold mb-1">{etudes}</h2>

                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </section>
            </main>
        </div>


    );
};

export default Dashboard;
