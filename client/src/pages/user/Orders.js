import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="container-fluid p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders?.map((o, i) => (
              <div className="card mb-4" key={o._id}>
                <div className="card-header">
                  <h5>Order #{i + 1}</h5>
                </div>
                <div className="card-body">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Status:</th>
                        <td>{o?.status}</td>
                      </tr>
                      <tr>
                        <th>Buyer:</th>
                        <td>{o?.buyer?.name}</td>
                      </tr>
                      <tr>
                        <th>Date:</th>
                        <td>
                          {moment(o?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                          {/* {i === 0
                            ? moment(o?.createdAt).subtract(1, 'day').format("YYYY-MM-DD HH:mm:ss")
                            : moment(o?.createdAt).format("YYYY-MM-DD HH:mm:ss")} */}
                        </td>
                      </tr>
                      <tr>
                        <th>Payment:</th>
                        <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      </tr>
                      <tr>
                        <th>Quantity:</th>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="row row-cols-1 row-cols-md-2">
                    {o?.products?.map((p, i) => (
                      <div className="col mb-4" key={p._id}>
                        <div className="card">
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                            width="100%"
                          />
                          <div className="card-body">
                            <h5 className="card-title">{p.name}</h5>
                            <p className="card-text">
                              {p.description.substring(0, 30)}
                            </p>
                            <p className="card-text">Price: {p.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
