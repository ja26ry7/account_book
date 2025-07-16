
// types.ts
export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id?: number;
    type: TransactionType;
    title: string;
    remark?: string;
    amount: number;
    icon?: string;
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
    label: string;
    icon: string;
    source: IconSource;
}

export interface CategoryStat {
    icon: string;
    label: string;
    amount: number;
    count: number;
}

