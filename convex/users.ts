import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";


// Create User
export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        name: v.string(),
        email: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            email: args.email,
            name: args.email,
            image: args.email,
            isOnline: true,
        })
    }
});

// Update User
export const updateUser = internalMutation({
    args: { tokenIdentifier: v.string(), image: v.string() },
    async handler(ctx, args) {
        const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
        .unique();

        if(!user){
            throw new ConvexError("User not found");
        }

        await ctx.db.patch(user._id,{
            image: args.image,
        });
    },
});

// Set User Online
export const setUserOnline = internalMutation({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
        .unique();

        if(!user){
            throw new ConvexError("User not found");
        }

        await ctx.db.patch(user._id,{ isOnline: true });
    },
});

// Set User Office
export const setUserOffline = internalMutation({
    args: { tokenIdentifier: v.string()},
    handler: async (ctx, args) => {
        const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
        .unique();

        if(!user){
            throw new ConvexError("User not found");
        }

        await ctx.db.patch(user._id,{ isOnline: false });
    },
});

// Get User
export const getUsers = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new ConvexError("Unauthorized");
        }

        const users = await ctx.db.query("users").collect();
        return users.filter((user) => user.tokenIdentifier !== identity.tokenIdentifier)
    },
});

// Get Me
export const getMe = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new ConvexError("Unauthorized");
        }

        const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();

        if(!user){
            throw new ConvexError("User not found");
        }
        return user;
    },
});

// Get Group Members
export const getGroupMembers = query({
	args: { conversationId: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const conversation = await ctx.db
			.query("conversations")
			.filter((q) => q.eq(q.field("_id"), args.conversationId))
			.first();
		if (!conversation) {
			throw new ConvexError("Conversation not found");
		}

		const users = await ctx.db.query("users").collect();
		const groupMembers = users.filter((user) => conversation.participants.includes(user._id));

		return groupMembers;
	},
});