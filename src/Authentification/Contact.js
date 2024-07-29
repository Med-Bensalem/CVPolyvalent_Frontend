import React, {useState} from 'react';
import NavbarPage from "../layouts/Navbar";
import FooterPage from "../layouts/Footer";
import {ajoutContact} from "../Services/contactService";
import SuccessAlert from "../Alert/SuccessAlert";
import {useNavigate} from "react-router-dom";

const ContactPage = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};

        if (!nom) {
            errors.nom = 'Veuillez entrer votre nom.';
        }

        if (!prenom) {
            errors.prenom = 'Veuillez entrer votre prénom.';
        }

        if (!email) {
            errors.email = 'Veuillez entrer votre adresse e-mail.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'S\'il vous plaît, mettez une adresse email valide.';
        }

        if (!phone) {
            errors.phone = 'Veuillez entrer votre numéro de téléphone.';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        try {
            await ajoutContact({ nom, prenom, email, phone, message });
            // Réinitialiser le formulaire après l'ajout du contact
            setNom('');
            setPrenom('');
            setEmail('');
            setPhone('');
            setMessage('');
            setErrors('');
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            setErrors('Erreur lors de l\'ajout du contact');
            console.error(error);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Réinitialiser le message d'erreur lorsque l'utilisateur commence à saisir dans le champ
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));

        // Mettre à jour l'état correspondant au champ
        switch (name) {
            case 'nom':
                setNom(value);
                break;
            case 'prenom':
                setPrenom(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            default:
                break;
        }
    };
    return (
        <div>
            <NavbarPage/>
            <main>
                <section className="container-fluid">
                    <div className="row align-items-center min-vh-100 ">
                        <div className="offset-xl-1 col-xl-5 col-lg-6 col-md-12 col-12 ">
                            <div className="py-8 me-xl-8 pe-xl-8">
                                <div className="d-flex justify-content-between mb-7 align-items-center">
                                    <a href="/"><img src="assets/images/brand/logo/logo.svg" alt="logo"
                                                                 className="logo-inverse"/></a>
                                    <div className="form-check form-switch theme-switch d-none">
                                        <input className="form-check-input" type="checkbox" role="switch"
                                               id="flexSwitchCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="display-4 fw-bold">Get In Touch.</h1>
                                    <p className="lead text-dark">Fill in the form to the right to get in touch with
                                        someone on our team, and we will reach out shortly.</p>
                                    <div className="mt-8 fs-4">
                                        <p className="mb-4">
                                            If you are seeking support please visit our
                                            <a href="#">support portal</a>
                                            before reaching out directly.
                                        </p>

                                        <p>
                                            <i className="bi bi-telephone text-primary me-2"></i>
                                            + 0123-456-7890
                                        </p>
                                        <p>
                                            <i className="bi bi-envelope-open text-primary me-2"></i>
                                            hello@geekui.com
                                        </p>
                                        <p className="d-flex">
                                            <i className="bi bi-geo-alt text-primary me-2"></i>
                                            2652 Kooter Lane Charlotte, NC 28263
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className="col-lg-6 d-lg-flex align-items-center w-lg-50 min-vh-lg-100 position-fixed-lg bg-cover bg-light top-0 right-0">
                            <div className="px-4 px-xl-8 mx-xl-8 py-8 py-lg-0">
                                <div>
                                    <form className="row needs-validation" onSubmit={handleSubmit} noValidate>
                                        <div className="mb-3 col-12 col-md-6">
                                            <label className="form-label" htmlFor="fname">
                                                Nom :
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                                                   type="text" name="nom" id="nom"
                                                   value={nom}
                                                   onChange={handleChange}                                                   placeholder="Nom"
                                                   required/>
                                            {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                                        </div>
                                        <div className="mb-3 col-12 col-md-6">
                                            <label className="form-label" htmlFor="lname">
                                                Prénom:
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                                                   type="text" name="prenom" id="prenom"
                                                   value={prenom}
                                                   onChange={handleChange}
                                                   placeholder="Prénom" required/>
                                            {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}

                                        </div>
                                        <div className="mb-3 col-12 col-md-6">
                                            <label className="form-label" htmlFor="email">
                                                Adresse E-mail:
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                   type="email" id="email" name="email"
                                                   value={email}
                                                   onChange={handleChange}                                                   placeholder="Email" required/>
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>
                                        <div className="mb-3 col-12 col-md-6">
                                            <label className="form-label" htmlFor="phone">
                                                Numéro de téléphone:
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                   type="text" name="phone" id="phone"
                                                   value={phone}
                                                   onChange={handleChange}
                                                   placeholder="Numéro de téléphone" required/>
                                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                        </div>

                                        <div className="mb-3 col-12">
                                            <label className="text-dark form-label" htmlFor="messages">Message:</label>
                                            <textarea className="form-control" id="messages" rows="3"
                                                      value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Messages"></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </div>
                                    </form>
                                    {success && (
                                        <SuccessAlert message="Le contact a été ajouté avec succès !" />
                                    )}
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

export default ContactPage;
