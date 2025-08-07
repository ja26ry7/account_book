export const toCurrency = (
    amountStr: string | number | string[] | null,
    separators = ',',
    trimZero = true
): string => {
    const parsed = Number(amountStr ?? '');
    if (isNaN(parsed) || amountStr === null) return '';

    if (typeof amountStr !== 'string') amountStr = amountStr.toString();
    if (amountStr[0] === '0') amountStr = amountStr.replace(/^0+(?=\d)/g, '');

    if (separators) {
        const tmp = amountStr.split('.');
        if (tmp.length > 1 && tmp[1].slice(-1) === '0' && trimZero)
            tmp[1] = tmp[1].replace(/0+$/g, '');
        tmp[0] = tmp[0].replace(/\B(?=(\d{3})+(?!\d))/g, separators);

        if (tmp[1]) amountStr = tmp.join('.');
        else amountStr = tmp[0];
    }

    return amountStr;
};

export function formatCurrency(amount: number): string {

    return amount < 0 ? `-$${toCurrency(Math.abs(amount))}` : `$${toCurrency(amount)}`;
}