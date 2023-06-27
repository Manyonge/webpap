import styles from "./style.module.css";
import { Button, Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

export const WebpapNavBar = () => {
  const { pathname } = useLocation();

  const items = [
    {
      key: "1",
      label: (
        <Link to={"/"}>
          {" "}
          <Button
            type={pathname === "/" ? "primary" : "text"}
            size="small"
            style={{ width: "100%" }}
          >
            Home
          </Button>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to={"/pricing"}>
          {" "}
          <Button
            type={pathname === "/pricing" ? "primary" : "text"}
            size="small"
            style={{ width: "100%" }}
          >
            Pricing
          </Button>
        </Link>
      ),
    },

    {
      key: "3",
      label: (
        <Link to={"/market-place"}>
          <Button
            type={pathname === "/market-place" ? "primary" : "text"}
            size="small"
            style={{ width: "100%" }}
          >
            Market place
          </Button>
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Link to={"/login"}>
          {" "}
          <Button
            type={pathname === "/login" ? "primary" : "text"}
            size="small"
            style={{ width: "100%" }}
          >
            Retailer Login
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className={styles.WebpapNavBar}>
      <Link to={"/"} className={styles.WebpapLogo}>
        Webpap
      </Link>

      <div className={styles.WebpapNavLinks}>
        <Link to={"/"}>
          <Button type={pathname === "/" ? "primary" : "text"} size="middle">
            Home
          </Button>
        </Link>
        <Link to={"/pricing"}>
          <Button
            type={pathname === "/pricing" ? "primary" : "text"}
            size="middle"
          >
            Pricing
          </Button>
        </Link>
        <Link to={"/market-place"}>
          <Button
            type={pathname === "/market-place" ? "primary" : "text"}
            size="middle"
          >
            Market place
          </Button>
        </Link>
        <Link to={"/login"}>
          <Button
            type={pathname === "/login" ? "primary" : "text"}
            size="middle"
          >
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
