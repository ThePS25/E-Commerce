import React from "react";
import Layout from "./../../components/Layout/Layout";

import { useAuth } from "../../context/auth";
import UserMenu from "../../components/Layout/UserMenu";
const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"Dashboard-zoophii"}>
      <div className="container-fluid p-10 m-5" style={{ padding: "100px" }}>
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>{auth?.user?.name}</h3>
              <h3>{auth?.user?.email}</h3>
              <h3>{auth?.user?.address}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
