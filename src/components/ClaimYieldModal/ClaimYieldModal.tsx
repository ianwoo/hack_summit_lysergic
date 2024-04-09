import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Numberu64, makeClaimYieldInstruction, signTransactionInstruction } from "../../hooks/api";
import { ModalProps, ModalState } from "../../types";

type Props = {
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  connection: Connection;
  claimer: PublicKey;
  lsuMint: PublicKey;
  lsuVault: PublicKey;
  redeemerLsuAta: PublicKey;
  redeemerYtAta: PublicKey;
  amount: Numberu64;
  maturityDate: Date;
};

function ClaimYieldModal(props: Props) {
  const { setModal, connection, claimer, lsuMint, lsuVault, redeemerLsuAta, redeemerYtAta, amount, maturityDate } =
    props;

  return (
    <div className="modal">
      <div className="modal-header">
        Claim Yield
        <div className="close" onClick={() => setModal({ state: ModalState.None })}>
          &#10006;
        </div>
      </div>
      <button
        onClick={() => {
          makeClaimYieldInstruction(
            claimer,
            lsuMint,
            lsuVault,
            redeemerLsuAta,
            redeemerYtAta,
            amount,
            maturityDate
          ).then((res: TransactionInstruction) =>
            signTransactionInstruction(
              connection,
              [], //signers
              claimer,
              [res]
            )
          );
        }}
      >
        CLAIM YIELD
      </button>
    </div>
  );
}

export default ClaimYieldModal;
