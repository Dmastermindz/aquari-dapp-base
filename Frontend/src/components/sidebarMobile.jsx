import React from "react";
import { useState } from "react";

//Import Icons
import { TbSettings } from "react-icons/tb";
import { IoExitOutline } from "react-icons/io5";
import { TiHomeOutline } from "react-icons/ti";
import { IoIosSwap } from "react-icons/io";
import { MdOutlineHowToVote } from "react-icons/md";
import { FiLayers } from "react-icons/fi";
import { FaRegMap } from "react-icons/fa6";
import { AiOutlineBank } from "react-icons/ai";
import { BsQuestionCircle } from "react-icons/bs";
import { IoChatboxOutline } from "react-icons/io5";
import { AiOutlineDollarCircle } from "react-icons/ai";

//Import Images
import Maciej from "../assets/AquariProfileLogo.png";

const sidebar = ({ setMobileNav, selected, setSelected, embeddedWallet, linkedWallet, authenticated, jsx, connectedWallet }) => {
  const menuItems = [
    {
      name: "Home",
      icon: (
        <TiHomeOutline
          size="23px"
          className={selected === "Home" ? "text-yellow-200 group-hover:text-yellow-200 transition duration-200 ease-in-out" : "text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out"}
        />
      ),
    },
    {
      name: "Trading",
      icon: (
        <IoIosSwap
          size="23px"
          className={selected === "Trading" ? "text-yellow-200 group-hover:text-yellow-200 transition duration-200 ease-in-out" : "text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out"}
        />
      ),
    },

    {
      name: "AquaVote",
      icon: (
        <MdOutlineHowToVote
          size="23px"
          className={selected === "AquaVote" ? "text-yellow-200 group-hover:text-yellow-200 transition duration-200 ease-in-out" : "text-[#4e5467] group-hover:text-yellow-200 transition duration-200 ease-in-out" && selected === "AquaVote2" ? "text-yellow-200 group-hover:text-yellow-200 transition duration-200 ease-in-out" : "text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out"}
        />
      ),
    },
    {
      name: "Stake",
      icon: (
        <FiLayers
          size="23px"
          className={selected === "Stake" ? "text-yellow-200 group-hover:text-yellow-200 transition duration-200 ease-in-out" : "text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out"}
        />
      ),
    },
    {
      name: "Cleanup Map",
      icon: (
        <FaRegMap
          size="23px"
          className={selected === "Cleanup Map" ? "text-yellow-200 group-hover:text-yellow-200 transition duration-200 ease-in-out" : "text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out"}
        />
      ),
    },
    {
      name: "DAO Financials",
      icon: (
        <AiOutlineBank
          size="23px"
          className={selected === "DAO Financials" ? "text-yellow-200 group-hover:text-yellow-200 transition duration-200 ease-in-out" : "text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out"}
        />
      ),
    },
    {
      name: "Buy Aquari",
      icon: (
        <AiOutlineDollarCircle
          size="23px"
          className={selected === "Buy Aquari" ? "text-yellow-200 group-hover:text-yellow-200 transition duration-200 ease-in-out" : "text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out"}
        />
      ),
    },
    {
      name: "Forum",
      icon: (
        <IoChatboxOutline
          size="23px"
          className={selected === "Forum" ? "text-yellow-200 group-hover:text-yellow-200 transition duration-200 ease-in-out" : "text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out"}
        />
      ),
    },

    {
      name: "Wiki",
      icon: (
        <BsQuestionCircle
          size="23px"
          className={selected === "Wiki" ? "text-yellow-200 group-hover:text-yellow-200 transition duration-200 ease-in-out" : "text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out"}
        />
      ),
    },
  ];

  return (
    <div className="absolute pt-3 mt-[54px] sm:mt-[76px] z-10 overflow-y-auto full-heightMobileNav  min-w-full flex-col bg-[#090d18]">
      <div className="flex flex-col mt-[5px]">
        {menuItems.map((item) => {
          if (item.name === selected) {
            return (
              <button className="group flex flex-row items-center gap-[11px] cursor-pointer bg-[#191b2c] rounded-l-2xl py-3 pl-[25px] select-none transition duration-200 ease-in-out">
                {item.icon}
                <h1 className="group font-bold text-yellow-200 group-hover:text-yellow-200 group:transition group:duration-200 ease-in-out">{item.name}</h1>
                <div className="border-white border-b-2"></div>
              </button>
            );
          } else if (selected === "AquaVote2") {
            console.log("We know that AquaVote2 Is the selected page");
            if (item.name === "AquaVote") {
              return (
                <button className="group flex flex-row items-center gap-[11px] cursor-pointer bg-[#191b2c] rounded-l-2xl py-3 pl-[25px] select-none transition duration-200 ease-in-out">
                  {item.icon}
                  <h1 className="group font-bold text-yellow-200 group-hover:text-yellow-200 group:transition group:duration-200 ease-in-out">{item.name}</h1>
                  <div className="border-white border-b-2"></div>
                </button>
              );
            } else {
              return (
                <button
                  onClick={() => {
                    setSelected(item.name);
                    setMobileNav(false);
                  }}
                  className="group flex flex-row items-center gap-[11px] cursor-pointer py-3 pl-[25px] select-none transition duration-200 ease-in-out">
                  {item.icon}
                  <h1 className="group font-bold group-text-yellow-200 text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out">{item.name}</h1>
                  <div className="border-white border-b-2"></div>
                </button>
              );
            }
          } else {
            return (
              <button
                onClick={() => {
                  setSelected(item.name);
                  setMobileNav(false);
                }}
                className="group flex flex-row items-center text-md tracking-wide gap-[11px] cursor-pointer py-3 pl-[25px] select-none transition duration-200 ease-in-out">
                {item.icon}
                <h1 className="group font-bold text-[#d0d3db] group-hover:text-yellow-200 transition duration-200 ease-in-out">{item.name}</h1>
                <div className="border-white border-b-2"></div>
              </button>
            );
          }
        })}
      </div>

      <div className="absolute bottom-[25px] ml-[19px] w-[325px] select-none profile-hide-on-height">
        <div className="flex flex-row items-center gap-3 mb-3">
          <img
            className="rounded-full opacity-[95%] h-[44px]"
            src={Maciej}
          />
          <div className="flex-col">
            <p className={!authenticated ? "text-white font-bold" : "hidden"}>Disconnected</p>
            <p className={embeddedWallet && authenticated ? "text-white font-bold" : "hidden"}>{embeddedWallet && authenticated ? embeddedWallet.address.slice(0, 21) : "Disconnected"}</p>
            <p className={authenticated && linkedWallet ? "text-white font-bold opacity-100" : "hidden"}>{linkedWallet && authenticated ? linkedWallet.address.slice(0, 21) : "Disconnected"}</p>
          </div>
        </div>

        <div className="border-[#4e5467]  border-b-2"></div>

        <div className="flex flex-row mt-[10px] gap-2 cursor-pointer">
          <TbSettings
            size="30px"
            className="border p-1 border-[#4e5467] rounded-md hover:text-yellow-200 select-none transition duration-200 ease-in-out"
          />
          <a href="https://aquari.org">
            <IoExitOutline
              size="30px"
              className="border p-1 border-[#4e5467] rounded-md cursor-pointer hover:text-yellow-200 select-none transition duration-200 ease-in-out"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default sidebar;
