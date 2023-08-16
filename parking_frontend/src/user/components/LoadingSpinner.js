import React from "react";

import "./LoadingSpinner.css";

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
      <div class="custom-loader"></div>
    </div>
  );
};

export default LoadingSpinner;
