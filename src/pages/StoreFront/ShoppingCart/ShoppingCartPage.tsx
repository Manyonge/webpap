import { Link, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { Product, ShoppingCart } from "../../../common/interfaces";
import { useEffect, useState } from "react";

const CartItem = (props: {
  product: Product;
  shoppingCart: ShoppingCart;
  setShoppingCart: any;
}) => {
  const { product, shoppingCart, setShoppingCart } = props;

  const handleRemoveFromCart = async (product: Product) => {
    const temp = JSON.parse(JSON.stringify(shoppingCart));
    temp.products = temp.products.filter(
      (item: Product) => item.id !== parseInt(product.id as string),
    );
    if (product?.price) {
      temp.totalPrice = temp.totalPrice - product?.price;
    }
    setShoppingCart(temp);
    localStorage.setItem("shoppingCart", JSON.stringify(temp));
  };

  return (
    <div
      className="rounded-lg shadow-xl px-3 py-2 mb-4
   flex flex-col items-center   justify-between
   mb-6"
    >
      <div className=" flex flex-row items-center justify-between  w-full">
        <img
          src={product.product_images[0].url}
          className="
        object-fill rounded-lg w-14 h-14  "
        />
        <p className="text-center"> {product.name} </p>
        <p className="text-center"> {product.size} </p>
        <p className="text-center"> {product.price} </p>
      </div>
      <div
        className="flex flex-col items-center justify-between
        w-1/3"
      >
        <button
          className="bg-error text-white py- w-full shadow-lg rounded-full"
          onClick={() => handleRemoveFromCart(product)}
        >
          {" "}
          Remove{" "}
        </button>
      </div>
    </div>
  );
};

export const ShoppingCartPage = () => {
  const { storeFrontID } = useParams();

  const [shoppingCart, setShoppingCart] = useState<ShoppingCart>({
    totalPrice: 0,
    products: [],
  });

  useEffect(() => {
    const cart = localStorage.getItem("shoppingCart");
    if (cart) {
      const temp = JSON.parse(cart);
      setShoppingCart(temp);
    } else {
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    }
  }, []);

  return (
    <div className="px-2 pt-10 pb-40 ">
      <Link
        to={`/${storeFrontID}`}
        className="flex flex-row items-center justify-start
       font-bold mb-4
      "
      >
        <LeftOutlined />
        <p>Continue Shopping</p>
      </Link>

      <p className="text-lg text-center font-bold mb-5 "> Shopping Cart </p>

      <div className="flex flex-row items-center justify-between mb-5 w-11/12   mx-auto">
        <p className="font-bold">TOTAL</p>
        <p className="font-bold"> {shoppingCart.totalPrice} KSH </p>
      </div>

      <Link
        to={`/${storeFrontID}/checkout`}
        className="flex flex-row justify-center items-center"
      >
        <button className="w-11/12 mx-auto  rounded-full shadow-lg mb-12 bg-success text-white py-1 ">
          {" "}
          Check out{" "}
        </button>
      </Link>

      {shoppingCart.products.length < 1 && (
        <p className="text-center text-lg"> No items added </p>
      )}

      <div className="w-11/12 mx-auto">
        {shoppingCart.products.length > 0
          ? shoppingCart.products.map((product) => (
              <CartItem
                product={product}
                key={product.id}
                setShoppingCart={setShoppingCart}
                shoppingCart={shoppingCart}
              />
            ))
          : null}
      </div>
    </div>
  );
};
