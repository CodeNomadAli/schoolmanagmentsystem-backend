import express from "express";
import {
  addRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} from "../controllers/transport.controller.js";

import optionalAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, addRoute);

router.get("/", optionalAuth, getRoutes);
router.get("/:id", optionalAuth, getRouteById);

router.put("/:id", optionalAuth, updateRoute);
router.delete("/:id", optionalAuth, deleteRoute);

export default router;