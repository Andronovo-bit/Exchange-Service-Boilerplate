import { Router } from "express";
import v1account from "./routes/v1/Account";

export default (): Router => {
  const app = Router();

  v1account(app);

  return app;
};