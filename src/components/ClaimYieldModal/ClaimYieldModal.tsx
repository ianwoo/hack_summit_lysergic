import { ModalProps, ModalState } from "../../types";

type Props = {
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
};

function ClaimYieldModal(props: Props) {
  const { setModal } = props;

  return (
    <div className="modal">
      <div className="modal-header">
        Claim Yield
        <div className="close" onClick={() => setModal({ state: ModalState.None })}>
          &#10006;
        </div>
      </div>
    </div>
  );
}

export default ClaimYieldModal;
