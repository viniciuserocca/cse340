const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory AS i 
      JOIN classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

/* ***************************
 *  Get specific inventory item details
 * ************************** */
async function getItemDetails(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getItemDetails error " + error)
  }
}

/* ***************************
 *  Get specific classification item details
 * ************************** */
async function getClassificationDetails(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM classification
      WHERE classification_id = $1`,
      [classification_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getClassificationDetails error " + error)
  }
}

/* ***************************
 *  New Classification Validation and INSERT
 * ************************** */

async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE LOWER(classification_name) = LOWER($1)"
    const result = await pool.query(sql, [classification_name])
    return result.rowCount > 0
  } catch (error) {
    console.error("checkExistingClassification error", error)
    return false
  }
}

async function addNewClassification(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO classification (classification_name) VALUES ($1) RETURNING *`,
      [classification_name]
    )
    return data.rows[0]
  } catch (error) {
    console.error("addNewClassification error " + error)
    return null
  }
}

async function addNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql =`INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`

    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id
  ])

  } catch (error) {
    console.error("addNewInventory error " + error)
    return null
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
  try {
    const sql = `UPDATE inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *`
    
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])

    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
 async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateClassification(classification_name, classification_id) {
  try {
    const sql = `UPDATE classification SET classification_name = $1 WHERE classification_id = $2 RETURNING *`
    
    const data = await pool.query(sql, [
      classification_name,
      classification_id
    ])

    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
 async function deleteClassification(classification_id) {
  try {
    const sql = 'DELETE FROM classification WHERE classification_id = $1'
    const data = await pool.query(sql, [classification_id])
  return data
  } catch (error) {
    new Error("Delete Classification Error")
  }
}

async function checkExistingInventory(classification_id) {
  try {
    const data = await pool.query(
      `SELECT 1 FROM inventory WHERE classification_id = $1 LIMIT 1`,
      [classification_id]
    )
    return data.rows.length > 0
  } catch (error) {
    console.error("checkExistingInventory error: " + error)
    throw error
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getItemDetails,
  addNewClassification,
  checkExistingClassification,
  addNewInventory,
  updateInventory,
  deleteInventory,
  getClassificationDetails,
  updateClassification,
  deleteClassification,
  checkExistingInventory
}