import { GraphQLNonNull, GraphQLString } from 'graphql';
import { PostType } from '../posts/post.js';
import { UUIDType } from './uuid.js';

export const UUIDNonNullType = new GraphQLNonNull(UUIDType);
export const PostNonNullType = new GraphQLNonNull(PostType);
export const StringNonNullType = new GraphQLNonNull(GraphQLString);
