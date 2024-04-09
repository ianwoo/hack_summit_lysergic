// import BN from "bn.js";

import {
  //   AccountInfo,
  Connection,
  //   clusterApiUrl,
  Keypair,
  PublicKey,
  //   SYSVAR_CLOCK_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

export const signTransactionInstruction = async (
  connection: Connection,
  signers: Array<Keypair>,
  feePayer: PublicKey,
  txInstructions: Array<TransactionInstruction>
): Promise<string> => {
  const tx = new Transaction();
  tx.feePayer = feePayer;
  tx.add(...txInstructions);

  return await connection.sendTransaction(tx, signers, {
    preflightCommitment: "single",
  });
};
