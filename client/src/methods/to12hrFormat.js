function to12hrFormat(time) {
if (time) {
    var [hrs, mins] = time.split(':');
    if (parseInt(hrs) > 12) {
        return `${parseInt(hrs) % 12}:${mins} PM`;
    }
    if (parseInt(hrs) === 12) {
        return `${hrs}:${mins} PM`;
    }
    if (parseInt(hrs) === 0) {
        return `12:${mins} AM`;
    }
    return `${hrs}:${mins} AM`;
}
};

export default to12hrFormat;
