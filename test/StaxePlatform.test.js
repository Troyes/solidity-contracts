var StaxePlatform = artifacts.require("./StaxePlatform.sol");
var StaxeToken = artifacts.require("./StaxeToken.sol");
var decimals = require('./helper/decimalplaces.js');

contract('StaxePlatform', async (accounts) => {

    beforeEach(async () => {
        this.token = await StaxeToken.new();
        this.contract = await StaxePlatform.new(this.token.address);
    });

    describe('token', async () => {
        it("should have staxe token address after contract creation", async () => {
            let result = await this.contract.getTokenAddress.call();

            let expected = this.token.address;
            assert.equal(result, expected, "Address of Staxe Token should be the same as the one deployed.");
        });
    });

    describe('createStaxe', async () => {

        it("should be able to create a staxe and return the ID.", async () => {
            let staxeID = await createStaxe(this.contract, {isMined: false});

            let expected = 0;
            assert.equal(staxeID, expected, "First event ID should be 0.")
        });

        it("should return an event called StaxeCreated.", async () => {
            let tx = await createStaxe(this.contract);

            result = tx.logs[0].event;

            expected = 'StaxeCreated';
            assert.equal(result, expected, "Event should be called StaxeCreated.");
        });

        it("should return an event with the ID of the Staxe created as first argument.", async () => {
            let tx = await createStaxe(this.contract);

            let staxeID = tx.logs[0].args.staxeID;

            // -1 to account for indexing starting at 0
            let expected = await this.contract.getStaxesCount.call() - 1;
            assert.equal(staxeID, expected, "ID is not correct.")
        });

        it("should be able to create a named Staxe.", async () => {
            let nameOfStaxe = "staxe 1";

            let tx = await createStaxe(this.contract, {name: nameOfStaxe});
            let staxeID = tx.logs[0].args.staxeID;
            let result = await this.contract.getStaxeName.call(staxeID);

            assert.equal(result, "staxe 1", "Name of staxe should be staxe 1.")
        });

        it("should store goal of Staxe Sale during createStaxe.", async () => {
            let goal = 7;
            let tx = await createStaxe(this.contract, { goal: goal });
            let staxeID = tx.logs[0].args.staxeID;
            
            let result = await this.contract.getStaxeGoal(staxeID);

            let expected = goal;
            assert.equal(result, expected, "Goal should be the same during creation.")
        });

        it("should store timestamp at creation.", async () => {
            let tx = await createStaxe(this.contract);
            let staxeID = tx.logs[0].args.staxeID;
            let timestamp = await this.contract.getStaxeCreationTimestamp(staxeID);

            let result = isValidTimestamp(timestamp);

            assert.equal(result, true, "Timestamp should be valid.")
        });

        it("should have a start timestamp of the staxe sale.", async () => {
            let start = 11111111122222222222222221;
            let tx = await createStaxe(this.contract, { start: start });
            let staxeID = tx.logs[0].args.staxeID;

            let result = await this.contract.getStaxeSaleStart.call(staxeID);

            let expected = start;
            assert.equal(result, expected, "Timestamp of start should be the same.")
        });

        it("should have a deadline to raise funds.", async () => {
            let deadline = 11111111122222222222222222;
            let tx = await createStaxe(this.contract, { deadline: deadline });
            let staxeID = tx.logs[0].args.staxeID;

            let result = await this.contract.getStaxeDeadline.call(staxeID);

            let expected = deadline;
            assert.equal(result, expected, "Timestamp of deadline should be valid.")
        });

        it("should reject deadline timestamps that dates before current blockchain timestamp.", async () => {
            let invalidDeadline = 1020281637;

            try {
                await createStaxe(this.contract, {deadline: invalidDeadline});
                assert.fail('it should fail before');
            } catch (error) {
                assert.ok(isErrorRevert(error));
            }
        });

        it("should store coordinates of where the staxe is taking place. as integers with 6 decimal places to have accuracy of 0.11mm.", async () => {
            let dummyLat = 1234567890.123456;
            let dummyLng = -9876543210.654321;
            let latitude = decimals.convertFloatTo6DecimalPlacesInt(dummyLat);
            let longitude = decimals.convertFloatTo6DecimalPlacesInt(dummyLng);
            let tx = await createStaxe(this.contract, { latitude: latitude, longitude: longitude });
            let staxeID = tx.logs[0].args.staxeID;

            let result = await this.contract.getStaxeLocation.call(staxeID)
            let latResult = decimals.convertIntTo6DecimalPlaces(result[0]);
            let lngResult = decimals.convertIntTo6DecimalPlaces(result[1]);

            let latExpected = dummyLat;
            let lngExpected = dummyLng;
            assert.equal(latResult, latExpected, "Latitude is incorrect.");
            assert.equal(lngResult, lngExpected, "Longitude is incorrect.");
        });
    });

    describe('staxeSale in event created', async () => {
        it("should store the address of the staxeSale for the staxe.", async () => {
            let tx = await createStaxe(this.contract);
            let staxeID = tx.logs[0].args.staxeID;
            let staxeSaleAddress = tx.logs[0].args.staxeSale;

            let result = await this.contract.getStaxeSaleAddress.call(staxeID);

            assert.equal(result, staxeSaleAddress, "Address of staxeSale is incorrect.");
        });
    });

    describe('invest', async () => {

        it("should return investor balance.", async () => {
            let investorAddress = '0x627306090abab3a6e1400e9345bc60c78a8bef57';
            let tx = await createStaxe(this.contract);
            let staxeID = tx.logs[0].args.staxeID;

            let shares = await this.contract.sharesOf.call(staxeID, investorAddress);

            let expected = 0;
            assert.equal(shares, expected, "we should have 0 shares.");
        });

        it("should return the correct shares of the investor after 2 investments.", async () => {
            let investmentAmount = 2;
            let investor = accounts[0];
            let txEvent = await createStaxe(this.contract);
            let staxeID = txEvent.logs[0].args.staxeID;
            let staxeSale = await this.contract.getStaxeSaleAddress.call(staxeID);

            await this.token.mint(investor, 4);
            await this.token.approveAndCall(staxeSale, 2, 0);
            await this.token.approveAndCall(staxeSale, 2, 0);
            let result = await this.contract.sharesOf(staxeID, investor);

            let expected = investmentAmount * 2;
            assert.equal(result, expected, "Amount invested is not correct.");
        });

        it("should return the amount raised.", async () => {
            let investmentAmount = 11;
            let investor = accounts[0];
            let txEvent = await createStaxe(this.contract);
            let staxeID = txEvent.logs[0].args.staxeID;
            let staxeSale = await this.contract.getStaxeSaleAddress.call(staxeID);

            await this.token.mint(investor, 11);
            await this.token.approveAndCall(staxeSale, 11, 0);
            let result = await this.contract.getStaxeSaleAmountRaised.call(staxeID);

            let expected = investmentAmount;
            assert.equal(result, expected, "Amount raised is not correct.");
        });
    });

});

function isErrorRevert(error) {
    return error.message.search("revert") > -1;
}
function isValidTimestamp(timestamp) {
    return ('' + timestamp).length > 9;
}

function createStaxe(
    contract,
    {
        name = 'dummy',
        goal = 10,
        start = 11111111122222222222222221,
        deadline = 11111111122222222222222222,
        latitude = 1234567890.123456,
        longitude = -9876543210.654321,
        isMined = true,
    } = {}) {
    if (isMined) {
        return contract.createStaxe(name, goal, start, deadline, latitude, longitude);
    } else {
        return contract.createStaxe.call(name, goal, start, deadline, latitude, longitude);
    }
}