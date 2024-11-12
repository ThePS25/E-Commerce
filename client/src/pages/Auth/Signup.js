import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";

import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";
// import router from '../../../../routes/authRoute.js';
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  //form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/signup", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <Layout title={"SignUp"}>
      <div
        className="form-container"
        style={{ minHeight: "90vh", padding: "200px" }}
      >
        <form onSubmit={handleSubmit}>
          <h1> Sign Up</h1>
          <div className="mb-3">
            {/* <label htmlFor="exampleInputName" className="form-label">Full Name</label> */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="exampleInputName"
              placeholder="Enter Your Full Name Here"
              required
            />
          </div>

          <div className="mb-3">
            {/* <label htmlFor="exampleInputEmail" className="form-label">Email</label> */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail"
              placeholder="Enter Your Email Here"
              required
            />
          </div>

          <div className="mb-3">
            {/* <label htmlFor="exampleInputPassword1" className="form-label">Password</label> */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Password Here"
              required
            />
          </div>

          <div className="mb-3">
            {/* <label htmlFor="exampleInputPhone" className="form-label">Phone</label> */}
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              id="exampleInputPhone"
              placeholder="Enter Your Phone No. Here"
              required
            />
          </div>

          <div className="mb-3">
            {/* <label htmlFor="exampleInputAddress" className="form-label">Address</label> */}
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Address"
              required
            />
          </div>

          <div className="mb-3">
            {/* <label htmlFor="exampleInputAddress" className="form-label">What is your favourite sports?</label> */}
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="What is Your Favorite sports?"
              required
            />
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
