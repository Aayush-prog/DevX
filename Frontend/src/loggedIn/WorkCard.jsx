import React from "react";
import { FaDollarSign } from "react-icons/fa";

export default function WorkCard(props) {
  const job = props.job;

  const handleClick = () => {
    console.log(`Navigating to job details for: ${job.title}`);
    // Add navigation logic here if needed
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
          {job.title}
        </h1>
        <p>{job.description}</p>
        <div className="flex gap-2 flex-wrap">
          {job.requiredTags.map((element, index) => (
            <div key={index} className="p-2 border rounded-lg text-primary">
              <h2>{element}</h2>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex gap-2 items-center text-lg lg:text-2xl font-bold text-primary">
              <FaDollarSign className="text-green" />
              <h2>{job.budget}</h2>
            </div>
            <div className="h-8 w-px bg-grey"></div>
            <div className="flex gap-2 items-center text-lg lg:text-2xl font-bold text-primary">
              <h2>{job.applicants?.count || "0"}</h2>
              <p className="text-grey">proposals</p>
            </div>
          </div>
          <button className="p-3 rounded-xl bg-green text-white hover:bg-blue active:bg-primary transition-colors duration-200">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
