import { Wishlist } from "../Model/Wishlist.schema.js";

// ==========================
// ADD TO WISHLIST
// ==========================

export const addToWishlist = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const productId = req.params.id;

    // find user wishlist
    let wishlist =
      await Wishlist.findOne({
        user: userId,
      });

    // create wishlist if not exists
    if (!wishlist) {
      wishlist =
        await Wishlist.create({
          user: userId,
          products: [productId],
        });

      return res.status(200).json({
        message:
          "Added to wishlist",
      });
    }

    // already exists
    const alreadyExists =
      wishlist.products.includes(
        productId
      );

    if (alreadyExists) {
      return res.status(400).json({
        message:
          "Product already in wishlist",
      });
    }

    // push product
    wishlist.products.push(productId);

    await wishlist.save();

    return res.status(200).json({
      message:
        "Added to wishlist successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// GET WISHLIST
// ==========================

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    }).populate("products");

    if (!wishlist) {
      return res.status(200).json({
        products: [],
      });
    }

    return res.status(200).json({
      products: wishlist.products,
    });

  } catch (error) {
    console.log("GET WISHLIST ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// REMOVE WISHLIST
// ==========================

export const removeWishlist =
  async (req, res) => {
    try {
      const wishlist =
        await Wishlist.findOne({
          user: req.user.id,
        });

      if (!wishlist) {
        return res.status(404).json({
          message:
            "Wishlist not found",
        });
      }

      wishlist.products =
        wishlist.products.filter(
          (item) =>
            item.toString() !==
            req.params.id
        );

      await wishlist.save();

      return res.status(200).json({
        message:
          "Removed from wishlist",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: error.message,
      });
    }
  };