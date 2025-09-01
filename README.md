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
