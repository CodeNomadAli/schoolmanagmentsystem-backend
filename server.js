import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import authRouter from "./routes/auth.route.js";

import validateEnv from "./validations/env.validation.js";
import userRouter from "./routes/user.route.js";
import userPortalRoute from "./routes/portal/user-portal.route.js";
import auth from "./middleware/auth.middleware.js";



import staffRoutes from "./routes/portal/staff.route.js";

import staffAuth from "./middleware/staff.middleware.js";
import staffRolesRoutes from "./routes/portal/staff-role.route.js";
import staffPermissionRoutes from "./routes/portal/staff-permission.route.js";
import uploadFileRoutes from "./routes/file.routes.js";

import askAI from "./routes/askai.route.js";
import teacherRouter from "./routes/teacher.routes.js"
import studentRouter from "./routes/student.routes.js"
import parantRouter from "./routes/parent.routes.js"
import classRouter from "./routes/class.routes.js"
import subjectRouter from "./routes/subject.routes.js"
import homeWorkRouter from "./routes/homework.routes.js"
import examRouter from "./routes/exam.routes.js"
import gradeRouter from "./routes/grade.routes.js"
import attendanceRouter from "./routes/attendance.routes.js"
import feeRouter from "./routes/fee.routes.js"
import bookRouter from "./routes/book.routes.js"
import roomRouter from "./routes/room.routes.js"
import transportRouter from "./routes/transport.routes.js"
import userProfileRouter from "./routes/user.profile.route.js"
import timeTableRouter from "./routes/timetable.routes.js"
import notificationRouter from "./routes/notification.router.js"










const app = express();

const PORTAL_ROUTE_PREFIX = "/api/v1/portal";

dotenv.config();
// parse JSON only for requests that are not file uploads
app.use(express.json({ limit: "10mb" })); // optional: increase limit if needed

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ], // Allow requests from these origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], //
    credentials: true,
  })
);

validateEnv();
connectDB();

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users", auth, userRouter);

app.use("/api/v1/ai", auth, askAI);

app.use("/api/v1/teacher", auth, teacherRouter);
app.use("/api/v1/student", auth, studentRouter);
app.use("/api/v1/parant", auth, parantRouter);
app.use("/api/v1/class", auth, classRouter);
app.use("/api/v1/subject", auth, subjectRouter);
app.use("/api/v1/homework", auth, homeWorkRouter);
app.use("/api/v1/exam", auth, examRouter);
app.use("/api/v1/grade", auth, gradeRouter);
app.use("/api/v1/attendance", auth, attendanceRouter);
app.use("/api/v1/fee", auth, feeRouter);
app.use("/api/v1/book", auth, bookRouter);
app.use("/api/v1/hostel", auth, roomRouter);
app.use("/api/v1/transport", auth, transportRouter);
app.use("/api/v1/user-profile", auth, userProfileRouter);
app.use("/api/v1/notification", auth, notificationRouter);
app.use("/api/v1/timetable", auth, timeTableRouter);












app.use(PORTAL_ROUTE_PREFIX + "/staff", staffAuth, staffRoutes);

app.use(PORTAL_ROUTE_PREFIX + "/files", uploadFileRoutes);

app.use(PORTAL_ROUTE_PREFIX + "/staff-roles", staffAuth, staffRolesRoutes);

app.use(
  PORTAL_ROUTE_PREFIX + "/staff-permissions",
  staffAuth,
  staffPermissionRoutes
);

app.use(PORTAL_ROUTE_PREFIX + "/users", staffAuth, userPortalRoute);

app.use(
  PORTAL_ROUTE_PREFIX + "/article-categories",
  staffAuth,
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
