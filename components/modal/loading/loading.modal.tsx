import { Image, ModalContent } from "@/components/ui";
import { useAssets } from "@/hooks/useAsset";

export function LoadingModal() {
  const { loading } = useAssets()

  return (
    <ModalContent id="content" className="flex items-center justify-center bg-transparent border-transparent shadow-none">
      <Image
        source={loading}
        style={{
          width: 83,
          height: 83
        }}
        resizeMode="contain"
      />
    </ModalContent>
  )
}