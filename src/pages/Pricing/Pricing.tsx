import { WebpapFooter, WebpapNavBar } from "../../components";
import styles from "./style.module.css";

export const Pricing = () => {
  return (
    <>
      <WebpapNavBar />
      <div className={`${styles.msgOne} primaryBg`}>
        <div></div>
      </div>
      <div className={styles.msgTwo}>
        <ol className={styles.prosList}>
          <li>
            Custom e-commerce store front where your customers can explore and
            shop
          </li>
          <li>Receive payments via M-PESA</li>
          <li>Deliver country wide with Pickup Mtaani</li>
          <li>Free advertising on our market place</li>
        </ol>
      </div>
      <WebpapFooter />
    </>
  );
};
