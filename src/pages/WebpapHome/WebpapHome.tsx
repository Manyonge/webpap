import { WebpapFooter, WebpapNavBar } from "../../components";
import styles from "./style.module.css";
import { Button } from "antd";
import { Link } from "react-router-dom";

export const WebpapHome = () => {
  return (
    <>
      <WebpapNavBar />
      <div className={`${styles.msgOne} primaryBg`}>
        <p>Instantly sell your clothing </p>
        <p>and footwear products on</p>
        <p>the web!</p>
        <Link to={"/sign-up"}>
          <Button
            className={styles.getStarted}
            type="primary"
            size="large"
            shape="round"
          >
            {" "}
            Get Started{" "}
          </Button>
        </Link>
      </div>

      <div className={styles.msgTwo}>
        <p>Get your own e-commerce</p>
        <p>website, receive orders and</p>
        <p>payments in your sleep!</p>
      </div>

      <div className={`${styles.msgThree} primaryBg`}>
        <p>No Startup costs</p>
        <p>No developers or lines of</p>
        <p>code needed!</p>
      </div>
      <WebpapFooter />
    </>
  );
};
