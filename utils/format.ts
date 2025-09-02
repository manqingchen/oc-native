import numeral from "numeral";
/**
 *
 * 10万以下：显示数字，用逗号间隔
 * 10万以上：显示0.XM.  1M.用Million来代替
 */
export const formatTVLNumber = (number: number) => {
  if (number < 1e5) {
    return numeral(number).format('0,0');
  }
  if (number < 1e6) {
    return `${(number / 1e6).toFixed(1)}M`;
  }
  return `${Math.floor(number / 1e6)}M`;
}

export const formatSubscribe = ({ product }: { product?: Product.Detail }) => {
  if (!product) return 0
  let text = ''
  if ((product.subscribeFeesPlatform + product.subscribeFixedFeesPlatform + product.subscribeMinFeesPlatform) === 0) return 0
  if (product.subscribeFeesPlatform) {
    text += product.subscribeFeesPlatform + '%'
  }
  if (product.subscribeFixedFeesPlatform) {
    text += '+' + '$' + product.subscribeFixedFeesPlatform
  }
  if (product.subscribeMinFeesPlatform) {
    text += ' Minimum=$' + product.subscribeMinFeesPlatform
  }
  return text
}

export const formatRedeem = ({ product }: { product?: Product.Detail }) => {
  if (!product) return 0
  let text = ''
  if ((product.redeemFeesPlatform + product.redeemFixedFeesPlatform + product.redeemMinFeesPlatform) === 0) return 0
  if (product.redeemFeesPlatform) {
    text += product.redeemFeesPlatform + '%'
  }
  if (product.redeemFixedFeesPlatform) {
    text += '+' + '$' + product.redeemFixedFeesPlatform
  }
  if (product.redeemMinFeesPlatform) {
    text += ' Minimum=$' + product.redeemMinFeesPlatform
  }
  return text
}