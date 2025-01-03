import React, { useState } from "react";
import Nav from "../Nav.jsx";
import group from "../assets/Group 137.png";
import creator from "../assets/creator.png";
import { MdGroups } from "react-icons/md";
import Footer from "../Footer.jsx";
export default function Home() {
  const [email, setEmail] = useState(null);

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleClick = () => {
    console.log("clicked");
  };
  return (
    <div>
      <Nav />
      <div className="lg:px-20">
        <div className="flex space-x-10 items-center">
          <div className=" space-y-5">
            <h1 className="text-6xl font-bold">
              Work <span className=" text-blue">Remotely</span>
              <br /> from your home or any other place
            </h1>
            <h1>
              We curate the best digital jobs for those who are looking to start
              their career in developing ideas to products.
            </h1>
            <div className="flex border border-black rounded-full overflow-hidden max-w-xs">
              <input
                type="text"
                placeholder="Enter your email"
                className="p-1 px-5 outline-none text-sm flex-grow"
                name="email"
                onChange={handleChange}
              />
              <button
                className="m-1 p-2 px-3 bg-green text-white text-sm rounded-full hover:bg-blue-600 transition"
                onClick={handleClick}
              >
                Get Started
              </button>
            </div>
          </div>
          <img src={group} className=" h-[600px] transform-x-2" />
        </div>
        <div className="flex items-center space-x-[200px] pb-7">
          <img src={creator} className="w-[700px]" />
          <div className=" space-y-5">
            <h1 className="text-6xl font-bold">
              Where <span className=" text-green">Idea</span>
              <br /> meets <span className="text-blue">Talent</span>
            </h1>
            <h1>Turn your ideas into the best it could be.</h1>
          </div>
        </div>
      </div>
      <div className="space-y-14">
        <div className="flex flex-col items-center space-y-5">
          <h1 className="mx-auto text-center text-5xl font-bold ">
            Manage your entire community<br></br> in a single system
          </h1>
          <span>Who is DevX suitable for?</span>
        </div>
        <div className="grid grid-cols-3 items-center px-20 gap-[200px] ">
          <div className="flex flex-col items-center text-center relative">
            <div
              className="bg-[#A7F3D0] absolute left-1/2 transform rounded-tl-3xl rounded-br-3xl w-16 h-16"
              aria-hidden="true"
            ></div>
            <MdGroups className="text-green text-6xl z-10 " />
            <h1 className="text-2xl font-semibold mt-4">
              Membership Organizations
            </h1>
            <span className="text-gray-600 mt-2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus id
              obcaecati ad quibusdam et impedit officiis dicta dolorem minima
              dolorum, labore neque doloremque blanditiis enim quas maxime
              sapiente? Sequi, iure!
            </span>
          </div>
          <div className="flex flex-col items-center text-center relative">
            <div
              className="bg-[#A7F3D0] absolute left-1/2 transform rounded-tl-3xl rounded-br-3xl w-16 h-16"
              aria-hidden="true"
            ></div>
            <MdGroups className="text-green text-6xl z-10 " />
            <h1 className="text-2xl font-semibold mt-4">
              Membership Organizations
            </h1>
            <span className="text-gray-600 mt-2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus id
              obcaecati ad quibusdam et impedit officiis dicta dolorem minima
              dolorum, labore neque doloremque blanditiis enim quas maxime
              sapiente? Sequi, iure!
            </span>
          </div>
          <div className="flex flex-col items-center text-center relative ">
            <div
              className="bg-[#A7F3D0] absolute left-1/2 transform rounded-tl-3xl rounded-br-3xl w-16 h-16"
              aria-hidden="true"
            ></div>
            <MdGroups className="text-green text-6xl z-10 " />
            <h1 className="text-2xl font-semibold mt-4">
              Membership Organizations
            </h1>
            <span className="text-gray-600 mt-2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus id
              obcaecati ad quibusdam et impedit officiis dicta dolorem minima
              dolorum, labore neque doloremque blanditiis enim quas maxime
              sapiente? Sequi, iure!
            </span>
          </div>
        </div>
        <div>
          <div className="flex flex-col items-center space-y-5 pt-5">
            <h1 className="mx-auto text-center text-5xl font-bold ">
              Our Clients
            </h1>
            <span>We have been working with some Fortune 500+ clients</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
