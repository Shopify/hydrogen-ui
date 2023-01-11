import {useEffect} from 'react';
import {stringify} from 'worktop/cookie';
import {SHOPIFY_Y, SHOPIFY_S} from './cart-constants.js';
import {buildUUID, getShopifyCookies} from './cookies-utils.js';

const longTermLength = 60 * 60 * 24 * 360 * 1; // ~1 year expiry
const shortTermLength = 60 * 30; // 30 mins

interface ShopifyCookiesProps {
  /** The domain scope of the cookie */
  domain: string;
  /**
   * Defaults to false. If hasUserConsent is true, we can set Shopify unique user token cookie
   * lifetime to 1 year
   */
  hasUserConsent?: boolean;
}

export function ShopifyCookies(props: ShopifyCookiesProps) {
  const {domain = '', hasUserConsent = false} = props;

  useEffect(() => {
    const cookies = getShopifyCookies(document.cookie);

    /**
     * Set user and session cookies and refresh the expiry time
     */
    document.cookie = stringify(SHOPIFY_Y, cookies[SHOPIFY_Y] || buildUUID(), {
      maxage: hasUserConsent ? longTermLength : shortTermLength,
      domain,
      samesite: 'Lax',
      path: '/',
    });
    document.cookie = stringify(SHOPIFY_S, cookies[SHOPIFY_S] || buildUUID(), {
      maxage: shortTermLength,
      domain,
      samesite: 'Lax',
      path: '/',
    });
  });

  return null;
}
