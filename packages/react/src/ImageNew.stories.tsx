import * as React from 'react';
import type {Story} from '@ladle/react';
import {Image, shopifyLoader} from './ImageNew.js';

type Crop = 'center' | 'top' | 'bottom' | 'left' | 'right';

type ImageConfig = {
  intervals: number;
  startingWidth: number;
  incrementSize: number;
  placeholderWidth: number;
};

const Template: Story<{
  as?: 'img' | 'source';
  src: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  loader?: Function /* Should be a Function */;
  width?: string | number;
  height?: string | number;
  crop?: Crop;
  sizes?: string;
  aspectRatio?: string;
  config?: ImageConfig;
  alt?: string;
  loading?: 'lazy' | 'eager';
}> = (props) => {
  return (
    <>
      <Image {...props} loading="eager" aspectRatio="1/1" sizes="100vw" />
      <Image {...props} aspectRatio="4/3" width="50vw" sizes="50vw" />
      <Image {...props} width="30vw" sizes="30vw" />
      <Image {...props} width={100} height={200} />
      <Image {...props} width="5rem" />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  as: 'img',
  src: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/Main.jpg',
  width: '100%',
  config: {
    intervals: 10,
    startingWidth: 300,
    incrementSize: 300,
    placeholderWidth: 100,
  },
  crop: 'center',
  loading: 'lazy',
  loader: shopifyLoader,
};
