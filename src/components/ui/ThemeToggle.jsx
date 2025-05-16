// ThemeToggle.jsx — Hydration-safe Version with Dynamic Visuals and State-based Randomization

import React, { useEffect, useState } from "react";
import "./ThemeToggle.css";

const getRandom = (min, max) => Math.random() * (max - min) + min;

const ThemeToggle = () => {
  const [stars, setStars] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [moonSpots, setMoonSpots] = useState([]);
  const [dayClouds, setDayClouds] = useState([]);
  const [nightClouds, setNightClouds] = useState([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 30 + Math.floor(Math.random() * 10) }).map(() => ({
        top: getRandom(0, 100),
        left: getRandom(0, 100),
        width: getRandom(1, 3),
        height: getRandom(1, 3),
        delay: getRandom(0, 2),
      }))
    );

    setLeaves(
      Array.from({ length: 20 + Math.floor(Math.random() * 10) }).map(() => ({
        color: ["#e67e22", "#d35400", "#c0392b", "#a04000", "#f39c12"][
          Math.floor(Math.random() * 5)
        ],
        left: getRandom(0, 100),
        delay: getRandom(0, 5),
        duration: getRandom(4, 8),
        scale: getRandom(0.4, 1.2),
        rotate: getRandom(0, 360),
        skewX: getRandom(-20, 20),
        skewY: getRandom(-20, 20),
      }))
    );

    setMoonSpots(
      Array.from({ length: 5 + Math.floor(Math.random() * 4) }).map(() => ({
        size: getRandom(2, 6),
        top: getRandom(5, 25),
        left: getRandom(5, 25),
        opacity: getRandom(0.2, 0.7),
      }))
    );

    setDayClouds(
      [0, 1].map(() => ({
        top: getRandom(5, 25),
        left: getRandom(0, 60),
        scale: getRandom(0.7, 1.2),
        duration: getRandom(20, 40),
      }))
    );

    setNightClouds(
      [0, 1, 2].map(() => ({
        top: getRandom(10, 40),
        left: getRandom(0, 70),
        scale: getRandom(0.5, 1.1),
        duration: getRandom(30, 50),
      }))
    );
  }, []);

  return (
    <label className="theme-toggle-button">
      <input type="checkbox" id="theme-checkbox" />
      <div className="switch-body">
        <div className="slider">
          <div className="sun"></div>
          <div className="moon">
            {moonSpots.map((spot, i) => (
              <div
                key={i}
                className="moon-spot"
                style={{
                  width: `${spot.size}px`,
                  height: `${spot.size}px`,
                  top: `${spot.top}px`,
                  left: `${spot.left}px`,
                  opacity: spot.opacity,
                }}
              />
            ))}
          </div>
        </div>

        {/* ☁️ DAY CLOUDS */}
        <div className="day-clouds">
          {dayClouds.map((cloud, i) => (
            <svg
              key={i}
              className="cloud day"
              viewBox="0 0 100 100"
              style={{
                top: `${cloud.top}px`,
                left: `${cloud.left}px`,
                transform: `scale(${cloud.scale})`,
                animationDuration: `${cloud.duration}s`,
              }}
            >
              <path d="M30,45 Q35,25 50,25 Q65,25 70,45 Q80,45 85,50 Q90,55 85,60 Q80,65 75,60 Q65,60 60,65 Q55,70 50,65 Q45,70 40,65 Q35,60 25,60 Q20,65 15,60 Q10,55 15,50 Q20,45 30,45" />
            </svg>
          ))}
        </div>

        {/* 🍁 LEAVES */}
        <div className="falling-leaves">
          {leaves.map((leaf, i) => (
            <div
              key={i}
              className="leaf"
              style={{
                left: `${leaf.left}%`,
                animationDelay: `${leaf.delay}s`,
                animationDuration: `${leaf.duration}s`,
                background: leaf.color,
                transform: `
                  scale(${leaf.scale})
                  rotate(${leaf.rotate}deg)
                  skew(${leaf.skewX}deg, ${leaf.skewY}deg)
                `,
              }}
            ></div>
          ))}
        </div>

        {/* 🌌 STARS */}
        <div className="stars">
          {stars.map((star, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.width}px`,
                height: `${star.height}px`,
                animationDelay: `${star.delay}s`,
              }}
            ></div>
          ))}
        </div>

        {/* 🌈 AURORA */}
        <div className="aurora"></div>

        {/* ☄️ COMETS (STATIC FOR NOW) */}
        <div className="comets">
          {[0, 1].map((_, i) => (
            <div key={i} className={`comet comet${i + 1}`}></div>
          ))}
        </div>

        {/* ☁️ NIGHT CLOUDS */}
        <div className="night-clouds">
          {nightClouds.map((cloud, i) => (
            <svg
              key={i}
              className="cloud night"
              viewBox="0 0 100 100"
              style={{
                top: `${cloud.top}px`,
                left: `${cloud.left}px`,
                transform: `scale(${cloud.scale})`,
                animationDuration: `${cloud.duration}s`,
              }}
            >
              <path d="M30,45 Q35,25 50,25 Q65,25 70,45 Q80,45 85,50 Q90,55 85,60 Q80,65 75,60 Q65,60 60,65 Q55,70 50,65 Q45,70 40,65 Q35,60 25,60 Q20,65 15,60 Q10,55 15,50 Q20,45 30,45" />
            </svg>
          ))}
        </div>
      </div>
    </label>
  );
};

export default ThemeToggle;
