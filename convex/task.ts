import { v } from 'convex/values';
import { query, mutation } from "./_generated/server";


// Get Task
export const getTasks = query({
    args: {},
    handler: async (ctx,args) => {
       const tasks = await ctx.db.query("tasks").collect()
        return tasks
    }
})

// Add Task
export const addTask = mutation({
    args: {
        text: v.string(),
    },
    handler: async (ctx,args) => {
        const taskId = await ctx.db.insert("tasks", { text: args.text, completed: false });
        return taskId;
    },
});

// Complete Task
export const completeTask = mutation({
    args: {
        id: v.id("tasks"),
    },
    handler: async (ctx,args) => {
        await ctx.db.patch(args.id, { completed: false });
    },
});

// Delete Task
export const deleteTask = mutation({
    args: {
        id: v.id("tasks"),
    },
    handler: async (ctx,args) => {
        await ctx.db.delete(args.id);
    },
});