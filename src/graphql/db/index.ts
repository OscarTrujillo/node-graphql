import { JSONFile, Low } from 'lowdb';
import { DatabaseStructure, IdbCustomer, IdbOrder, IdbEmployee } from './interfaces';
import { v4 as uuid } from 'uuid';

import * as _ from 'lodash';
import {
  AllowedState,
  Employee,
  Item,
  Order,
  Maybe,
  ItemInput,
  ItemSelection,
} from '../utils/codegenerated';

const adapter = new JSONFile<DatabaseStructure>('db.json');
const db = new Low(adapter);

db.read();

// If file.json doesn't exist, db.data will be null
// Set default data
db.data ||= { customers: [], employees: [], items: [], orders: [] };

// Item
export async function getItems(): Promise<Item[]> {
  const items = db.data?.items || [];
  return items;
}

// Employee
export async function getEmployees(): Promise<Employee[]> {
  const employees = db.data?.employees || [];
  return employees;
}

// Order

const buildOrderResponse = (o: IdbOrder) => {
  const employee = db.data?.employees.find((e) => e.id === o.employeeId);
  const customer = db.data?.customers.find((c) => c.id === o.customerId);
  if (!customer) {
    throw new Error('data corrupted');
  }

  const items = o.items.map((orderItem) => {
    const item = db.data?.items.find((i) => i.id === orderItem.id) as ItemSelection;
    item.amount = orderItem.amount;
    return item;
  }) as Maybe<ItemSelection>[];

  const order: Order = {
    id: o.id,
    state: o.state as AllowedState,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    employee,
    customer,
    items: items,
  };
  return order;
};

export async function getOrders(): Promise<Order[]> {
  const dbOrders = db.data?.orders || [];

  const orders: Order[] = [];
  dbOrders.forEach((o) => {
    const order = buildOrderResponse(o);

    orders.push(order);
  });
  return orders as Order[];
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const dbOrder = db.data?.orders.find((o) => o.id === id);
  return dbOrder ? buildOrderResponse(dbOrder) : undefined;
}

export async function createOrder(customerEmail: string, items: ItemInput[]): Promise<Order> {
  let customer = db.data?.customers.find((c) => c.email == customerEmail);

  // if not customer, create it
  if (!customer) {
    const newCustomer: IdbCustomer = {
      id: uuid(),
      email: customerEmail,
    };
    db.data?.customers.push(newCustomer);
    customer = newCustomer;
  }
  const dbOrder: IdbOrder = {
    id: uuid(),
    customerId: customer.id,
    state: AllowedState.Open,
    createdAt: Date.now(),
    updatedAt: Date.now(),

    items: items.map((i) => {
      return { id: i.id, amount: i.amount };
    }),
  };

  db.data?.orders.push(dbOrder);

  await db.write();

  return buildOrderResponse(dbOrder);
}

export async function assignOrder(orderId: string, employeeEmail?: string): Promise<Order> {
  const dbOrder = db.data?.orders.find((o) => o.id === orderId);
  if (!dbOrder) {
    throw new Error('order doesn`t exist');
  }

  if (dbOrder.state !== AllowedState.Open) {
    throw new Error('order is not Open');
  }

  let dbEmployee: IdbEmployee | undefined;
  if (employeeEmail) {
    dbEmployee = db.data?.employees.find((c) => c.email == employeeEmail);
    // if employee doesn't exists, error
    if (!dbEmployee) {
      throw new Error('employee doesn`t exist');
    }
  } else {
    // if not email, select one employee
    // todo: select less busy employee
    dbEmployee = db.data?.employees[0];
  }

  dbOrder.employeeId = dbEmployee?.id;
  dbOrder.state = AllowedState.InProgress;
  dbOrder.updatedAt = Date.now();
  await db.write();

  return buildOrderResponse(dbOrder);
}

export async function completeOrder(orderId: string): Promise<Order> {
  const dbOrder = db.data?.orders.find((o) => o.id === orderId);
  if (!dbOrder) {
    throw new Error('order doesn`t exist');
  }
  if (dbOrder.state !== AllowedState.InProgress) {
    throw new Error('order is not In Progress');
  }
  dbOrder.state = AllowedState.Complete;
  delete dbOrder.employeeId; // todo: think if keep it
  dbOrder.updatedAt = Date.now();
  await db.write();

  return buildOrderResponse(dbOrder);
}
