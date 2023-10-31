import { useEffect } from "react";

export const useLoadingImage = () => {
  useEffect(() => {
    const setOpacity = () => {
      const images = document.querySelectorAll(".loading-image");
      images.forEach((image) => {
        image.addEventListener("load", function () {
          (image as HTMLElement).style.opacity = "1";
        });
      });
    };
    setOpacity();
  }, []);
};
