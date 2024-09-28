// src/components/KanbanBoard.js
import React, { useState } from 'react';
import TaskList from './TaskList';
import { DragDropContext } from 'react-beautiful-dnd';

const KanbanBoard = () => {
    const initialTasks = {
        todo: [
            { id: 'task-1', title: 'Website launch planning', date: '30 Dec', attachments: 6, comments: 16 },
            { id: 'task-3', title: 'Website launch ', date: '30 Dec', attachments: 6, comments: 16 },
            { id: 'task-4', title: 'Web ', date: '30 Dec', attachments: 6, comments: 16 },
            { id: 'task-5', title: 'Webs ', date: '30 Dec', attachments: 6, comments: 16 },
            { id: 'task-6', title: 'Website launche ', date: '30 Dec', attachments: 6, comments: 16 },
            { id: 'task-7', title: 'Website launches ', date: '30 Dec', attachments: 6, comments: 16 },
            { id: 'task-8', title: 'Website launcher ', date: '30 Dec', attachments: 6, comments: 16 },
            { id: 'task-9', title: 'Website launcheg ', date: '30 Dec', attachments: 6, comments: 16 },


            // Add more tasks here
        ],
        inProgress: [
            { id: 'task-2', title: 'Website redesign', date: '1 Jan', attachments: 2, comments: 4 },
            // Add more tasks here
        ],
    };

    const [tasks, setTasks] = useState(initialTasks);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        // Reordering within the same list
        if (source.droppableId === destination.droppableId) {
            const start = tasks[source.droppableId];
            const reorderedTasks = Array.from(start);
            const [moved] = reorderedTasks.splice(source.index, 1);
            reorderedTasks.splice(destination.index, 0, moved);

            setTasks(prev => ({
                ...prev,
                [source.droppableId]: reorderedTasks
            }));
        } else {
            // Moving between lists
            const start = tasks[source.droppableId];
            const end = tasks[destination.droppableId];
            const [moved] = start.splice(source.index, 1);
            end.splice(destination.index, 0, moved);

            setTasks(prev => ({
                ...prev,
                [source.droppableId]: Array.from(start),
                [destination.droppableId]: Array.from(end)
            }));
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="row">
                <div className="col-12">
                    <div className="task-kanban-container">
                        <div className="card bg-gray-200 shadow-none rounded-3 d-inline-block me-4 align-top mb-4 task-card">
                            <div className="card-body p-3 ">
                                <TaskList title="To Do" tasks={tasks.todo} listId="todo" />

                            </div>

                        </div>
                        <div className="card bg-gray-200 shadow-none rounded-3 d-inline-block me-4 align-top mb-4 task-card ">
                            <div className="card-body p-3">
                                <TaskList title="In Progress" tasks={tasks.inProgress} listId="inProgress" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
