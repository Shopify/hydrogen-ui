import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {
  ShopifyProvider,
  CartProvider,
  ShopifyCookies,
  sendShopifyAnalytics,
  getClientBrowserParameters,
  AnalyticsEventName,
  type ShopifyPageViewPayload,
} from '@shopify/hydrogen-react';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

const analyticsShopData = {
  shopId: 55145660472,
  currency: 'USD',
  acceptedLanguage: 'en',
};
let isInit = false;

export default function App({Component, pageProps}: AppProps) {
  const router = useRouter();
  const hasUserConsent = true;
  const analytics = {
    hasUserConsent,
    ...analyticsShopData,
    ...pageProps.analytics,
  };
  const pagePropsWithAppAnalytics = {
    ...pageProps,
    analytics,
  };

  useEffect(() => {
    const handleRouteChange = () => {
      sendPageView(analytics);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // First load event guard
    if (!isInit) {
      isInit = true;
      sendPageView(analytics);
    }

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [analytics]);

  return (
    <ShopifyProvider
      shopifyConfig={{
        storeDomain: `hydrogen-preview`,
        storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
        storefrontApiVersion: '2023-01',
        locale: 'EN-US',
      }}
    >
      <CartProvider>
        <Component {...pagePropsWithAppAnalytics} />
      </CartProvider>
      <ShopifyCookies domain="" hasUserConsent={hasUserConsent} />
    </ShopifyProvider>
  );
}

function sendPageView(analyticsPageData: Partial<ShopifyPageViewPayload>) {
  sendShopifyAnalytics({
    eventName: AnalyticsEventName.PAGE_VIEW,
    payload: {
      ...getClientBrowserParameters(),
      ...analyticsPageData,
    } as ShopifyPageViewPayload,
  });
}
