import { Item } from '../utils/codegenerated';
import { IResolvers } from '@graphql-tools/utils'
import * as db  from '../db';

export const ItemResolvers: IResolvers = {
  Query: {
    async items (_: void): Promise<Item[]> {
        const items = db.getItems()
        return items;
    }
  }
}