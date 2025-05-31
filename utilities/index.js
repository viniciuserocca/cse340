const invModel = require("../models/inventory-model")
const Util = {}

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
* Build the login view HTML
* ************************************ */
Util.buildLogin = async function () {
  let form = `
    <form class="login-form" method="post" action="/login">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="account_email" required>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="account_password" required
        pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"
        >
      </div>

      <div class="form-group">
        <button type="submit" class="login-btn">LOGIN</button>
      </div>

      <p class="signup-text">
        No account? <a href="/account/register">Sign-up</a>
      </p>
    </form>
  `;
  return form;
};

/* **************************************
* Build the register view HTML
* ************************************ */
Util.buildRegister = async function () {
  let form = `
    <form class="register-form" action="/account/register" method="post">
      <h2>Register</h2>

      <div class="form-group">
        <label for="firstName">First name</label>
        <input type="text" id="firstName" name="account_firstname" required>
      </div>

      <div class="form-group">
        <label for="lastName">Last name</label>
        <input type="text" id="lastName" name="account_lastname" required>
      </div>

      <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" id="email" name="account_email" required>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="account_password" 
          required
          pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"
          title="Password must be at least 12 characters long and contain at least 1 capital letter, 1 number, and 1 special character."
        >
        <span><i>Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character.</i></span> 
      </div>

      <div class="form-group">
        <button type="submit" class="register-btn">Register</button>
      </div>
    </form>
  `;
  return form;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util