import Realm, { BSON } from "realm";

export interface TransactionItem extends Realm.Object {
    _id: BSON.ObjectId;
    title: string;
    remark: string;
    amount: number;
    icon: string;
    type: "income" | "expense";
}

export interface TransactionGroup extends Realm.Object {
    _id: BSON.ObjectId;
    date: Date;
    data: Realm.List<TransactionItem>;
}

export interface AccountSummary extends Realm.Object {
    _id: BSON.ObjectId;
    income: number;
    expense: number;
    balance: number;
    data: Realm.List<TransactionGroup>;
}

export type IconSource = 'default' | 'custom';

export interface IconItem {
    id?: number; // 自動遞增主鍵
    label: string;
    icon: string;
}