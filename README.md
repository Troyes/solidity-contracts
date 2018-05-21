# Staxe Solidity Contracts
[![CircleCI](https://circleci.com/gh/staxe/contracts/tree/master.svg?style=shield)](https://circleci.com/gh/staxe/contracts/tree/master)

## Roadmap

#### 1. Functionality

* tickets
* distribution

#### 2. Performance

* execution
* gas
* scalability

#### 3. Security

* best practices
* 3rd party audits 

## Build

### Windows

install windows-build-tools globally (for the ethereumjs-wallet dependency).

```
npm install -g windows-build-tools
```

## Deploy on Rinkeby

```
DEPLOY_PRIVATE_KEY="[Your testnet wallet private key]" truffle migrate --network rinkeby
``` 