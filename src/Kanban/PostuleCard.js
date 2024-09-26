// PostuleCard.js
import React from 'react';
import './PostuleCard.css';
import CircularProgress from "./CircleProgress";

const baseURL = 'http://localhost:5000';
const PostuleCard = ({ postule, user }) => {

    return (
        <div>
            <div className="task-header">
                <img src={`${baseURL}${user?.image}`} alt={`${user?.nom} ${user?.prenom}`} className="user-image" />
                <div className="user-info">
                    <p className="user-name">{user?.nom} {user?.prenom}</p>
                    <p className="user-email">{user?.email} </p>
                </div>

            </div>

            <div className="task-footer">
                <p className="creation-date">
                    <i className="fe fe-calendar" aria-hidden="true" style={{marginRight: '5px'}}></i>
                    {new Date(postule.dateCreation).toLocaleDateString()}
                </p>
                <CircularProgress score={postule.score}/>
            </div>
        </div>
    );
};

export default PostuleCard;
