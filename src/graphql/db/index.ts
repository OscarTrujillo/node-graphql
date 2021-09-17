import { JSONFile, Low } from 'lowdb';
import { DatabaseStructure, IdbCustomer, IdbOrder, IdbEmployee } from './interfaces';
import { v4 as uuid } from 'uuid';

import * as _ from 'lodash';
import { AllowedState, Employee, Item, Order, Maybe, ItemInput } from '../utils/codegenerated';

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
    const item = db.data?.items.find((i) => i.id === orderItem.id);
    return item;
  }) as Maybe<Item>[];

  const order: Order = {
    id: o.id,
    state: o.state as AllowedState,
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
    items: items.map((i) => {
      return { id: i.id, amount: 1 };
    }),
  };

  db.data?.orders.push(dbOrder);

  await db.write();

  return buildOrderResponse(dbOrder);
}

export async function assignOrder(employeeEmail?: string): Promise<Order> {
  let dbEmployee: IdbEmployee | undefined;
  if (employeeEmail) {
    dbEmployee = db.data?.employees.find((c) => c.email == employeeEmail);
    // if employee doesn't exists, error
    if (!dbEmployee) {
      throw new Error('employee doesn`t exist');
    }
  } else {
    // if not email, select one employee

    const muylargoajsjkdbakjsbdlkjasndasd = [];
    const employeesFree = muylargoajsjkdbakjsbdlkjasndasd.filter(
      ({ id: id1 }) => !muylargoajsjkdbakjsbdlkjasndasd.some((id2) => id2 === id1)
    );
    // todo: select less busy employee

    dbEmployee = db.data?.employees[0];
  }
}
