import React, { useEffect, useState } from 'react';
import './Kanban.css';
import { useParams } from "react-router-dom";
import { getWorkflowByOffreId } from "../Services/workflowService";
import { getStepsByWorkflowId } from "../Services/stepService";
import { getPostulesByOffer, sendStatusChangeEmails, updatePostuleStatus } from "../Services/postuleService";
import { getUserById } from "../Services/authService";
import PostuleCard from './PostuleCard';
import SuccessAlert from "../Alert/SuccessAlert";

function Kanban() {
    const { id } = useParams();
    const [steps, setSteps] = useState([]);
    const [postules, setPostules] = useState([]);
    const [previousPostules, setPreviousPostules] = useState([]);
    const [users, setUsers] = useState({});
    const [draggedTask, setDraggedTask] = useState(null);
    const [successMessage, setSuccessMessage] = useState(""); // State for success message

    useEffect(() => {
        const fetchData = async () => {
            try {
                const workflow = await getWorkflowByOffreId(id);
                if (workflow && workflow._id) {
                    const fetchedSteps = await getStepsByWorkflowId(workflow._id);
                    setSteps(fetchedSteps);
                }

                const fetchedPostules = await getPostulesByOffer(id);
                setPostules(fetchedPostules);
                setPreviousPostules(fetchedPostules); // Store the initial postules

                const userPromises = fetchedPostules.map((postule) =>
                    getUserById(postule.userId)
                );
                const fetchedUsers = await Promise.all(userPromises);

                const usersById = fetchedUsers.reduce((acc, user) => {
                    acc[user._id] = user;
                    return acc;
                }, {});

                setUsers(usersById);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleDragStart = (task) => {
        setDraggedTask(task);
    };

    const handleDrop = async (stepId) => {
        if (draggedTask) {
            const { _id } = draggedTask;

            // Update the postule status on the backend
            try {
                await updatePostuleStatus(_id, stepId);

                // Update the status of the postule in the local state
                const updatedPostules = postules.map((postule) =>
                    postule._id === _id ? { ...postule, status: stepId } : postule
                );
                setPostules(updatedPostules);
            } catch (error) {
                console.error('Error updating postule status:', error);
            }
        }

        setDraggedTask(null);
    };

    const handleSendEmails = async () => {
        // Create an array to hold IDs of postules with changed statuses
        const postuleIds = postules
            .filter(postule => {
                const previousPostule = previousPostules.find(p => p._id === postule._id);
                return previousPostule && postule.status !== previousPostule.status; // Compare current status with previous status
            })
            .map(postule => postule._id); // Get the IDs of changed postules

        // If there are postules with changed statuses, send emails
        if (postuleIds.length > 0) {
            try {
                await sendStatusChangeEmails(postuleIds);
                setSuccessMessage("Emails sent successfully");

                // Clear the success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage("");
                }, 1500); // Duration in milliseconds

                // Update previousPostules to the current postules after sending emails
                setPreviousPostules(postules); // Set current postules as previous for next comparison
            } catch (error) {
                console.error('Error sending emails:', error);
                setSuccessMessage("Error sending emails"); // Set error message

                // Clear the error message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage("");
                }, 1500);
            }
        } else {
            setSuccessMessage("No statuses changed, no emails sent.");

            // Clear the message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 1500);
        }
    };

    return (
        <div>
            <div className="kanban-board">
                {steps.map((step) => (
                    <div
                        key={step._id}
                        className="kanban-column"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(step.step_order)}
                    >
                        <h5 className="text-center">{step.titre}</h5>
                        <div className="kanban-tasks">
                            {postules
                                .filter((postule) => postule.status === step.step_order)
                                .map((postule) => (
                                    <div
                                        key={postule._id}
                                        className="kanban-task"
                                        draggable
                                        onDragStart={() => handleDragStart(postule)}
                                    >
                                        <PostuleCard postule={postule} user={users[postule.userId]} />
                                    </div>
                                ))}

                            {/* Display success message */}
                            {successMessage && (
                                <SuccessAlert message={successMessage} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-end mt-3">
                <button className="btn btn-primary" onClick={handleSendEmails}>Envoyer les emails</button>
            </div>
        </div>
    );
}

export default Kanban;
