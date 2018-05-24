
const StaxeToken = artifacts.require("./StaxeToken.sol");
const decimals = 18;
const initialAmount = 10000000;

contract('StaxeToken', (accounts) => {

    describe('balanceOf', async () => {
        it("should have 10000 Staxe Tokens in first account", async () => {
            let token = await StaxeToken.deployed();
            let balance = await token.balanceOf.call(accounts[0]);

            let expected = initialAmount * (10 ** decimals);
            assert.equal(balance.valueOf(), expected, "We should have 10000000 Staxe tokens in first account.")
        });
    });

    describe('mint', async () => {
        it("should be able to mint 1007 Staxe tokens", async () => {
            let token = await StaxeToken.deployed();
            let mint = await token.mint(accounts[1], 1007);

            let expectedBalance = await token.balanceOf.call(accounts[1]);
            assert.equal(expectedBalance, 1007, "We should have 1007 Staxe tokens on second account.");
        });
    });
});