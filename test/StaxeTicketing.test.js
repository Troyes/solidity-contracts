var StaxeTicketing = artifacts.require("./StaxeTicketing.sol")
var StaxeToken = artifacts.require("./StaxeToken.sol")
var hex = require('./helper/hex');

var dummyTicketTypesID = [0,1,2];
var dummyTicketAvailable = [100,200,300]; 
var dummyTicketCost = [1000,2000,3000];

contract('StaxeTicketing', (accounts) => {

    beforeEach(async () => {
        this.token = await StaxeToken.new();
        this.contract = await StaxeTicketing.new(this.token.address, dummyTicketTypesID, dummyTicketAvailable, dummyTicketCost);
      });

    describe('initial state of contract', async () => {
        it("should have the address of the Staxe Token.", async () => {
            let result = await this.contract.staxeToken.call();

            let expected = this.token.address;
            assert.equal(result, expected, "Address of Staxe Token should be correct");
        });

        it("should have 3 types of tickets", async () => {
            let result = await this.contract.ticketTypesCount.call();

            let expected = 3;
            assert.equal(result, expected, "Test Contract should start with 3 types of tickets.")
        });

        it("should have tickets available on each type", async () => {
            let typeID1 = 0;
            let ticketsAvailable1 = await this.contract.ticketsAvailable.call(typeID1);
            let typeID2 = 1;
            let ticketsAvailable2 = await this.contract.ticketsAvailable.call(typeID2);
            let typeID3 = 2;
            let ticketsAvailable3 = await this.contract.ticketsAvailable.call(typeID3);

            let expected1 = dummyTicketAvailable[typeID1];
            let expected2 = dummyTicketAvailable[typeID2];
            let expected3 = dummyTicketAvailable[typeID3];
            assert.equal(ticketsAvailable1, expected1, "Test Contract first type should have 100 tickets.");
            assert.equal(ticketsAvailable2, expected2, "Test Contract first type should have 200 tickets.");
            assert.equal(ticketsAvailable3, expected3, "Test Contract first type should have 300 tickets.");
        });

        it("should have cost of tickets on each type", async () => {
            let typeID1 = 0;
            let ticketsCost1 = await this.contract.ticketsCost.call(typeID1);
            let typeID2 = 1;
            let ticketsCost2 = await this.contract.ticketsCost.call(typeID2);
            let typeID3 = 2;
            let ticketsCost3 = await this.contract.ticketsCost.call(typeID3);

            let expected1 = dummyTicketCost[typeID1];
            let expected2 = dummyTicketCost[typeID2];
            let expected3 = dummyTicketCost[typeID3];
            assert.equal(ticketsCost1, expected1, "Test Contract first type should have 100 tickets.");
            assert.equal(ticketsCost2, expected2, "Test Contract first type should have 200 tickets.");
            assert.equal(ticketsCost3, expected3, "Test Contract first type should have 300 tickets.");
        });
    });

    describe('balance of tickets', async () => {
        it("should return the amount of tickets available for specific ticketTypeID", async () => {
            let available = await this.contract.ticketsOwnedOfTypeID.call(accounts[0], 0);

            let expected = 0;
            assert.equal(available, expected, "Should have 0 tickets");
        });
    });

    describe('buy', async () => {
        it("should be able to buy one ticket using Staxe Token", async () => {
            let ticketTypeID = 2;
            let ticketAmount = 1;
            let ticketTypeIDHex = hex.fromNumberToBytes32AsHexString(ticketTypeID);

            let tx = await this.token.approveAndCall(this.contract.address, ticketAmount, ticketTypeIDHex);
            let result = await this.contract.ticketsOwnedOfTypeID.call(accounts[0], ticketTypeID);

            let expected = 1;
            assert.equal(result, expected, "Should have 1 ticket.")
        });

        it("should be able to buy 2 ticket using 2 Staxe Token", async () => {
            let ticketTypeID = 2;
            let ticketAmount = 2;
            let ticketTypeIDHex = hex.fromNumberToBytes32AsHexString(ticketTypeID);

            let tx = await this.token.approveAndCall(this.contract.address, ticketAmount, ticketTypeIDHex);
            let result = await this.contract.ticketsOwnedOfTypeID.call(accounts[0], ticketTypeID);

            let expected = 2;
            assert.equal(result, expected, "Should have 2 ticket.")
        });

        it("should be able to buy one ticket using 0.01 ether", async () => {
            let ticketTypeID = 1;
            let ticketAmount = 1;

            let tx = await this.contract.buyWithEther(ticketTypeID, ticketAmount, { value: 0.01 * (10 ** 18)});
            let result = await this.contract.ticketsOwnedOfTypeID.call(accounts[0], ticketTypeID);

            let expected = 1;
            assert.equal(result, expected, "Should have 1 ticket.")
        });

        it("should not be able to buy one ticket using Staxe Token after they are sold out", async () => {
            let ticketTypeID = 0;
            let buyAmount = 1;
            let allTicketsAvailable = dummyTicketAvailable[ticketTypeID];
            let ticketTypeIDHex = hex.fromNumberToBytes32AsHexString(ticketTypeID);

            let tx = await this.token.approveAndCall(this.contract.address, allTicketsAvailable, ticketTypeIDHex);
            
            try {
                await this.token.approveAndCall(this.contract.address, buyAmount, ticketTypeIDHex);
                assert.fail('it should fail before');
            } catch (error) {
                assert.ok(isErrorRevert(error));
            }
        });
    });

});


function isErrorRevert(error) {
    return error.message.search("revert") > -1;
}