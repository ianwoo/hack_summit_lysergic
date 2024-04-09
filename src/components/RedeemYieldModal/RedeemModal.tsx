import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Numberu64, makeRedeemYieldInstruction, signTransactionInstruction } from "../../hooks/api";
import { ModalProps, ModalState } from "../../types";

type Props = {
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  connection: Connection;
  redeemer: PublicKey;
  lsuMint: PublicKey;
  lsuVault: PublicKey;
  redeemerLsuAta: PublicKey;
  redeemerPtAta: PublicKey;
  redeemerYtAta: PublicKey;
  amount: Numberu64;
  maturityDate: Date;
};

function RedeemModal(props: Props) {
  const {
    setModal,
    connection,
    redeemer,
    lsuMint,
    lsuVault,
    redeemerLsuAta,
    redeemerPtAta,
    redeemerYtAta,
    amount,
    maturityDate,
  } = props;

  return (
    <div className="modal">
      <div className="modal-header">
        Redeem PT Modal
        <div className="close" onClick={() => setModal({ state: ModalState.None })}>
          &#10006;
        </div>
      </div>
      <button
        onClick={() => {
          makeRedeemYieldInstruction(
            redeemer,
            lsuMint,
            lsuVault,
            redeemerLsuAta,
            redeemerPtAta,
            redeemerYtAta,
            amount,
            maturityDate
          ).then((res: TransactionInstruction) =>
            signTransactionInstruction(
              connection,
              [], //signers
              redeemer,
              [res]
            )
          );
        }}
      >
        REDEEM PT
      </button>
    </div>
  );
}

export default RedeemModal;
