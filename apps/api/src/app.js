const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const studentRoutes = require("./routes/students.routes");
const teacherRoutes = require("./routes/teachers.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const feeRoutes = require("./routes/fees.routes");
const feeStructuresRoutes = require("./routes/fee-structures.routes");
const paymentRoutes = require("./routes/payments.routes");
const examRoutes = require("./routes/exams.routes");
const resultRoutes = require("./routes/results.routes");
const noticeRoutes = require("./routes/notices.routes");
const homeworkRoutes = require("./routes/homework.routes");
const libraryRoutes = require("./routes/library.routes");
const timetableRoutes = require("./routes/timetable.routes");
const communicationRoutes = require("./routes/communications.routes");
const userRoutes = require("./routes/users.routes");
const admissionsRoutes = require("./routes/admissions.routes");
const hrRoutes = require("./routes/hr.routes");
const transportRoutes = require("./routes/transport.routes");
const expensesRoutes = require("./routes/expenses.routes");
const hostelRoutes = require("./routes/hostel.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const alumniRoutes = require("./routes/alumni.routes");
const uploadRoutes = require("./routes/upload.routes");
const rolesRoutes = require("./routes/roles.routes");
const schoolsRoutes = require("./routes/schools.routes");
const errorHandler = require("./middlewares/error.middleware");
const notFound = require("./middlewares/not-found.middleware");

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "LearnNext ERP API is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/fee-structures", feeStructuresRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/communications", communicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admissions", admissionsRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/hostel", hostelRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/schools", schoolsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
