import {
  FacebookFilled,
  InstagramOutlined,
  TwitterCircleFilled,
} from "@ant-design/icons";

import styles from "./style.module.css";

export const WebpapFooter = () => {
  return (
    <footer className={styles.WebpapFooter}>
      <p> Contact us:</p>
      <a href="mailto:webpapsuppport@gmail.com">webpapsuppport@gmail.com</a>
      <a href="tel:+254792586134">+254792586134</a>
      <div className={styles.iconsSection}>
        <a target="_blank">
          {" "}
          <FacebookFilled />{" "}
        </a>
        <a target="_blank" href="">
          <TwitterCircleFilled />
        </a>
        <a target="_blank" href="">
          <InstagramOutlined />
        </a>
      </div>
    </footer>
  );
};
