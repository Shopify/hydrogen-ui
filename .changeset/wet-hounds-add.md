---
'@shopify/hydrogen-react': patch
---

Updated to Storefront API version `2023-01`

## Storefront API Changes

The Storefront API changelog can be viewed [here](https://shopify.dev/api/release-notes/2023-01#graphql-storefront-api-changes). There are not any breaking changes in the Storefront API itself.

## Storefront Kit changes

### Breaking Changes

- The default Cart query no longer uses `compareAtPriceV2` and `priceV2`; use `compareAtPrice` and `price` instead. The `V2` fields will be removed in an upcoming version of the Storefront API.
- The storefront client and ShopifyProvider now provide the `storeDomain` exactly as it is received; it's recommended that you pass the domain with the protocol and the fully-qualified domain name for your Storefront. For example: `https://hydrogen-test.myshopify.com`
- `parseMetafield`'s implementation has been updated and vastly improved so that it is correctly parsing all the metafield types.

  - The parsed metafield will now be found on the `parsedValue` property. For example:

    ```ts
    const metafield = parseMetafield(rawMetafield);

    console.log(metafield.parsedValue);
    ```

  - Additionally, a new TypeScript type called `ParsedMetafields` is provided to help the `parseMetafield` function return the correct TypeScript types, by passing the type of metafield into the `ParsedMetafield` type. For example:

    ```ts
    const metafield = parseMetafield<ParsedMetafield['boolean']>(rawMetafield);

    // parsedValue is a boolean
    if (metafield.parsedValue === true) {
    }
    ```

- The `<Metafield/>` component has been removed; use `parseMetafield().parsedValue` to have control over what you want to render

### Removal of `data` prop from components

In [issue 106](https://github.com/Shopify/hydrogen-ui/issues/106), we solicited feedback about the usage of the `data` prop for components. Overwhelmingly the feedback was to remove the `data` prop and use individual props with primitive values instead of a `data` prop with an object.

Due to this change, the following components have had their props changed:

- `<Money data={moneyV2}/>` is now `<Money amount={moneyV2.amount} currencyCode={moneyV2.currencyCode}/>`
- `useMoney(moneyV2)` is now `useMoney(moneyV2.amount, moneyV2.currency)`
