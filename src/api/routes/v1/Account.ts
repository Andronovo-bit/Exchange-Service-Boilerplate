import { Router } from "express";
import { findUserByEmail } from "../../../controller/AccountController"; // Ensure the casing matches the actual file name

const router = Router();

export default (app: Router): void => {
    app.use('/v1/account', router);
    router.get('/findUserByEmail', findUserByEmail);
};