import React, {useEffect, useState} from 'react';
import {BsPlusCircleFill} from "react-icons/bs";
import {jwtDecode} from "jwt-decode";
import {addCompetenceToUser, deleteCompetence, getCompetencesByUser} from "../../Services/competenceService";

const Competence = () => {
    const [nom, setNom] = useState('');
    const [competences, setCompetences] = useState([]);
    const [userId, setUserId] = useState(null);

    const fetchCompetences = async () => {
        // Implement fetching competences by user
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            try {
                const fetchedCompetences = await getCompetencesByUser(user.userId);
                setCompetences(fetchedCompetences);
                setUserId(user.userId);
            } catch (error) {
                console.error('Error fetching competences:', error);
            }
        }
    };

    useEffect(() => {
        fetchCompetences(); // Fetch competences when the component mounts
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const competenceData = { nom };
            const response = await addCompetenceToUser(userId, competenceData);
            console.log(response);
            setNom('');
            fetchCompetences();


        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDelete = async (competenceId) => {
        try {
            await deleteCompetence(userId, competenceId);
            setCompetences(prevCompetences => prevCompetences.filter(competence => competence._id !== competenceId));
        } catch (error) {
            console.error('Error deleting competence:', error);
        }
    };
    return (
        <div className="card-body">
            <div className="bg-light rounded p-2 cardStyle">
                <h4>Compétences </h4>
                <div className="input-group mb-3 ">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ajouter une compétence"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={handleSubmit}>
                        <BsPlusCircleFill/>
                    </button>
                </div>
                {competences.map((competence, index) => (
                    <a className="btn btn-secondary btn-sm mx-2" key={index}>
                        <span  >{competence.nom}</span> <i className="fas fa-times mx-1" onClick={() => handleDelete(competence._id)}></i>
                    </a>
                ))}

            </div>


        </div>
    );
};

export default Competence;
