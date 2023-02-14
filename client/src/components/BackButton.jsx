import React, { useContext } from "react";
import { MarkerFilterContext } from "../providers/MarkerFilterProvider";
import "./BackButton.scss"

export default function BackButton() {
  const { setSelectedProperty } = useContext(MarkerFilterContext);

  const handleClick = () => {
    setSelectedProperty({});
  };

  return (
    <button
      className="btn btn-outline btn-back BubbleDetail_btnBack__2aeZ1"
      onClick={handleClick}
    >
      <svg height="8" width="14" className="BubbleDetail_backArrow__29V4h">
        <title>back-arrow</title>
        <path
          d="M.64 4.219L4.017.844V3.64h9.156v1.156H4.016v2.797z"
          fill="#5AB8F8"
          fillRule="evenodd"
        ></path>
      </svg>
      <span>Average Rent Price</span>
    </button>
  );
}
