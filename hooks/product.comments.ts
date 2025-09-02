import { useEffect, useMemo, useState } from "react";

export function useProductComments({
  product,
  interval = 5000,
}: {
  product: Product.Detail;
  interval?: number;
}) {
  const comments = useMemo(() => product.productCommentList || [], [product.productCommentList, product.productId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasComment = comments.length > 0;

  useEffect(() => {
    if (comments.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % comments.length);
    }, interval);

    return () => clearInterval(timer);
  }, [comments.length, interval, product.productId]);

  return {
    currentComment: comments[currentIndex],
    allComments: comments,
    hasComment
  }
}