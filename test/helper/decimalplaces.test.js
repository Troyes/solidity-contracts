var sut = require('./decimalplaces.js');


describe('decimalplaces.js: should convert float to int and vice versa', async () => {

    it("should convert float with 6 decimal places to int.", async () => {
        let aFloat = 12.123456;

        let result = sut.convertFloatTo6DecimalPlacesInt(aFloat);

        let expected = 12123456;
        assert.equal(result, expected, "Failed to convert float to int 6 decimal places.");
    });

    it("should convert int to float with 6 decimal places.", async () => {
        let anInt = 12123456;

        let result = sut.convertIntTo6DecimalPlaces(anInt);

        let expected = 12.123456;
        assert.equal(result, expected, "Failed to convert int to float with 6 decimal places.");
    });
});