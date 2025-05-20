import { ObjectSchema } from "realm";

export const TransactionItemSchema: ObjectSchema = {
    name: "TransactionItem",
    properties: {
        _id: "objectId",
        title: "string",
        remark: "string",
        amount: "double",
        icon: "string",
        type: "string", // income / expense
    },
    primaryKey: "_id",
};

export const TransactionGroupSchema: ObjectSchema = {
    name: "TransactionGroup",
    properties: {
        _id: "objectId",
        date: "date",
        data: "TransactionItem[]",
    },
    primaryKey: "_id",
};

export const AccountSummarySchema: ObjectSchema = {
    name: "AccountSummary",
    properties: {
        _id: "objectId",
        income: "double",
        expense: "double",
        balance: "double",
        data: "TransactionGroup[]",
    },
    primaryKey: "_id",
};

export const schemas = [
    AccountSummarySchema,
    TransactionGroupSchema,
    TransactionItemSchema,
];

export const SCHEMA_VERSION = 1;
