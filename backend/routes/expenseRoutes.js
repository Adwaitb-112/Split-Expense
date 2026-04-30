const express = require("express");
const { addExpense, getAllExpenses, getAllBalances } = require("../controllers/expenseController");

const router = express.Router();

router.post("/", addExpense);
router.get("/", getAllExpenses);
router.get("/balances", getAllBalances);

module.exports = router;