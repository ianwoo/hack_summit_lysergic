import BN from "bn.js";
import assert from "assert";
import { Schema, serialize } from "borsh";
// import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

import {
  AccountMeta,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export function getYieldTokenizerAddress(LsuMint: PublicKey, MaturityDate: Date): PublicKey {
  const _unixTimestamp = MaturityDate.getTime();
  const _unixTimestampU64 = new Numberu64(_unixTimestamp);
  return PublicKey.findProgramAddressSync(
    [LsuMint.toBuffer(), _unixTimestampU64.toBuffer()],
    new PublicKey(LYSERGIC_PROGRAM_ID)
  )[0];
}
//pretty sure is right

export function getYieldTokenAddress(YieldTokenizer: PublicKey, LsuMint: PublicKey, MaturityDate: Date): PublicKey {
  const _unixTimestamp = MaturityDate.getTime();
  const _unixTimestampU64 = new Numberu64(_unixTimestamp);
  return PublicKey.findProgramAddressSync(
    [YieldTokenizer.toBuffer(), LsuMint.toBuffer(), _unixTimestampU64.toBuffer()],
    new PublicKey(LYSERGIC_PROGRAM_ID)
  )[0];
}
//need marker same as below

export function getPrincipalTokenAddress(YieldTokenizer: PublicKey, LsuMint: PublicKey, MaturityDate: Date): PublicKey {
  const _unixTimestamp = MaturityDate.getTime();
  const _unixTimestampU64 = new Numberu64(_unixTimestamp);
  return PublicKey.findProgramAddressSync(
    [YieldTokenizer.toBuffer(), LsuMint.toBuffer(), _unixTimestampU64.toBuffer()],
    new PublicKey(LYSERGIC_PROGRAM_ID)
  )[0];
}
//need marker same as above

//INSTRUCTION FUNCTIONS
export async function makeTokenizeYieldInstruction(
  buyer: PublicKey,
  LsuMint: PublicKey,
  MaturityDate: Date,
  LsuVault: PublicKey,
  BuyerLsuAta: PublicKey,
  BuyerPtAta: PublicKey,
  BuyerYtAta: PublicKey,
  amount: Numberu64
) {
  const _yieldTokenizer = await getYieldTokenizerAddress(LsuMint, MaturityDate);
  const _yieldTokenAddr = await getYieldTokenAddress(_yieldTokenizer, LsuMint, MaturityDate);
  const _ptMint = await getPrincipalTokenAddress(_yieldTokenizer, LsuMint, MaturityDate);

  const data = amount.toBuffer();

  const keys: AccountMeta[] = [
    { pubkey: buyer, isSigner: true, isWritable: true },
    { pubkey: _yieldTokenizer, isSigner: false, isWritable: true },
    { pubkey: LsuMint, isSigner: false, isWritable: true },
    { pubkey: _ptMint, isSigner: false, isWritable: true },
    { pubkey: _yieldTokenAddr, isSigner: false, isWritable: true },
    { pubkey: LsuVault, isSigner: false, isWritable: true },
    { pubkey: BuyerLsuAta, isSigner: false, isWritable: true },
    { pubkey: BuyerPtAta, isSigner: false, isWritable: true },
    { pubkey: BuyerYtAta, isSigner: false, isWritable: true },
  ];

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(LYSERGIC_PROGRAM_ID),
    data,
  });
}

export async function makeRedeemYieldInstruction(
  Redeemer: PublicKey,
  LsuMint: PublicKey,
  LsuVault: PublicKey,
  RedeemerLsuAta: PublicKey,
  RedeemerPtAta: PublicKey,
  BuyerYtAta: PublicKey,
  amount: Numberu64
) {
  const _yieldTokenizer = await getYieldTokenizerAddress(LsuMint, MaturityDate);
  const _yieldTokenAddr = await getYieldTokenAddress(_yieldTokenizer, LsuMint, MaturityDate);
  const _ptMint = await getPrincipalTokenAddress(_yieldTokenizer, LsuMint, MaturityDate);

  // redeemer: PublicKey;
  // yield_tokenizer: PublicKey;
  // lsu_mint: PublicKey;
  // pt_mint: PublicKey;
  // yt_mint: PublicKey;
  // lsu_vault: PublicKey;
  // redeemer_lsu_ata: PublicKey;
  // redeemer_pt_ata: PublicKey;
  // redeemer_yt_ata: PublicKey;
  // amount: Numberu64;

  const keys: AccountMeta[] = [
    { pubkey: Redeemer, isSigner: true, isWritable: true },
    { pubkey: _yieldTokenizer, isSigner: false, isWritable: true },
    { pubkey: LsuMint, isSigner: false, isWritable: true },
    { pubkey: _ptMint, isSigner: false, isWritable: true },
    { pubkey: _yieldTokenAddr, isSigner: false, isWritable: true },
    { pubkey: LsuVault, isSigner: false, isWritable: true },
    { pubkey: BuyerLsuAta, isSigner: false, isWritable: true },
    { pubkey: BuyerPtAta, isSigner: false, isWritable: true },
    { pubkey: BuyerYtAta, isSigner: false, isWritable: true },
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
