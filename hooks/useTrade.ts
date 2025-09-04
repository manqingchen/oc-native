// import { usePayRedeemOrder, usePaySubscriptionOrder, useRedeemOrder, useSubscribeOrder } from "@/api/order";
import { ModalType } from "@/constants/modal";
import { getFofFundClientByEnv, } from "@/fof_fund_sdk/src";
import { CURRENT_ENV } from "@/lib/config";
import { useTradeStore } from "@/stores/trade.store";
import { formatAmount } from "@/utils";
// import { PhantomWallet } from "fof-fund-sdk";
import { useWalletStore as useConnect } from "@/lib/store";
import { useFofStore } from "@/stores/fof.store";
import { useWalletStore } from "@/stores/wallet.store";
import { useModal } from "@/hooks/modal.hook";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
// import { useModal } from "./modal.hook";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { OrderService } from "@/services/order.service";
import { useLocalSearchParams } from "expo-router";
import { useWalletBalance } from "./useWalletBalance";
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { usePhantomWallet } from '@/stores/phantomWalletStore'
import { showToast } from "@/utils/toast";
export function useTrade({
  product,
}: {
  product: Product.Detail;
}) {
  useWalletBalance()
  const { type } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<"subscribe" | "redeem">(
    type === "redeem" ? "redeem" : "subscribe"
  );
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [indicativeQuantity, setIndicativeQuantity] = useState("");
  const { open, close } = useModal()
  const { balance, assetBalance } = useWalletStore()
  const { loading, setLoading } = useTradeStore();
  const { fof, fundName, setFoF } = useFofStore()
  const adminWallet = useSolanaWallet()
  const connection = fof?.getConnection()
  const { wallet } = usePhantomWallet()
  useEffect(() => {
    if (!fof && connection) {
      const fofSdk = getFofFundClientByEnv(CURRENT_ENV, connection)
      setFoF(fofSdk as any)
    } else {
      // console.log('fof ===================>>>>>>>>>>>', fof);
    }
  }, [fof, connection])

  const buy = async () => {
    console.log('begin buy !!!')
    try {
      setLoading(true)
      open(ModalType.LOADING)
      const res = await OrderService.subscribeOrder({
        productId: product.productId,
        totalAmount: amount,
        productQuantity: indicativeQuantity,
        fundNetValue: String(product.nav),
      })
      console.log('res', res)
      const orderId = res.data?.orderId;
      console.log('orderId', orderId)
      adminWallet.setConnection(connection as any);
      const params = {
        fundName,
        orderId,
        amount: Number(amount),
        ifRealize: false,
        adminWallet
      }
      console.log('buy params purchaseTokens ===================>>>>>>>>>>> ', params);
      console.log('adminWallet ===================>>>>>>>>>>> ', adminWallet);
      const approveTxHash = await fof?.approveCash(
        Number(amount),
        adminWallet
      );
      console.log('🚀🚀🚀 approveTxHash ===================>>>>>>>>>>> ', approveTxHash);
      const res1 = await OrderService.paySubscriptionOrder({ orderId, approveTxHash, cashAmount: Number(amount) });
      console.log('res1 ===================>>>>>>>>>>> ', res1);
      if (!res1.success) {
        throw new Error((res1 as any).msg)
      }
      close().then(() => {
        open(ModalType.SUCCESS)
      })

      setAmount("");
      setIndicativeQuantity("");
      setLoading(false)
      return res1;
    } catch (error: any) {
      console.log('error ===================>>>>>>>>>>> ', error);
      showToast.success(error?.message || error?.toString() || 'Transaction failed')
      close()
      setLoading(false)
      console.error('buy error ===================>>>>>>>>>>> ', error);
    }
  };
  const redeem = async () => {
    try {
      setLoading(true)
      open(ModalType.LOADING)
      const res = await OrderService.redemptionOrder({
        productId: product.productId,
        redeemAmount: amount,
        productQuantity: Number(indicativeQuantity),
        fundNetValue: String(product.nav),
      })
      const orderId = res?.data?.orderId;
      console.log('Number(amount) ===================>>>>>>>>>>> ', Number(amount), amount);
      const approveTxHash = await fof?.approveFundAsset(
        fundName,
        Number(indicativeQuantity),
        adminWallet
      )
      console.log('approveTxHash ===================>>>>>>>>>>> ', approveTxHash);
      const params = {
        fundName,
        orderId,
        ifRealize: false,
        approveTxHash
      }
      console.log('redeem params ===================>>>>>>>>>>> ', params);
      const res1 = await OrderService.payRedemptionOrder(params);
      console.log('res1 ===================>>>>>>>>>>> ', res1);
      console.log('res1.success ===================>>>>>>>>>>> ', res1.success);
      if (!res1.success) {
        throw new Error((res1 as any).msg)
      }
      close().then(() => {
        open(ModalType.REDEEM_PROGRESS)
      })
      setAmount("");
      setIndicativeQuantity("");
      return res1;
    } catch (error: any) {
      showToast.success(error?.message || error?.toString() || 'Transaction failed')
      console.error('redeem error ===================>>>>>>>>>>> ', error);
      close()
      setLoading(false)
    } finally {
      close()
      setLoading(false)
    }
  }
  const changeAmount = (value: string) => {
    setAmount(value);
    if (activeTab === "subscribe") {
      const quantity = formatAmount(Number(value) / product?.nav!);
      console.log('quantity ===================>>>>>>>>>>> ', quantity);
      setIndicativeQuantity(String(quantity));
    } else {
      const quantity = formatAmount(Number(value) / product?.nav!);
      setIndicativeQuantity(String(quantity));
    }
  };
  const changeIndicativeQuantity = (value: string) => {
    setIndicativeQuantity(value);
    if (activeTab === "subscribe") {
      const amount = formatAmount(Number(value) * product?.nav!);
      setAmount(String(amount));
    } else {
      const amount = formatAmount(Number(value) * product?.nav!);
      setAmount(String(amount));
    }
  };

  const minSubscribeAmount = product?.minSubscribeAmount || 0
  const minRedeem = product?.redeemMinNum

  //  Not comply with the incremental rule
  //  
  // 不能购买 比如钱不够， 不能赎回， 比如余额不足
  const cannotPurchase = useMemo(() => {
    if (amount === '') return false
    let amt: number
    if (activeTab === "subscribe") {
      amt = Number(amount)
      if (amt > (balance || 0)) return t("trade.insufficient_balance")
      else if (amt < minSubscribeAmount || !amt) return t('trade.below_the_minimum_subscription_amount')
      // else if (amt % product?.subscribeIncrement !== 0) return t('trade.not_comply_with_the_incremental_rule')
    }
    if (activeTab === "redeem") {
      amt = Number(indicativeQuantity)
      if (assetBalance === '-') return
      if (amt > (assetBalance || 0)) return t("trade.insufficient_balance")
      else if (amt < minRedeem || !amt) return t('trade.below_the_minimum_subscription_amount')
      // else if (amt % product?.redeemIncrement !== 0) return t('trade.not_comply_with_the_incremental_rule')
    }
    return false
  }, [amount, activeTab, minSubscribeAmount, balance, assetBalance])


  // 按钮是否可以点击继续
  const disabledNext = useMemo(() => {
    if (amount === '') return true
    if (cannotPurchase) return true
    if (loading) return true
    return false
  }, [amount, cannotPurchase, loading])

  const handleClick = () => {
    if (disabledNext) return
    if (activeTab === "subscribe") {
      buy()
    } else {
      redeem()
    }
  }

  return {
    cannotPurchase,
    buy,
    redeem,
    amount,
    setActiveTab,
    activeTab,
    changeAmount,
    changeIndicativeQuantity,
    setAmount,
    indicativeQuantity,
    disabledNext,
    setIndicativeQuantity,
    handleClick,
    transactionText: activeTab === "subscribe" ? t("button.continue_to_subscribe") : t("button.continue_to_redeem")
  }
}
