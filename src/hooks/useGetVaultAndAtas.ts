// import { useCallback, useEffect, useState } from "react";
// import { getVaultAndAtas, signTransactionInstruction } from "./api";
// import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
// import { deserialize } from "borsh";

// class VaultSchema {
// 	mint: PublicKey
// 	minPeriod: Numberu64
// 	rewardPeriod: Numberu64
// 	rate: Numberu64
// 	earlyWithdrawalFee: Numberu64
// 	totalObligations: Numberu64
// 	totalStaked: Numberu64

// 	constructor(fields?: {
// 		mint: PublicKey,
// 		minPeriod: Numberu64,
// 		rewardPeriod: Numberu64,
// 		rate: Numberu64,
// 		earlyWithdrawalFee: Numberu64,
// 		totalObligations: Numberu64,
// 		totalStaked: Numberu64,
// 	}){
// 		this.mint = fields.mint;
// 		this.minPeriod = fields.minPeriod;
// 		this.rewardPeriod = fields.rewardPeriod;
// 		this.rate = fields.rate;
// 		this.earlyWithdrawalFee = fields.earlyWithdrawalFee;
// 		this.totalObligations = fields.totalObligations;
// 		this.totalStaked = fields.totalStaked;
// 	}

// 	static schema = new Map([[
// 		VaultSchema, {
// 			kind: "struct",
// 			fields: [
// 				['mint', ['u8', 32]],
// 				['minPeriod', 'u64'],
// 				['rewardPeriod', 'u64'],
// 				['rate', 'u64'],
// 				['earlyWithdrawalFee', 'u64'],
// 				['totalObligations', 'u64'],
// 				['totalStaked', 'u64']
// 			]
// 		}
// 	]])

// 	serialize(): Uint8Array {
// 		return serialize(VaultSchema.schema, this);
// 	}
// }

// export const useGetVaultAndAtas = (connection: Connection, user: PublicKey, LsuMint: PublicKey) => {
//   const [vaultAndAtas, setVaultAndAtas] = useState<>();

//   const fetchVaultAndAtas = useCallback(async () => {
//     const _vaa = getVaultAndAtas(user, LsuMint).then((res: TransactionInstruction) => signTransactionInstruction(connection, [], user, [res]));

//     const _vaad = deserialize( , _vaa);

//     //lsuVault?: PublicKey; //retrieve using LSU Mint
// //   userLsuAta?: PublicKey; //retrieve using LSU Mint
// //   userPtAta?: PublicKey; //retrieve using LSU Mint
// //   userYtAta?: PublicKey; //retrieve using LSU Mint

//     //deserialize
//     const _asserted = _vaa as PublicKey[];
//     setVaultAndAtas(_asserted);
//   }, [user, LsuMint]);

//   useEffect(() => {
//     fetchVaultAndAtas();
//   }, [fetchVaultAndAtas]);

//   return { vaultAndAtas, fetchVaultAndAtas };
// };
