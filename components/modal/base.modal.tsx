import { Modal, ModalBackdrop } from "@/components/ui/modal";
import { ModalType } from "@/constants/modal";
import { ConnectWalletModal } from "./connect-wallet/connect-wallet";
import { RedeemProgressModal } from "./redeem-progress/redeem.progress.modal";
import { ShareModal } from "./share/share.modal";
import { SuccessModal } from "./success/success.modal";
import { WxShareModal } from "./wx-share/wx.share";
import { LoadingModal } from './loading/loading.modal'
export function BaseModal({
  type,
  isOpen,
  onClose,
}: {
  type?: ModalType;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!type) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {type !== ModalType.LOADING && <ModalBackdrop />}
      {type === ModalType.SUCCESS && <SuccessModal />}
      {type === ModalType.REDEEM_PROGRESS && <RedeemProgressModal />}
      {type === ModalType.JOIN_WECHAT && <WxShareModal />}
      {type === ModalType.CONNECT_WALLET && <ConnectWalletModal />}
      {type === ModalType.SHARE && <ShareModal />}
      {type === ModalType.LOADING && <LoadingModal />}
    </Modal>
  );
}
