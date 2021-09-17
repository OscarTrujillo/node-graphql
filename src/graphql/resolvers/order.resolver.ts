import {
  Order,
  QueryOrderArgs,
  MutationCreateOrderArgs,
  MutationAssignOrderArgs,
  MutationCompleteOrderArgs,
} from '../utils/codegenerated';
import { IResolvers } from '@graphql-tools/utils';
import * as db from '../db';

export const OrderResolvers: IResolvers = {
  Query: {
    async orders(_: void): Promise<Order[]> {
      const orders = db.getOrders();
      return orders;
    },
    async order(_: void, args: QueryOrderArgs): Promise<Order | undefined> {
      return db.getOrder(args.id);
    },
  },
  Mutation: {
    async createOrder(_: void, args: MutationCreateOrderArgs): Promise<Order> {
      return db.createOrder(args.customerEmail, args.items);
    },
    async assignOrder(_: void, args: MutationAssignOrderArgs): Promise<Order> {
      return db.assignOrder(args.orderId, args.employeeEmail || undefined);
    },
    async completeOrder(_: void, args: MutationCompleteOrderArgs): Promise<Order> {
      return db.completeOrder(args.orderId);
    },
  },
};
