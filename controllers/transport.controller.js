import Transport from "../models/transport.model.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE ----------------
export const addRoute = async (req, res) => {
  try {
    const { routeName, vehicleNo, driverName, capacity, assignedStudents, status } = req.body;
    const school_id = req.user.school_id;

    const existing = await Transport.findOne({ vehicleNo, school_id });
    if (existing) {
      return res
        .status(409)
        .json(apiResponse(409, null, "Vehicle already exists for this school"));
    }

    const route = await Transport.create({
      routeName,
      vehicleNo,
      driverName,
      capacity,
      assignedStudents: assignedStudents || 0,
      status,
      school_id,
    });

    return res
      .status(201)
      .json(apiResponse(201, route, "Transport route added successfully"));
  } catch (err) {
    console.error("Add transport error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ALL ----------------
export const getRoutes = async (req, res) => {
  try {
    const routes = await Transport.find({
      school_id: req.user.school_id,
    });

    return res
      .status(200)
      .json(apiResponse(200, routes, "Routes fetched successfully"));
  } catch (err) {
    console.error("Get routes error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ONE ----------------
export const getRouteById = async (req, res) => {
  try {
    const route = await Transport.findById(req.params.id);

    if (!route) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Route not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, route, "Route fetched successfully"));
  } catch (err) {
    console.error("Get route error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- UPDATE ----------------
export const updateRoute = async (req, res) => {
  try {
    const route = await Transport.findById(req.params.id);

    if (!route) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Route not found"));
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        route[key] = req.body[key];
      }
    });

    // 🔥 Auto status logic
    if (route.assignedStudents >= route.capacity) {
      route.status = "Full";
    } else if (route.assignedStudents === 0) {
      route.status = "Active";
    } else {
      route.status = "Partial";
    }

    await route.save();

    return res
      .status(200)
      .json(apiResponse(200, route, "Route updated successfully"));
  } catch (err) {
    console.error("Update route error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- DELETE ----------------
export const deleteRoute = async (req, res) => {
  try {
    const route = await Transport.findByIdAndDelete(req.params.id);

    if (!route) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Route not found"));
    }

    // await route.remove();

    return res
      .status(200)
      .json(apiResponse(200, null, "Route deleted successfully"));
  } catch (err) {
    console.error("Delete route error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};