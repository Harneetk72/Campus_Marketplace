import { Order } from "../Model/Order.schema.js";
import { Product } from "../Model/product.schema.js";
import { sendEmail } from "../../utility/sendEmail.js";

export const createOrder = async (
  req,
  res
) => {

  try {

    const {
      productId,
      fullName,
      phone,
      address,
      city,
      pincode,
    } = req.body;

    // PRODUCT FIND

    const product =
      await Product.findById(productId)
        .populate("seller");

    if (!product) {

      return res.status(404).json({
        message: "Product not found",
      });

    }

    // CREATE ORDER

    const order =
      await Order.create({

        product: product._id,

        buyer: req.user.id,

        seller: product.seller._id,

        fullName,
        phone,
        address,
        city,
        pincode,

      });

    // SEND EMAIL TO SELLER

    await sendEmail(

      product.seller.email,

      "New Order Received",

      `
A new order has been placed.

Product: ${product.title}

Buyer Name: ${fullName}

Phone: ${phone}

Address: ${address}

City: ${city}

Pincode: ${pincode}
      `
    );

    return res.status(201).json({

      message:
        "Order placed successfully",

      order,

    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }

};

// GET ALL ORDERS
export const getOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("product", "title price images");

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });

  }
};


// GET SINGLE ORDER
export const getSingleOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("product", "title price images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });

  }
};