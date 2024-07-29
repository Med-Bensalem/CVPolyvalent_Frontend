import React, {useEffect, useState} from 'react';
import {getUserById, logout} from "../Services/authService";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const baseURL = 'http://localhost:5000';
const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const user = jwtDecode(token);
                try {
                    const userResponse = await getUserById(user.userId);
                    setUser(userResponse);


                } catch (error) {
                    console.error('Error fetching user details:', error);
                    // Handle error if necessary
                }
            }
        };

        fetchData();
    }, []);

    const imagePath = user.image ? baseURL + user.image : "assets/images/avatar/avatar-1.jpg";

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (
        <nav className="navbar-default navbar navbar-expand-lg">


            <div className="ms-auto d-flex">

                <ul className="navbar-nav navbar-right-wrap ms-2 d-flex nav-top-wrap">

                    <li className="dropdown ms-2">
                        <a className="rounded-circle" href="#" role="button" id="dropdownUser"
                           data-bs-toggle="dropdown" aria-expanded="false">
                            <div className="avatar avatar-md avatar-indicators avatar-online">
                                <img alt="avatar" src={imagePath}
                                     className="rounded-circle"/>
                            </div>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUser">
                            <div className="dropdown-item">
                                <div className="d-flex">
                                    <div className="avatar avatar-md avatar-indicators avatar-online">
                                        <img alt="avatar" src={imagePath}
                                             className="rounded-circle"/>
                                    </div>
                                    <div className="ms-3 lh-1">
                                        <h5 className="mb-1">{user.nom} {user.prenom}</h5>
                                        <p className="mb-0">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                            {user.role !== 'admin' && (
                                <>
                                    <div className="dropdown-divider"></div>
                                    <ul className="list-unstyled">

                                        <li>
                                            <a className="dropdown-item" href="/profile">
                                                <i className="fe fe-user me-2"></i>
                                                Profile
                                            </a>
                                        </li>




                                        <li>
                                            <a className="dropdown-item" href="/setting">
                                                <i className="fe fe-settings me-2"></i>
                                                Paramètres
                                            </a>
                                        </li>
                                    </ul>
                                </>
                            )}
                            {user.role === 'candidat' && (
                                <>
                            <ul className="list-unstyled">
                                <li>
                                    <a className="dropdown-item" href="/portfolio">
                                        <i className="fe fe-eye me-2"></i>
                                        View Portfolio <span
                                        className={`${user.views > 0 ? 'text-success mx-2' : 'text-danger mx-2'}`}>{user.views}</span>
                                    </a>
                                </li>
                            </ul>
                                </>
                            )}

                            <div className="dropdown-divider"></div>
                            <ul className="list-unstyled">
                                <li>
                                    <a className="dropdown-item" href="" onClick={handleLogout}>
                                        <i className="fe fe-power me-2"></i>
                                        Se déconnecter
                                    </a>
                                </li>
                                </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>

    );
};

export default Header;
