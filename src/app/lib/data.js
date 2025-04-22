const data = require("./dal/userdbutils");

////https://codeomelet.com/posts/crafting-paginated-api-with-nodejs-and-mssql
export const fetchUsers = async (q, page) => {
  try {
    const ITEM_PER_PAGE = 5;

    const users = await data.getAllUsersBySearch(q, page, ITEM_PER_PAGE);

    return users;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const GetAllRole = async () => {
  try {
    const AllRoles = await data.GetAllRole();

    return AllRoles;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const GetAllCompany = async () => {
  try {
    const AreaIds = await data.GetAllCompany();

    return AreaIds;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchProducts = async (q, page) => {
  try {
    const ITEM_PER_PAGE = 5;

    const products = await data.getAllProductsBySearch(q, page, ITEM_PER_PAGE);

    return products;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch products!");
  }
};

export const fetchUser = async (id) => {
  try {
    const user = await data.UserfindById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};

export const fetchProduct = async (id) => {
  try {
    const product = await data.ProductfindById(id);
    return product;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch product!");
  }
};

// // DUMMY DATA

export const cards = [
  {
    id: 1,
    title: "Today",
    number: 10.928,
    last: "Yesterday",
    value: 10.928,
    change: 12,
  },
  {
    id: 2,
    title: "This Week",
    number: 8.236,
    last: "Last Week",
    value: 10.928,
    change: -2,
  },
  {
    id: 3,
    title: "This Month",
    number: 6.642,
    last: "Last Month",
    value: 10.928,
    change: 18,
  },
  {
    id: 4,
    title: "This Year",
    number: 6.642,
    last: "Last Year",
    value: 10.928,
    change: 18,
  },
];

// import { Product, User } from "./models";
// import { connectToDB } from "./utils";

// export const fetchUsers = async (q, page) => {
//   const regex = new RegExp(q, "i");

//   const ITEM_PER_PAGE = 2;

//   try {
//     connectToDB();
//     const count = await User.find({ username: { $regex: regex } }).count();
//     const users = await User.find({ username: { $regex: regex } })
//       .limit(ITEM_PER_PAGE)
//       .skip(ITEM_PER_PAGE * (page - 1));
//     return { count, users };
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to fetch users!");
//   }
// };

// export const fetchUser = async (id) => {
//   console.log(id);
//   try {
//     connectToDB();
//     const user = await User.findById(id);
//     return user;
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to fetch user!");
//   }
// };

// export const fetchProducts = async (q, page) => {
//   console.log(q);
//   const regex = new RegExp(q, "i");

//   const ITEM_PER_PAGE = 2;

//   try {
//     connectToDB();
//     const count = await Product.find({ title: { $regex: regex } }).count();
//     const products = await Product.find({ title: { $regex: regex } })
//       .limit(ITEM_PER_PAGE)
//       .skip(ITEM_PER_PAGE * (page - 1));
//     return { count, products };
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to fetch products!");
//   }
// };

// export const fetchProduct = async (id) => {
//   try {
//     connectToDB();
//     const product = await Product.findById(id);
//     return product;
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to fetch product!");
//   }
// };

// // DUMMY DATA

// export const cards = [
//   {
//     id: 1,
//     title: "Total Users",
//     number: 10.928,
//     change: 12,
//   },
//   {
//     id: 2,
//     title: "Stock",
//     number: 8.236,
//     change: -2,
//   },
//   {
//     id: 3,
//     title: "Revenue",
//     number: 6.642,
//     change: 18,
//   },
// ];
