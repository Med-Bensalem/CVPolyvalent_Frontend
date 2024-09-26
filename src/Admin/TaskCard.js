import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ title, date, attachments, comments, index }) => (
    <Draggable draggableId={title} index={index}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="card mb-3"
            >
                <div className="card-body p-3">
                    <div className="d-flex justify-content-between">
                        <div>
                            <div className="form-check custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`customCheck-${title}`}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={`customCheck-${title}`}
                                >
                                    <span className="h5">{title}</span>
                                    <br />
                                    <span className="badge bg-warning">Medium</span>
                                </label>
                            </div>
                        </div>
                        <div></div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center ps-4 mt-6">
                        <div className="d-flex align-items-center">
                            <img
                                src="../../assets/images/avatar/avatar-3.jpg"
                                alt="Avatar"
                                className="avatar avatar-xs rounded-circle imgtooltip"
                                data-template="three"
                            />
                            <div id="three" className="d-none">
                                <h6 className="mb-0">Charlie Holland</h6>
                            </div>
                            <div className="ms-2">
                                <span className="fs-6">
                                    <i className="fe fe-clock me-1"></i>{date}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="me-2 align-middle">
                                <i className="fe fe-paperclip fs-6"></i>
                                <span className="fw-semibold fs-6">{attachments}</span>
                            </span>
                            <span className="align-middle">
                                <i className="fe fe-message-square fs-6"></i>
                                <span className="fw-semibold fs-6">{comments}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </Draggable>
);

export default TaskCard;
