import styles from "./style.module.css";
import { Button, Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const WebpapNavBar = () => {
  const items = [
    {
      key: "1",
      label: <Link to={"/"}>Home</Link>,
    },
    {
      key: "2",
      label: <Link to={"/pricing"}>Pricing</Link>,
    },

    {
      key: "3",
      label: <Link to={"/market-place"}>Market Place</Link>,
    },
    {
      key: "4",
      label: <Link to={"/login"}>Retailer Login</Link>,
    },
  ];

  return (
    <div className={styles.WebpapNavBar}>
      <Link to={"/"} className={styles.WebpapLogo}>
        Webpap
      </Link>

      <div className={styles.WebpapNavLinks}>
        <Link to={"/"}>
          <Button type="text" size="large">
            Home
          </Button>
        </Link>
        <Link to={"/pricing"}>
          <Button type="text" size="large">
            Pricing
          </Button>
        </Link>
        <Link to={"/market-place"}>
          <Button type="text" size="large">
            Market place
          </Button>
        </Link>
        <Link to={"/login"}>
          <Button type="text" size="large">
            Retailer Login
          </Button>
        </Link>
      </div>

      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        className={styles.WebpapDropdown}
      >
        <Button type="text" icon={<MenuOutlined />} />
      </Dropdown>
    </div>
  );
};
