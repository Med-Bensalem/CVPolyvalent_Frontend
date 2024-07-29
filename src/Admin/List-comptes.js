import React, {useEffect, useState} from 'react';
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import {getUsersApproved, getUsersByRole, getUsersNotApproved, userApproval, userReject} from "../Services/authService";
import ReactPaginate from "react-paginate";

const itemsPerPage = 5;
const ListComptes = () => {
    const [users, setUsers] = useState([]);
    const [usersApproved, setUsersApprouved] = useState([]);
    const [usersNotApproved, setUsersNotApprouved] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentItemsApprouved, setCurrentItemsApprouved] = useState([]);
    const [pageCountApprouved, setPageCountApprouved] = useState(0);
    const [currentItemsNotApprouved, setCurrentItemsNotApprouved] = useState([]);
    const [pageCountNotApprouved, setPageCountNotApprouved] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [itemOffsetApprouved, setItemOffsetApprouved] = useState(0);
    const [itemOffsetNotApprouved, setItemOffsetNotApprouved] = useState(0);
    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const fetchedUsers = await getUsersByRole();
                const fetchedApprovedUsers = await getUsersApproved();
                const fetchedNotApprovedUsers = await getUsersNotApproved();
                setUsers(fetchedUsers);
                setUsersApprouved(fetchedApprovedUsers);
                setUsersNotApprouved(fetchedNotApprovedUsers);

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(users.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(users.length / itemsPerPage));

        const endOffsetApprouved = itemOffsetApprouved + itemsPerPage;
        setCurrentItemsApprouved(usersApproved.slice(itemOffsetApprouved, endOffsetApprouved));
        setPageCountApprouved(Math.ceil(usersApproved.length / itemsPerPage));

        const endOffsetNotApprouved = itemOffsetNotApprouved + itemsPerPage;
        setCurrentItemsNotApprouved(usersNotApproved.slice(itemOffsetNotApprouved, endOffsetNotApprouved));
        setPageCountNotApprouved(Math.ceil(usersNotApproved.length / itemsPerPage));

    }, [itemOffset,itemOffsetNotApprouved,itemOffsetApprouved, users,usersNotApproved,usersApproved]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % users.length;
        setItemOffset(newOffset);
    };
    const handlePageClickApprouved = (event) => {
        const newOffset = (event.selected * itemsPerPage) % usersApproved.length;
        setItemOffsetApprouved(newOffset);
    };
    const handlePageClickNotApprouved = (event) => {
        const newOffset = (event.selected * itemsPerPage) % usersNotApproved.length;
        setItemOffsetNotApprouved(newOffset);
    };

    const approveUser = async (userId) => {
        try {
            const success = await userApproval(userId);
            if (success) {
                // Actualiser la liste des utilisateurs après l'approbation
                const updatedUsers = await getUsersByRole();
                setUsers(updatedUsers);
            } else {
                console.error('Failed to approve user');
            }
        } catch (error) {
            console.error('Error approving user:', error);
        }
    };

    const rejectUser = async (userId) => {
        try {
            const success = await userReject(userId);
            if (success) {
                // Actualiser la liste des utilisateurs après l'approbation
                const updatedUsers = await getUsersByRole();
                setUsers(updatedUsers);
            } else {
                console.error('Failed to approve user');
            }
        } catch (error) {
            console.error('Error approving user:', error);
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
                            <div className="border-bottom pb-3 mb-3 d-md-flex align-items-center justify-content-between">
                                <div className="mb-3 mb-md-0">
                                    <h1 className="mb-1 h2 fw-bold">Liste Comptes</h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                Gestion Comptes
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Liste Comptes</li>
                                        </ol>
                                    </nav>
                                </div>

                            </div>
                        </div>
                    </div>
                    {users.length === 0 ? (
                        <div className="col-12 mb-2">
                            <div className="alert alert-info alert-dismissible fade show" role="alert">
                                Désolé, aucune utilisateur disponible pour le moment. Revenez bientôt !
                            </div>
                        </div>
                    ) : (
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="card rounded-3">
                                <div className="card-header p-0">
                                    <div>
                                        <ul className="nav nav-lb-tab border-bottom-0" id="tab" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" id="courses-tab" data-bs-toggle="pill"
                                                   href="#courses" role="tab" aria-controls="courses"
                                                   aria-selected="true">Tout</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="approved-tab" data-bs-toggle="pill"
                                                   href="#approved" role="tab" aria-controls="approved"
                                                   aria-selected="false">Approuvé</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="pending-tab" data-bs-toggle="pill"
                                                   href="#pending" role="tab" aria-controls="pending"
                                                   aria-selected="false">En attente</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="p-4 row">
                                    <form className="d-flex align-items-center col-12 col-md-12 col-lg-12">
                                        <span className="position-absolute ps-3 search-icon"><i
                                            className="fe fe-search"></i></span>
                                        <input type="search" className="form-control ps-6" placeholder="Recherche "/>
                                    </form>
                                </div>
                                <div>

                                    <div className="tab-content" id="tabContent">
                                        <div className="tab-pane fade show active" id="courses" role="tabpanel" aria-labelledby="courses-tab">
                                            <div className="table-responsive border-0 overflow-y-hidden">
                                                <table className="table mb-0 text-nowrap table-centered table-hover">
                                                    <thead className="table-light">
                                                    <tr>
                                                        <th>Nom Entreprise</th>

                                                        <th>Email</th>
                                                        <th>Status</th>


                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {currentItems.map((user, index) => (
                                                        <tr key={index}>

                                                            <td>
                                                                {user.nom}
                                                            </td>

                                                            <td>
                                                                {user.email}
                                                            </td>
                                                            <td>
                                                                {user.approuver ? (
                                                                    <span
                                                                        className="badge-dot bg-success me-1 d-inline-block align-middle"></span>
                                                                ) : (
                                                                    <span
                                                                        className="badge-dot bg-warning me-1 d-inline-block align-middle"></span>
                                                                )}
                                                                {user.approuver ? "Approuvé" : "En attente"}
                                                            </td>


                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
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
                                        </div>
                                        <div className="tab-pane fade" id="approved" role="tabpanel" aria-labelledby="approved-tab">
                                            <div className="table-responsive border-0 overflow-y-hidden">
                                                <table className="table mb-0 text-nowrap table-centered table-hover">
                                                    <thead className="table-light">
                                                    <tr>
                                                        <th>Nom Societe</th>

                                                        <th>Email</th>

                                                        <th>ACTION</th>

                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {currentItemsApprouved.map((user, index) => (
                                                        <tr key={index}>

                                                            <td>
                                                                {user.nom}
                                                            </td>
                                                            
                                                            <td>
                                                                {user.email}
                                                            </td>

                                                            <td>
                                                                <a href="" onClick={() => rejectUser(user._id)}
                                                                   className="btn btn-outline-secondary btn-sm mx-2">Reject</a>

                                                            </td>

                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <ReactPaginate
                                                breakLabel="..."
                                                nextLabel="suivant >"
                                                onPageChange={handlePageClickApprouved}
                                                pageRangeDisplayed={5}
                                                pageCount={pageCountApprouved}
                                                previousLabel="< précédent"
                                                renderOnZeroPageCount={null}
                                                containerClassName="pagination"
                                                activeClassName="active"

                                            />

                                        </div>
                                        <div className="tab-pane fade" id="pending" role="tabpanel" aria-labelledby="pending-tab">
                                            <div className="table-responsive border-0 overflow-y-hidden">
                                                <table className="table mb-0 text-nowrap table-centered table-hover">
                                                    <thead className="table-light">
                                                    <tr>
                                                        <th>Nom Entreprise</th>

                                                        <th>Email</th>

                                                        <th>ACTION</th>

                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {currentItemsNotApprouved.map((user, index) => (
                                                        <tr key={index}>

                                                            <td>
                                                                {user.nom}
                                                            </td>

                                                            <td>
                                                                {user.email}
                                                            </td>

                                                            <td>

                                                            <a href="" className="btn btn-success btn-sm" onClick={() => approveUser(user._id)}>Approved</a>
                                                        </td>

                                                    </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <ReactPaginate
                                                breakLabel="..."
                                                nextLabel="suivant >"
                                                onPageChange={handlePageClickNotApprouved}
                                                pageRangeDisplayed={5}
                                                pageCount={pageCountNotApprouved}
                                                previousLabel="< précédent"
                                                renderOnZeroPageCount={null}
                                                containerClassName="pagination"
                                                activeClassName="active"

                                            />
                                        </div>
                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>
                    )}
                </section>
            </main>
        </div>
);
};

export default ListComptes;
