import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "user" },
    }),
    defineField({
      name: "views",
      type: "number",
    }),
    defineField({
        name: "likes",
        type: "number",
      }),
    defineField({
      name: "category",
      type: "reference",
      to: { type: "category" },
    }),
    defineField({
      name: "post",
      type: "markdown",
    }),
  ],
});