import { defineQuery } from "next-sanity";

export const USER_BY_GITHUB_ID_QUERY =
  defineQuery(`*[_type == "user" && id == $id][0] {
  _id,
  id, 
  name, 
  username, 
  email, 
  image,
  bio
}`);

export const CATEGORY_BY_ID_QUERY =
  defineQuery(`*[_type == "category" && _id == $id][0] {
  _id
}`);

export const ALL_CATEGORIES_QUERY =
  defineQuery(`*[_type == "category"] | order(category asc) {
  _id,
  category
}`);

export const ALL_POSTS_QUERY =
  defineQuery(`*[_type == "post"] | order(_createdAt asc) {
  _id, 
  title, 
  slug,
  category -> {
    _id, category
  }, 
  _createdAt,
  author -> {
    _id, name, image, bio, username
  }, 
  views,
  likes,
  "totalComments": count(*[_type == "comment" && post._ref == ^._id]),
  post
}`);

export const VIEWS_LIKES_ON_POSTS_QUERY =
  defineQuery(`*[_type == "post" && _id == $id][0] {
    likes,
    views
}`);
