import { WebpapFooter, WebpapNavBar } from "../components";
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
      <div className=" w-40 md:w-60 shadow-md rounded-lg mx-auto">
        <img
          src={imageURL}
          className="w-40 md:w-60 h-36 md:h-48 rounded-lg object-cover "
        />

        <p className="text-center text-sm md:text-base/5 my-3">
          {" "}
          {description}{" "}
        </p>
      </div>
    </Link>
  );
};

export const MarketPlace = () => {
  return (
    <>
      <WebpapNavBar />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 pt-4 px-3 md:px-4 pb-40">
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
