"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const TasksPage = () => {
    const tasks = useQuery(api.task.getTasks)
    const deleteTask = useMutation(api.task.deleteTask)

  return<div className='p-10 flex flex-col gap-4'>
    <h1 className="text-5x1"> All tasks are here</h1>
    {tasks?.map((task) => (
        <div key={task._id} className="flex gap-2">
            <span>{task.text}</span>
            <button onClick={async () => {
                await deleteTask({ id: task._id });
            }}>
                Delete Task
            </button>
        </div>
    ))}

  </div>
}
export default TasksPage