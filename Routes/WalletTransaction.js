import express from "express";

import { Authentication, Authorization } from "../Middleware/Auth.js";
import { AddMoney, DeductMoney } from "../Controller/WalletTransaction.js";


const router = express.Router();


router.post("/AddMoney", Authentication, Authorization, AddMoney);

router.post("/DeductMoney", Authentication, Authorization, DeductMoney);



export default router;
