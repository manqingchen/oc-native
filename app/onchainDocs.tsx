import { Footer } from "@/components/footer";
import { MobileDocBar } from "@/components/footer/doc.bar";
import { BottomLogo } from "@/components/home/bottom.logo";
import { Box, Text } from "@/components/ui";
import { OnchainDocSection } from "@/constants/oc.doc";
import { useScrollStore } from "@/stores/scorll.store";
import { twClassnames } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Linking } from "react-native";

export default function OnchainDocs() {
  const { id } = useLocalSearchParams()
  const { t, i18n } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const howToStartRef = useRef(null);
  const walletGuideRef = useRef(null);
  const tradeGuideRef = useRef(null);
  const securityRef = useRef(null);
  const contactRef = useRef(null);
  const aboutOnchainRef = useRef(null);
  const { scrollToSection, setSectionRef, setSectionTop } = useScrollStore();

  useEffect(() => {
    setSectionRef(OnchainDocSection.WRAPPER, scrollViewRef);
    setSectionRef(OnchainDocSection.ABOUT_ONCHAIN, aboutOnchainRef);
    setSectionRef(OnchainDocSection.HOW_TO_START, howToStartRef);
    setSectionRef(OnchainDocSection.WALLET_GUIDE, walletGuideRef);
    setSectionRef(OnchainDocSection.TRADE_GUIDE, tradeGuideRef);
    setSectionRef(OnchainDocSection.TRUST_SECURITY, securityRef);
    setSectionRef(OnchainDocSection.CONTACT_US, contactRef);
  }, [setSectionRef]);
  useEffect(() => {
    setTimeout(() => {
      if (id) {
        scrollToSection(id as string);
      }
    }, 200)
  }, [id])
  const boxClassName = twClassnames('', "mb-11");
  const praams = useMemo(() => {
    return {
      aboutOnchainRef,
      howToStartRef,
      tradeGuideRef,
      walletGuideRef,
      contactRef,
      boxClassName,
      setSectionTop,
    }
  }, [])
  const renderContent = useMemo(() => {
    if (i18n.language === 'zh') return <ZHContent {...praams} />
    return <ENContent {...praams} />
  }, [i18n.language])
  return (
    <Box
      className={twClassnames(
        "flex-1 bg-white",
        " pt-1"
      )}
    >
      <MobileDocBar />
      <ScrollView  className="scroll-smooth" showsVerticalScrollIndicator={false} ref={scrollViewRef} >
        {renderContent}
        <BottomLogo className="mt-[18px] mb-[47px]" />
        <Footer />
      </ScrollView>
    </Box>
  );
}

function Title({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text
      className={twClassnames(
        "font-['inter'] block text-[26px] leading-[31px] font-bold text-[#1B1B1D] mb-5",
        className
      )}
    >
      {children}
    </Text>
  );
}

function Content({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text
      className={twClassnames(
        "font-['inter'] text-[16px] leading-[24px] font-normal text-[#929294]",
        className
      )}
    >
      {children}
    </Text>
  );
}

function SubTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <Text className={twClassnames("font-['inter'] text-[16px] leading-[24px] font-bold text-black flex", className)}>{children}</Text>
      {'\n'}
    </>
  )
}

function SubContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <Text className={twClassnames("font-['inter'] text-[16px] leading-[24px] font-normal text-[#929294] flex", className)}>{children}</Text>
      <Box className='w-full h-2' />
    </>
  )
}

function ENContent({
  aboutOnchainRef,
  howToStartRef,
  tradeGuideRef,
  walletGuideRef,
  contactRef,
  boxClassName,
  setSectionTop,
}: any) {
  const { t } = useTranslation();
  return (
    <Box
      className={twClassnames(
        'flex flex-col',
        "mt-0 mx-6"
      )}
    >
      <Box
        ref={aboutOnchainRef}
        onLayout={(e) => setSectionTop(OnchainDocSection.ABOUT_ONCHAIN, e.nativeEvent.layout.y)}
        className={twClassnames(
          "scroll-mt-12",
          "mb-11 mt-[21px]"
        )}
      >
        <Title>
          {t("onchainDocs.about_onchain.title")}
        </Title>
        <Content>
          <Text> OnChain - Moving assets onchain,OnChain reconstructs the global asset investment
            experience through blockchain technology</Text>
          <Box className='w-full h-4' />
          <SubTitle>I. Team Background </SubTitle>
          <SubContent>
            The OnChain team unites experts from traditional finance and blockchain, including the
            founder of a NASDAQ-listed company , leaders from a trillion-dollar asset management firm,
            and former CEX executives. Core members, graduates of Peking University, Columbia, and
            others, have worked at Goldman Sachs, Bytedance, and Tencent, with deep expertise in
            blockchain, smart contracts, and digital asset management.
          </SubContent>
          <SubTitle>II. Purpose of OnChain </SubTitle>
          <SubContent>
            Recognizing the shortage of stable on-chain investment products, OnChain aims to bridge
            traditional finance and blockchain. Our platform integrates off-chain financial returns with on-
            chain token rewards to offer safer, more accessible wealth management. With 87% of young
            investors facing barriers to quality asset management, OnChain seeks to democratize
            access and reshape the market.
          </SubContent>
          <SubTitle>III. Market Opportunities </SubTitle>
          <SubContent>
            The global fund investment market is $120T, with on-chain demand exceeding $10T, yet
            stable products are scarce. High-performance blockchains like Solana enable efficient, low-
            cost transactions, fueling explosive growth in on-chain wealth management. OnChain targets
            this gap, leveraging platforms like Solana to deliver diverse, high-quality investment products
            for millions of users.
          </SubContent>
          <SubTitle>IV. User Feedback & Validation </SubTitle>
          <SubContent>
            Early user feedback highlights strong interest in on-chain wealth management but concerns
            about security and profitability. OnChain addresses these with robust security (e.g., smart
            contracts, licensed custody) and partnerships with top global institutions. Initial research
            confirms market demand, with plans to integrate stocks, bonds, and futures from NASDAQ,
            NYSE, HKEX, and other major exchanges for seamless global investing.
          </SubContent>
          <SubTitle>V. Long-Term Vision </SubTitle>
          <SubContent>
            OnChain aspires to be the world’s leading on-chain wealth management platform, serving
            100 million users. We will innovate product offerings, enhance user experience, and
            collaborate to advance blockchain in finance, driving a prosperous, diverse future for internet
            capital markets.
            Next, Internet Capital Markets will usher in a more prosperous and diverse future
          </SubContent>
        </Content>
      </Box>
      <Box ref={howToStartRef} onLayout={(e) => setSectionTop(OnchainDocSection.HOW_TO_START, e.nativeEvent.layout.y)} className={boxClassName}>
        <Title>
          {t("onchainDocs.how_it_works.title")}
        </Title>
        <Content>
          OnChain is positioned as an "all-scenario on-chain capital markets investment platform," designed to meet the one-stop global asset allocation needs of on-chain clients. It will offer financial products including money market funds, investment-grade bond funds, and non-standard fixed-income public/private products managed by top institutions such as CMBI ,UBS, and Invesco.

          <SubContent>
            In the future, OnChain will support investments in global ETFs, including spot gold ETFs, crude oil ETFs, and Nasdaq 100 ETFs, as well as actively managed public funds through separate investment accounts. Additionally, by partnering with licensed brokers, OnChain will connect to major equity markets such as Nasdaq, NYSE, Hong Kong Stock Exchange, and Shanghai/Shenzhen Stock Exchanges for trading equity linked products, and to commodity exchanges like LME and CME for trading commodity derivatives contracts.
          </SubContent>

          <SubContent>
            Ultimately, OnChain is committed to build a truly configurable on-chain platform for global capital markets, collaborating with more high-quality licensed institutions to enrich trading options and improve investment efficiency On the technical level, our self-developed supply chain HUB system is the core support. It is like an intelligent resource hub, which can manually and flexibly select high-quality products, and can also automatically schedule according to preset rules. The management background can configure global supplier assets online, ultimately achieving "one-click global asset allocation", which greatly reduces the threshold for cross-market operations for institutional users.
          </SubContent>

          <SubContent>Three key innovation points:               </SubContent>

          <SubContent>
            The global fund investment market is $120T, with on-chain demand exceeding $10T, yet
            stable products are scarce. High-performance blockchains like Solana enable efficient, low-
            cost transactions, fueling explosive growth in on-chain wealth management. OnChain targets
            this gap, leveraging platforms like Solana to deliver diverse, high-quality investment products
            for millions of users.
          </SubContent>

          <SubTitle>1.Security upgrade for asset tokenization  </SubTitle>

          <SubContent>
            Our first batch of monetary fund products applied the Solana ecosystem's Token-2022 standard to solve the pain points of traditional funds.{'\n'}
            • Transaction compliance: Through the "transfer hook", tokens can only be redeemed through the fund contract, eliminating private transfers. All transactions are completed within the compliance framework.{'\n'}
            • Compatibility and flexibility: Supports both SPL and Token-2022 standards. Upper-level FOF funds use the more powerful Token-2022 to achieve programmable liquidity (such as on demand minting/destruction of tokens), while underlying assets use SPL to ensure basic compatibility. The two work together.{'\n'}
            • Net Value Fairness: Anchoring the net value through algorithms ensures that each transaction is allocated according to real-time fair value, avoiding the settlement delay problem of traditional funds.
          </SubContent>
          <SubTitle>2.Triple security protection for subscription process  </SubTitle>
          <SubContent>
            From the moment the user subscribes, the system provides protection through three layers of design.{'\n'}
            • Permission isolation: Use different PDA addresses (program-derived addresses) to split core functions such as fund management, liquidity pool, and token minting, and independently control each link.{'\n'}
            • Allowlist mechanism: Only authorized addresses can perform key operations, such as fund company admission, large transaction approval, etc., to accurately control risks.• Whole-link verification: Automatically scan asset status, permission matching, and compliance before trading to prevent misoperations and malicious attacks. At the same time, real-time recording of outstanding transactions through "in-transit asset tracking", combined with "two-way net value calculation" (FOF and underlying asset synchronization accounting) and "net value update time limit", ensures the accounting accuracy and price stability of each transaction.
          </SubContent>
          <SubTitle>3.On-chain asset tokenization  </SubTitle>
          <SubContent>
            To solve the problem of slow redemption and high Liquidity Risk of traditional funds, we have designed a "layered liquidity architecture". {'\n'}
            • Exclusive redemption pool: redeem_cash_pool independent of the main fund pool, specifically to meet redemption needs and avoid running risks;{'\n'}
            • Dual-mode selection: Users can choose "instant redemption" (with sufficient liquidity in the pool arriving instantly) or "delayed redemption" (entering the processing queue to balance overall liquidity) according to their needs.{'\n'}
            • Asset isolation: By separating core assets and trading assets through a multi-account system, even in extreme market conditions, the underlying principal can remain safe. Finally, let's look at the "scalability design" of the underlying architecture.{'\n'}
            The user and order system uses database sharding technology. The middle layer intelligently routes and automatically distributes requests according to rules, and the business layer is completely unaware of where the data exists. This design allows the system to maintain millisecond-level response even with millions of users and tens of thousands of concurrent users, leaving enough space for future access to more assets and users.{'\n'}
            In summary, OnChain has made global asset investment as simple, safe, and efficient as online shopping through three major innovations: "compliance architecture + smart contracts + layered liquidity". Whether it is institutions doing cross-border allocation or individual investors wanting Risk Diversification, we can provide whole-link solutions.
          </SubContent>
        </Content>
      </Box>


      <Box ref={walletGuideRef} onLayout={(e) => setSectionTop(OnchainDocSection.WALLET_GUIDE, e.nativeEvent.layout.y)} className={boxClassName}>
        <Title>
          {t("onchainDocs.trust_security.title")}
        </Title>
        <Content>

          <SubTitle>①Terms of Use </SubTitle>
          Access to, and use of, the DApp and the services available through the DApp (Services) are subject to the following terms, conditions and notices (Terms of Use). By using the Services, you are agreeing to all of the Terms of Use, as may be updated by us from time to time. You should check this page regularly to take notice of any changes we may have made to the Terms of Use.
          <SubContent>
            1.Amendments to Terms of Use The Company reserves the right to amend these Terms of Use from time to time. Amendments will be effective immediately upon notification on the App or through the Services. Your continued use of the App and the Services following such notification will represent an agreement by you to be bound by the Terms of Use as amended.
          </SubContent>
          <SubContent>
            2.Area and age limits You must be at least 18 years old, or the age of legal majority in your jurisdiction of residence, to access the App and the Services. You may not use the App or the Services you represent and warrant that: [i]you are a resident, national or agent of [China, North Korea], or any other jurisdiction where the service offered by us is restricted [Restricted Territories]; [ii]you are included in any trade embargoes, list of economic sanctions or equivalent maintained by the United States government, the United Kingdom government, the European Union or the United Nations [Restricted Persons]; [iii]you intend to transact with any Restricted Territories or Restricted Persons; [iv] your access to and use of the App and Services is illegal in your country of residence in the manner in which you access and use them.
          </SubContent>
          <SubContent>
            3.Temporary application Access to the App is permitted on a temporary basis, and we reserve the right to withdraw or amend the Services without notice. We will not be liable if for any reason the App is unavailable at any time or for any period. From time to time, we may restrict access to some parts or all of the App.
          </SubContent>
          <SubContent>
            4.External link The App may contain links to other apps or websites (Linked Sites), which are not operated by the Company. The Company has no control over the Linked Sites, makes no warranties or representations in relation to the Linked Sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them. Your use of the Linked Sites will be subject to the terms of use and service contained within each respective Linked Site.
          </SubContent>
          <SubContent>
            5.Copyright Except where expressly stated to the contrary all persons (including their names and images), third party trade marks and content, services and/or locations featured in the App are in no way associated, linked or affiliated with the Company and you should not rely on the existence of such a connection or affiliation. Any trade marks/names featured on the App are owned by the respective trade mark owners. Where a trade mark or brand name is referred to it is used solely to describe or identify the products and services and is in no way an assertion that such products or services are endorsed by or connected to the Company.
          </SubContent>
          <SubContent>
            6.Force majeure The Company will not be in breach of these Terms of Use as a result of, or liable for, any failure or delay in the performance of the Company’s obligations under these Terms of Use to the extent that such failure or delay is wholly or partially caused, directly or indirectly, by any event outside the Company’s reasonable control or any act or omission of you or any third party.
          </SubContent>


          <SubTitle>②Privacy Policy </SubTitle>
          Access to, and use of, the DApp and the services available through the DApp (Services) are subject to the following terms, conditions and notices (Terms of Use). By using the Services, you are agreeing to all of the Terms of Use, as may be updated by us from time to time. You should check this page regularly to take notice of any changes we may have made to the Terms of Use.
          <SubContent>
            7.Introduction
            1.1 OnChain recognizes that people who use our products value their privacy. This Privacy Policy details important information regarding the collection, use and disclosure of User information collected on theOnChain website located at OnChain.Channel(the “Site”).OnChain provides this Privacy Policy to help you understand how your personal information is used by us and your choices regarding our use of it. By using the Site, you agree that we can collect, use, disclose, and process your information as described in this Privacy Policy. This Privacy Policy only applies to the Site, and not to any other websites, products or services you may be able to access or link to via the Site. We encourage you to read the privacy policies of any other websites you visit before providing your information to them. While our values will not shift, the Site will evolve over time, and this Privacy Policy will change to reflect that evolution. If we make changes, we will notify you by revising the date at the top of this Privacy Policy. In some cases, if we make significant changes, we may give you additional notice by adding a statement to our homepage. We encourage you to review this Privacy Policy periodically to stay informed about our practices. Some third-party providers may place cookies or pixels - small data files stored on your hard drive or in device memory - on your browser or hard drive. Note that this Privacy Policy does not cover the use of cookies or pixels by such third parties. Most web browsers are set to accept cookies and pixels by default, but you can usually set your browser to remove or reject browser cookies or pixels. If you do choose to remove or reject cookies or pixels, however, your ability to use the Site might be affected{'\n'}
            1.2 This Privacy Policy should be read in conjunction with our Terms of Use. By accessing the Site, you are consenting to the information collection and use practices described in this Privacy Policy. {'\n'}
            1.3 Your use of the Site and any personal information you provide through the Site remains subject to the terms of this Privacy Policy and our Terms of Use, as each may be updated from time to time. {'\n'}
            1.4 Any questions, comments or complaints that you might have should be in contact with the US.
          </SubContent>
          <SubContent>
            8.Information We Collect The personal information we collect from you generally may include: {'\n'}
            2.1 Network information regarding transactions, including, among other things, the type of device you use, access times, hardware model, MAC address, IP address, operating system and version, and other unique device identifiers. {'\n'}
            2.2. Information about plugins you might be using, included but not limited to those related to the management of cryptocurrency assets and any information provided by them., and your Evm&Solana public address. {'\n'}
            2.3 We may receive network information from you as a result of your interaction with our Site. {'\n'}
            2.4 Evm &Solana public address-When you register as a user, we may collect the following personal information from you: your email address and user name. We may also receive personal information from third parties, when you sign up to services provided by OnChain through a social network; in such occasions, we may receive the personal information you have made available to such third parties, and which you have allowed for them to relay via your privacy settings. {'\n'}
            2.5 We collect information relating to your participation in theOnChain community, including the events you attend and any information you share through our X and Telegram community platform. {'\n'}
            2.6 We may collect information when you contact us with questions or concerns and when you voluntarily respond to questionnaires, surveys or requests for market research seeking your opinion and feedback. {'\n'}
            2.7 We maintain a social media presence on platforms like  X (“Social Media Pages”). When you interact with us on social media, we may receive personal information that you provide or make available to us based on your settings, such as your contact details. In addition, the companies that host our Social Media Pages may provide us with aggregate information and analytics regarding the use of our Social Media Pages. [We may also receive information from social media platforms if you link your social media accounts with yourOnChain account. The type of information we receive depends on your settings with the relevant platform, but may include things like your handle and followers list. {'\n'}
            2.8 We use Google Analytics to collect anonymous aggregate user data for the purpose of optimizing the user experience. We do not share user data with any third-party organizations.
          </SubContent>
          <SubContent>
            9.The WayOnChain Uses your Personal Information {'\n'}
            3.1 As with nearly all interactions that take place on the World Wide Web, our servers may receive information by virtue of your interaction with them, including but not limited to IP Addresses. {'\n'}
            3.2 Some of the services in our Site(such as create, maintain, and authenticate your account) require permissions that could potentially be used to access additional personal information. Such permissions are used for an extremely limited technical purpose for allowing the Site to properly interact with your browser. No additional information is obtained beyond what is necessary to provide the Site. No information received is shared with any third-party except those affiliated withOnChain or as required for provision of the Site. {'\n'}
            3.3OnChain collects usage data for purposes of monitoring web traffic and improving our products. {'\n'}
            3.4 Public blockchains provide transparency into transactions andOnChain is not responsible for preventing or managing information broadcasted on a blockchain. {'\n'}
            3.5 To assist us in meeting business operations needs and to perform certain services and functions, we may share personal information with service providers, including hosting services, cloud services, and other information technology services, email communication software and email newsletter services, advertising and marketing services, payment processors, customer relationship management and customer support services, and analytics services. Pursuant to our instructions, these parties will access, process, or store personal information in the course of performing their duties to us. {'\n'}
            3.6 We may share personal information with our professional advisors such as lawyers and accountants where doing so is necessary to facilitate the services they render to us. {'\n'}
            3.7 If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, receivership, dissolution, sale of all or a portion of our assets, or transition of service to another provider (collectively a “Transaction”), your personal information may be shared in the diligence process with counterparties and others assisting with the Transaction and transferred to a successor or affiliate as part of or following that Transaction along with other assets. {'\n'}
            3.8 We do not volunteer your personal information to government authorities or regulators, but we may disclose your personal information where required to do so for the Compliance and Protection purposes described above. {'\n'}
          </SubContent>
          <SubContent>
            10.What We Do with Information We Collect {'\n'}
            4.1OnChain may use the information we collect in the following ways: To analyze trends for how the Site are being used; To improve the Site; To help personalize your experience of the Site; and If you gave us your contact information, we may use that information to contact you to send you technical notices, updates, confirmations, security alerts, to provide support to you, to tell you about other products and services that we think might interest you, or to respond to your comments or questions. {'\n'}
            4.2OnChain may share the information we collect with third parties who need to access it in order to perform work on our behalf, including doing things like helping us make the Site available, including without limitation payment services providers, anti-fraud services providers, or providing analytics services for us. We work hard to ensure that these third parties only access and use your information as necessary to perform their functions. {'\n'}
            4.3OnChain may create aggregations and anonymizations that contain your information in a way that does not directly identify you.OnChain may use and/or share those aggregations and anonymizations for a variety of purposes related to the Site, or our company and its business. {'\n'}
            4.4OnChain may disclose your personal information to our subsidiaries, affiliated companies, agents, businesses, or service providers who process your personal information on our behalf in providing the Service to you. Our agreements with these service providers limit the kinds of information they can use or process and ensure they use reasonable efforts to keep your personal information secure. {'\n'}
            4.5OnChain also reserves the right to disclose personal information thatOnChain believes, in good faith, is appropriate or necessary to enforce our Terms of Use, take precautions against liability or harm, to investigate and respond to third-party claims or allegations, to respond to court orders or official requests, to protect the security or integrity of our Site, and to protect the rights, property, or safety ofOnChain, our users or others. {'\n'}
            4.6 In the event thatOnChain is involved in a merger, acquisition, sale, bankruptcy, insolvency, reorganization, receivership, assignment for the benefit of creditors, or the application of laws or equitable principles affecting creditors’ rights generally, or other change of control, there may be a disclosure of your information to another entity related to such event.
          </SubContent>
          <SubContent>
            11.LINKS TO OTHER WEBSITES The Service may contain links to other websites not operated or controlled byOnChain, including social media services (“Third Party Sites”). The information that you share with Third Party Sites will be governed by the specific privacy policies and terms of service of the Third Party Sites and not by this Privacy Policy. By providing these links we do not imply that we endorse or have reviewed these sites. Please contact the Third Party Sites directly for information on their privacy practices and policies.
          </SubContent>
          <SubContent>
            12.Your ChoiceOnChain will process your personal information in accordance with this Privacy Policy, and as part of that you will have limited or no opportunity to otherwise modify how your information is used byTOX .
          </SubContent>
          <SubContent>
            13.Cookies Our Site uses “Cookies”, which are text files placed on your computer which helpOnChain analyze how users use the Site, and similar technologies (e.g. web beacons, pixels, ad tags and device identifiers) to recognise you and/or your device on, off and across different devices and our Site, as well as to improve the Site, to improve marketing, analytics or functionality. The use of Cookies is standard on the internet. Although most web browsers automatically accept cookies, the decision of whether to accept or not is yours. You may adjust your browser settings to prevent the use of cookies, or to provide notification whenever a cookie is sent to you. You may refuse the use of cookies by selecting the appropriate settings on your browser. However, please note that if you do this, you may not be able to access the full functionality of our Site.
          </SubContent>
          <SubContent>
            13.Cookies Our Site uses “Cookies”, which are text files placed on your computer which helpOnChain analyze how users use the Site, and similar technologies (e.g. web beacons, pixels, ad tags and device identifiers) to recognise you and/or your device on, off and across different devices and our Site, as well as to improve the Site, to improve marketing, analytics or functionality. The use of Cookies is standard on the internet. Although most web browsers automatically accept cookies, the decision of whether to accept or not is yours. You may adjust your browser settings to prevent the use of cookies, or to provide notification whenever a cookie is sent to you. You may refuse the use of cookies by selecting the appropriate settings on your browser. However, please note that if you do this, you may not be able to access the full functionality of our Site.
          </SubContent>
          <SubContent>
            14.Information We Don't Collect We do not collect any other personally-identifiable information about you, unless you give it to us directly: by filling out a form, giving us written feedback, communicating with us via third party social media sites, or otherwise communicating with us via the Site or any other means.
          </SubContent>
          <SubContent>
            15.Information Security Whilst neither we, nor any other organization, can guarantee the security of information processed online, we do have appropriate security measures in place to protect your personal information. For example, we store the personal information you provide on computer systems with limited access, encryption, or both.
          </SubContent>
          <SubContent>
            16.Data Retention Periods All action log and personal data of a user will be stored for 720 days, and we can perform data deletion if the user does not make any logins/interactions within this period of time.
          </SubContent>
          <SubContent>
            17.Privacy Rights Subject to applicable law, you may have some or all of the following rights in respect of your personal information: {'\n'}
            a.to obtain a copy of your personal information together with information about how and on what basis that personal information is processed; {'\n'}
            b. to rectify inaccurate personal information (including the right to have incomplete personal information completed);{'\n'}
            c.to erase your personal information (in limited circumstances, where it is no longer necessary in relation to the purposes for which it was collected or processed); {'\n'}
            d.to restrict processing of your personal information where: a. the accuracy of the personal information is contested; b. the processing is unlawful but you object to the erasure of the personal information; or c. we no longer require the personal information but it is still required for the establishment, exercise or defense of a legal claim; {'\n'}
            e.to challenge processing which we have justified on the basis of a legitimate interest (as opposed to your consent, or to perform a contract with you); (vi) to prevent us from sending you direct marketing;{'\n'}
            f.to withdraw your consent to our processing of your personal information (where that processing is based on your consent);{'\n'}
            g. to object to decisions which are based solely on automated processing or profiling; {'\n'}
            h.in addition to the above, you have the right to file a complaint with the supervisory authority.
          </SubContent>
          <SubContent>
            18.Changes and Updates {'\n'}
            12.1 This Privacy Policy may be revised periodically and this will be reflected by the “Last update posted” date above. Please revisit this page to stay aware of any changes. Your continued use of the Site constitutes your agreement to this Privacy Policy and any future revisions.
          </SubContent>

        </Content>
      </Box>
      <Box ref={contactRef} onLayout={(e) => setSectionTop(OnchainDocSection.CONTACT_US, e.nativeEvent.layout.y)} className={boxClassName}>
        <Title>
          {t("onchainDocs.contact_us.title")}
        </Title>
        <Content>
          <SubTitle className="mb-4">
            <Text
              className="text-blue-600 underline"
              onPress={() => Linking.openURL('https://t.me/BILL_ONCHAIN')}
            >
              TG：@BILL_ONCHAIN
            </Text>
          </SubTitle>
          <SubTitle>
            <Text
              className="text-blue-600 underline"
              onPress={() => Linking.openURL('https://x.com/OnChain_RWA')}
            >
              X：@OnChain_RWA
            </Text>
          </SubTitle>
        </Content>
      </Box>
      <Box className="h-10" />
    </Box>
  )
}
function ZHContent({
  aboutOnchainRef,
  howToStartRef,
  tradeGuideRef,
  walletGuideRef,
  boxClassName,
  contactRef,
  setSectionTop,
}: any) {
  const { t } = useTranslation();
  return (
    <Box
      className={twClassnames(
        'flex flex-col',
        "mt-0 mx-6"
      )}
    >
      <Box
        ref={aboutOnchainRef}
        onLayout={(e) => setSectionTop(OnchainDocSection.ABOUT_ONCHAIN, e.nativeEvent.layout.y)}
        className={twClassnames(
          "mb-11 mt-[21px]"
        )}
      >
        <Title >
          {t("onchainDocs.about_onchain.title")}
        </Title>
        <Content>
          OnChain - Moving assets onchain, 通过区块链技术重构全球资产投资体验。
          <SubTitle>一、团队背景 </SubTitle>
          <SubContent>
            OnChain团队汇聚传统金融与区块链领域专家，成员包括：纳斯达克上市公司创始人、万亿美元资管机构高管、前TOP5交易所高管。核心成员毕业于北京大学、哥伦比亚大学等院校，曾就职高盛、字节跳动和腾讯，在区块链、智能合约及数字资产管理领域具备深厚经验
          </SubContent>
          <SubTitle>二、平台宗旨</SubTitle>
          <SubContent>
            针对链上稳健投资产品的稀缺性，OnChain致力于连接传统金融与区块链。平台融合链外金融收益与链上代币奖励，提供更安全、普惠的财富管理方案。当前87%的年轻投资者面临优质资产管理门槛，OnChain旨在降低参与壁垒并重塑市场生态
          </SubContent>
          <SubTitle>三、市场机遇 </SubTitle>
          <SubContent>
            全球基金投资市场规模达120万亿美元，链上需求超10万亿美元，但稳健产品供给不足。Solana等高性能区块链可实现高效低成本交易，推动链上财富管理爆发式增长。OnChain瞄准这一缺口，依托Solana等平台为百万用户提供多元化优质投资产品
          </SubContent>
          <SubTitle>四、用户反馈验证 </SubTitle>
          <SubContent>
            早期调研显示用户对链上财富管理兴趣浓厚，但担忧安全性与收益能力。OnChain通过智能合约、持牌托管等强安全措施，以及顶级机构合作化解疑虑。初步研究证实市场需求，计划整合纳斯达克、纽交所、港交所等机构的股票、债券及期货产品，实现无缝全球投资
          </SubContent>
          <SubTitle>五、长期愿景</SubTitle>
          <SubContent>
            OnChain立志成为全球领先链上财富管理平台，服务1亿用户。我们将持续创新产品体系、优化用户体验，推动区块链与金融深度融合，引领互联网资本市场迈向繁荣多元的未来
          </SubContent>
        </Content>
      </Box>
      <Box ref={howToStartRef} onLayout={(e) => setSectionTop(OnchainDocSection.HOW_TO_START, e.nativeEvent.layout.y)} className={boxClassName}>
        <Title>
          {t("onchainDocs.how_it_works.title")}
        </Title>
        <Content>
          <SubContent>
            技术层⾯，我们⾃研的供应链 HUB 系统是核⼼⽀撑。它像⼀个智能资源中枢，既能⼿动灵活挑选优质 产品，也能按预设规则⾃动调度，管理后台可在线配置全球供应商资产，最终实现「⼀键式全球资产 配置」，对机构⽤⼾来说⼤幅降低了跨市场操作⻔槛。

          </SubContent>

          <SubContent>关键创新点：            </SubContent>

          <SubTitle>1.资产代币化的安全升级</SubTitle>

          <SubTitle>2.我们⾸批货币基⾦产品应⽤了 Solana ⽣态的 Token-2022 标准，解决传统基⾦的痛点：  </SubTitle>
          <SubContent>
            • 交易合规性：通过「转账钩⼦」限制代币只能通过基⾦合约赎回，杜绝私下转账，所有交易都在合 规框架内完成；• 兼容性与灵活性：同时⽀持 SPL 和 Token-2022 双标准，上层 FOF 基⾦⽤更强⼤的 Token-2022 实 现可编程流动性（⽐如按需铸造 / 销毁代币），底层资产⽤ SPL 保证基础兼容性，两者分⼯协作；{'\n'}
            • 净值公平性：通过算法锚定净值，确保每笔交易按实时公允价值分配，避免传统基⾦的结算延迟问 题。
          </SubContent>
          <SubTitle>3.订阅流程的三重安全防护 </SubTitle>
          <SubContent>
            ⽤⼾从认购开始，系统就通过三层设计保驾护航：{'\n'}
            • 权限隔离：⽤不同 PDA 地址（程序衍⽣地址）拆分基⾦管理、流动性池、代币铸造等核⼼功能，每 个环节独⽴管控；{'\n'}
            • ⽩名单机制：只有授权地址能执⾏关键操作，⽐如基⾦公司准⼊、⼤额交易审批等，精准控制⻛ 险；{'\n'}
            • 全链路验证：交易前⾃动扫描资产状态、权限匹配度、合规性，防⽌误操作和恶意攻击。 同时，通过「在途资产追踪」实时记录未完成交易，结合「双向净值计算」（FOF 与底层资产同步核算）和「净值更新时间限制」，确保每笔交易的会计准确性和价格稳定性。
          </SubContent>
          <SubTitle>4.赎回体验的流动性⾰命  </SubTitle>
          <SubContent>
            为解决传统基⾦赎回慢、流动性⻛险⾼的问题，我们设计了「分层流动性架构」： {'\n'}
            • 专属赎回池：独⽴于主资⾦池的 redeem_cash_pool，专⻔应对赎回需求，避免挤兑⻛险； {'\n'}
            • 双模式选择：⽤⼾可根据需求选「即时赎回」（池内有⾜够流动性时秒到账）或「延迟赎回」（进 ⼊处理队列，平衡整体流动性）； {'\n'}
            • 资产隔离：通过多账⼾体系分离核⼼资产和交易资产，就算极端⾏情下，底层本⾦也能保持安全。 最后看底层架构的「可扩展性设计」： {'\n'}
            ⽤⼾和订单系统采⽤数据库分⽚技术，中间层智能路由⾃动按规则分发请求，业务层完全感知不到数据存在哪⾥。这种设计让系统在百万级⽤⼾和万级并发下，依然能保持毫秒级响应，为未来接⼊更多资产和⽤⼾留⾜空间。 {'\n'}
            总结来说，OnChain 通过「合规架构 + 智能合约 + 分层流动性」三⼤创新，让全球资产投资变得像⽹购⼀样简单、安全、⾼效。⽆论是机构做跨境配置，还是个⼈投资者想分散⻛险，我们都能提供全链路解决⽅案。
          </SubContent>
        </Content>
      </Box>


      <Box ref={walletGuideRef} onLayout={(e) => setSectionTop(OnchainDocSection.WALLET_GUIDE, e.nativeEvent.layout.y)} className={boxClassName}>
        <Title>
          Trust & Security
        </Title>
        <Content>

          <SubTitle>①Terms of Use </SubTitle>
          Access to, and use of, the DApp and the services available through the DApp (Services) are subject to the following terms, conditions and notices (Terms of Use). By using the Services, you are agreeing to all of the Terms of Use, as may be updated by us from time to time. You should check this page regularly to take notice of any changes we may have made to the Terms of Use.
          <SubContent>
            1.Amendments to Terms of Use The Company reserves the right to amend these Terms of Use from time to time. Amendments will be effective immediately upon notification on the App or through the Services. Your continued use of the App and the Services following such notification will represent an agreement by you to be bound by the Terms of Use as amended.
          </SubContent>
          <SubContent>
            2.Area and age limits You must be at least 18 years old, or the age of legal majority in your jurisdiction of residence, to access the App and the Services. You may not use the App or the Services you represent and warrant that: [i]you are a resident, national or agent of [China, North Korea], or any other jurisdiction where the service offered by us is restricted [Restricted Territories]; [ii]you are included in any trade embargoes, list of economic sanctions or equivalent maintained by the United States government, the United Kingdom government, the European Union or the United Nations [Restricted Persons]; [iii]you intend to transact with any Restricted Territories or Restricted Persons; [iv] your access to and use of the App and Services is illegal in your country of residence in the manner in which you access and use them.
          </SubContent>
          <SubContent>
            3.Temporary application Access to the App is permitted on a temporary basis, and we reserve the right to withdraw or amend the Services without notice. We will not be liable if for any reason the App is unavailable at any time or for any period. From time to time, we may restrict access to some parts or all of the App.
          </SubContent>
          <SubContent>
            4.External link The App may contain links to other apps or websites (Linked Sites), which are not operated by the Company. The Company has no control over the Linked Sites, makes no warranties or representations in relation to the Linked Sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them. Your use of the Linked Sites will be subject to the terms of use and service contained within each respective Linked Site.
          </SubContent>
          <SubContent>
            5.Copyright Except where expressly stated to the contrary all persons (including their names and images), third party trade marks and content, services and/or locations featured in the App are in no way associated, linked or affiliated with the Company and you should not rely on the existence of such a connection or affiliation. Any trade marks/names featured on the App are owned by the respective trade mark owners. Where a trade mark or brand name is referred to it is used solely to describe or identify the products and services and is in no way an assertion that such products or services are endorsed by or connected to the Company.
          </SubContent>
          <SubContent>
            6.Force majeure The Company will not be in breach of these Terms of Use as a result of, or liable for, any failure or delay in the performance of the Company’s obligations under these Terms of Use to the extent that such failure or delay is wholly or partially caused, directly or indirectly, by any event outside the Company’s reasonable control or any act or omission of you or any third party.
          </SubContent>


          <SubTitle>②Privacy Policy </SubTitle>
          Access to, and use of, the DApp and the services available through the DApp (Services) are subject to the following terms, conditions and notices (Terms of Use). By using the Services, you are agreeing to all of the Terms of Use, as may be updated by us from time to time. You should check this page regularly to take notice of any changes we may have made to the Terms of Use.
          <SubContent>
            7.Introduction
            1.1 OnChain recognizes that people who use our products value their privacy. This Privacy Policy details important information regarding the collection, use and disclosure of User information collected on theOnChain website located at OnChain.Channel(the “Site”).OnChain provides this Privacy Policy to help you understand how your personal information is used by us and your choices regarding our use of it. By using the Site, you agree that we can collect, use, disclose, and process your information as described in this Privacy Policy. This Privacy Policy only applies to the Site, and not to any other websites, products or services you may be able to access or link to via the Site. We encourage you to read the privacy policies of any other websites you visit before providing your information to them. While our values will not shift, the Site will evolve over time, and this Privacy Policy will change to reflect that evolution. If we make changes, we will notify you by revising the date at the top of this Privacy Policy. In some cases, if we make significant changes, we may give you additional notice by adding a statement to our homepage. We encourage you to review this Privacy Policy periodically to stay informed about our practices. Some third-party providers may place cookies or pixels - small data files stored on your hard drive or in device memory - on your browser or hard drive. Note that this Privacy Policy does not cover the use of cookies or pixels by such third parties. Most web browsers are set to accept cookies and pixels by default, but you can usually set your browser to remove or reject browser cookies or pixels. If you do choose to remove or reject cookies or pixels, however, your ability to use the Site might be affected{'\n'}
            1.2 This Privacy Policy should be read in conjunction with our Terms of Use. By accessing the Site, you are consenting to the information collection and use practices described in this Privacy Policy. {'\n'}
            1.3 Your use of the Site and any personal information you provide through the Site remains subject to the terms of this Privacy Policy and our Terms of Use, as each may be updated from time to time. {'\n'}
            1.4 Any questions, comments or complaints that you might have should be in contact with the US.
          </SubContent>
          <SubContent>
            8.Information We Collect The personal information we collect from you generally may include: {'\n'}
            2.1 Network information regarding transactions, including, among other things, the type of device you use, access times, hardware model, MAC address, IP address, operating system and version, and other unique device identifiers. {'\n'}
            2.2. Information about plugins you might be using, included but not limited to those related to the management of cryptocurrency assets and any information provided by them., and your Evm&Solana public address. {'\n'}
            2.3 We may receive network information from you as a result of your interaction with our Site. {'\n'}
            2.4 Evm &Solana public address-When you register as a user, we may collect the following personal information from you: your email address and user name. We may also receive personal information from third parties, when you sign up to services provided by OnChain through a social network; in such occasions, we may receive the personal information you have made available to such third parties, and which you have allowed for them to relay via your privacy settings. {'\n'}
            2.5 We collect information relating to your participation in theOnChain community, including the events you attend and any information you share through our X and Telegram community platform. {'\n'}
            2.6 We may collect information when you contact us with questions or concerns and when you voluntarily respond to questionnaires, surveys or requests for market research seeking your opinion and feedback. {'\n'}
            2.7 We maintain a social media presence on platforms like  X (“Social Media Pages”). When you interact with us on social media, we may receive personal information that you provide or make available to us based on your settings, such as your contact details. In addition, the companies that host our Social Media Pages may provide us with aggregate information and analytics regarding the use of our Social Media Pages. [We may also receive information from social media platforms if you link your social media accounts with yourOnChain account. The type of information we receive depends on your settings with the relevant platform, but may include things like your handle and followers list. {'\n'}
            2.8 We use Google Analytics to collect anonymous aggregate user data for the purpose of optimizing the user experience. We do not share user data with any third-party organizations.
          </SubContent>
          <SubContent>
            9.The WayOnChain Uses your Personal Information {'\n'}
            3.1 As with nearly all interactions that take place on the World Wide Web, our servers may receive information by virtue of your interaction with them, including but not limited to IP Addresses. {'\n'}
            3.2 Some of the services in our Site(such as create, maintain, and authenticate your account) require permissions that could potentially be used to access additional personal information. Such permissions are used for an extremely limited technical purpose for allowing the Site to properly interact with your browser. No additional information is obtained beyond what is necessary to provide the Site. No information received is shared with any third-party except those affiliated withOnChain or as required for provision of the Site. {'\n'}
            3.3OnChain collects usage data for purposes of monitoring web traffic and improving our products. {'\n'}
            3.4 Public blockchains provide transparency into transactions andOnChain is not responsible for preventing or managing information broadcasted on a blockchain. {'\n'}
            3.5 To assist us in meeting business operations needs and to perform certain services and functions, we may share personal information with service providers, including hosting services, cloud services, and other information technology services, email communication software and email newsletter services, advertising and marketing services, payment processors, customer relationship management and customer support services, and analytics services. Pursuant to our instructions, these parties will access, process, or store personal information in the course of performing their duties to us. {'\n'}
            3.6 We may share personal information with our professional advisors such as lawyers and accountants where doing so is necessary to facilitate the services they render to us. {'\n'}
            3.7 If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, receivership, dissolution, sale of all or a portion of our assets, or transition of service to another provider (collectively a “Transaction”), your personal information may be shared in the diligence process with counterparties and others assisting with the Transaction and transferred to a successor or affiliate as part of or following that Transaction along with other assets. {'\n'}
            3.8 We do not volunteer your personal information to government authorities or regulators, but we may disclose your personal information where required to do so for the Compliance and Protection purposes described above. {'\n'}
          </SubContent>
          <SubContent>
            10.What We Do with Information We Collect {'\n'}
            4.1OnChain may use the information we collect in the following ways: To analyze trends for how the Site are being used; To improve the Site; To help personalize your experience of the Site; and If you gave us your contact information, we may use that information to contact you to send you technical notices, updates, confirmations, security alerts, to provide support to you, to tell you about other products and services that we think might interest you, or to respond to your comments or questions. {'\n'}
            4.2OnChain may share the information we collect with third parties who need to access it in order to perform work on our behalf, including doing things like helping us make the Site available, including without limitation payment services providers, anti-fraud services providers, or providing analytics services for us. We work hard to ensure that these third parties only access and use your information as necessary to perform their functions. {'\n'}
            4.3OnChain may create aggregations and anonymizations that contain your information in a way that does not directly identify you.OnChain may use and/or share those aggregations and anonymizations for a variety of purposes related to the Site, or our company and its business. {'\n'}
            4.4OnChain may disclose your personal information to our subsidiaries, affiliated companies, agents, businesses, or service providers who process your personal information on our behalf in providing the Service to you. Our agreements with these service providers limit the kinds of information they can use or process and ensure they use reasonable efforts to keep your personal information secure. {'\n'}
            4.5OnChain also reserves the right to disclose personal information thatOnChain believes, in good faith, is appropriate or necessary to enforce our Terms of Use, take precautions against liability or harm, to investigate and respond to third-party claims or allegations, to respond to court orders or official requests, to protect the security or integrity of our Site, and to protect the rights, property, or safety ofOnChain, our users or others. {'\n'}
            4.6 In the event thatOnChain is involved in a merger, acquisition, sale, bankruptcy, insolvency, reorganization, receivership, assignment for the benefit of creditors, or the application of laws or equitable principles affecting creditors’ rights generally, or other change of control, there may be a disclosure of your information to another entity related to such event.
          </SubContent>
          <SubContent>
            11.LINKS TO OTHER WEBSITES The Service may contain links to other websites not operated or controlled byOnChain, including social media services (“Third Party Sites”). The information that you share with Third Party Sites will be governed by the specific privacy policies and terms of service of the Third Party Sites and not by this Privacy Policy. By providing these links we do not imply that we endorse or have reviewed these sites. Please contact the Third Party Sites directly for information on their privacy practices and policies.
          </SubContent>
          <SubContent>
            12.Your ChoiceOnChain will process your personal information in accordance with this Privacy Policy, and as part of that you will have limited or no opportunity to otherwise modify how your information is used byTOX .
          </SubContent>
          <SubContent>
            13.Cookies Our Site uses “Cookies”, which are text files placed on your computer which helpOnChain analyze how users use the Site, and similar technologies (e.g. web beacons, pixels, ad tags and device identifiers) to recognise you and/or your device on, off and across different devices and our Site, as well as to improve the Site, to improve marketing, analytics or functionality. The use of Cookies is standard on the internet. Although most web browsers automatically accept cookies, the decision of whether to accept or not is yours. You may adjust your browser settings to prevent the use of cookies, or to provide notification whenever a cookie is sent to you. You may refuse the use of cookies by selecting the appropriate settings on your browser. However, please note that if you do this, you may not be able to access the full functionality of our Site.
          </SubContent>
          <SubContent>
            13.Cookies Our Site uses “Cookies”, which are text files placed on your computer which helpOnChain analyze how users use the Site, and similar technologies (e.g. web beacons, pixels, ad tags and device identifiers) to recognise you and/or your device on, off and across different devices and our Site, as well as to improve the Site, to improve marketing, analytics or functionality. The use of Cookies is standard on the internet. Although most web browsers automatically accept cookies, the decision of whether to accept or not is yours. You may adjust your browser settings to prevent the use of cookies, or to provide notification whenever a cookie is sent to you. You may refuse the use of cookies by selecting the appropriate settings on your browser. However, please note that if you do this, you may not be able to access the full functionality of our Site.
          </SubContent>
          <SubContent>
            14.Information We Don't Collect We do not collect any other personally-identifiable information about you, unless you give it to us directly: by filling out a form, giving us written feedback, communicating with us via third party social media sites, or otherwise communicating with us via the Site or any other means.
          </SubContent>
          <SubContent>
            15.Information Security Whilst neither we, nor any other organization, can guarantee the security of information processed online, we do have appropriate security measures in place to protect your personal information. For example, we store the personal information you provide on computer systems with limited access, encryption, or both.
          </SubContent>
          <SubContent>
            16.Data Retention Periods All action log and personal data of a user will be stored for 720 days, and we can perform data deletion if the user does not make any logins/interactions within this period of time.
          </SubContent>
          <SubContent>
            17.Privacy Rights Subject to applicable law, you may have some or all of the following rights in respect of your personal information: {'\n'}
            a.to obtain a copy of your personal information together with information about how and on what basis that personal information is processed; {'\n'}
            b. to rectify inaccurate personal information (including the right to have incomplete personal information completed);{'\n'}
            c.to erase your personal information (in limited circumstances, where it is no longer necessary in relation to the purposes for which it was collected or processed); {'\n'}
            d.to restrict processing of your personal information where: a. the accuracy of the personal information is contested; b. the processing is unlawful but you object to the erasure of the personal information; or c. we no longer require the personal information but it is still required for the establishment, exercise or defense of a legal claim; {'\n'}
            e.to challenge processing which we have justified on the basis of a legitimate interest (as opposed to your consent, or to perform a contract with you); (vi) to prevent us from sending you direct marketing;{'\n'}
            f.to withdraw your consent to our processing of your personal information (where that processing is based on your consent);{'\n'}
            g. to object to decisions which are based solely on automated processing or profiling; {'\n'}
            h.in addition to the above, you have the right to file a complaint with the supervisory authority.
          </SubContent>
          <SubContent>
            18.Changes and Updates {'\n'}
            12.1 This Privacy Policy may be revised periodically and this will be reflected by the “Last update posted” date above. Please revisit this page to stay aware of any changes. Your continued use of the Site constitutes your agreement to this Privacy Policy and any future revisions.
          </SubContent>

        </Content>
      </Box>
      <Box ref={contactRef} onLayout={(e) => setSectionTop(OnchainDocSection.CONTACT_US, e.nativeEvent.layout.y)} className={boxClassName}>
        <Title>
          联系我们
        </Title>
        <Content>
          <SubTitle className="mb-4">
            <Text
              className="text-blue-600 underline"
              onPress={() => Linking.openURL('https://t.me/BILL_ONCHAIN')}
            >
              TG：@BILL_ONCHAIN
            </Text>
          </SubTitle>
          <SubTitle>
            <Text
              className="text-blue-600 underline"
              onPress={() => Linking.openURL('https://x.com/OnChain_RWA')}
            >
              X：@OnChain_RWA
            </Text>
          </SubTitle>
        </Content>
      </Box>
      <Box className="h-10" />
    </Box>
  )
}
