"use client";

import { useEffect, useState } from "react";
import { formSchema } from "@/lib/validation";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/sanity/types";
import { createPostAction, fetchCategoriesAction } from "@/lib/actions";

const CreatePost = () => {
  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [post, setPost] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategoriesAction();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    loadCategories();
  }, []);

  const createPost = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsPending(true);
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      const formValues = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        post,
      };
      console.log(formValues);
      await formSchema.parseAsync(formValues);

      const result = await createPostAction(formData, post);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your post has been created successfully",
        });
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });
        return { status: "ERROR", error: "Invalid form data" };
      }
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });
      return { status: "ERROR", error: "An unexpected error has occurred" };
    } finally {
      setIsPending(false);
      setOpenCreatePost(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpenCreatePost(!openCreatePost);
        }}
      >
        Create new Post
      </button>

      {openCreatePost && (
        <form
          onSubmit={createPost}
          className="mx-auto p-4 rounded bg-black mt-4 h-full w-[90%] flex flex-col max-sm:w-full"
        >
          <h3 className="font-oxanium text-lg font-semibold mb-2">
            Create a new post
          </h3>
          <div className="flex items-center justify-between gap-2 max-sm:flex-col">
            <div className="w-full mb-auto min-h-full">
              <label className="font-oxanium" htmlFor="title">
                Title
              </label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder="Add a title to your new post"
                className="default-input"
              />
              {errors.title && (
                <p className="font-oxanium text-sm text-red-400 mt-1">
                  {errors.title}
                </p>
              )}
            </div>
            <div className="w-1/2 mb-auto min-h-full max-sm:w-full">
              <label className="font-oxanium" htmlFor="category">
                Category
              </label>
              <Select name="category">
                <SelectTrigger className="w-full border-none bg-black-100 rounded">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent className="bg-black-100 border-none rounded">
                  {categories?.length > 0 &&
                    categories.map((category: Category) => {
                      return (
                        <SelectItem
                          key={category?._id}
                          className="cursor-pointer hover:bg-[#32393a] transition duration-200"
                          value={category?._id}
                        >
                          {category?.category}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>

              {errors.category && (
                <p className="font-oxanium text-sm text-red-400 mt-1">
                  {errors.category}
                </p>
              )}
            </div>
          </div>
          <div data-color-mode="dark" className="mt-2">
            <label htmlFor="post" className="font-oxanium">
              Tell the world what you are learning
            </label>
            <MDEditor
              value={post}
              preview="edit"
              id="post"
              height={300}
              onChange={(value) => setPost(value as string)}
              style={{
                borderRadius: "20",
                overflow: "hidden",
                backgroundColor: "#272c2e",
              }}
              textareaProps={{
                placeholder: "Tell the world what you are learning",
              }}
              previewOptions={{
                disallowedElements: ["style"],
              }}
            />
            {errors.post && (
              <p className="font-oxanium text-sm text-red-400 mt-1">
                {errors.post}
              </p>
            )}
          </div>

          <Button
            disabled={isPending}
            className="btn-secondary self-end mt-2"
            type="submit"
          >
            {isPending ? "Creating..." : "Create Post"}
            <Send className="size-6 ml-1" />
          </Button>
        </form>
      )}
    </>
  );
};

export default CreatePost;
