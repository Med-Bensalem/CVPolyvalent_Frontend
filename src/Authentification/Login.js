import React, {useState} from 'react';
import {getUserById, login} from '../Services/authService';
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../Alert/SuccessAlert";
import {jwtDecode} from "jwt-decode";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState('');
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);



    const validate = () => {
        const errors = {};

        if (!email) {
            errors.email = 'Veuillez entrer votre adresse e-mail.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'S\'il vous plaît, mettez une adresse email valide.';
        }

        if (!password) {
            errors.password = 'Veuillez entrer votre mot de passe .';
        } else if (password.length < 6) {
            errors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBackendError(''); // Clear any previous backend error
        if (!validate()) return;

        try {
            const response = await login(email, password);

            if (response.token) {
                localStorage.setItem('token', response.token);
                const decodedToken = jwtDecode(response.token);
                const userConnected = await getUserById(decodedToken.userId);

                setSuccess(true)
                setTimeout(() => {

                    if (userConnected.role === 'admin') {
                        navigate('/dashboard');
                    } else {
                        navigate('/profile');
                    }
                }, 1500);

            } else if (response.message) {
                setBackendError(response.message);
            }
        } catch (error) {
            setBackendError(error.message);
        }
    };

    return (
        <main>
            <section className="container d-flex flex-column vh-100">
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <a href="/"><img src="assets/images/brand/logo/logo-icon.svg" className="mb-4" alt="logo-icon"/></a>
                                    <h1 className="mb-1 fw-bold">Login</h1>
                                    <span>
                                        Vous n'avez pas de compte ?
                                        <a href="/register" className="ms-1">Inscription</a>
                                    </span>
                                </div>

                                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                    {backendError && <div className="alert alert-danger">{backendError}</div>}
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Adresse E-mail<span
                                            className="red-asterisk">*</span></label>
                                        <input
                                            type="email"
                                            id="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Adresse E-mail"
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Mot de passe <span
                                            className="red-asterisk">*</span></label>
                                        <input
                                            type="password"
                                            id="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="**************"
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>

                                    <div className="d-lg-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check"></div>
                                        <div>
                                            <a href="/reset-password">Mot de passe oublié?</a>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-grid">
                                            <button type="submit" className="btn btn-primary">Login</button>
                                        </div>
                                    </div>
                                </form>
                                {success && (
                                    <SuccessAlert message="Connexion avec succès" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default LoginPage;
