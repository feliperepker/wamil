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

export const USER_BY_ID_QUERY =
  defineQuery(`*[_type == "user" && _id == $id][0] {
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
  defineQuery(`*[_type == "post" && !defined($search) || title match $search || category->category match $search || author->name match $search] | order(_createdAt asc) {
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
    likes
}`);

export const COMMENTS_ON_POSTS_QUERY =
  defineQuery(`*[_type == "comment" && post._ref == $postId && parentComment == null] {
    _id,
    comment,
    user -> {
    _id, name, image, bio, username
  }, 
  likes,
  _createdAt,
  "totalReplies": count(*[_type == "comment" && parentComment._ref == ^._id]),
  "userLiked": $userCall in coalesce(likes[]._ref, [])
}`);

export const REPLYES_ON_COMMENTS_QUERY =
  defineQuery(`*[_type == "comment" && parentComment._ref == $commentId] {
    _id,
    comment,
    user -> {
    _id, name, image, bio, username
  }, 
  likes,
  _createdAt,
  "userLiked": $userId in coalesce(likes[]._ref, [])
}`);

export const USER_INFOS_QUERY =
  defineQuery(`*[_type == "user" && _id == $userId][0] {
    _id, 
    name, 
    image, 
    username
}`);

export const GET_USERS_QUERY =
  defineQuery(`*[_type == "user" && (!defined($search) || name match $search || username match $search)] | order(name asc) {
    _id, 
    name, 
    image, 
    username
}`);

export const POSTS_BY_USER_QUERY =
  defineQuery(`*[_type == "post" && author->_id match $id] | order(_createdAt asc) {
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
