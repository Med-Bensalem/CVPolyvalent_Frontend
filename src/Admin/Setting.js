import React, { useEffect, useState } from 'react';
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import {jwtDecode} from "jwt-decode";
import {changePassword} from "../Services/authService"; // Correctly imported as default

const Setting = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userId, setUserId] = useState(null);

    const fetchUser = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            setUserId(user.userId); // Correctly set the userId from the decoded token
        }
    };

    useEffect(() => {
        fetchUser(); // Fetch user details when the component mounts
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('\n' +
                'Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas.');
            return;
        }

        try {
            const result = await changePassword(userId, currentPassword, newPassword);

            if (result && result.success) {
                setSuccess(result.message);
                setError('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            if (err.message === "Ce mot de passe est incorrect") {
                setError('Ce mot de passe est incorrect.');
            } else {
                setError('An error occurred while changing the password.');
            }
            setSuccess('');

        }
    };



    return (
        <div id="db-wrapper">
            <Sidebar />

            <main id="page-content">
                <div className="header">
                    <Header />
                </div>

                <section className="container-fluid p-4">
                    <div className="col-lg-12 col-md-8 col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="mb-0">Changer le mot de passe</h4>
                            </div>
                            <div className="card-body">
                                <form className="row needs-validation" noValidate onSubmit={handleSubmit}>
                                    <div className="col-lg-6 col-md-12 col-12">
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="currentpassword">Mot de passe actuel</label>
                                            <input
                                                id="currentpassword"
                                                type="password"
                                                name="currentpassword"
                                                className="form-control"
                                                value={currentPassword}
                                                placeholder="Mot de passe actuel"
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                            />
                                            <div className="invalid-feedback">Please enter current password.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="newpassword">Nouveau mot de passe</label>
                                            <input
                                                id="newpassword"
                                                type="password"
                                                name="newpassword"
                                                className="form-control"
                                                value={newPassword}
                                                placeholder="Nouveau mot de passe"
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                            <div className="invalid-feedback">Please enter new password.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="confirmpassword">Confirmer le nouveau mot de passe</label>
                                            <input
                                                id="confirmpassword"
                                                type="password"
                                                name="confirmpassword"
                                                className="form-control mb-2"
                                                value={confirmPassword}
                                                placeholder="Confirmer le nouveau mot de passe"
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <div className="invalid-feedback">Please confirm new password.</div>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Save Password</button>
                                        {error && <div className="text-danger mt-3">{error}</div>}
                                        {success && <div className="text-success mt-3">{success}</div>}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Setting;
