import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, { postId }) => {
    const data = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), postId))
      .order("desc")
      .collect();

    return data;
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    body: v.string(),
  },
  handler: async (ctx, { postId, body }) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.insert("comments", {
      postId,
      body,
      authorId: user._id,
      authorName: user.name,
    });
  },
});
