import { ModalType } from "@/constants/modal";
import { useModal } from "@/hooks/modal.hook";
import { useTranslation } from "react-i18next";
import { usePhantomWallet } from "@/stores/phantomWalletStore";
import { Button, ButtonText } from "../ui";
import { AccountPopover } from "../popvoer/account.popover.mobile";

export function WalletButton() {
  const { t } = useTranslation();
  const { open } = useModal();
  const { wallet } = usePhantomWallet()

  console.log('wallet info in wallet button ===================>>>>>>>>>>> ', wallet);
  const { address, isConnected } = wallet || {}

  if (isConnected && address) {
    return (
      <AccountPopover />
    );
  }

  return <Button className="flex items-center justify-center px-6" style={{
  }} onPress={() => open(ModalType.CONNECT_WALLET)}>
    <ButtonText>
      {t("wallet.connect-wallet")}
    </ButtonText>
  </Button>
}
;