import type {Product, ProductVariant} from './storefront-api-types.js';
import {AnalyticsEventName, ShopifyAppSource} from './analytics-constants.js';

export type ClientBrowserParameters = {
  uniqueToken: string;
  visitToken: string;
  url: string;
  path: string;
  search: string;
  referrer: string;
  title: string;
  userAgent: string;
  navigationType: string;
  navigationApi: string;
};

export type ShopifyAnalyticsProduct = {
  product_gid: Product['id'];
  variant_gid?: ProductVariant['id'];
  name: Product['title'];
  variantName?: ProductVariant['title'];
  brand: Product['vendor'];
  category?: Product['productType'];
  price: ProductVariant['price']['amount'];
  sku?: ProductVariant['sku'];
  quantity?: number;
};

export type ShopifyAppSources = keyof typeof ShopifyAppSource;

export type ShopifyCommonPayload = ClientBrowserParameters & {
  shopifyAppSource?: ShopifyAppSources;
  hasUserConsent: boolean;
  shopId: string | number;
  currency: string;
  storefrontId?: string;
  acceptedLanguage?: string;
  customerId?: string;
  totalValue?: string;
  products?: ShopifyAnalyticsProduct[];
};

export type ShopifyPageViewPayload = ShopifyCommonPayload & {
  canonicalUrl?: string;
  pageType?: string;
  resourceId?: string;
  collectionHandle?: string;
  searchString?: string;
};

export type ShopifyPageView = {
  eventName: AnalyticsEventName.PAGE_VIEW;
  payload: ShopifyPageViewPayload;
};

export type ShopifyAddToCartPayload = ShopifyCommonPayload & {
  /** The cart's ID if it has been created through the Storefront API. */
  cartId: string;
};

export type ShopifyAddToCart = {
  eventName: AnalyticsEventName.ADD_TO_CART;
  payload: ShopifyAddToCartPayload;
};

export type ShopifyMonorailPayload = Record<string, unknown>;
export type ShopifyAnalyticsPayload =
  | ShopifyPageViewPayload
  | ShopifyAddToCartPayload;
export type ShopifyAnalytics = ShopifyPageView | ShopifyAddToCart;
