export function toFixedHash(x){
    if(Number(x).toFixed(0).toString().length > 18) {
        return (Number(x).toFixed(2) / 1000000000000000000).toFixed(2);
    } else if(Number(x).toFixed(0).toString().length > 15) {
        return (Number(x).toFixed(2) / 1000000000000000).toFixed(2);
    } else if(Number(x).toFixed(0).toString().length > 12) {
        return (Number(x).toFixed(2) / 1000000000000).toFixed(2);
    } else if(Number(x).toFixed(0).toString().length > 9) {
        return (Number(x).toFixed(2) / 1000000000).toFixed(2);
    } else if(Number(x).toFixed(0).toString().length > 6) {
        return (Number(x).toFixed(2) / 1000000).toFixed(2);
    } else if(Number(x).toFixed(0).toString().length > 3) {
        return (Number(x).toFixed(2) / 1000).toFixed(2);
    } else {
        return Number(x).toFixed(2);
    }
}

export function symbolHash(x){
    if(Number(x).toFixed(0).toString().length > 18) {
        return "EH/s"
    } else if(Number(x).toFixed(0).toString().length > 15) {
        return "PH/s"
    } else if(Number(x).toFixed(0).toString().length > 12) {
        return "TH/s"
    } else if(Number(x).toFixed(0).toString().length > 9) {
        return "GH/s"
    } else if(Number(x).toFixed(0).toString().length > 6) {
        return "MH/s"
    } else if(Number(x).toFixed(0).toString().length > 3) {
        return "kH/s"
    } else {
        return "H/s"
    }
}

export function convertHash(symbol, x){
    switch(symbol) {
        case 'EH/s':
            return (Number(x).toFixed(2) / 1000000000000000000).toFixed(2);
        case 'PH/s':
            return (Number(x).toFixed(2) / 1000000000000000).toFixed(2);
        case 'TH/s':
            return (Number(x).toFixed(2) / 1000000000000).toFixed(2);
        case 'GH/s':
            return (Number(x).toFixed(2) / 1000000000).toFixed(2);
        case 'MH/s':
            return (Number(x).toFixed(2) / 1000000).toFixed(2);
        case 'kH/s':
            return (Number(x).toFixed(2) / 1000).toFixed(2);
        case  'H/s':
            return Number(x).toFixed(2);
    }
}

export const hashSymbols = ["EH/s", "PH/s", "TH/s", "GH/s" ,"MH/s", "kH/s", "H/s"];