// Template2.js
import React, {useEffect, useState} from 'react';
import {BsPlusCircleFill} from "react-icons/bs";
import {addInterestToUser, deleteInterest, getInterestsByUser} from "../../Services/interetService";
import {jwtDecode} from "jwt-decode";

const Interet = () => {
    const [nom, setNom] = useState('');
    const [interests, setInterests] = useState([]);
    const [userId, setUserId] = useState(null);

    const fetchInterests = async () => {
        // Implement fetching competences by user
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            try {
                const fetchedInterests = await getInterestsByUser(user.userId);
                setInterests(fetchedInterests);
                setUserId(user.userId);
            } catch (error) {
                console.error('Error fetching interets:', error);
            }
        }
    };

    useEffect(() => {
        fetchInterests(); // Fetch competences when the component mounts
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const interetData = { nom };
            const response = await addInterestToUser(userId, interetData);
            console.log(response);
            setNom('');
            fetchInterests();


        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDelete = async (interestId) => {
        try {
            await deleteInterest(userId, interestId);
            setInterests(prevInterests => prevInterests.filter(interest => interest._id !== interestId));
        } catch (error) {
            console.error('Error deleting interest:', error);
        }
    };
    return (
        <div className="card-body">
            <div className="bg-light rounded p-2 cardStyle">
                <h4>Interets</h4>
                <div className="input-group mb-3 ">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ajouter un intérêt"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={handleSubmit}>
                        <BsPlusCircleFill/>
                    </button>
                </div>
                {interests.map((interest, index) => (
                    <a className="btn btn-secondary btn-sm mx-2" key={index} >
                        <span>{interest.nom}</span> <i className="fas fa-times mx-1" onClick={() => handleDelete(interest._id)}></i>
                    </a>
                ))}
            </div>


        </div>
    );
};

export default Interet;
