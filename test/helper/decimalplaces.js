function convertFloatTo6DecimalPlacesInt(floatNumber) {
    // float * 10^6
    return floatNumber * 1000000;
}
function convertIntTo6DecimalPlaces(intNumber) {
    return intNumber / 1000000;
}

module.exports = {
    convertFloatTo6DecimalPlacesInt,
    convertIntTo6DecimalPlaces
}