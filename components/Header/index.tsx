import React, { useContext } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import SearchInput from "./components/SearchInput";
import { useRouter } from "next/dist/client/router";
import { AuthContext } from "../../contexts/AuthContext";
import FadeMenu from "./components/FadeMenu";

const Header = () => {
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header className={styles.container}>
      <div className={styles.centerHeader}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <a className={styles.logo} />
          </Link>
        </div>

        {router.pathname === "/review" && <SearchInput />}

        <div className={styles.leftHeader} />

        {isAuthenticated && <FadeMenu />}
      </div>
    </header>
  );
};

export default Header;
