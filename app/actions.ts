"use server";

import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { fetchMutation } from "convex/nextjs";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CreateBlogFormData } from "./(shared-layout)/create/page";
import { createBlogSchema } from "./schemas/blog";

export const createBlogAction = async (data: CreateBlogFormData) => {
  try {
    const parsed = createBlogSchema.safeParse(data);

    if (!parsed.success) {
      throw new Error("Invalid form data");
    }

    const token = await getToken();

    const uploadImageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token },
    );

    const uploadResponse = await fetch(uploadImageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResponse.ok) {
      return {
        error: "Failed to upload image",
      };
    }

    const { storageId } = await uploadResponse.json();

    await fetchMutation(
      api.posts.createPost,
      {
        body: parsed.data.content,
        title: parsed.data.title,
        imageStorageId: storageId,
      },
      {
        token,
      },
    );
  } catch {
    return {
      error: "Failed to create blog",
    };
  }

  // revalidatePath("/blog");
  updateTag("blog-list");
  return redirect("/blog");
};
