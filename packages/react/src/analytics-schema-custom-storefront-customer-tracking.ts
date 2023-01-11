import {
  ShopifyAnalyticsPayload,
  ShopifyPageViewPayload,
  ShopifyAddToCartPayload,
  ShopifyMonorailPayload,
  ShopifyAnalyticsProduct,
} from './analytics-types.js';
import {AnalyticsPageType, ShopifyAppSource} from './analytics-constants.js';
import {
  addDataIf,
  schemaWrapper,
  stripGId,
  stripId,
} from './analytics-utils.js';
import {buildUUID} from './cookies-utils.js';

const SCHEMA_ID = 'custom_storefront_customer_tracking/1.0';
const PAGE_RENDERED_EVENT_NAME = 'page_rendered';
const COLLECTION_PAGE_RENDERED_EVENT_NAME = 'collection_page_rendered';
const PRODUCT_PAGE_RENDERED_EVENT_NAME = 'product_page_rendered';
const PRODUCT_ADDED_TO_CART_EVENT_NAME = 'product_added_to_cart';
const SEARCH_SUBMITTED_EVENT_NAME = 'search_submitted';

export function pageView(
  payload: ShopifyAnalyticsPayload
): ShopifyMonorailPayload[] {
  const pageViewPayload = payload as ShopifyPageViewPayload;
  const additionalPayload = {
    canonical_url: pageViewPayload.canonicalUrl || pageViewPayload.url,
    customerId: pageViewPayload.customerId,
  };
  const pageType = pageViewPayload.pageType;
  const pageViewEvents = [];

  pageViewEvents.push(
    schemaWrapper(
      SCHEMA_ID,
      addDataIf(
        {
          event_name: PAGE_RENDERED_EVENT_NAME,
          ...additionalPayload,
        },
        formatPayload(pageViewPayload)
      )
    )
  );

  if (pageType === AnalyticsPageType.collection) {
    pageViewEvents.push(
      schemaWrapper(
        SCHEMA_ID,
        addDataIf(
          {
            event_name: COLLECTION_PAGE_RENDERED_EVENT_NAME,
            ...additionalPayload,
            collection_name: pageViewPayload.collectionHandle,
          },
          formatPayload(pageViewPayload)
        )
      )
    );
  }

  if (pageType === AnalyticsPageType.product) {
    pageViewEvents.push(
      schemaWrapper(
        SCHEMA_ID,
        addDataIf(
          {
            event_name: PRODUCT_PAGE_RENDERED_EVENT_NAME,
            ...additionalPayload,
            collection_name: pageViewPayload.collectionHandle,
            products: formatProductPayload(pageViewPayload.products),
            total_value: pageViewPayload.totalValue,
          },
          formatPayload(pageViewPayload)
        )
      )
    );
  }

  if (pageType === AnalyticsPageType.search) {
    pageViewEvents.push(
      schemaWrapper(
        SCHEMA_ID,
        addDataIf(
          {
            event_name: SEARCH_SUBMITTED_EVENT_NAME,
            ...additionalPayload,
            search_string: pageViewPayload.searchString,
          },
          formatPayload(pageViewPayload)
        )
      )
    );
  }

  return pageViewEvents;
}

export function addToCart(
  payload: ShopifyAnalyticsPayload
): ShopifyMonorailPayload[] {
  const addToCartPayload = payload as ShopifyAddToCartPayload;
  return [
    schemaWrapper(
      SCHEMA_ID,
      addDataIf(
        {
          event_name: PRODUCT_ADDED_TO_CART_EVENT_NAME,
          customerId: addToCartPayload.customerId,
          cart_token: stripId(addToCartPayload.cartId),
          total_value: addToCartPayload.totalValue,
          products: formatProductPayload(addToCartPayload.products),
        },
        formatPayload(addToCartPayload)
      )
    ),
  ];
}

function formatPayload(
  payload: ShopifyAnalyticsPayload
): ShopifyMonorailPayload {
  return {
    source: payload.shopifyAppSource || ShopifyAppSource.headless,
    hydrogenSubchannelId: payload.storefrontId || '0',

    is_persistent_cookie: payload.hasUserConsent,
    ccpa_enforced: false,
    gdpr_enforced: false,
    unique_token: payload.uniqueToken,
    event_time: Date.now(),
    event_id: buildUUID(),

    event_source_url: payload.url,
    referrer: payload.referrer,
    user_agent: payload.userAgent,
    navigation_type: payload.navigationType,
    navigation_api: payload.navigationApi,

    shop_id: stripGId(payload.shopId),
    currency: payload.currency,
  };
}

function formatProductPayload(products?: ShopifyAnalyticsProduct[]) {
  return products
    ? products.map((p: ShopifyAnalyticsProduct) => {
        const product = addDataIf(
          {
            variant_gid: p.variant_gid,
            category: p.category,
            sku: p.sku,
            product_id: stripGId(p.product_gid),
            variant_id: stripGId(p.variant_gid),
          },
          {
            product_gid: p.product_gid,
            name: p.name,
            variant: p.variantName || '',
            brand: p.brand,
            price: p.price,
            quantity: Number(p.quantity || 0),
          }
        );
        return JSON.stringify(product as ShopifyAnalyticsProduct);
      })
    : [];
}
