import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu.js";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders?.map((o, i) => (
              <div className="card mb-4" key={o._id}>
                <div className="card-header">
                  <h5>Order #{i + 1}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p>Status:</p>
                      <Select
                        bordered={false}
                        onChange={(value) => handleChange(o._id, value)}
                        defaultValue={o?.status}
                        className="status-select"
                        size="large"
                      >
                        {status.map((s, i) => (
                          <Option key={i} value={s}>
                            {s}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="col-md-6">
                      <p>Buyer: {o?.buyer?.name}</p>
                      <p>
                        Date:{" "}
                        {moment(o?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </p>

                      {/* {i === 0
                            ? moment(o?.createdAt).subtract(1, 'day').format("YYYY-MM-DD HH:mm:ss")
                            : moment(o?.createdAt).format("YYYY-MM-DD HH:mm:ss")} */}
                      <p>
                        Payment: {o?.payment.success ? "Success" : "Failed"}
                      </p>
                      <p>Quantity: {o?.products?.length}</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="row row-cols-1 row-cols-md-2">
                    {o?.products?.map((p) => (
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

export default AdminOrders;
