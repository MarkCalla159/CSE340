const pool = require("../database/")
/* ***************************
 *  Get Review by ID (is it a rhyme?)
 * ***************************/
async function getReviewId(review_id){
  try {
    const data = await pool.query(
      `SELECT * FROM invReview AS iv 
      WHERE iv.review_id = $1`,
      [review_id]) 
      return data.rows[0]
  }catch (error){
    //console.error("Error en addNewReview:", error);
    return error.message
  }
}
/* ***************************
 *  Add a Review (is it a rhyme?)
 * ***************************/
async function addNewReview(account_id, inv_id, review_text, review_date) {
  try {
    const data = "INSERT INTO invReview (account_id, inv_id, review_text, review_date) VALUES ($1, $2, $3, $4) RETURNING *";
    return await pool.query(data, [account_id, inv_id, review_text, review_date]);
  } catch (error) {
    //console.error("Error en addNewReview:", error);
    return error.message
  }
}
/* ***************************
 * Edit a Review (?Not a rhyme)
 * ***************************/
async function editReview(review_id, review_text, review_date) {
  try{
    const data = " UPDATE invReview SET review_text = $1, review_date = $2 WHERE review_id = $3 RETURNING *"
    const sql = await pool.query(data, [
      review_text,
      review_date,
      review_id,
    ])
    return sql.rows[0]
  } catch (error){
    return error.message
  }
}
/* ***************************
 * Get Review by ACC ID (?Not a rhyme)
 * ***************************/
async function getReviewByAccId(account_id) {
  try {
    const sql = await pool.query("SELECT * FROM invReview WHERE account_id = $1", 
      [account_id,]
    );
    return sql.rows;
  } catch (error) {
    return error.message;
  }
}
/* ***************************
 * Get Review by ACC ID (?Not a rhyme)
 * ***************************/
async function getReviewByInvId(inv_id) {
  try {
    const sql = await pool.query("SELECT * FROM invReview WHERE inv_id = $1", 
      [inv_id,]
    );
    return sql.rows;
  } catch (error) {
    return error.message;
  }
}
/* ***************************
 * Delete Review by ACC ID and review Id (?Not a rhyme)
 * ***************************/
async function deleteRev(review_id){
  try {
    const sql = 'DELETE FROM invReview WHERE review_id = $1'
    const data = await pool.query(sql, [ review_id ])
    return data
  } catch (error){
    return error.message
  }
}
module.exports = {addNewReview, getReviewId, editReview, getReviewByAccId, getReviewByInvId, deleteRev}