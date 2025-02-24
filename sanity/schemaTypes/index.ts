import { type SchemaTypeDefinition } from 'sanity'
import { user } from './user'
import { post } from './post'
import { comment } from './comment'
import { category } from './category'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, post, comment, category],
}
