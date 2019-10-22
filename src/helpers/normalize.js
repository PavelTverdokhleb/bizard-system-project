export const poolAddress = value => {
    if (!value || !/^[0-9.]+$/i.test(value)) {
        return value
    }

    const onlyNums = value.replace(/[^\d]/g, '');
    if (onlyNums.length <= 3) {
        return onlyNums
    }
    if (onlyNums.length < 7) {
        return `${onlyNums.slice(0, 3)}.${onlyNums.slice(3)}`
    }
    if (onlyNums.length < 10) {
        return `${onlyNums.slice(0, 3)}.${onlyNums.slice(3, 6)}.${onlyNums.slice(6, 9)}`
    }
    return `${onlyNums.slice(0, 3)}.${onlyNums.slice(3, 6)}.${onlyNums.slice(6, 9)}.${onlyNums.slice(9, 12)}`
};

export const balanceTopUp = value => {
    return value.replace(/[^\d]/g, '');
};