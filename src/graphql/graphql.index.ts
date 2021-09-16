import 'graphql-import-node';
import { GraphQLSchema } from 'graphql'
import { merge } from 'lodash'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { IResolvers } from '@graphql-tools/utils'

import * as emptyTypeDefs from './schemas/empty.graphql';
import * as orderTypeDefs from './schemas/order.graphql';
import * as itemTypeDefs from './schemas/item.graphql';
import * as customerTypeDefs from './schemas/customer.graphql';
import * as employeeTypeDefs from './schemas/employee.graphql';

import { OrderResolvers } from './resolvers/order.resolver';

const resolvers: IResolvers = merge(OrderResolvers)

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [emptyTypeDefs, orderTypeDefs, itemTypeDefs, customerTypeDefs, employeeTypeDefs],
  resolvers
})
export default schema

