import { Employee } from '../utils/codegenerated';
import { IResolvers } from '@graphql-tools/utils'
import * as db  from '../db';

export const EmployeeResolvers: IResolvers = {
  Query: {
    async employees (_: void): Promise<Employee[]> {
        return db.getEmployees();
    }
  }
}