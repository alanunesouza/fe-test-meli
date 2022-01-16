import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import ReviewPage, { getServerSideProps } from "./index.page";
import categoriesMock from "../../__mocks__/categories.json";
import productsMock from "../../__mocks__/products.json";
import { currencyEsAr } from "../../helpers/currencyEsAr";
import { mocked } from "ts-jest/utils";
import frontApi from "../../helpers/frontApi";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require("next/dist/client/router"), "useRouter");
jest.mock("../../helpers/frontApi.ts");

describe("ReviewPage", () => {
  it("should render correctly", async () => {
    useRouter.mockImplementation(() => ({
      pathname: "/review",
    }));

    const { queryByTestId, queryAllByTestId } = render(
      <ReviewPage categories={categoriesMock} productsSSR={productsMock} />
    );

    const categoriesItem = queryAllByTestId("category-item");
    const productsItem = queryAllByTestId("product-item");
    const productsTitle = queryAllByTestId("product-title");
    const productsImage = queryAllByTestId("product-image");
    const productsOldPrice = queryAllByTestId("product-old-price");
    const productsPrice = queryAllByTestId("product-price");
    const buttonsRating = queryAllByTestId("button-rating");
    const inputSearch = queryByTestId("input-term");

    const quantityOldPrice = productsMock.results.reduce((sum, item) => {
      if (item.original_price) {
        return sum + 1;
      }
      return sum;
    }, 0);

    expect(categoriesItem).toHaveLength(categoriesMock.length);
    expect(productsItem).toHaveLength(productsMock.results.length);
    expect(productsTitle).toHaveLength(productsMock.results.length);
    expect(productsTitle[0].textContent).toBe(productsMock.results[0].title);
    expect(productsImage).toHaveLength(productsMock.results.length);
    expect(productsOldPrice).toHaveLength(quantityOldPrice);
    expect(productsOldPrice[0].textContent).toBe(
      currencyEsAr(productsMock.results[0].original_price)
    );
    expect(productsPrice).toHaveLength(productsMock.results.length);
    expect(productsPrice[0].textContent).toBe(
      currencyEsAr(productsMock.results[0].price)
    );
    expect(buttonsRating).toHaveLength(productsMock.results.length);
    expect(inputSearch).toBeVisible();

    await buttonsRating.forEach((buttonEl) => {
      expect(buttonEl).toBeDisabled();
    });
  });

  it("should search product", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(() => ({
      pathname: "/review",
      push: pushMock,
    }));

    const { queryByTestId } = render(
      <ReviewPage categories={categoriesMock} productsSSR={productsMock} />
    );

    const inputSearch = queryByTestId("input-term");
    const buttonSearchSubmit = queryByTestId("button-search-submit");

    expect(inputSearch).toBeVisible();
    expect(buttonSearchSubmit).toBeVisible();

    await fireEvent.change(inputSearch, { target: { value: "teste" } });

    await act(async () => {
      fireEvent.click(buttonSearchSubmit);
    });

    expect(pushMock).toHaveBeenCalledWith("/review?q=teste");
  });

  it("should not render products and categories when data is empty", async () => {
    useRouter.mockImplementation(() => ({
      pathname: "/review",
    }));

    const { queryAllByTestId } = render(
      <ReviewPage categories={null} productsSSR={null} />
    );

    const categoriesItem = queryAllByTestId("category-item");
    const productsItem = queryAllByTestId("product-item");

    expect(categoriesItem).toHaveLength(0);
    expect(productsItem).toHaveLength(0);
  });

  it("should review one product", async () => {
    useRouter.mockImplementation(() => ({
      pathname: "/review",
    }));

    const { queryAllByTestId } = render(
      <ReviewPage categories={categoriesMock} productsSSR={productsMock} />
    );

    const buttonsRating = queryAllByTestId("button-rating");
    const stars5 = queryAllByTestId("rate-5");

    expect(buttonsRating[0]).toBeDisabled();
    expect(stars5[0]).toBeTruthy();

    fireEvent.click(stars5[0]);

    expect(buttonsRating[0]).toBeEnabled();

    fireEvent.click(buttonsRating[0]);

    expect(screen.getAllByTestId("button-rating")).toHaveLength(
      productsMock.results.length - 1
    );
  });

  it("should favorite one product", async () => {
    useRouter.mockImplementation(() => ({
      pathname: "/review",
    }));

    const { queryAllByTestId } = render(
      <ReviewPage categories={categoriesMock} productsSSR={productsMock} />
    );

    const buttonsFavorite = queryAllByTestId("button-favorite");

    fireEvent.click(buttonsFavorite[0]);

    expect(screen.queryAllByTestId("product-favorited")).toHaveLength(1);
  });

  describe("testing getServerSideProps", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    it("should return props with success", async () => {
      mocked(frontApi.get).mockResolvedValueOnce({
        status: 200,
        data: categoriesMock,
        headers: {},
        config: {},
        statusText: "",
      });
      mocked(frontApi.get).mockResolvedValueOnce({
        status: 200,
        data: productsMock,
        headers: {},
        config: {},
        statusText: "",
      });

      const ctx: any = {
        query: { q: "teste" },
        req: {
          headers: {
            cookie: "nextauth.token=a5b76320-cf27-4133-b440-e2ba69c1960d",
          },
        },
      };

      const props = await getServerSideProps(ctx);

      expect(frontApi.get).toBeCalledTimes(2);
      expect(props).toEqual({
        props: {
          categories: categoriesMock,
          productsSSR: productsMock,
        },
      });
    });

    it("should return props without products", async () => {
      mocked(frontApi.get).mockResolvedValueOnce({
        status: 200,
        data: categoriesMock,
        headers: {},
        config: {},
        statusText: "",
      });

      const ctx: any = {
        query: {},
        req: {
          headers: {
            cookie: "nextauth.token=a5b76320-cf27-4133-b440-e2ba69c1960d",
          },
        },
      };

      const props = await getServerSideProps(ctx);

      expect(frontApi.get).toBeCalledTimes(1);
      expect(props).toEqual({
        props: {
          categories: categoriesMock,
          productsSSR: null,
        },
      });
    });

    it("should return props without categories and products", async () => {
      mocked(frontApi.get).mockRejectedValueOnce({
        status: 500,
        data: {},
        headers: {},
        config: {},
        statusText: "",
      });

      const ctx: any = {
        query: {},
        req: {
          headers: {
            cookie: "nextauth.token=a5b76320-cf27-4133-b440-e2ba69c1960d",
          },
        },
      };

      const props = await getServerSideProps(ctx);

      expect(frontApi.get).toBeCalledTimes(1);
      expect(props).toEqual({
        props: {
          categories: null,
          productsSSR: null,
        },
      });
    });

    it("should redirecting when user is not logged", async () => {
      const ctx: any = {
        query: {},
        req: {
          headers: {
            cookie: "",
          },
        },
      };

      const props = await getServerSideProps(ctx);

      expect(frontApi.get).toBeCalledTimes(0);
      expect(props).toEqual({
        redirect: {
          destination: "/login",
          permanent: false,
        },
      });
    });
  });
});
