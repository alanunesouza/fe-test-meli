import { AxiosResponse } from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import frontApi from "../../helpers/frontApi";
import styles from "./Review.module.css";
import { GetServerSidePropsContext } from "next";
import ProductCard from "./components/ProductCard";
import useLocalStorage from "../../hooks/useLocalStorage";
import { TCategory, TProductResponse, TProps } from ".";
import { useRouter } from "next/router";
import { Button, Drawer, TablePagination } from "@material-ui/core";
import nProgress from "nprogress";
import { useViewPort } from "../../hooks/useViewPort";
import { parseCookies } from "nookies";

const ENDPOINT_MELI = "https://api.mercadolibre.com/sites";
const LIMIT_PER_PAGE = 10;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const { "nextauth.token": token } = parseCookies(ctx);

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const { query } = ctx;
    const term = query.q;
    const categoriesResponse: AxiosResponse<TCategory[], unknown> =
      await frontApi.get(`${ENDPOINT_MELI}/MLB/categories`);

    if (term) {
      const productsResponse: AxiosResponse<TProductResponse, unknown> =
        await frontApi.get(
          `${ENDPOINT_MELI}/MLA/search?q=${term}&limit=${LIMIT_PER_PAGE}`
        );

      return {
        props: {
          categories: categoriesResponse.data,
          productsSSR: productsResponse.data,
        },
      };
    }

    return {
      props: {
        categories: categoriesResponse.data,
        productsSSR: null,
      },
    };
  } catch (error) {
    return {
      props: {
        categories: null,
        productsSSR: null,
      },
    };
  }
}

const Review = ({ categories, productsSSR }: TProps) => {
  const [products, setProducts] = useState<TProductResponse>(null);
  const [starProducts, setStarProducts] = useLocalStorage("star-products", []);
  const [favoriteProducts, setFavoriteProducts] = useLocalStorage(
    "favorite-products",
    []
  );
  const [openCategoriesMobile, setOpenCategoriesMobile] =
    useState<boolean>(false);
  const router = useRouter();
  const { isMobile } = useViewPort();

  useEffect(() => {
    if (productsSSR) {
      setProducts(productsSSR);
    }
  }, [productsSSR]);

  const fetchDataOfCurrentPage = async (currentValue: number) => {
    nProgress.start();

    const URL = `${ENDPOINT_MELI}/MLA/search?q=${router.query?.q}&limit=${LIMIT_PER_PAGE}&offset=${currentValue}`;
    const response: AxiosResponse<TProductResponse, unknown> =
      await frontApi.get(URL);

    setProducts(response.data);
    nProgress.done();
  };

  const getCategoryDetails = async (categoryId: string) => {
    const response: AxiosResponse<{ permalink: string }> = await frontApi.get(
      `https://api.mercadolibre.com/categories/${categoryId}`
    );
    window.open(response.data.permalink, "_blank").focus();
  };

  return (
    <div>
      <Head>
        <title>Mercado Livre - Avaliação de Produtos</title>
      </Head>

      <Header />

      <div className={styles.container}>
        {!isMobile ? (
          <aside className={styles.sideBar}>
            <strong className={styles.sideBarTitle}>Categorias</strong>
            {categories?.map((category) => (
              <a
                className={styles.category}
                key={category.id}
                onClick={() => getCategoryDetails(category.id)}
                data-testid="category-item"
              >
                <span>{category.name}</span>
              </a>
            ))}
          </aside>
        ) : (
          <>
            <Button
              variant="contained"
              style={{ textTransform: "none" }}
              fullWidth
              onClick={() => setOpenCategoriesMobile(true)}
            >
              Categorias
            </Button>
            <Drawer
              anchor="right"
              open={openCategoriesMobile}
              onClose={() => setOpenCategoriesMobile(false)}
            >
              {categories?.map((category) => (
                <a
                  className={styles.category}
                  key={category.id}
                  onClick={() => getCategoryDetails(category.id)}
                  data-testid="category-item"
                  style={{ margin: "8px" }}
                >
                  <span>{category.name}</span>
                </a>
              ))}
            </Drawer>
          </>
        )}
        <div className={styles.content}>
          {products?.results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorited={
                !!favoriteProducts.find((fp: any) => fp?.id === product.id)
              }
              isRated={starProducts.find((sp: any) => sp?.id === product.id)}
              favoriteProducts={favoriteProducts}
              starProducts={starProducts}
              setFavoriteProducts={setFavoriteProducts}
              setStarProducts={setStarProducts}
            />
          ))}

          {products && (
            <TablePagination
              page={products?.paging.offset}
              onPageChange={(
                _: React.MouseEvent<HTMLButtonElement> | null,
                newPage: number
              ) => {
                fetchDataOfCurrentPage(newPage);
              }}
              rowsPerPage={products?.paging.limit}
              rowsPerPageOptions={[]}
              component="div"
              count={products?.paging.total}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
