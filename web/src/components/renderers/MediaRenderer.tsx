import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaRendererInterface {
  media: string[];
}

function MediaRenderer({ media }: MediaRendererInterface) {
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(5);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    console.log({ left, right, index, lastIndex: media.length - 1 });
  }, [media, left, right, index]);

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full overflow-hidden">
        {media.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Media ${i}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              index === i ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
        {media.length > 1 && (
          <>
            <button className="z-10 absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full opacity-50 md:p-1" onClick={() => {
                if (index !== 0 && index - 1 === left) {
                  setLeft(left - 1);
                  setRight(right - 1);
                }
                index !== 0 && setIndex(index - 1);
              }}
            >
              <ArrowLeft />
            </button>
            <button className="z-10 absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full opacity-50 md:p-1" onClick={() => {
              if (index !== media.length - 1 && index + 1 === right) {
                setRight(right + 1);
                setLeft(left + 1);
              }
              index !== media.length - 1 && setIndex(index + 1);
            }}>
              <ArrowRight />
            </button>
          </>
        )}

      </div>
      <div className={`${media.length == 1 ? "hidden" : ""} flex justify-center items-center`}>
        <div className="flex justify-center items-center gap-1 mt-2">
          {media.map((item, i) => (
            <div
              key={i}
              className={`${
                i < left || i > right
                  ? "hidden"
                  : i === left && index !== left || i === right && index !== right
                  ? "w-1.5 h-1.5"
                  : "w-2 h-2"
              } ${index === left || index === right ? "w-1 h-1" : ""} ${
                index === i ? "bg-blue-400" : "bg-gray-500"
              } rounded-full`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MediaRenderer;
