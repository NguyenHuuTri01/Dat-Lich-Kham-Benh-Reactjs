import db from "../models/index";
import CRUDservice from "../services/CRUDservice";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDservice.createNewUser(req.body);
  console.log(message);
  return res.send("post crud from server");
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDservice.getAllUser();

  return res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDservice.getUserInfoById(userId);

    return res.render("editCRUD.ejs", {
      user: userData,
    });
  } else {
    return res.send("Users not found!");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUser = await CRUDservice.updateUserData(data);
  return res.render("displayCRUD.ejs", {
    dataTable: allUser,
  });
};

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDservice.deleteUserById(id);
    let data = await CRUDservice.getAllUser();
    return res.render("displayCRUD.ejs", {
      dataTable: data,
    });
  } else {
    return res.send("User not found!");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
