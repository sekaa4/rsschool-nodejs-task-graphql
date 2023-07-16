import { GraphQLList } from 'graphql';
import { UserType } from './user.js';



export const UserTypeList = new GraphQLList(UserType);
