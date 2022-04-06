import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./logout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");

  async function populateQuote() {
    const req = await fetch("http://localhost:1337/api/quote", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  }


  // const handleChange =(e)=>{
  //     const { name, value } = e.target;
  //     setQuotes({
  //         ...quote,
  //         [name]: value,
  //       });
  //   }

  
  async function updateQuote(event) {
    event.preventDefault();
    console.log(tempQuote);

    const req = await fetch("http://localhost:1337/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(tempQuote);
      setTempQuote("");
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {
    const data = localStorage.getItem("token");
    if (!data) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      populateQuote();
    }
  }, []);
  return (
    <>
      <Logout />
      <form onSubmit={updateQuote}>
        <input
          type="text"
          placeholder="Quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <input type="submit" value="Update quote" />
      </form>
    </>
  );
};

export default Dashboard;
