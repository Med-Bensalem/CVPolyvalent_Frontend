import React, {useEffect, useState} from 'react';
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import {getAllContacts, markContactAsRead} from "../Services/contactService";
import ReactPaginate from "react-paginate";
import '../Template.css';

const itemsPerPage = 5;

const ListContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemOffset, setItemOffset] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);




    useEffect(() => {
        // Fonction pour charger les contacts au chargement du composant
        const fetchContacts = async () => {
            try {
                const data = await getAllContacts();
                setContacts(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(contacts.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(contacts.length / itemsPerPage));
    }, [itemOffset, contacts]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % contacts.length;
        setItemOffset(newOffset);
    };

    const markAsRead = async (contactId) => {
        try {
            await markContactAsRead(contactId);
            // Mettre à jour les contacts après la mise à jour
            const updatedContacts = contacts.map(contact => {
                if (contact._id === contactId) {
                    return { ...contact, read: true };
                }
                return contact;
            });
            setContacts(updatedContacts);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div id="db-wrapper">
            <Sidebar/>

            <main id="page-content">
                <div className="header">
                    <Header/>
                </div>

                <section className="container-fluid p-4">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div
                                className="border-bottom pb-3 mb-3 d-md-flex align-items-center justify-content-between">
                                <div className="mb-2 mb-lg-0">
                                    <h1 className="mb-0 h2 fw-bold">Liste Contacts</h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                               Gestion Contacts
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Liste Contacts</li>
                                        </ol>
                                    </nav>
                                </div>

                            </div>
                        </div>
                    </div>
                    {currentItems.length === 0 ? (
                    <div className="col-12 mb-2">
                        <div className="alert alert-info alert-dismissible fade show" role="alert">
                            Désolé, aucune contacts disponible pour le moment. Revenez bientôt !
                        </div>
                    </div>
                    ) : (
                    <>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="table-responsive overflow-y-hidden">
                                        <table className="table mb-0 text-nowrap table-hover table-centered">
                                            <thead>
                                            <tr>
                                                <th>Nom & Prénom</th>
                                                <th>Email</th>
                                                <th>Téléphone</th>
                                                <th>Message</th>
                                                <th>Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="5">Chargement en cours...</td>
                                                </tr>
                                            ) : (
                                                currentItems.map(contact => (
                                                    <tr key={contact._id} className={!contact.read ? 'unread-contact' : ''}>
                                                        <td>{contact.nom} {contact.prenom}</td>
                                                        <td>{contact.email}</td>
                                                        <td>{contact.phone}</td>
                                                        <td>{contact.message}</td>
                                                        <td>
                                                            <div className="dropdown dropstart">
                                                                <a
                                                                    className="btn-icon btn btn-ghost btn-sm rounded-circle"
                                                                    href="#"
                                                                    role="button"
                                                                    id={`Dropdown${contact._id}`}
                                                                    data-bs-toggle="dropdown"
                                                                    aria-haspopup="true"
                                                                    aria-expanded="false"
                                                                >
                                                                    <i className="fe fe-more-vertical"></i>
                                                                </a>
                                                                <div className="dropdown-menu" aria-labelledby={`Dropdown${contact._id}`}>
                                                                    <span className="dropdown-header">Paramètres</span>
                                                                    <a className="dropdown-item" onClick={() => markAsRead(contact._id)}>
                                                                        <i className="fe fe-edit dropdown-item-icon"></i>
                                                                        Lire Message
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="suivant >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="< précédent"
                            renderOnZeroPageCount={null}
                            containerClassName="pagination"
                            activeClassName="active"

                        />
                    </>
                    )}


                </section>
            </main>
        </div>
    );
};

export default ListContacts;
