import React, { PropsWithChildren } from "react";

const viewportContext = React.createContext({
  isMobile: false,
  width: 1200,
});

export const ViewportProvider = ({ children }: PropsWithChildren<any>) => {
  const [width, setWidth] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);

    const isMobileInnerWidth = window.innerWidth < 768;

    setIsMobile(isMobileInnerWidth);
  };

  React.useEffect(() => {
    if (window) {
      handleWindowResize();
      window.addEventListener("resize", handleWindowResize);
    }

    return () =>
      window && window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <viewportContext.Provider value={{ isMobile, width }}>
      {children}
    </viewportContext.Provider>
  );
};

export const useViewPort = () => {
  const { width, isMobile } = React.useContext(viewportContext);
  return { width, isMobile };
};
