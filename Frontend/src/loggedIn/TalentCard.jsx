import React from "react";
import { useNavigate } from "react-router-dom";

export default function TalentCard(props) {
  const dev = props.dev;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/dev/${dev._id}`);
  };

  return (
    <div className="relative">
      {/* Background "cube" effect */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl bg-grey shadow-lg -z-10 "></div>

      {/* Foreground card */}
      <div
        className="border p-3 rounded-xl space-y-2 lg:space-y-4 cursor-pointer bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 transition-transform duration-200"
        onClick={handleClick}
      >
        <h1 className="text-xl lg:text-2xl 2xl:text-4xl font-bold text-primary">
          {dev.name}
        </h1>
        <p>{dev.description}</p>
        <div className="flex gap-2 flex-wrap">
          <div className="p-2 border rounded-lg text-primary">
            <h2>{dev.tag}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
