import {SHOPIFY_S, SHOPIFY_Y} from './cart-constants.js';
import type {
  ClientBrowserParameters,
  ShopifyAnalytics,
  ShopifyMonorailPayload,
} from './analytics-types.js';
import {AnalyticsEventName} from './analytics-constants.js';
import {errorIfServer} from './analytics-errors-utils.js';
import {getShopifyCookies} from './cookies-utils.js';

import * as TrekkieStorefrontPageView from './analytics-schema-trekkie-storefront-page-view.js';
import * as CustomStorefrontCustomerTracking from './analytics-schema-custom-storefront-customer-tracking.js';

export function sendShopifyAnalytics({eventName, payload}: ShopifyAnalytics) {
  let events: ShopifyMonorailPayload[] = [];

  switch (eventName) {
    case AnalyticsEventName.PAGE_VIEW:
      events = events.concat(TrekkieStorefrontPageView.pageView(payload));
      events = events.concat(
        CustomStorefrontCustomerTracking.pageView(payload)
      );
      break;
    case AnalyticsEventName.ADD_TO_CART:
      events = events.concat(
        CustomStorefrontCustomerTracking.addToCart(payload)
      );
      break;
  }

  sendToShopify(events);
}

type MonorailResponse = {
  status: number;
  message: string;
};

const ERROR_MESSAGE = 'sendShopifyAnalytics request is unsuccessful';

function sendToShopify(events: ShopifyMonorailPayload[]) {
  const eventsToBeSent = {
    events,
    metadata: {
      event_sent_at_ms: Date.now(),
    },
  };

  try {
    fetch('https://monorail-edge.shopifysvc.com/unstable/produce_batch', {
      method: 'post',
      headers: {
        'content-type': 'text/plain',
      },
      body: JSON.stringify(eventsToBeSent),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data) {
          const jsonResponse = JSON.parse(data);
          jsonResponse.result.forEach((eventResponse: MonorailResponse) => {
            if (eventResponse.status !== 200) {
              console.error(ERROR_MESSAGE, '\n\n', eventResponse.message);
            }
          });
        }
      })
      .catch((err) => {
        console.error(ERROR_MESSAGE, err);
      });
  } catch (error) {
    // Do nothing
  }
}

export function getClientBrowserParameters():
  | ClientBrowserParameters
  | Record<string, never> {
  if (errorIfServer('getClientBrowserParameters')) {
    return {};
  }

  const [navigationType, navigationApi] = getNavigationType();
  const cookies = getShopifyCookies(document.cookie);

  return {
    uniqueToken: cookies[SHOPIFY_Y],
    visitToken: cookies[SHOPIFY_S],
    url: location.href,
    path: location.pathname,
    search: location.search,
    referrer: document.referrer,
    title: document.title,
    userAgent: navigator.userAgent,
    navigationType,
    navigationApi,
  };
}

function getNavigationTypeExperimental() {
  try {
    const navigationEntries =
      performance?.getEntriesByType &&
      performance?.getEntriesByType('navigation');

    if (navigationEntries && navigationEntries[0]) {
      //  https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
      const rawType = (
        window.performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming
      )['type'];
      const navType = rawType && rawType.toString();

      return navType;
    }
  } catch (err) {
    // Do nothing
  }
  return undefined;
}

function getNavigationTypeLegacy() {
  try {
    if (
      PerformanceNavigation &&
      performance?.navigation?.type !== null &&
      performance?.navigation?.type !== undefined
    ) {
      //  https://developer.mozilla.org/en-US/docs/Web/API/Performance/navigation

      const rawType = performance.navigation.type;
      switch (rawType) {
        case PerformanceNavigation.TYPE_NAVIGATE:
          return 'navigate';
          break;
        case PerformanceNavigation.TYPE_RELOAD:
          return 'reload';
          break;
        case PerformanceNavigation.TYPE_BACK_FORWARD:
          return 'back_forward';
          break;
        default:
          return `unknown: ${rawType}`;
      }
    }
  } catch (err) {
    // do nothing
  }
  return undefined;
}

function getNavigationType() {
  try {
    let navApi = 'PerformanceNavigationTiming';
    let navType = getNavigationTypeExperimental();
    if (!navType) {
      navType = getNavigationTypeLegacy();
      navApi = 'performance.navigation';
    }
    if (navType) {
      return [navType, navApi];
    } else {
      return ['unknown', 'unknown'];
    }
  } catch (err) {
    // do nothing
  }
  return ['error', 'error'];
}
