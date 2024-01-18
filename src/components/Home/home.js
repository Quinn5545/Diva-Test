import React, { useEffect, useState } from "react";
import "./home.css";

export default function Home() {
  const [message, setMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const [jwt, setJwt] = useState("");
  // console.log("jwt---->", jwt);
  // console.log("message--->", message);

  const checkServerStatus = async () => {
    try {
      const res = await fetch(
        "https://diva-challenge-ul4cm77qva-uc.a.run.app/alive",
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      // console.log("res--->", res.json());
      if (res.ok) {
        const data = await res.text();
        // console.log("data====>", data);
        setResponseStatus(data);
      }
    } catch (error) {
      console.error("err-->", error);
    }
  };

  const sendMessageToEngineering = async () => {
    try {
      const res = await fetch(
        "https://diva-challenge-ul4cm77qva-uc.a.run.app/slack",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ text: message }),
        }
      );

      // console.log("res---->", res);

      if (res.ok) {
        const data = await res.text();
        // console.log("data---->", data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renewJWT = async () => {
    try {
      const res = await fetch(
        "https://diva-challenge-ul4cm77qva-uc.a.run.app/login"
      );

      if (res.ok) {
        const data = await res.json();
        // console.log("jwt data--->", data.jwt);
        setJwt(data.jwt);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    renewJWT();
    setInterval(() => {
      renewJWT();
    }, 14000);
  }, []);

  return (
    <div className="container">
      <button className="checkServerStatusButton" onClick={checkServerStatus}>
        Check Server Status
      </button>
      <input
        className="inputField"
        type="text"
        value={message}
        placeholder="Message:"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="sendMessageButton" onClick={sendMessageToEngineering}>
        Send Message
      </button>
      <div className="status">Status: {responseStatus}</div>
    </div>
  );
}
