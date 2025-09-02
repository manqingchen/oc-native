import { useUserStore } from "@/api/request";
import { useMyAssetsStore } from "@/stores/my.assets.store";
import { useDeleteNotice, useMyAssetsInfo } from "./useMyAssets";
import { useEffect } from "react";

export const useSystemMessage = () => { 
  const dwm = useMyAssetsStore(state => state.dwm);
  const language = useUserStore(state => state.language);
  const { data: myAssets, getMyAssetsInfo: refetch, isLoading } = useMyAssetsInfo({
    dwm,
    language,
  });
  const { deleteNotice } = useDeleteNotice()
 
  const handleDeleteNotice = (id: number) => {
    deleteNotice(id).finally(() => {
      refetch()
    })
  }
  useEffect(() => {
    refetch()
  }, [])
  const noticesList = myAssets?.messageList || []
  const hasNoRead = noticesList.some(item => item.isRead === 0)
  return {
    noticesList,
    handleDeleteNotice,
    isLoading,
    hasNoRead,
    refetch,
  }
}