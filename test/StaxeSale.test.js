var StaxeToken = artifacts.require("./StaxeToken.sol");
var StaxeSale = artifacts.require("./StaxeSale.sol")

var goal = 10;
var start = 15231671861;
var deadline = 15231671865;

contract('StaxeSale', (accounts) => {

    beforeEach(async () => {
        this.token = await StaxeToken.new();
        this.contract = await StaxeSale.new(this.token.address, goal, start, deadline);
        await this.contract.transferOwnership(this.contract.address);
      });

    describe('ownership', async () => {
        it("should have as owner StaxeSale contract", async () => {
            let result = await this.contract.getOwner.call();

            let expected = this.contract.address; 
            assert.equal(result, expected, "Contract should be owned by itself.")
        });
    });

    describe('balance', async () => {
        it("should return the total balance of the Staxe.", async () => {
            let result = await this.contract.getAmountRaised.call();

            expected = 0;
            assert.equal(result, expected, "Balance should be 0.");
        });
    });

    describe('goal', async () => {
        it("should return the goal of funding.", async () => {
            let result = await this.contract.getGoal.call();

            expected = 10;
            assert.equal(result, expected, "Balance should be 0.");
        });
    });
});