"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { Category } from "@/sanity/types";
import { ALL_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { post } from "@/sanity/schemaTypes/post";

export const createPostAction = async (form: FormData, post: string) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });

  const { title, category } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "post")
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const postObject = {
      title,
      category: {
        _type: "reference",
        _ref: category,
      },
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session.id,
      },
      post,
    };

    const result = await writeClient.create({ _type: "post", ...postObject });

    return parseServerActionResponse({
      status: "SUCCESS",
      id: result._id,
      error: "",
    });
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  return await client.fetch(ALL_CATEGORIES_QUERY);
};

export const addLike = async (id: string) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });
  try {
    await writeClient
      .patch(id)
      .setIfMissing({ likes: [] })
      .append("likes", [
        { _type: "reference", _ref: session?.id, _key: session?.id },
      ])
      .commit();
    return { status: "SUCCESS", message: "Like added" };
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};

export const removeLike = async (id: string) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });
  try {
    await writeClient
      .patch(id)
      .unset([`likes[_ref=="${session?.id}"]`])
      .commit();

    return { status: "SUCCESS", message: "Like removed" };
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};

export const getUserId = async () => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });

  return session.id;
};

export const addUserView = async (postId: string) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });
  try {
    await writeClient
      .patch(postId)
      .setIfMissing({ views: [] })
      .append("views", [
        { _type: "reference", _ref: session?.id, _key: session?.id },
      ])
      .commit();
    return { status: "SUCCESS", message: "View added" };
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};

export const createComment = async (comment: string, postId: string) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });

  try {
    const postObject = {
      comment,
      post: {
        _type: "reference",
        _ref: postId,
      },
      user: {
        _type: "reference",
        _ref: session.id,
      },
    };

    const result = await writeClient.create({
      _type: "comment",
      ...postObject,
    });

    return parseServerActionResponse({
      status: "SUCCESS",
      id: result._id,
      error: "",
    });
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};

export const deleteComment = async (commentId: string) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });

  try {
    await writeClient.delete(commentId);

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
    });
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};
