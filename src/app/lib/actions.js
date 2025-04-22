"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

const data = require("../lib/dal/userdbutils");

export const addUser = async (formData) => {
  let redirectPath = null;
  const {
    username,
    email,
    password,
    phone,
    address,
    isActive,
    role_Id,
    sitesIds,
  } = Object.fromEntries(formData);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = {
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isActive,
      sitesIds,
      role_Id,
    };

    const adduser = await data.addUser(newUser);

    if (adduser[0][0][""] === "Email Exists") {
      console.log("Email Exists");
    } else {
      redirectPath = `/dashboard/users`;
      // revalidatePath("/dashboard/users");
      // redirect("/dashboard/users");
    }
  } catch (err) {
    redirectPath = `/dashboard/users`;
    console.log(err);
  } finally {
    //Clear resources
    if (redirectPath) redirect(redirectPath);
  }
};

export const addProduct = async (formData) => {
  let redirectPath = null;
  const { title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    const newProduct = {
      title,
      desc,
      price,
      stock,
      color,
      size,
    };

    const adduser = await data.addProduct(newProduct);

    if (adduser[0][0][""] === "Product Already Exists") {
      console.log("Email Exists");
    } else {
      redirectPath = `/dashboard/products`;
      // revalidatePath("/dashboard/users");
      // redirect("/dashboard/users");
    }
  } catch (err) {
    redirectPath = `/dashboard/products`;
    console.log(err);
  } finally {
    //Clear resources
    if (redirectPath) redirect(redirectPath);
  }
};

export const deleteUser = async (formData) => {
  try {
    const { id } = Object.fromEntries(formData);

    const user = await data.deleteUser(id);

    if (user[0][0][""] === "User not found") {
      console.log("User not found");
    } else {
      revalidatePath("/dashboard/users");
    }
  } catch (err) {
    revalidatePath("/dashboard/users");
    console.log(err);
  } finally {
    revalidatePath("/dashboard/users");
  }
};

export const deleteProduct = async (formData) => {
  try {
    const { id } = Object.fromEntries(formData);

    const product = await data.deleteProduct(id);

    if (product[0][0][""] === "Product not found") {
      console.log("Product not found");
    } else {
      revalidatePath("/dashboard/products");
    }
  } catch (err) {
    revalidatePath("/dashboard/products");
    console.log(err);
  } finally {
    revalidatePath("/dashboard/products");
  }
};

export const updateUser = async (formData) => {
  let redirectPath = "/dashboard/users";
  const {
    id,
    username,
    email,
    password,
    phone,
    address,
    isAdmin,
    isActive,
    role_Id,
    sitesIds,
    oldpassword,
  } = Object.fromEntries(formData);

  let newpassword;

  const salt = await bcrypt.genSalt(10);
  const isPasswordValid = await bcrypt.compare(oldpassword, password);
  if (isPasswordValid) {
    newpassword = oldpassword;
  } else {
    // 3. Hash and update the new password

    newpassword = await bcrypt.hash(password, salt);
  }

  try {
    const updateFields = {
      username,
      email,
      newpassword,
      phone,
      address,
      isAdmin,
      isActive,
      role_Id,
      sitesIds,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    const updateUser = await data.findUserByIdAndUpdate(id, updateFields);

    if (updateUser[0][0][""] === "User does not exists") {
      console.log("User does not exists");
    } else {
      redirectPath = `/dashboard/users`;
    }
  } catch (err) {
    redirectPath = `/dashboard/users`;
    console.log(err);
  } finally {
    //Clear resources
    if (redirectPath) redirect(redirectPath);
  }
};

export const updateProduct = async (formData) => {
  let redirectPath = "/dashboard/products";
  const { id, title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    const updateFields = {
      title,
      desc,
      price,
      stock,
      color,
      size,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    const updateProduct = await data.findProductByIdAndUpdate(id, updateFields);

    if (updateProduct[0][0][""] === "Product does not exists") {
      console.log("Product does not exists");
    } else {
      redirectPath = `/dashboard/products`;
    }
  } catch (err) {
    redirectPath = `/dashboard/products`;
    console.log(err);
  } finally {
    //Clear resources
    if (redirectPath) redirect(redirectPath);
  }
};

export const getDataAreaId = async () => {
  try {
    const getAllCompany = await data.GetAllCompany();
    return getAllCompany[0][0];
  } catch (err) {
  } finally {
    //Clear resources
  }
};
