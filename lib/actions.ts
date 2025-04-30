"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { Category } from "@/sanity/types";
import { ALL_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

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

export const fetchCategoriesAction = async (): Promise<Category[]> => {
  return await client.fetch(ALL_CATEGORIES_QUERY);
};

export const addLikeAction = async (id: string) => {
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

export const removeLikeAction = async (id: string) => {
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

export const getUserIdAction = async () => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });

  return session.id;
};

export const addUserViewAction = async (postId: string) => {
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

export const createCommentAction = async (comment: string, postId: string) => {
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

export const deleteCommentAction = async (commentId: string) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });

  try {
    const replies = await writeClient.fetch(
      `*[_type == "comment" && parentComment._ref == $commentId]._id`,
      { commentId }
    );

    const idsToDelete = [commentId, ...replies];

    const transaction = idsToDelete.reduce(
      (tx, id) => tx.delete(id),
      writeClient.transaction()
    );

    await transaction.commit();

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

export const createReplyAction = async (
  commentText: string,
  commentId: string
) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });

  try {
    const postObject = {
      comment: commentText,
      parentComment: {
        _type: "reference",
        _ref: commentId,
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

export const editCommentAction = async (
  commentText: string,
  commentId: string
) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });

  try {
    const result = await writeClient
      .patch(commentId)
      .set({ comment: commentText })
      .commit();

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

export const editPostAction = async (
  postEditContent: string,
  postId: string
) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });

  try {
    const result = await writeClient
      .patch(postId)
      .set({ post: postEditContent })
      .commit();

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
