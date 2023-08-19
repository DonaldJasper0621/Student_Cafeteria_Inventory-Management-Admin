import React from "react";
import { InfinitySpin } from "react-loader-spinner";
const Loader = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center absolute top-0 left-0 bg-black/50 z-50">
      <InfinitySpin width="200" color="#3dd1bb" />
      <h3 className="text-xl font-bold text-[#3dd1bb]">Loading...</h3>
    </div>
  );
};

export default Loader;
