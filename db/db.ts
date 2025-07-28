// db.ts
import dayjs from 'dayjs/esm';
import { openDatabaseAsync } from 'expo-sqlite';
import { AccountSummary, CategoryStat, IconItem, Transaction } from './type';

const db = openDatabaseAsync("account.db");

export const initDB = async () => {

    await (await db).execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      remark TEXT,
      amount REAL NOT NULL,
      icon TEXT,
      date TEXT NOT NULL
    );
  `);
};

export const addTransaction = async (tx: Transaction): Promise<void> => {
    const { type, title, remark, amount, icon, date } = tx;

    await (await db).runAsync(
        `INSERT INTO transactions (type, title, remark, amount, icon, date)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [
            type,
            title,
            remark ?? '',
            amount,
            icon ?? '',
            date instanceof Date ? date.toISOString() : date,
        ]
    );
};

export const updateTransaction = async (tx: Transaction): Promise<void> => {
    const { id, type, title, remark, amount, icon, date } = tx;

    if (typeof id !== 'number') {
        throw new Error('Invalid transaction id');
    }

    await (await db).runAsync(
        `UPDATE transactions
         SET type = ?, title = ?, remark = ?, amount = ?, icon = ?, date = ?
         WHERE id = ?`,
        [
            type,
            title,
            remark ?? '',
            amount,
            icon ?? '',
            date instanceof Date ? date.toISOString() : date,
            id,
        ]
    );
};

export const getTransactions = async (): Promise<AccountSummary> => {
    const dbInstance = await db;
    const result = await dbInstance.getAllAsync<Transaction>(
        'SELECT * FROM transactions ORDER BY date DESC'
    );
    // console.log(result)
    const grouped: Record<string, Transaction[]> = {};
    let income = 0;
    let expense = 0;

    for (const tx of result) {
        const dateStr = dayjs(tx.date).format('YYYY-MM-DD'); // 分組用 yyyy-mm-dd
        if (!grouped[dateStr]) {
            grouped[dateStr] = [];
        }

        grouped[dateStr].push(tx);

        // 計算總收入/支出
        if (tx.type === 'income') {
            income += tx.amount;
        } else {
            expense += tx.amount;
        }
    }

    const data = Object.entries(grouped).map(([date, txs]) => {
        let dailyBalance = 0;// 每日餘額

        for (const tx of txs) {
            if (tx.type === 'income') {
                dailyBalance += tx.amount;
            } else {
                dailyBalance -= tx.amount;
            }
        }

        return {
            date,
            dailyBalance,
            data: txs,
        };
    });

    return {
        income,
        expense,
        balance: income - expense,
        data,
    };
};

export const deleteTransaction = async (id: number): Promise<void> => {
    await (await db).runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
};


export const defaultIcons: IconItem[] = [
    { label: '飲食', icon: 'fast-food', source: 'default' },
    { label: '交通', icon: 'train', source: 'default' },
    { label: '購物', icon: 'bag-handle', source: 'default' },
    { label: '娛樂', icon: 'game-controller', source: 'default' },
];

export const createIconsTable = async () => {
    await (await db).runAsync(`
    CREATE TABLE IF NOT EXISTS icons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      icon TEXT NOT NULL,
      source TEXT NOT NULL CHECK(source IN ('default', 'custom'))
    );
  `);
};

export const insertDefaultIcons = async () => {
    for (const item of defaultIcons) {
        await (await db).runAsync(
            `INSERT INTO icons (label, icon, source) VALUES (?, ?, ?)`,
            [item.label, item.icon, item.source]
        );
    }
};

export const addCustomIcon = async (
    icon: Omit<IconItem, 'id' | 'source'>
) => {
    const iconList = await getAllIcons();
    const existIcon = iconList.find((item) => item.label === icon.label);
    if (existIcon) {
        throw new Error('Icon with this label already exists');
    }
    await (await db).runAsync(
        `INSERT INTO icons (label, icon, source) VALUES (?, ?, ?)`,
        [icon.label, icon.icon, 'custom']
    );
};
export const getAllIcons = async (): Promise<IconItem[]> => {
    const result = await (await db).getAllAsync<IconItem>(`SELECT * FROM icons`);
    return result;
};

export const deleteIcon = async (id: IconItem['id']): Promise<void> => {
    if (typeof id !== 'number') {
        throw new Error('Invalid icon id');
    }
    await (await db).runAsync(`DELETE FROM icons WHERE id = ?`, [id]);
};

export const getStateisticsByCategory = async ({ type, range }: { type: 'income' | 'expense', range: 'all' | 'year' | 'month' }): Promise<CategoryStat[]> => {
    const dbInstance = await db;

    let whereClause = `t.type = ? AND i.label IS NOT NULL`;
    const params: any[] = [type]

    if (range === 'year') {
        whereClause += ` AND strftime('%Y', t.date) = ?`
        params.push(dayjs().format('YYYY'));
    } else if (range === 'month') {
        whereClause += ` AND strftime('%Y-%m', t.date) = ?`
        params.push(dayjs().format('YYYY-MM'));
    }

    const result = await dbInstance.getAllAsync<{
        icon: string;
        label: string;
        amount: number;
        count: number;
    }>(`
      SELECT
        t.icon,
        i.label,
        SUM(t.amount) AS amount,
        COUNT(*) AS count
      FROM transactions t
      LEFT JOIN icons i ON t.icon = i.icon
      WHERE ${whereClause}
      GROUP BY t.icon, i.label
      ORDER BY amount DESC
    `, params);

    return result;
}