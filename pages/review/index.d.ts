export type TProps = {
  categories?: TCategory[] | undefined;
  productsSSR?: TProductResponse | undefined;
};

type TProduct = {
  id: string;
  title: string;
  price: number;
  status?: string;
  thumbnail: string;
  permalink: string;
  [x: string]: any;
};

export type TProductResponse = {
  paging: {
    total: number;
    primary_results: number;
    offset: number;
    limit: number;
  };
  results: TProduct[];
};

export type TCategory = {
  id: string;
  name: string;
};
