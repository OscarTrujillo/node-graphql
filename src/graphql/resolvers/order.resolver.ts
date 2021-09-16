import { Order, QueryOrderArgs, MutationCreateOrderArgs, AllowedState } from './../codegenerated';
import { IResolvers } from '@graphql-tools/utils'

export const OrderResolvers: IResolvers = {
  Query: {
    async orders (_: void): Promise<Order[]> {
      return [
          {
            id: '1',
            customer: {id: '1', name: 'name'},
            state: AllowedState.Open,
            items: []
          }
        ]
      
    },
    async order (_: void, args: QueryOrderArgs): Promise<Order> {
      return {
            id: '1',
            customer: {id: '1', name: 'name'},
            state: AllowedState.Open,
            items: []
      }
    }
  },
  Mutation: {
    async createOrder (_: void, args: MutationCreateOrderArgs): Promise<Order> {
      return {
        id: '2',
        customer: {id: '3', name: 'name'},
        state: AllowedState.Open,
        items: []
  }
    }
  }
}