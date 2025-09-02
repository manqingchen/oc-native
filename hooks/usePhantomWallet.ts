import { WalletInfo} from "@/fof_fund_sdk/src";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useRef } from "react";

export const useSolanaWallet = (): WalletInfo => {
    const { publicKey, signTransaction, signMessage } = useWallet();
    const { connection } = useConnection();
    const connectionRef = useRef<any>(connection);

    // 更新连接引用
    const setConnection = useCallback((newConnection: any) => {
        connectionRef.current = newConnection;
    }, []);

    const handleSignMessage = useCallback(async (message: string): Promise<string> => {
        if (!signMessage) {
            throw new Error("Wallet does not support message signing");
        }
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await signMessage(encodedMessage);
        return Buffer.from(signedMessage).toString('base64');
    }, [signMessage]);

    const partialSign = useCallback(async (transaction: any): Promise<any> => {
        if (!signTransaction) {
            throw new Error("Wallet does not support transaction signing");
        }
        try {
            const signedTransaction = await signTransaction(transaction as any);
            return signedTransaction;
        } catch (error: any) {
            console.log('partialSign error ===================>>>>>>>>>>> ', error);
            // 检查是否是用户拒绝签名
            if (error?.message?.includes('User rejected') || error?.code === 4001) {
                throw new Error('User rejected the transaction');
            }
            // 其他错误
            throw new Error(error?.message || 'Transaction signing failed');
        }
    }, [signTransaction]);

    const signAndSendTransaction = useCallback(async (transaction: any): Promise<string> => {
        const signedTx = await partialSign(transaction);
        const txSignature = await connectionRef.current.sendRawTransaction(signedTx.serialize());
        return txSignature;
    }, [partialSign]);

    const partialSignV0 = useCallback(async (transaction: any): Promise<any> => {
        if (!signTransaction) {
            throw new Error("Wallet does not support transaction signing");
        }
        try {
            const signedTransaction = await signTransaction(transaction as any);
            return signedTransaction;
        } catch (error: any) {
            console.log('partialSignV0 error ===================>>>>>>>>>>> ', error);
            // 检查是否是用户拒绝签名
            if (error?.message?.includes('User rejected') || error?.code === 4001) {
                throw new Error('User rejected the transaction');
            }
            // 其他错误
            throw new Error(error?.message || 'Transaction signing failed');
        }
    }, [signTransaction]);

    const signAndSendTransactionV0 = useCallback(async (transaction: any): Promise<string> => {
        console.log('transction.message.recentBlockhash ===================>>>>>>>>>>> ', transaction.message.recentBlockhash);
        const signedTx = await partialSignV0(transaction);
        console.log('transaction next ===================>>>>>>>>>>> ', transaction.message.recentBlockhash);
        console.log("tx1:size", signedTx.serialize().length);
        console.log('signedTx ===================>>>>>>>>>>> ', signedTx.message.recentBlockhash);
        console.log('connectionRef.current ===================>>>>>>>>>>> ', connectionRef.current);
        const txSignature = await connectionRef.current.sendRawTransaction(signedTx.serialize());
        return txSignature;
    }, [partialSignV0]);

    return {
        publicKey: publicKey as any,
        setConnection,
        signMessage: handleSignMessage,
        partialSign,
        signAndSendTransaction,
        partialSignV0,
        signAndSendTransactionV0,
    };
};
