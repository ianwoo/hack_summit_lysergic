import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Numberu64, makeTokenizeYieldInstruction, signTransactionInstruction } from "../../hooks/api";
import { ModalProps, ModalState } from "../../types";

type Props = {
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  connection: Connection;
  buyer: PublicKey;
  lsuMint: PublicKey;
  maturityDate: Date;
  lsuVault: PublicKey;
  buyerLsuAta: PublicKey;
  buyerPtAta: PublicKey;
  buyerYtAta: PublicKey;
  amount: Numberu64;
};

function TokenizeYieldModal(props: Props) {
  const { setModal, connection, buyer, lsuMint, maturityDate, lsuVault, buyerLsuAta, buyerPtAta, buyerYtAta, amount } =
    props;

  return (
    <div className="modal">
      <div className="modal-header">
        Tokenize Yield
        <div className="close" onClick={() => setModal({ state: ModalState.None })}>
          &#10006;
        </div>
      </div>
      <button
        onClick={() => {
          makeTokenizeYieldInstruction(
            buyer,
            lsuMint,
            maturityDate,
            lsuVault,
            buyerLsuAta,
            buyerPtAta,
            buyerYtAta,
            amount
          ).then((res: TransactionInstruction) =>
            signTransactionInstruction(
              connection,
              [], //signers
              buyer,
              [res]
            )
          );
        }}
      >
        TOKENIZE YIELD
      </button>
    </div>
  );
}

export default TokenizeYieldModal;
