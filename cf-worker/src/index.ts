/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const RPC_URL = 'https://api.calibration.node.glif.io/rpc/v1';
const DEPLOYED_CONTRACT_ADDRESS = '0x99119858d2c2F59B19eC7759aacBe18300f63BAd';
const MULTISIG_ADDRESS = '0x0df418f06e2dc2EF03b7f5780f8F4152691435B1';

import Safe from '@safe-global/protocol-kit';
import { type MetaTransactionData, OperationType, SigningMethod } from '@safe-global/types-kit';
import { Interface } from '@ethersproject/abi';

const safeControllerAbi = ['function tick() returns (address, address, address, uint256)'];
const safeControllerIface = new Interface(safeControllerAbi);

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const CONTROLLER_PRIVATE_KEY = env.CONTROLLER_PRIVATE_KEY;
		if (!CONTROLLER_PRIVATE_KEY) {
			throw new Error('CONTROLLER_PRIVATE_KEY not set');
		}
		console.log('Invoking %s .tick() via Safe %s', DEPLOYED_CONTRACT_ADDRESS, MULTISIG_ADDRESS);

		const safeKit = await Safe.init({
			provider: RPC_URL,
			signer: CONTROLLER_PRIVATE_KEY,
			safeAddress: MULTISIG_ADDRESS,
		});

		const signerAddress = await safeKit.getSafeProvider().getSignerAddress();
		if (!signerAddress) {
			throw new Error('Unexpected error: signer address is null or undefined');
		}

		const safeTransactionData: MetaTransactionData = {
			to: DEPLOYED_CONTRACT_ADDRESS,
			value: '0',
			data: safeControllerIface.encodeFunctionData('tick', []),
			operation: OperationType.Call,
		};

		const safeTransaction = await safeKit.createTransaction({
			transactions: [safeTransactionData],
		});

		const signedTransaction = await safeKit.signTransaction(safeTransaction, SigningMethod.ETH_SIGN);

		const tx = await safeKit.executeTransaction(signedTransaction);

		const transactionResult = await (tx.transactionResponse as { wait: () => Promise<unknown> }).wait().then(
			(result) => {
				console.log({ message: 'TX was accepted', result });
				return { success: true, result };
			},
			(error) => {
				console.log({ message: 'TX failed', error });
				return { success: false, error };
			},
		);

		console.log(`Submitted transaction ${tx.hash}`);

		const result = {
			targetContract: DEPLOYED_CONTRACT_ADDRESS,
			safeAddress: MULTISIG_ADDRESS,
			signer: signerAddress,
			transactionHash: tx.hash,
			transactionResult,
		};

		return new Response(JSON.stringify(transactionResult, null, 2), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
} satisfies ExportedHandler<Env>;
