import { Link, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

export const CheckOut = () => {
  const { storeFrontID } = useParams();
  return (
    <div className="px-10 pb-40">
      <Link to={`/${storeFrontID}`} className="font-bold mb-4 ">
        <LeftOutlined />
        Cancel
      </Link>

      <form>
        <input />
      </form>
    </div>
  );
};
