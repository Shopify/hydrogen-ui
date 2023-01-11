export enum AnalyticsEventName {
  PAGE_VIEW = 'PAGE_VIEW',
  ADD_TO_CART = 'ADD_TO_CART',
}

export enum AnalyticsPageType {
  article = 'article',
  blog = 'blog',
  captcha = 'captcha',
  cart = 'cart',
  collection = 'collection',
  customersAccount = 'customers/account',
  customersActivateAccount = 'customers/activate_account',
  customersAddresses = 'customers/addresses',
  customersLogin = 'customers/login',
  customersOrder = 'customers/order',
  customersRegister = 'customers/register',
  customersResetPassword = 'customers/reset_password',
  giftCard = 'gift_card',
  home = 'index',
  listCollections = 'list-collections',
  forbidden = '403',
  notFound = '404',
  page = 'page',
  password = 'password',
  product = 'product',
  policy = 'policy',
  search = 'search',
}

export enum ShopifyAppSource {
  hydrogen = 'hydrogen',
  headless = 'headless',
}

export const ShopifyAppId = {
  hydrogen: '6167201',
  headless: '12875497473',
};
