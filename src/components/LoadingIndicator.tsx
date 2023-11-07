import { useAppContext } from "../contexts";

export const LoadingIndicator = (props: {
  heightWidthXs: number;
  heightWidthMd: number;
  fillColor?: string;
  styleClasses?: string;
}) => {
  const { heightWidthXs, heightWidthMd, fillColor, styleClasses } = props;
  const { windowWidth } = useAppContext();
  return (
    <div className="mx-auto">
      <svg
        height={`${
          windowWidth > heightWidthMd ? heightWidthMd : heightWidthXs
        }px`}
        width={`${
          windowWidth > heightWidthMd ? heightWidthMd : heightWidthXs
        }px`}
        id="Layer_1"
        version="1.1"
        viewBox="0 0 16 16"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className={`animate-spin-slow ${fillColor ? fillColor : "fill-white"} ${
          styleClasses ? styleClasses : ""
        } mx-auto `}
      >
        <path
          d="M8,0C7.448,0,7,0.448,7,1v2c0,0.552,0.448,1,1,
        1s1-0.448,1-1V1C9,0.448,8.552,0,8,0z M8,
        12c-0.552,0-1,0.447-1,1v2  c0,0.553,0.448,1,1,
        1s1-0.447,1-1v-2C9,12.447,8.552,12,8,12z M12.242,
        5.172l1.414-1.415c0.391-0.39,0.391-1.024,
        0-1.414  c-0.39-0.391-1.023-0.391-1.414,0l-1.414,1.414c-0.391,0.391-0.391,1.024,0,1.415C11.219,5.562,11.852,5.562,12.242,5.172z   M3.757,10.828l-1.414,1.414c-0.391,0.391-0.391,1.024,0,1.414c0.39,0.391,1.023,0.391,1.414,0l1.414-1.414  c0.391-0.391,0.391-1.023,0-1.414C4.781,10.438,4.148,10.438,3.757,10.828z M3.757,2.343c-0.391-0.391-1.024-0.391-1.414,0  c-0.391,0.39-0.391,1.024,0,1.414l1.414,1.415c0.391,0.39,1.024,0.39,1.414,0c0.391-0.391,0.391-1.024,0-1.415L3.757,2.343z   M12.242,10.828c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l1.414,1.414c0.391,0.391,1.024,0.391,1.414,0  c0.391-0.39,0.391-1.023,0-1.414L12.242,10.828z M15,7h-2c-0.553,0-1,0.448-1,1s0.447,1,1,1h2c0.553,0,1-0.448,1-1S15.553,7,15,7z   M4,8c0-0.552-0.448-1-1-1H1C0.448,7,0,7.448,0,8s0.448,1,1,1h2C3.552,9,4,8.552,4,8z"
        />
      </svg>
    </div>
  );
};
