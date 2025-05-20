import Realm from 'realm';

class TransactionItem extends Realm.Object<TransactionItem> {
    _id!: Realm.BSON.ObjectId;
    title!: string;
    remark!: string;
    amount!: number;
    icon!: string;
    type!: string;

    static schema = {
        name: "TransactionItem",
        primaryKey: "_id",
        properties: {
            _id: "objectId",
            title: "string",
            remark: "string",
            amount: "int",
            icon: "string",
            type: "string"
        }
    }
}

class TransactionGroup extends Realm.Object<TransactionGroup> {
    _id!: Realm.BSON.ObjectId;
    date!: Date;
    data!: Realm.List<TransactionItem>;

    static schema = {
        name: "TransactionGroup",
        primaryKey: "_id",
        properties: {
            _id: "objectId",
            date: "date",
            data: {
                type: "list",
                objectType: "TransactionItem",
            },
        },
    }
}

class AccountSummary extends Realm.Object<AccountSummary> {
    _id!: Realm.BSON.ObjectId;
    balance!: number;
    income!: number;
    expense!: number;
    data!: Realm.List<TransactionGroup>;

    static schema = {
        name: "AccountSummary",
        primaryKey: "_id",
        properties: {
            _id: "objectId",
            balance: "int",
            income: "int",
            expense: "int",
            data: {
                type: "list",
                objectType: "TransactionGroup",
            },
        },
    };
}

export default {
    AccountSummary,
    TransactionGroup,
    TransactionItem,
};