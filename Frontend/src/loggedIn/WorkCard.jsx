import React from "react";
import { useNavigate } from "react-router-dom";
export default function WorkCard() {
  const work = props.work;
  return (
    <div>
      <h1>{work.name}</h1>
      <p>{work.description}</p>
      <div className="flex gap-2">
        {work.requiredTags.array.forEach((element) => {
          <div className="p-1 border rounded-xl">
            <h2>{element}</h2>
          </div>;
        })}
      </div>
    </div>
  );
}
