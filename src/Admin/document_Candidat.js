import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import React, {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";

import {getAcceptedPostules} from "../Services/postuleService";
import {useNavigate} from "react-router-dom";
import moment from "moment/moment";


const itemsPerPage = 5;
const CandidatAccepte = () => {
    const [candidats, setCandidats] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const navigate = useNavigate();

    const fetchCandidat = async () => {
       const postules = await getAcceptedPostules();
       setCandidats(postules)
    };

    useEffect(() => {
        fetchCandidat();
    }, []);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(candidats.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(candidats.length / itemsPerPage));
    }, [itemOffset, candidats]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % candidats.length;
        setItemOffset(newOffset);
    };

    const handleButtonClick = (id) => {
        // Navigate to the WorkTestComponent with test._id in the URL
        navigate(`/work-tests/${id}`);
    };

    return (

        <div id="db-wrapper">
            <Sidebar />

            <main id="page-content">
                <div className="header">
                    <Header />
                </div>

                <section className="container-fluid p-4">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="border-bottom pb-3 mb-3 d-md-flex align-items-center justify-content-between">
                                <div className="mb-2 mb-lg-0">
                                    <h1 className="mb-0 h2 fw-bold">Liste Candidats Acceptées </h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                Gestion Candidats Acceptées
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Liste Candidats Acceptées</li>
                                        </ol>
                                    </nav>
                                </div>

                            </div>
                        </div>
                    </div>

                    {currentItems.length === 0 ? (
                        <div className="col-12 mb-2">
                            <div className="alert alert-info alert-dismissible fade show" role="alert">
                                Désolé, aucun Test disponible pour le moment. Revenez bientôt !
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="mb-0">Candidats Acceptées</h4>
                                        </div>
                                        <div className="table-responsive overflow-y-hidden">
                                            <table className="table mb-0 text-nowrap table-hover table-centered">
                                                <thead className="table-light">
                                                <tr>
                                                    <th>Nom & Prénom</th>
                                                    <th>Email</th>
                                                    <th>Date Postulation</th>
                                                    <th>Score</th>
                                                    <th></th>

                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems.map((postule) => (
                                                    <tr key={postule._id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">

                                                                <a href="#" className="text-inherit">
                                                                    {postule.userId.nom} {postule.userId.prenom}
                                                                </a>

                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">

                                                                <a href="#" className="text-inherit">
                                                                    {postule.userId.email}
                                                                </a>

                                                            </div>
                                                        </td>
                                                        <td>
                                                            {moment(postule.dateCreation).format('DD/MM/YYYY')}
                                                        </td>
                                                        <td>
                                                            {postule.score}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-primary me-2"

                                                                onClick={() => handleButtonClick(postule._id)}
                                                            >
                                                                Suivie documents
                                                            </button>
                                                        </td>

                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
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
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    activeClassName="active"
                                />
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>


    )
}

export default CandidatAccepte