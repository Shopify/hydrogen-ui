import {
  ShopifyAnalyticsPayload,
  ShopifyPageViewPayload,
  ShopifyMonorailPayload,
} from './analytics-types.js';
import {ShopifyAppId} from './analytics-constants.js';
import {
  addDataIf,
  schemaWrapper,
  stripGId,
  getResourceType,
} from './analytics-utils.js';
import {buildUUID} from './cookies-utils.js';

const SCHEMA_ID = 'trekkie_storefront_page_view/1.4';
const oxygenDomain = 'myshopify.dev';

export function pageView(
  payload: ShopifyAnalyticsPayload
): ShopifyMonorailPayload[] {
  const pageViewPayload = payload as ShopifyPageViewPayload;
  return [
    schemaWrapper(
      SCHEMA_ID,
      addDataIf(
        {
          pageType: pageViewPayload.pageType,
          customerId: pageViewPayload.customerId,
          resourceType: getResourceType(pageViewPayload.resourceId),
          resourceId: stripGId(pageViewPayload.resourceId),
        },
        formatPayload(pageViewPayload)
      )
    ),
  ];
}

function formatPayload(
  payload: ShopifyAnalyticsPayload
): ShopifyMonorailPayload {
  return {
    appClientId: payload.shopifyAppSource
      ? ShopifyAppId[payload.shopifyAppSource]
      : ShopifyAppId.headless,
    isMerchantRequest: isMerchantRequest(payload.url),
    hydrogenSubchannelId: payload.storefrontId || '0',

    isPersistentCookie: payload.hasUserConsent,
    uniqToken: payload.uniqueToken,
    visitToken: payload.visitToken,
    microSessionId: buildUUID(),
    microSessionCount: 1,

    url: payload.url,
    path: payload.path,
    search: payload.search,
    referrer: payload.referrer,
    title: payload.title,

    shopId: stripGId(payload.shopId),
    currency: payload.currency,
    contentLanguage: payload.acceptedLanguage || 'en',
  };
}

function isMerchantRequest(url: string): boolean {
  const hostname = new URL(url).hostname;
  if (hostname.indexOf(oxygenDomain) !== -1 || hostname === 'localhost') {
    return true;
  }
  return false;
}
