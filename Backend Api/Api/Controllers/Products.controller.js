import { Product } from "../Model/product.schema.js";
import jwt from "jsonwebtoken";
//crud operations
// Create
export const CreateProducts = async (req, res, next) => {
  try {
    console.log(req.user);
    console.log(req.body);
    console.log(req.files);
    const { title, description, price, quantity, category } = req.body;
    if (!title || !description || !price || !category) {
      console.log(req.body);
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    console.log(req.user);
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    console.log(req.files);
    const images =
  req.files?.map((file) => ({
    url: file.path,
    public_id: file.filename || file.public_id,
  })) || [];
    const products = await Product.create({
      title,
      description,
      price,
      images,
      quantity,
      category,
      seller: user.id,
      college: req.user.college,
    });
    return res.status(201).json({
      message: "Product Create Sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// read
export const AllProducts = async (req, res, next) => {
  try {
    let filters = {
      inStock: true,
    };

    const token = req.cookies?.token;

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Apne products hide karo
      filters.seller = {
        $ne: decoded.id,
      };

      // Sirf apne college ke products
      filters.college = decoded.college;
    }

    const products = await Product.find(filters);

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "Products are not available",
      });
    }

    return res.status(200).json({
      products,
    });

  } catch (error) {
    console.log("ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
}; 
// read
export const MyProducts = async (req, res, next) => {
  try {
    let filter = {
      seller: req.user.id,
    };
    const products = await Product.find(filter).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const SingleProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        ).populate("seller");

      if (!product) {

        return res.status(404)
          .json({
            message:
              "Product not found",
          });

      }

      return res.status(200)
        .json({
          product,
        });

    } catch (error) {

      return res.status(500)
        .json({
          message:
            error.message,
        });

    }
  };
  export const DeleteProduct = async (
  req,
  res
) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {

      return res.status(404).json({
        message: "Product not found",
      });

    }

    // OWNER CHECK

    if (
      product.seller.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message: "Unauthorized",
      });

    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      message:
        "Product deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }

};