import { WebpapFooter, WebpapNavBar } from "../../components";
import styles from "./style.module.css";

export const Pricing = () => {
  return (
    <>
      <WebpapNavBar />
      <div className={`${styles.msgOne} primaryBg`}>
        <div>
          <div className={styles.transaction}>
            <p>8%</p>
            <p>Transaction cost</p>
          </div>
          <div className={styles.border}></div>
          <div className={styles.withdrawal}>
            <p> 100 KSH </p>
            <p>Per withdrawal</p>
          </div>
        </div>
        <p>
          {" "}
          No <span> subscription fees </span>{" "}
        </p>
        <p>
          {" "}
          No <span> extra charges </span>{" "}
        </p>
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
