import React, {
  useEffect,
  useState,
} from "react";

import apiClient from "../api/apiClient";

const OrdersPage = () => {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH ORDERS
  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const response =
          await apiClient.get(
            "/order/"
          );

        setOrders(
          response.data.orders   || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    fetchOrders();

  }, []);

  if (loading) {

    return (
      <div className="orders-loading">
        Loading Orders...
      </div>
    );
  }

  return (

    <div className="orders-page">

      <div className="orders-header">

        <h1>
          My Orders
        </h1>

        <p>
          All placed orders
        </p>

      </div>

      {
        orders.length > 0 ? (

          <div className="orders-grid">

            {
              orders.map((order) => (

                <div
                  key={order._id}
                  className="order-card"
                >

                  <div className="order-top">

                    <img
                      src={
                        order.product?.images?.[0]
                          ?.url
                      }
                      alt="product"
                      className="order-image"
                    />

                    <div className="order-product-info">

                      <h2>
                        {
                          order.product
                            ?.title
                        }
                      </h2>

                      <p>
                        ₹{
                          order.product
                            ?.price
                        }
                      </p>

                    </div>

                  </div>

                  <div className="order-details">

                    <div>
                      <span>
                        Full Name
                      </span>

                      <p>
                        {
                          order.fullName
                        }
                      </p>
                    </div>

                    <div>
                      <span>
                        Phone
                      </span>

                      <p>
                        {order.phone}
                      </p>
                    </div>

                    <div>
                      <span>
                        Address
                      </span>

                      <p>
                        {
                          order.address
                        }
                        , {order.city}
                      </p>
                    </div>

                    <div>
                      <span>
                        Pincode
                      </span>

                      <p>
                        {
                          order.pincode
                        }
                      </p>
                    </div>

                  </div>

                  <div className="order-footer">

                    <span className="order-status">
                      Order Placed
                    </span>

                  </div>

                </div>

              ))
            }

          </div>

        ) : (

          <div className="no-orders">
            No Orders Found
          </div>

        )
      }

    </div>
  );
};

export default OrdersPage;