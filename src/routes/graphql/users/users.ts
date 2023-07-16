import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';

const userTypeFields = {
  id: { type: UUIDType },
  name: { type: GraphQLString },
  balance: { type: GraphQLString },
};

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    ...userTypeFields,
  }),
});

export const UserTypeList = new GraphQLList(UserType);
