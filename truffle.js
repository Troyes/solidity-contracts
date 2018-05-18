module.exports = {
    mocha: {
        reporter: "spec",
        reporterOptions: {
            mochaFile: "test-results.xml"
        }
    },
    networks: {
        development: {
            host: "194.0.2.10",
            port: 8545,
            network_id: "*"
            //gas: 3500000
        },
        local: {
            host: "127.0.0.1",
            port: 9545,
            network_id: "*"
        },
        rinkeby: {
            provider: () => {
                var WalletProvider = require("truffle-wallet-provider");
                var pkeyBuffer = new Buffer(process.env.DEPLOY_PRIVATE_KEY, 'hex');
                var wallet = require('ethereumjs-wallet').fromPrivateKey(pkeyBuffer);
                return new WalletProvider(wallet, "https://rinkeby.infura.io");
            },
            network_id: 3,
            gas: 3500000
        }
    }
};
