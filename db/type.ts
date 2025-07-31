
// types.ts
export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id?: number;
    type: TransactionType;
    title: string;
    remark?: string;
    amount: number;
    icon?: string;
    color: string;
    date: Date; // ISO 格式
}

export interface TransactionGroup {
    date: string;
    dailyBalance: number;
    data: Transaction[];
}

export interface AccountSummary {
    income: number;
    expense: number;
    balance: number;
    data: TransactionGroup[];
}

export type IconSource = 'default' | 'custom';

export interface IconItem {
    id?: number;
    label: string;
    icon: string;
    color: string;
    source: IconSource;
}

export interface CategoryStat {
    icon: string;
    color: string;
    label: string;
    amount: number;
    count: number;
}

