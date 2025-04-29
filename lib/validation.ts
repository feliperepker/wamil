import { z } from "zod";
import { client } from "@/sanity/lib/client";
import { CATEGORY_BY_ID_QUERY } from "@/sanity/lib/queries";

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().refine(
    async (id) => {
      try {
        const category = await client.fetch(CATEGORY_BY_ID_QUERY, { id });

        return category != null;
      } catch {
        return;
      }
    },
    {
      message: "The selected category doesn't exists",
    }
  ),
  post: z.string().min(10),
});
