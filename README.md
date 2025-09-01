# poc-safe-on-fil

An experiment with Safe smart account invoking Filecoin smart contracts

## Prerequisites

### Download Foundry

Install Foundry by following the instructions in the [official Foundry repository](https://github.com/foundry-rs/foundry#installation).

## Getting Started

### Clone the Repository

Open your terminal (or command prompt) and navigate to the directory where you want to store this code. Then run the following commands:

```bash
git clone https://github.com/bajtos/poc-safe-on-fil.git
cd poc-safe-on-fil
git submodule update --init --recursive
forge build
npm ci
```

This will clone the repository to your computer, navigate to the newly created directory, install the required dependencies, build the project and compile the contracts.

### Set Up Your Private Key

You can obtain a private key from a wallet provider such as [MetaMask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

### Configure Environment Variables

Add your private key as an environment variable by running this command:

```bash
export PRIVATE_KEY='your_private_key_here'
```

Alternatively, to avoid setting this every time, create a `.env` file in the root directory of the project (you can use `.env.example` as a template) and add the following lines:

```bash
PRIVATE_KEY=your_private_key_here
CALIBRATIONNET_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
```

Then, in a new terminal, run:

```bash
source .env
```

**⚠️ Security Warning:** Never commit or push `.env` files that contain sensitive information such as private keys! If this information reaches a public GitHub repository, someone could potentially access your wallet and steal your funds.

### Fund Your Deployer Address

Visit the [Calibrationnet testnet faucet](https://faucet.calibnet.chainsafe-fil.io/funds.html) and paste in your Ethereum address. This will send testnet FIL to your account for deployment and testing.

## Contract Deployment

This PoC contains a single contract with two roles - a Deployer and a Controller.

- The deployer can change the controller address.
- The controller can execute the `main` method

### Deploy to Calibrationnet (Testnet)

Let's deploy the SafeController contract to the Calibration testnet:

```bash
npm run calibration:deploy
```

This will deploy the DealClient contract to the Calibration testnet. You'll see output similar to:

```
Deployer: 0x42C930A33280a7218bc924732d67dd84D6247Af4
Deployed to: 0xb364aA01595fbC73c07B6F318dce9A34a1e8527b
Transaction hash: 0x858f01f8fa090cfe89c92754dd777bf4f2aad688502f05dfc9e57738f162392a
```

### Verify Contracts on Calibration using Filfox

Set `SAFE_CONTROLLER_ADDRESS` environment variable to the address of the deployed contract.

```bash
npm run calibration:verify
```

Successful verification will display:

```

> poc-safe-on-fil@1.0.0 verify:calibration
> filfox-verifier forge $DEPLOYED_CONTRACT_ADDRESS src/safe-controller/SafeController.sol:SafeController --chain 314159

⠹ Verifying contract on Filfox...

Verification Result:
✔ ℹ️  Contract already verified at: https://calibration.filfox.info/en/address/0xb364aA01595fbC73c07B6F318dce9A34a1e8527b
```

### Invoke the `tick()` method to check permissions

```bash
npm run calibration:tick
```
