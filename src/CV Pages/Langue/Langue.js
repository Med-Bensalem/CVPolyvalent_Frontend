import React, {useEffect, useState} from 'react';
import {BsPlusCircleFill} from "react-icons/bs";
import {jwtDecode} from "jwt-decode";
import {addLanguageToUser, deleteLanguage, getLanguagesByUser} from "../../Services/langueService";

const Langue = () => {
    const [nom, setNom] = useState('');
    const [langues, setLangues] = useState([]);
    const [userId, setUserId] = useState(null);

    const fetchLangues = async () => {
        // Implement fetching competences by user
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            try {
                const fetchedLangues = await getLanguagesByUser(user.userId);
                setLangues(fetchedLangues);
                setUserId(user.userId);
                console.log(user.userId)
            } catch (error) {
                console.error('Error fetching langue:', error);
            }
        }
    };

    useEffect(() => {
        fetchLangues(); // Fetch competences when the component mounts
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const competenceData = { nom };
            const response = await addLanguageToUser(userId, competenceData);
            console.log(response);
            setNom('');
            fetchLangues();


        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDelete = async (languageId) => {
        try {
            await deleteLanguage(userId, languageId);
            setLangues(prevLangues => prevLangues.filter(langue => langue._id !== languageId));
        } catch (error) {
            console.error('Error deleting langue:', error);
        }
    };
    return (
        <div className="card-body">
            <div className="bg-light rounded p-2 cardStyle">
                <h4>Langues</h4>
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
                {langues.map((langue, index) => (
                    <a className="btn btn-secondary btn-sm mx-2" key={index}>
                        <span>{langue.nom}</span> <i className="fas fa-times mx-1" onClick={() => handleDelete(langue._id)}></i>
                    </a>
                ))}
            </div>


        </div>

    );
};

export default Langue;
