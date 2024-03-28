const router = require("express").Router();
const axios = require("axios");
const { authenticateToken } = require("../controllers/loginMiddleware");
// Use the middleware on the protected route
router.get("/dashboard", authenticateToken, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    path: "/dashboard",
    user: req.user,
  });
});

router.get("/product-categories", authenticateToken, async (req, res) => {
  const loginToken = req.cookies["loginToken"];
  const API_URL = process.env.API_URL;
  if (!loginToken) {
    return res.status(401).send("Authorization token is missing");
  }
  try {
    // Fetch categories from the API
    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });

    if (response.data && response.data.length > 0) {
      const sortedCategories = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      console.log(sortedCategories);
      res.render("product-categories", {
        title: "Product Categories",
        path: "/master",
        user: req.user,
        categories: sortedCategories,
      });
    } else {
      res.render("product-categories", {
        title: "Product Categories",
        path: "/master",
        user: req.user,
        categories: [],
      });
    }
  } catch (error) {
    // Handle errors (e.g., API request failed)
    console.error("Error fetching categories:", error);
    res.status(500).send("Error fetching categories");
  }
});

router.get("/products", authenticateToken, async (req, res) => {
  const loginToken = req.cookies["loginToken"];
  const API_URL = process.env.API_URL;
  if (!loginToken) {
    return res.status(401).send("Authorization token is missing");
  }
  try {
    const response = await axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });

    let products = "";
    if (response.data && response.data.length > 0) {
      products = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    res.render("products", {
      title: "Products",
      path: "/products",
      user: req.user,
      products: products,
    });
  } catch (err) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Error fetching categories");
  }
});

router.get("/add-product", authenticateToken, async (req, res) => {
  const loginToken = req.cookies["loginToken"];
  const API_URL = process.env.API_URL;
  if (!loginToken) {
    return res.status(401).send("Authorization token is missing");
  }
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });
    let categories = [];

    if (response.data && response.data.length > 0) {
      categories = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    console.log(categories);
    console.log(API_URL);

    res.render("add-product", {
      title: "Add new product",
      path: "/add-product",
      user: req.user,
      categories: categories,
    });
  } catch (err) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Error fetching categories");
  }
});

module.exports = router;
