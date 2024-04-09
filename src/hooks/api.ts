import BN from "bn.js";
import assert from "assert";
import { deserializeUnchecked, Schema, serialize } from "borsh";
import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

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

const U64SIZE: number = 8;
const U32SIZE: number = 4;
const DISCRIMINANT: number = 16;
const SLICE: number = -2;
const ENDPOINTS = {
  // mainnet: "https://api.mainnet-beta.solana.com",
  devnet: "https://api.devnet.solana.com",
  testnet: "https://api.testnet.solana.com",
  localhost: "127.0.1.1",
};

const LYSERGIC_PROGRAM_ID = "LSDjBzV1CdC4zeXETyLnoUddeBeQAvXXRo49j8rSguH";

const connection = new Connection(ENDPOINTS.devnet);

export class Numberu64 extends BN {
  toBuffer(): Buffer {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === U64SIZE) {
      return b;
    }
    assert(b.length < U64SIZE, `Numberu64 is limited to ${U64SIZE} bytes`);
    const zeroPad = Buffer.alloc(U64SIZE);
    b.copy(zeroPad);
    return zeroPad;
  }

  static fromBuffer(buffer: any): any {
    assert(buffer.length === U64SIZE, `Invalid buffer length: ${buffer.length}`);
    return new BN(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(DISCRIMINANT)}`.slice(SLICE))
        .join(""),
      DISCRIMINANT
    );
  }
}

export class Numberu32 extends BN {
  toBuffer(): Buffer {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === U32SIZE) {
      return b;
    }
    assert(b.length < U32SIZE, `Numberu32 is limited to ${U32SIZE} bytes`);

    const zeroPad = Buffer.alloc(U32SIZE);
    b.copy(zeroPad);
    return zeroPad;
  }

  static fromBuffer(buffer: any): any {
    assert(buffer.length === U32SIZE, `Invalid buffer length: ${buffer.length}`);
    return new BN(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(DISCRIMINANT)}`.slice(SLICE))
        .join(""),
      DISCRIMINANT
    );
  }
}

enum Expiry {
  TwelveMo = 12,
  EighteenMo = 18,
  TwentyFourMo = 24,
}

type InitTokenizerInstruction = {
  program_id: PublicKey;
  authority: PublicKey;
  yield_tokenizer: PublicKey;
  lsu_mint: PublicKey;
  pt_mint: PublicKey;
  yt_mint: PublicKey;
  lsu_vault: PublicKey;
  expiry: Expiry;
};

type TokenizeYieldInstruction = {
  buyer: PublicKey;
  yield_tokenizer: PublicKey;
  lsu_mint: PublicKey;
  pt_mint: PublicKey;
  yt_mint: PublicKey;
  lsu_vault: PublicKey;
  buyer_lsu_ata: PublicKey;
  buyer_pt_ata: PublicKey;
  buyer_yt_ata: PublicKey;
  amount: Numberu64;
};

type RedeemYieldInstruction = {
  redeemer: PublicKey;
  yield_tokenizer: PublicKey;
  lsu_mint: PublicKey;
  pt_mint: PublicKey;
  yt_mint: PublicKey;
  lsu_vault: PublicKey;
  redeemer_lsu_ata: PublicKey;
  redeemer_pt_ata: PublicKey;
  redeemer_yt_ata: PublicKey;
  amount: Numberu64;
};

type RedeemFromPTInstruction = {
  redeemer: PublicKey;
  yield_tokenizer: PublicKey;
  lsu_mint: PublicKey;
  pt_mint: PublicKey;
  lsu_vault: PublicKey;
  redeemer_lsu_ata: PublicKey;
  redeemer_pt_ata: PublicKey;
  amount: Numberu64;
};

type ClaimYieldInstruction = {
  claimer: PublicKey;
  yield_tokenizer: PublicKey;
  lsu_mint: PublicKey;
  yt_mint: PublicKey;
  lsu_vault: PublicKey;
  redeemer_lsu_ata: PublicKey;
  redeemer_yt_ata: PublicKey;
};

//LIB FUNCTIONS
export async function getYieldTokenizerAddress(LsuMint: Numberu64, MaturityDate: Date): Promise<PublicKey> {
  const _unixTimestamp = MaturityDate.getTime();
  const _unixTimestampU64 = new Numberu64(_unixTimestamp);
  return (
    await PublicKey.findProgramAddressSync(
      [LsuMint.toBuffer(), _unixTimestampU64.toBuffer()],
      new PublicKey(LYSERGIC_PROGRAM_ID)
    )
  )[0];
}
//pretty sure is right

//INSTRUCTION FUNCTIONS
async function initTokenizer(yieldTokenizer: PublicKey) {
  const yieldTokenizer = await find;
  const keys = [
    { pubkey: yieldTokenizer, isSigner: true, isWritable: true },
    { pubkey: yieldTokenizer, isSigner: true, isWritable: true },
    { pubkey: yieldTokenizer, isSigner: true, isWritable: true },
    { pubkey: yieldTokenizer, isSigner: true, isWritable: true },
    { pubkey: yieldTokenizer, isSigner: true, isWritable: true },
  ];
}

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
