import { defineField, defineType } from "sanity";

export const comment = defineType({
  name: "comment",
  title: "comment",
  type: "document",
  fields: [
    defineField({
      name: "user",
      type: "reference",
      to: { type: "user" },
    }),
    defineField({
      name: "comment",
      type: "string",
    }),
    defineField({
      name: "post",
      type: "reference",
      to: { type: "post" },
    }),
    defineField({
      name: "parentComment",
      type: "reference",
      to: { type: "comment" },
    }),
    defineField({
      name: "likes",
      type: "array",
      title: "Likes",
      of: [{ type: "reference", to: { type: "user" } }],
    }),
  ],
});
