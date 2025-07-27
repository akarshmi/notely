import React from "react";
import "./Hero.css";

import Img1 from '../Assets/SW9GJi_8z625QTzq.png'
import Button from "./Button";
import { Link } from "react-router-dom";



const HomePage = () => {
  return (
    <div className="home-page-container">
      <div className="home-page-header">

      </div>
      <div className="home-page">
        <div className="home-left">
          <span id="welcome"><p>Welcome to</p> notely </span>
          <div>
            {/* <span>orgnize your idea,</span> */}
            <p className="gradient-text" >
              Capture ideas, stay organized, write freely—Notely is your creative thinking space.
            </p>
            <Link to="/signup">
              <Button color="#2563eb" label="Get Started" />
            </Link>
          </div>

        </div>
        <div className="home-right">
          <img src={Img1} alt="" />

        </div>
      </div>
    </div>
  );
};

export default HomePage;
