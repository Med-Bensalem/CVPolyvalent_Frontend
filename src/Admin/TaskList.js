import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const TaskList = ({ title, tasks, listId }) => (
    <Droppable droppableId={listId}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-list"
            >
                <h3>{title}</h3>
                {tasks.map((task, index) => (
                    <TaskCard
                        key={task.id}
                        index={index}
                        title={task.title}
                        date={task.date}
                        attachments={task.attachments}
                        comments={task.comments}
                    />
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
);

export default TaskList;
