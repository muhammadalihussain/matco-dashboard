// import mongoose from "mongoose";

// const connection = {};

// export const connectToDB = async () => {
//   try {
//     if (connection.isConnected) return;
//     const db = await mongoose.connect(process.env.MONGO);
//     connection.isConnected = db.connections[0].readyState;
//   } catch (error) {
//     console.log(error)
//     throw new Error(error);
//   }
// };

var config = require("./dbconfig");
const sql = require("mssql");

async function getUsers(storeprocedure) {
  try {
    let pool = await sql.connect(config);
    let user = await pool.request().execute(storeprocedure);
    return user.recordsets;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function findUserByEmail(email) {
  try {
    let pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("email", email)
      .execute("findUserByEmail");

    return result.recordsets[0][0];
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

//https://codeomelet.com/posts/crafting-paginated-api-with-nodejs-and-mssql

async function getAllUsersBySearch(q, page, ITEM_PER_PAGE, orderBy, orderDir) {
  try {
    let pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("page", page || 5)
      .input("size", ITEM_PER_PAGE || 2)
      .input("search", q || "")
      .input("orderBy", orderBy || "Id")
      .input("orderDir", orderDir || "DESC")
      .execute("usp_UserPagination");
    const count = result.recordsets[1][0];
    const users = {
      records: result.recordsets[0],
      filtered: count.Filtered,
      total: count.Total,
    };

    return users;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function ProductfindById(id) {
  try {
    let pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("id", id)
      .execute("ProductfindById");

    return result.recordsets[0][0];
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function UserfindById(id) {
  try {
    let pool = await sql.connect(config);

    const result = await pool.request().input("id", id).execute("UserfindById");

    return result.recordsets[0][0];
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function getAllProductsBySearch(
  q,
  page,
  ITEM_PER_PAGE,
  orderBy,
  orderDir
) {
  try {
    let pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("page", page || 5)
      .input("size", ITEM_PER_PAGE || 2)
      .input("search", q || "")
      .input("orderBy", orderBy || "Id")
      .input("orderDir", orderDir || "DESC")
      .execute("usp_ProductPagination");
    const count = result.recordsets[1][0];
    const products = {
      records: result.recordsets[0],
      filtered: count.Filtered,
      total: count.Total,
    };

    return products;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function findUserByIdAndUpdate(id, user) {
  try {
    let pool = await sql.connect(config);
    let updateUser = await pool
      .request()
      .input("id", sql.Int, id)
      .input("username", sql.NVarChar, user.username)
      .input("email", sql.NVarChar, user.email)
      .input("password", sql.NVarChar, user.password)
      .input("img", sql.NVarChar, "")
      // .input("isAdmin", sql.NVarChar, user.isAdmin)
      .input("isActive", sql.NVarChar, user.isActive)
      .input("phone", sql.NVarChar, user.phone)
      .input("address", sql.NVarChar, user.address)
      .execute("findUserByIdAndUpdate"); //storeProcedure

    return updateUser.recordsets;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function addUser(user) {
  try {
    let pool = await sql.connect(config);
    let insertUser = await pool
      .request()
      .input("username", sql.NVarChar, user.username)
      .input("email", sql.NVarChar, user.email)
      .input("password", sql.NVarChar, user.password)
      .input("img", sql.NVarChar, "")
      // .input("isAdmin", sql.NVarChar, user.isAdmin)
      .input("isActive", sql.NVarChar, user.isActive)
      .input("phone", sql.NVarChar, user.phone)
      .input("role_id", sql.NVarChar, user.RoleId)
      .input("site_Ids", sql.Int, user.siteIds)
      .input("address", sql.NVarChar, user.address)
      .execute("InsertUser"); //storeProcedure

    return insertUser.recordsets;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function deleteUser(id) {
  try {
    let pool = await sql.connect(config);
    let deleteUser = await pool
      .request()
      .input("id", sql.Int, id)
      .execute("deleteUser"); //storeProcedure

    return deleteUser.recordsets;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function findProductByIdAndUpdate(id, product) {
  try {
    let pool = await sql.connect(config);
    let updateProduct = await pool
      .request()
      .input("id", sql.Int, id)
      .input("title", sql.NVarChar, product.title)
      .input("desc", sql.NVarChar, product.desc)
      .input("price", sql.NVarChar, product.price)
      .input("stock", sql.NVarChar, product.stock)
      .input("color", sql.NVarChar, product.color)
      .input("size", sql.NVarChar, product.size)
      .execute("findProductByIdAndUpdate"); //storeProcedure

    return updateProduct.recordsets;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function addProduct(product) {
  try {
    let pool = await sql.connect(config);
    let insertProduct = await pool
      .request()
      .input("title", sql.NVarChar, product.title)
      .input("desc", sql.NVarChar, product.desc)
      .input("price", sql.NVarChar, product.price)
      .input("stock", sql.NVarChar, product.stock)
      .input("color", sql.NVarChar, product.color)
      .input("size", sql.NVarChar, product.size)

      .execute("InsertProduct"); //storeProcedure

    return insertProduct.recordsets;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function deleteProduct(id) {
  try {
    let pool = await sql.connect(config);
    let deleteProd = await pool
      .request()
      .input("id", sql.Int, id)
      .execute("deleteProduct"); //storeProcedure

    return deleteProd.recordsets;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function getAllUsers() {
  try {
    let pool = await sql.connect(config);
    let users = await pool
      .request()
      .query(
        "SELECT Id,username,email,password,img,isActive,phone,address, createdAt  from [User] "
      );

    return users.recordsets[0];
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}

async function findUsers(limit = 5, offset = 0) {
  try {
    // Connect to the database
    const pool = await sql.connect(config);

    // Execute a query
    const result = await pool
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(
        `SELECT * FROM [User] 
         ORDER BY username
         OFFSET @offset ROWS 
         FETCH FIRST @limit ROWS ONLY`
      );

    return result.recordset;
  } catch (err) {
    console.error("Error finding authors:", err);
  }
}

module.exports = {
  getUsers: getUsers,
  getAllUsers: getAllUsers,
  getAllUsersBySearch: getAllUsersBySearch,
  getAllProductsBySearch: getAllProductsBySearch,
  findUsers: findUsers,
  addUser: addUser,
  addProduct: addProduct,
  deleteProduct: deleteProduct,
  deleteUser: deleteUser,
  UserfindById: UserfindById,
  ProductfindById: ProductfindById,
  findUserByIdAndUpdate: findUserByIdAndUpdate,
  findProductByIdAndUpdate: findProductByIdAndUpdate,
  findUserByEmail: findUserByEmail,
};
