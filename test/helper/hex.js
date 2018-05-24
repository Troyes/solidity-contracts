function fromNumberToBytes32AsHexString(num) {
    num = '' + num;
    num = toHex(num);
    num = pad(num, 64);
    num = '0x' + num;
    return num;
}

function toHex(num) {
    return num.toString(16);
}

function pad(num, padding) {
    num = '' + num;
    while (num.length < (padding || 2)) {
        num = "0" + num;
    }
    return num;
}

module.exports = {
    fromNumberToBytes32AsHexString
}