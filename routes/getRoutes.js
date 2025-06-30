const router = require("express").Router();
const axios = require("axios");
const { authenticateToken } = require("../controllers/loginMiddleware");
// Use the middleware on the protected route
router.get("/dashboard", authenticateToken, async (req, res, next) => {
  const loginToken = req.cookies["loginToken"];
  const API_URL = process.env.API_URL;
  if (!loginToken) {
    return res.status(401).send("Authorization token is missing");
  }
  try {
    const productCount = await axios.get(`${API_URL}/products/count`);
    const categoryCount = await axios.get(`${API_URL}/categories/count`);
    const brandCount = await axios.get(`${API_URL}/brands/count`);

    res.render("dashboard", {
      title: "Dashboard",
      path: "/dashboard",
      user: req.user,
      productCount: productCount.data,
      categoryCount: categoryCount.data,
      brandCount: brandCount.data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/product-categories", authenticateToken, async (req, res, next) => {
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
    next(error);
  }
});

router.get("/brands", authenticateToken, async (req, res, next) => {
  const loginToken = req.cookies["loginToken"];
  const API_URL = process.env.API_URL;
  const BASE_URL = process.env.BASE_URL;
  if (!loginToken) {
    return res.status(401).send("Authorization token is missing");
  }
  try {
    // Fetch categories from the API
    const response = await axios.get(`${API_URL}/brands`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });

    if (response.data && response.data.length > 0) {
      const brands = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      console.log(brands);
      res.render("brands", {
        title: "Brands",
        path: "/master",
        user: req.user,
        brands: brands,
        BASE_URL: BASE_URL,
      });
    } else {
      res.render("brands", {
        title: "Brands",
        path: "/master",
        user: req.user,
        brands: [],
      });
    }
  } catch (error) {
    console.error("Error fetching brands:", error);
    next(error);
  }
});

router.get("/products", authenticateToken, async (req, res, next) => {
  const loginToken = req.cookies["loginToken"];
  const API_URL = process.env.API_URL;
  const BASE_URL = process.env.BASE_URL;
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
      BASE_URL: BASE_URL,
    });
  } catch (err) {
    console.error("Error fetching data:", error);
    next(error);
  }
});

router.get("/add-product", authenticateToken, async (req, res, next) => {
  const loginToken = req.cookies["loginToken"];
  const API_URL = process.env.API_URL;
  if (!loginToken) {
    return res.status(401).send("Authorization token is missing");
  }
  try {
    // Assuming your API has a similar structure for brands
    const categoriesRequest = axios.get(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });

    const brandsRequest = axios.get(`${API_URL}/brands`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });

    // Use Promise.all to make both requests concurrently
    const [categoriesResponse, brandsResponse] = await Promise.all([
      categoriesRequest,
      brandsRequest,
    ]);

    let activeCategories = [];
    let activeBrands = [];

    // Filter and sort categories
    if (categoriesResponse.data && categoriesResponse.data.length > 0) {
      activeCategories = categoriesResponse.data
        .filter((category) => category.status === "active") // Filter active categories
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Filter and sort brands
    if (brandsResponse.data && brandsResponse.data.length > 0) {
      activeBrands = brandsResponse.data
        .filter((brand) => brand.status === "active") // Filter active brands
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Render the page with both active categories and active brands
    res.render("add-product", {
      title: "Add new product",
      path: "/add-product",
      user: req.user,
      categories: activeCategories, // Use active categories
      brands: activeBrands, // Use active brands
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    next(error);
  }
});

router.get("/view-product/:id", authenticateToken, async (req, res, next) => {
  const loginToken = req.cookies["loginToken"];
  const API_URL = process.env.API_URL;
  const productId = req.params.id;
  const BASE_URL = process.env.BASE_URL;
  if (!loginToken) {
    return res.status(401).send("Authorization token is missing");
  }
  try {
    // Make a GET request to the API to fetch the product by ID
    const productResponse = await axios.get(`${API_URL}/product/${productId}`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });

    // Check if the product was found
    if (!productResponse.data) {
      return res.status(404).send("Product not found");
    }

    res.render("view-product", {
      title: "product",
      product: productResponse.data,
      path: "/view-product",
      user: req.user,
      BASE_URL: BASE_URL,
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // Handle 404 error specifically if the product is not found
      console.error("Product not found:", err);
      res.status(404).send("Product not found");
    } else {
      // Handle other errors generically
      console.error("Error fetching product data:", err);
      next(error);
    }
  }
});

router.get("/update-product/:id", authenticateToken, async (req, res, next) => {
  const productId = req.params.id;
  const loginToken = req.cookies["loginToken"];
  const API_URL = process.env.API_URL;
  const BASE_URL = process.env.BASE_URL;
  if (!loginToken) {
    return res.status(401).send("Authorization token is missing");
  }
  try {
    // Make a GET request to the API to fetch the product by ID
    const productRequest = axios.get(`${API_URL}/product/${productId}`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });

    // Fetch active categories and brands
    const categoriesRequest = axios.get(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });

    const brandsRequest = axios.get(`${API_URL}/brands`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });

    // Use Promise.all to make all requests concurrently
    const [productResponse, categoriesResponse, brandsResponse] =
      await Promise.all([productRequest, categoriesRequest, brandsRequest]);

    // Check if the product was found
    if (!productResponse.data) {
      return res.status(404).send("Product not found");
    }
    console.log(productResponse.data);

    let activeCategories = [];
    let activeBrands = [];

    // Filter and sort categories
    if (categoriesResponse.data && categoriesResponse.data.length > 0) {
      activeCategories = categoriesResponse.data
        .filter((category) => category.status === "active")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Filter and sort brands
    if (brandsResponse.data && brandsResponse.data.length > 0) {
      activeBrands = brandsResponse.data
        .filter((brand) => brand.status === "active")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.render("update-product", {
      title: "Update product",
      product: productResponse.data,
      categories: activeCategories,
      brands: activeBrands,
      path: "/view-product",
      user: req.user,
      BASE_URL: BASE_URL,
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    next(err);
  }
});

module.exports = router;
