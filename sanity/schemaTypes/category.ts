import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "category",
  type: "document",
  fields: [
    defineField({
      name: "category",
      type: "string",
    }),
  ],
});  