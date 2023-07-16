import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { PostType } from '../posts/post.js';
import { MemberIDType } from './member-id.js';
import { UUIDType } from './uuid.js';

export const UUIDNonNullType = new GraphQLNonNull(UUIDType);
export const PostNonNullType = new GraphQLNonNull(PostType);
export const MemberIDNonNullType = new GraphQLNonNull(MemberIDType);

export const StringNonNullType = new GraphQLNonNull(GraphQLString);
export const BooleanNonNullType = new GraphQLNonNull(GraphQLBoolean);
export const IntNonNullType = new GraphQLNonNull(GraphQLInt);
