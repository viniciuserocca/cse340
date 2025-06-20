const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" ></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildDetailsGrid = async function(data) {
  let grid = '';

  if (data && Object.keys(data).length > 0) {
    grid += '<div class="details-container">';
    grid += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" >';
    
    grid += '<div class="details-display">';
    grid += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details</h2>';
    
    grid += '<div class="info-row gray-bg"><b>Price: $' + 
      new Intl.NumberFormat('en-US').format(data.inv_price) + '</b></div>';
    
    grid += '<div class="info-row"><b>Description:</b> ' + data.inv_description + '</div>';
    
    grid += '<div class="info-row gray-bg"><b>Color:</b> ' + data.inv_color + '</div>';
    
    grid += '<div class="info-row"><b>Miles:</b> ' + 
      new Intl.NumberFormat('en-US').format(data.inv_miles) + '</div>';
    
    grid += '</div>';
    grid += '</div>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }

  return grid;
}

/* **************************************
* Build the select list for the new vehicle view HTML
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* **************************************
* Build the classification table for the new classification manage view HTML
* ************************************ */

Util.buildManageClassification = async function () {
  let data = await invModel.getClassifications()
  let classificationTable = `
    <table>
      <thead>
        <tr>
          <th>Classification</th>
        </tr>
      </thead>
      <tbody>
  `

  data.rows.forEach((row) => {
    classificationTable += `
      <tr>
        <td>${row.classification_name}</td>
        <td><a href="/inv/editClassification/${row.classification_id}">Edit</a></td>
        <td><a href="/inv/deleteClassification/${row.classification_id}">Delete</a></td>
      </tr>
    `
  })

  classificationTable += `
      </tbody>
    </table>
  `
  return classificationTable
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     req.session.save(() => {
     return res.redirect("/account/login")
     });
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    req.session.save(() => {
    return res.redirect("/account/login")
    });
  }
 }

 /* ****************************************
 *  Check Permissions
 * ************************************ */
 Util.checkPermission = (req, res, next) => {
  if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin" ) {
    next()
  } else {
    req.flash("notice", "You are not authorized to enter this page.")
    req.session.save(() => {
    return res.redirect("/account/")
    });
  }
 }

module.exports = Util