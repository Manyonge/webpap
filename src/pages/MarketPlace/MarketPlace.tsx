import { WebpapFooter, WebpapNavBar } from "../../components";
import styles from "./style.module.css";
import { Link } from "react-router-dom";

const retailers = [
  {
    storeFrontID: "dripventory",
    imageURL:
      "https://firebasestorage.googleapis.com/v0/b/hustle-build.appspot.com/o/hustles%2Fxlei7bkgxu8o7oirt41k546w8est3i95.png?alt=media&token=a580c71c-7a4d-4325-a08a-37e8e4663c62",
    description: "Cargo pants, pre-loved sneakers",
  },
  {
    storeFrontID: "dripventory",
    imageURL:
      "https://firebasestorage.googleapis.com/v0/b/hustle-build.appspot.com/o/hustles%2Fxlei7bkgxu8o7oirt41k546w8est3i95.png?alt=media&token=a580c71c-7a4d-4325-a08a-37e8e4663c62",
    description: "Cargo pants, pre-loved sneakers",
  },
  {
    storeFrontID: "dripventory",
    imageURL:
      "https://firebasestorage.googleapis.com/v0/b/hustle-build.appspot.com/o/hustles%2Fxlei7bkgxu8o7oirt41k546w8est3i95.png?alt=media&token=a580c71c-7a4d-4325-a08a-37e8e4663c62",
    description: "Cargo pants, pre-loved sneakers",
  },
  {
    storeFrontID: "dripventory",
    imageURL:
      "https://firebasestorage.googleapis.com/v0/b/hustle-build.appspot.com/o/hustles%2Fxlei7bkgxu8o7oirt41k546w8est3i95.png?alt=media&token=a580c71c-7a4d-4325-a08a-37e8e4663c62",
    description: "Cargo pants, pre-loved sneakers",
  },

  {
    storeFrontID: "dripventory",
    imageURL:
      "https://firebasestorage.googleapis.com/v0/b/hustle-build.appspot.com/o/hustles%2Fxlei7bkgxu8o7oirt41k546w8est3i95.png?alt=media&token=a580c71c-7a4d-4325-a08a-37e8e4663c62",
    description: "Cargo pants, pre-loved sneakers",
  },
  {
    storeFrontID: "dripventory",
    imageURL:
      "https://firebasestorage.googleapis.com/v0/b/hustle-build.appspot.com/o/hustles%2Fxlei7bkgxu8o7oirt41k546w8est3i95.png?alt=media&token=a580c71c-7a4d-4325-a08a-37e8e4663c62",
    description: "Cargo pants, pre-loved sneakers  ",
  },
  {
    storeFrontID: "dripventory",
    imageURL:
      "https://firebasestorage.googleapis.com/v0/b/hustle-build.appspot.com/o/hustles%2Fxlei7bkgxu8o7oirt41k546w8est3i95.png?alt=media&token=a580c71c-7a4d-4325-a08a-37e8e4663c62",
    description: "Cargo pants, pre-loved sneakers",
  },
  {
    storeFrontID: "dripventory",
    imageURL:
      "https://firebasestorage.googleapis.com/v0/b/hustle-build.appspot.com/o/hustles%2Fxlei7bkgxu8o7oirt41k546w8est3i95.png?alt=media&token=a580c71c-7a4d-4325-a08a-37e8e4663c62",
    description: "Cargo pants, pre-loved sneakers",
  },
];

const RetailerPaper = (props: {
  imageURL: string;
  description: string;
  storeFrontID: string;
}) => {
  const { storeFrontID, description, imageURL } = props;
  return (
    <Link to={`/${storeFrontID}`} className={"Link"}>
      <div className={styles.RetailerPaper}>
        <img src={imageURL} />
        <p> {description} </p>
      </div>
    </Link>
  );
};

export const MarketPlace = () => {
  return (
    <>
      <WebpapNavBar />
      <div className={styles.gridContainer}>
        {retailers.map(({ imageURL, description, storeFrontID }) => (
          <RetailerPaper
            imageURL={imageURL}
            description={description}
            storeFrontID={storeFrontID}
          />
        ))}
      </div>
      <WebpapFooter />
    </>
  );
};
