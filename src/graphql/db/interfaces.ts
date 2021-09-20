import { AllowedState } from "../utils/codegenerated";

export interface IdbCustomer { 
    id: string;
    name?: string;
    email: string;
}

export interface IdbEmployee { 
    id: string;
    name: string;
    email: string;
}

interface IdbItem { 
    id: string;
    name: string;
    price: number;
}

export interface IdbItemSelection {
    id: string;
    amount: number;
}

export interface IdbOrder { 
    id: string;
    customerId: string;
    updatedAt: number;
    createdAt: number;
    
    employeeId?: string;
    state: AllowedState;
    items: IdbItemSelection[];
}


export interface DatabaseStructure {
    customers: IdbCustomer[];
    employees: IdbEmployee[];
    items: IdbItem[];
    orders: IdbOrder[];
}