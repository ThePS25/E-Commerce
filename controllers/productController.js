import slugify from "slugify";
import productmodel from "../models/productmodel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";
import { applyCouponToOrder } from "./couponController.js";

dotenv.config();

const getCartTotal = (cart = []) =>
  cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

const saveOrder = async ({ cart, buyerId, payment, coupon }) => {
  const order = await new orderModel({
    products: cart,
    payment,
    buyer: buyerId,
  }).save();

  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }

  return order;
};

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//create product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productmodel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    //console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Creating Product",
    });
  }
};

//get all product
export const getProductController = async (req, res) => {
  try {
    const products = await productmodel
      .find({})
      .populate("category")
      .select("-photo")
      // .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All Products ",
      products,
    });
  } catch (error) {
    //console.log(error);
    res.status(500).send({
      success: false,
      message: "Errr in Getting Products",
      error: error.message,
    });
  }
};

//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productmodel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    //console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Getting Single Product",
      error,
    });
  }
};

//get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productmodel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    //console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Fetching Photo",
      error,
    });
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    await productmodel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    //console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Deleting Product",
      error,
    });
  }
};

//update product controller
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productmodel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    //console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Product Updation",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {}; // [] --> empty object 
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productmodel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    //console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productmodel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    //console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productmodel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    //console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productmodel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    //console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productmodel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    //console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productmodel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    //console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    //console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart, couponCode } = req.body;
    const total = getCartTotal(cart);

    let discount = 0;
    let coupon = null;

    if (couponCode) {
      try {
        const applied = await applyCouponToOrder(couponCode, total);
        discount = applied.discount;
        coupon = applied.coupon;
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    const chargeAmount = Math.max(0, total - discount);

    gateway.transaction.sale(
      {
        amount: chargeAmount,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (error, result) {
        if (result) {
          await saveOrder({
            cart,
            buyerId: req.user._id,
            coupon,
            payment: {
              method: "braintree",
              success: true,
              amount: chargeAmount,
              subtotal: total,
              discount,
              couponCode: coupon?.code || null,
              gateway: result,
            },
          });
          res.json({ ok: true, success: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment failed", error });
  }
};

// pay on delivery
export const codOrderController = async (req, res) => {
  try {
    const { cart, couponCode } = req.body;
    const total = getCartTotal(cart);

    let discount = 0;
    let coupon = null;

    if (couponCode) {
      try {
        const applied = await applyCouponToOrder(couponCode, total);
        discount = applied.discount;
        coupon = applied.coupon;
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    const payable = Math.max(0, total - discount);

    await saveOrder({
      cart,
      buyerId: req.user._id,
      coupon,
      payment: {
        method: "cod",
        success: false,
        pending: true,
        amount: payable,
        subtotal: total,
        discount,
        couponCode: coupon?.code || null,
      },
    });

    res.status(200).json({
      success: true,
      ok: true,
      message: "Order placed with Pay on Delivery",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not place order", error });
  }
};
