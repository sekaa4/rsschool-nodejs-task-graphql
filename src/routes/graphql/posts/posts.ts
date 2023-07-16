import { GraphQLList } from 'graphql';
import { PostType } from './post.js';

export const PostTypeList = new GraphQLList(PostType);
