
// // 资源常量对象 - 只在模块加载时执行一次
// const ASSETS = {
//   tgImage: require("@/assets/svg/tg-icon.svg"),
//   // wxShareImage: require("@/assets/images/wechat.png"),
//   redeem: require("@/assets/svg/oc-asse-Redeem.svg"),
//   subscribe: require("@/assets/svg/oc-asse-Subscribe.svg"),
//   logo: require("@/assets/svg/oc-logo-mobile.svg"),
//   notice: require("@/assets/svg/notice.svg"),
//   mobileBg1: require("@/assets/svg/oc-mobile-bg1.svg"),
//   // homeBg: require("@/assets/images/h5-bg.png"),
//   arrowRight: require("@/assets/svg/oc-button-arrow-right.svg"),
//   homeDescription: require("@/assets/svg/oc-home-description.svg"),
//   homeOCText: require("@/assets/svg/oc-home-oc-text.svg"),
//   wx: require("@/assets/svg/oc-home-footer-wx.svg"),
//   x: require("@/assets/svg/oc-home-footer-x.svg"),
//   email: require("@/assets/svg/oc-home-footer-email.svg"),
//   commonBack: require("@/assets/svg/oc-common-back.svg"),
//   productDetailShare: require("@/assets/svg/oc-product-detail-share.svg"),
//   menu: require("@/assets/svg/oc-doc-menu.svg"),
//   close: require("@/assets/svg/oc-close.svg"),
//   inProcess: require("@/assets/svg/oc-in-process.svg"),
//   processDone: require("@/assets/svg/oc-process-done.svg"),
//   processLine: require("@/assets/svg/oc-process-line.svg"),
//   myAssetsRight: require("@/assets/svg/oc-my-arrow-right.svg"),
//   myAssetsTop: require("@/assets/svg/oc-my-arrow-top.svg"),
//   upsideDown: require("@/assets/svg/oc-upside-down.svg"),
//   copy: require("@/assets/svg/oc-copy.svg"),
//   setting: require("@/assets/svg/oc-my-setting.svg"),
//   activeHomeIcon: require("@/assets/svg/oc-mobile-home-active-icon.svg"),
//   homeIcon: require("@/assets/svg/oc-mobile-home-icon.svg"),
//   activeProductIcon: require("@/assets/svg/oc-mobile-product-active-icon.svg"),
//   productIcon: require("@/assets/svg/oc-nav-products.svg"),
//   activeAssetsIcon: require("@/assets/svg/oc-mobile-assets-active-icon.svg"),
//   assetsIcon: require("@/assets/svg/oc-mobile-assets-icon.svg"),
//   activeMyIcon: require("@/assets/svg/oc-mobile-my-active-icon.svg"),
//   myIcon: require("@/assets/svg/oc-mobile-my-icon.svg"),
//   // subscribeAmount: require("@/assets/images/usdc.png"),
//   indicativeQuantity: require("@/assets/svg/oc-indicative-quantity.svg"),
//   marquee: [
//     require("@/assets/svg/carouselImage/oc-carousel-image1.svg"),
//     require("@/assets/svg/carouselImage/oc-carousel-image2.svg"),
//     require("@/assets/svg/carouselImage/oc-carousel-image3.svg"),
//     // require("@/assets/svg/carouselImage/oc-carousel-image4.svg"),
//     // require("@/assets/svg/carouselImage/oc-carousel-image5.svg"),
//     require("@/assets/svg/carouselImage/oc-carousel-image6.svg"),
//     require("@/assets/svg/carouselImage/oc-carousel-image7.svg"),
//     require("@/assets/svg/carouselImage/oc-carousel-image8.svg"),
//   ],
//   myAddress: require("@/assets/svg/oc-my-address.svg"),
//   toastSuccess: require("@/assets/svg/oc-toast-success.svg"),
//   successModalIcon: require("@/assets/svg/oc-modal-success-icon.svg"),
//   modalCloseIcon: require("@/assets/svg/oc-modal-close.svg"),
//   joinWxTitle: require("@/assets/svg/oc-join-wx-mobile-title.svg"),
//   nextIcon: require("@/assets/svg/oc-next-icon.svg"),
//   modalTitleIcon: require("@/assets/svg/oc-modal-title-icon.svg"),
//   wxLogo: require("@/assets/svg/oc-wx-logo.svg"),
//   share: {
//     shareIcon1: require("@/assets/svg/share/share1.svg"),
//     shareIcon2: require("@/assets/svg/share/share2.svg"),
//     shareIcon3: require("@/assets/svg/share/share3.svg"),
//   },
//   homePic: require("@/assets/svg/oc-mobile-home-pic.svg"),
//   orderHistory: require("@/assets/svg/oc-order-history.svg"),
//   loading: require("@/assets/gif/loading.gif"),
//   redeemProgressLine: require("@/assets/svg/oc-redeem-progess-line.svg"),
//   // empty: require("@/assets/images/empty.png"),
//   testingSvg: require("@/assets/svg/oc-testing.svg")
// } as const;

// // Hook 函数 - 直接返回常量对象
// export const useAssets = () => ASSETS;

// // 也可以直接导出常量供非 Hook 场景使用
// export { ASSETS as assets };

// PC Assets
import h5BgPng from "@/assets/images/h5-bg.png";
import usdcPng from "@/assets/images/usdc.png";
import noticeSvg from "@/assets/svg/notice.svg";
import redeemSvg from "@/assets/svg/oc-asse-Redeem.svg";
import subscribeSvg from "@/assets/svg/oc-asse-Subscribe.svg";
import arrowRightSvg from "@/assets/svg/oc-button-arrow-right.svg";
import commonBackSvg from "@/assets/svg/oc-common-back.svg";
import copySvg from "@/assets/svg/oc-copy.svg";
import menuSvg from "@/assets/svg/oc-doc-menu.svg";
import homeDescriptionSvg from "@/assets/svg/oc-home-description.svg";
import emailSvg from "@/assets/svg/oc-home-footer-email.svg";
import wxSvg from "@/assets/svg/oc-home-footer-wx.svg";
import xSvg from "@/assets/svg/oc-home-footer-x.svg";
import homeOCTextSvg from "@/assets/svg/oc-home-oc-text.svg";
import inProcessSvg from "@/assets/svg/oc-in-process.svg";
import indicativeQuantitySvg from "@/assets/svg/oc-indicative-quantity.svg";
import logoMobileSvg from "@/assets/svg/oc-logo-mobile.svg";
import productsSvg from "@/assets/svg/oc-nav-products.svg";
import nextIconSvg from "@/assets/svg/oc-next-icon.svg";
import processDoneSvg from "@/assets/svg/oc-process-done.svg";
import processLineSvg from "@/assets/svg/oc-process-line.svg";
import productDetailShareSvg from "@/assets/svg/oc-product-detail-share.svg";
import testingSvg from "@/assets/svg/oc-testing.svg";
import toastSuccessSvg from "@/assets/svg/oc-toast-success.svg";
import upsideDownSvg from "@/assets/svg/oc-upside-down.svg";

// Carousel images
import carousel1Svg from "@/assets/svg/carouselImage/oc-carousel-image1.svg";
import carousel2Svg from "@/assets/svg/carouselImage/oc-carousel-image2.svg";
import carousel3Svg from "@/assets/svg/carouselImage/oc-carousel-image3.svg";
// import carousel4Svg from "@/assets/svg/carouselImage/oc-carousel-image4.svg";
// import carousel5Svg from "@/assets/svg/carouselImage/oc-carousel-image5.svg";
import carousel6Svg from "@/assets/svg/carouselImage/oc-carousel-image6.svg";
import carousel7Svg from "@/assets/svg/carouselImage/oc-carousel-image7.svg";
import carousel8Svg from "@/assets/svg/carouselImage/oc-carousel-image8.svg";

// Modal assets
import mobileBg1Svg from "@/assets/svg/oc-mobile-bg1.svg";
import modalCloseSvg from "@/assets/svg/oc-modal-close.svg";
import successModalIconSvg from "@/assets/svg/oc-modal-success-icon.svg";
import modalTitleIconSvg from "@/assets/svg/oc-modal-title-icon.svg";
import wxLogoSvg from "@/assets/svg/oc-wx-logo.svg";

// Share icons
import share1Svg from "@/assets/svg/share/share1.svg";
import share2Svg from "@/assets/svg/share/share2.svg";
import share3Svg from "@/assets/svg/share/share3.svg";

// Other assets
import loadingGif from "@/assets/gif/loading.gif";
import closeSvg from "@/assets/svg/oc-close.svg";
import joinWxMobileTitleSvg from "@/assets/svg/oc-join-wx-mobile-title.svg";
import activeAssetsIconSvg from "@/assets/svg/oc-mobile-assets-active-icon.svg";
import assetsIconSvg from "@/assets/svg/oc-mobile-assets-icon.svg";
import activeHomeIconSvg from "@/assets/svg/oc-mobile-home-active-icon.svg";
import homeIconSvg from "@/assets/svg/oc-mobile-home-icon.svg";
import mobileHomePicSvg from "@/assets/svg/oc-mobile-home-pic.svg";
import activeMyIconSvg from "@/assets/svg/oc-mobile-my-active-icon.svg";
import myIconSvg from "@/assets/svg/oc-mobile-my-icon.svg";
import activeProductIconSvg from "@/assets/svg/oc-mobile-product-active-icon.svg";
import myAddressSvg from "@/assets/svg/oc-my-address.svg";
import myAssetsRightSvg from "@/assets/svg/oc-my-arrow-right.svg";
import myAssetsTopSvg from "@/assets/svg/oc-my-arrow-top.svg";
import settingSvg from "@/assets/svg/oc-my-setting.svg";
import orderHistorySvg from "@/assets/svg/oc-order-history.svg";
import redeemProgressLineSvg from "@/assets/svg/oc-redeem-progess-line.svg";
// import empty from "@/assets/svg/oc-nothing.svg"
import empty from "@/assets/images/empty.png";
import wxShareImage from '@/assets/images/wechat.png';
import tgImage from '@/assets/svg/tg-icon.svg';

export const useAssets = (): any => {

  return {
    tgImage,
    wxShareImage,
    redeem: redeemSvg,
    subscribe: subscribeSvg,
    logo: logoMobileSvg,
    notice: noticeSvg,
    mobileBg1: mobileBg1Svg,
    homeBg: h5BgPng,
    arrowRight: arrowRightSvg,
    homeDescription: homeDescriptionSvg,
    homeOCText: homeOCTextSvg,
    wx: wxSvg,
    x: xSvg,
    email: emailSvg,
    commonBack: commonBackSvg,
    productDetailShare: productDetailShareSvg,
    menu: menuSvg,
    close: closeSvg,
    inProcess: inProcessSvg,
    processDone: processDoneSvg,
    processLine: processLineSvg,
    myAssetsRight: myAssetsRightSvg,
    myAssetsTop: myAssetsTopSvg,
    upsideDown: upsideDownSvg,
    copy: copySvg,
    setting: settingSvg,
    activeHomeIcon: activeHomeIconSvg,
    homeIcon: homeIconSvg,
    activeProductIcon: activeProductIconSvg,
    productIcon: productsSvg,
    activeAssetsIcon: activeAssetsIconSvg,
    assetsIcon: assetsIconSvg,
    activeMyIcon: activeMyIconSvg,
    myIcon: myIconSvg,
    subscribeAmount: usdcPng,
    indicativeQuantity: indicativeQuantitySvg,
    marquee: [
      carousel1Svg,
      carousel2Svg,
      carousel3Svg,
      // carousel4Svg,
      // carousel5Svg,
      carousel6Svg,
      carousel7Svg,
      carousel8Svg,
    ],
    myAddress: myAddressSvg,
    toastSuccess: toastSuccessSvg,
    successModalIcon: successModalIconSvg,
    modalCloseIcon: modalCloseSvg,
    joinWxTitle: joinWxMobileTitleSvg,
    nextIcon: nextIconSvg,
    modalTitleIcon: modalTitleIconSvg,
    wxLogo: wxLogoSvg,
    share: {
      shareIcon1: share1Svg,
      shareIcon2: share2Svg,
      shareIcon3: share3Svg,
    },
    homePic: mobileHomePicSvg,
    orderHistory: orderHistorySvg,
    loading: loadingGif,
    redeemProgressLine: redeemProgressLineSvg,
    empty,
    testingSvg
  };
};
