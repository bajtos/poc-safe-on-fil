// import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import {
  type MetaTransactionData,
  OperationType,
  SigningMethod,
} from '@safe-global/types-kit'
import { Interface } from '@ethersproject/abi'

const safeControllerAbi = [
  'function tick() returns (address, address, address, uint256)',
]
const safeControllerIface = new Interface(safeControllerAbi)

const RPC_URL =
  process.env.RPC_URL ?? 'https://api.calibration.node.glif.io/rpc/v1'

const SAFE_CONTROLLER_ADDRESS = process.env.SAFE_CONTROLLER_ADDRESS
if (!SAFE_CONTROLLER_ADDRESS) {
  throw new Error('SAFE_CONTROLLER_ADDRESS not set')
}

const MULTISIG_ADDRESS = process.env.MULTISIG_ADDRESS
if (!MULTISIG_ADDRESS) {
  throw new Error('MULTISIG_ADDRESS not set')
}

console.log(
  'Invoking %s .tick() via Safe %s',
  SAFE_CONTROLLER_ADDRESS,
  MULTISIG_ADDRESS,
)

const CONTROLLER_PRIVATE_KEY = process.env.CONTROLLER_PRIVATE_KEY
if (!CONTROLLER_PRIVATE_KEY) {
  throw new Error('CONTROLLER_PRIVATE_KEY not set')
}
// todo: log the wallet address

// Initialize the Protocol Kit with Owner A
const safeKit = await Safe.init({
  provider: RPC_URL,
  signer: CONTROLLER_PRIVATE_KEY,
  safeAddress: MULTISIG_ADDRESS,
})

const signerAddress = await safeKit.getSafeProvider().getSignerAddress()
console.log('Signer:', signerAddress)
if (!signerAddress) {
  console.error('Unexpected error: signer address is null or undefined')
  process.exit(2)
}

console.log('== Safe info ==')
console.log('Contract manager:', safeKit.getContractManager())
console.log('Safe provider:', safeKit.getSafeProvider())
console.log('Multisend address:', safeKit.getMultiSendAddress())
console.log('IS DEPLOYED?', await safeKit.isSafeDeployed())
console.log('Contract version:', safeKit.getContractVersion())
console.log('Owners:', await safeKit.getOwners())
console.log('Chain ID:', await safeKit.getChainId())
console.log('IS SIGNER AN OWNER?', await safeKit.isOwner(signerAddress))

// Create a Safe transaction

const safeTransactionData: MetaTransactionData = {
  to: SAFE_CONTROLLER_ADDRESS,
  value: '0',
  data: safeControllerIface.encodeFunctionData('tick', []),
  operation: OperationType.Call,
}

console.log('Creating a transaction:', safeTransactionData)

const safeTransaction = await safeKit.createTransaction({
  transactions: [safeTransactionData],
})
const signedTransaction = await safeKit.signTransaction(
  safeTransaction,
  // TODO: which SigningMethod is appropriate here?
  SigningMethod.ETH_SIGN,
  // SigningMethod.ETH_SIGN_TYPED_DATA_V4,
)

console.log('Executing the transaction...')

// Execute the Safe transaction
const tx = await safeKit.executeTransaction(signedTransaction)
console.log('TX hash:', tx.hash)
console.log(
  'TX response: %o',
  await (tx.transactionResponse as { wait: () => Promise<unknown> }).wait(),
)
