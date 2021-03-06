import React from "react";
import ReactPlayer from "react-player";
import { Waypoint } from "react-waypoint";

const Video_Module_Slice = props => {
  function fadeIn() {
    document.getElementById(props.id).classList.remove("animate");
    document.getElementById(props.id).classList.add("is--active");
  }
  function fadeOut() {
    document.getElementById(props.id).classList.add("animate");
    document.getElementById(props.id).classList.remove("is--active");
  }
  return (
    <Waypoint
      onEnter={fadeIn}
      onLeave={fadeOut}
      topOffset="-10%"
      bottomOffset="15%"
    >
      <div
        id={props.id}
        className={`animate video-player--wrap media ${
          props.style ? props.style : "media--wide"
        }`}
      >
        <ReactPlayer
          className="video-player"
          width="100%"
          height="100%"
          url={props.mediaModuleUrl}
        />
      </div>
    </Waypoint>
  );
};

export default Video_Module_Slice;
