import React from "react";
import { useNavigate } from "react-router-dom";
import { FaDollarSign } from "react-icons/fa";
export default function WorkCard(props) {
  const job = props.job;
  return (
    <div>
      <h1>{job.name}</h1>
      <p>{job.description}</p>
      <div className="flex gap-2">
        {job.requiredTags.array.forEach((element) => {
          <div className="p-1 border rounded-xl">
            <h2>{element}</h2>
          </div>;
        })}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <FaDollarSign className="text-green" />
          <h2>{job.budget}</h2>
        </div>
        <button className="p-2 rounded-xl bg-green">Apply Now</button>
      </div>
    </div>
  );
}
