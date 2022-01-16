import { Button, IconButton, Paper } from "@material-ui/core";
import React, { useCallback } from "react";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import Rating from "../Rating";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { currencyEsAr } from "../../../../helpers/currencyEsAr";

const ProductCard = ({
  product,
  isFavorited,
  isRated,
  starProducts,
  setStarProducts,
  favoriteProducts,
  setFavoriteProducts,
}: any) => {
  const [stars, setStars] = React.useState(isRated?.stars);
  const [isFavorite, setIsFavorite] = React.useState(isFavorited);

  const onClickRating = (e: any) => {
    const value = e.target.value;

    if (value) {
      setStars(value);
    }
  };

  const toggleFavorite = useCallback(() => {
    setIsFavorite(!isFavorite);

    if (isFavorite) {
      setFavoriteProducts(
        favoriteProducts.filter(
          (productItem: any) => productItem.id !== product.id
        )
      );
    } else {
      setFavoriteProducts([...favoriteProducts, product]);
    }
  }, [isFavorite, setFavoriteProducts, favoriteProducts, product]);

  const handleRating = () => {
    const newStarProducts = [...starProducts, { ...product, stars }];
    setStarProducts(newStarProducts);
    setStars(0);
  };

  const ButtonFavorite = useCallback(
    () => (
      <IconButton
        className={styles.iconButton}
        onClick={toggleFavorite}
        data-testid="button-favorite"
      >
        {isFavorite ? (
          <FavoriteIcon color="primary" data-testid="product-favorited" />
        ) : (
          <FavoriteBorderIcon color="primary" />
        )}
      </IconButton>
    ),
    [isFavorite, toggleFavorite]
  );

  return (
    <Paper
      key={product.id}
      className={styles.cardProduct}
      data-testid="product-item"
    >
      <div className={styles.containerImg}>
        <Link href="/" replace>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={product.permalink}
            data-testid="product-image"
          >
            <Image
              className={styles.imageProduct}
              src={product.thumbnail}
              alt={product.title}
              layout="fixed"
              width={140}
              height={140}
            />
          </a>
        </Link>

        <ButtonFavorite />
      </div>

      <div className={styles.containerProductDetails}>
        <span className={styles.textProduct} data-testid="product-title">
          {product.title}
        </span>
        {product.original_price > product.price && (
          <span className={styles.oldPrice} data-testid="product-old-price">
            {currencyEsAr(product.original_price)}
          </span>
        )}
        <span className={styles.price} data-testid="product-price">
          {currencyEsAr(product.price)}
        </span>

        <Rating
          onClick={onClickRating}
          id={product.id}
          valueDefault={isRated?.stars}
        />
      </div>
      <div className={styles.containerButton}>
        {!isRated && (
          <Button
            className={styles.buttonReviewSubmit}
            variant="contained"
            disabled={!stars}
            onClick={handleRating}
            data-testid="button-rating"
            fullWidth
          >
            Avaliar
          </Button>
        )}
      </div>
    </Paper>
  );
};

export default ProductCard;
