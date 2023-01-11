import type {ShopifyMonorailPayload} from './analytics-types.js';

export function schemaWrapper(schemaId: string, payload: unknown) {
  return {
    schema_id: schemaId,
    payload,
    metadata: {
      event_created_at_ms: Date.now(),
    },
  };
}

export function stripGId(text: number | string | undefined): number {
  if (typeof text === 'number') return text;
  return parseInt(stripId(text || ''));
}

export function stripId(text = ''): string {
  return text.substring(text.lastIndexOf('/') + 1);
}

export function addDataIf(
  keyValuePairs: ShopifyMonorailPayload,
  formattedData: ShopifyMonorailPayload
): ShopifyMonorailPayload {
  Object.entries(keyValuePairs).forEach(([key, value]) => {
    if (value) {
      formattedData[key] = value;
    }
  });
  return formattedData;
}

export function getResourceType(text = ''): string {
  return text
    .substring(0, text.lastIndexOf('/'))
    .replace(/.*shopify\//, '')
    .toLowerCase();
}
