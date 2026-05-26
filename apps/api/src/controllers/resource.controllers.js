const prisma = require("../utils/prisma");
const createCrudController = require("../utils/create-crud-controller");

const userController = createCrudController(prisma.user, {
  searchFields: ["name", "email", "phone", "role"],
  filterFields: ["role", "isActive"],
  beforeUpdate: async (req, payload) => {
    if ("password" in payload) {
      delete payload.password;
    }
    if ("resetPasswordToken" in payload) {
      delete payload.resetPasswordToken;
    }
    if ("resetPasswordExpire" in payload) {
      delete payload.resetPasswordExpire;
    }
    return payload;
  },
});

const alumniController = createCrudController(prisma.student, {
  searchFields: [
    "admissionNo",
    "firstName",
    "lastName",
    "email",
    "phone",
    "className",
  ],
  filterFields: ["status"],
});

// Override the list method to forcefully filter for status="alumni" or "Alumni"
const originalAlumniList = alumniController.list;
alumniController.list = require("../utils/async-handler")(async (req, res) => {
  req.query.status = "Alumni";
  return originalAlumniList(req, res);
});

const baseStudentController = createCrudController(prisma.student, {
  searchFields: [
    "admissionNo",
    "firstName",
    "lastName",
    "email",
    "phone",
    "className",
    "section",
    "parentName",
  ],
  filterFields: ["className", "section", "status", "gender"],
});

const studentController = {
  ...baseStudentController,
  create: require("../utils/async-handler")(async (req, res) => {
    const bcrypt = require("bcryptjs");
    const { firstName, lastName, email, phone, admissionNo, ...otherData } = req.body;

    const studentEmail = email || `${admissionNo}@student.learnnext.edu`;
    const defaultPassword = await bcrypt.hash(String(admissionNo), 12);

    let user = await prisma.user.findUnique({ where: { email: studentEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: studentEmail,
          password: defaultPassword,
          role: "student",
          phone: phone || null,
        }
      });
    }

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email: studentEmail,
        phone,
        admissionNo,
        ...otherData,
        userId: user.id,
      },
    });

    const sessionId = student.session;
    const structure = await prisma.feeStructure.findUnique({
      where: {
        sessionId_classId_sectionId: {
          sessionId,
          classId: student.className,
          sectionId: student.section,
        },
      },
    });

    if (structure) {
      await prisma.studentFee.create({
        data: {
          studentId: student.id,
          feeStructureId: structure.id,
          totalFee: structure.annualFee,
          dueAmount: structure.annualFee,
          status: "Due",
        },
      });
    }

    res.status(201).json(student);
  }),
};

studentController.promote = require("../utils/async-handler")(async (req, res) => {
  const { fromSession, fromClass, fromSection, toSession, toClass, toSection } = req.body;

  const students = await prisma.student.findMany({
    where: {
      session: fromSession,
      className: fromClass,
      section: fromSection,
    }
  });

  if (students.length === 0) {
    return res.status(404).json({ message: "No students found matching the criteria" });
  }

  const structure = await prisma.feeStructure.findUnique({
    where: {
      sessionId_classId_sectionId: {
        sessionId: toSession,
        classId: toClass,
        sectionId: toSection,
      },
    },
  });

  await prisma.$transaction(async (tx) => {
    // 1. Update students
    await tx.student.updateMany({
      where: {
        session: fromSession,
        className: fromClass,
        section: fromSection,
      },
      data: {
        session: toSession,
        className: toClass,
        section: toSection,
      }
    });

    // 2. Create new fee records for each student
    if (structure) {
      const newFeeRecords = students.map(student => ({
        studentId: student.id,
        feeStructureId: structure.id,
        totalFee: structure.annualFee,
        dueAmount: structure.annualFee,
        status: "Due",
      }));
      await tx.studentFee.createMany({
        data: newFeeRecords
      });
    }
  });

  res.json({ message: `Promoted ${students.length} students successfully.` });
});

const teacherController = createCrudController(prisma.teacher, {
  searchFields: [
    "employeeId",
    "firstName",
    "lastName",
    "subject",
    "department",
    "email",
  ],
  filterFields: ["status", "department", "subject"],
});

const attendanceController = createCrudController(prisma.attendance, {
  searchFields: ["className", "section", "remarks"],
  filterFields: ["status", "className", "section", "studentId"],
  include: {
    student: { select: { id: true, firstName: true, lastName: true, admissionNo: true, className: true, section: true } },
    markedBy: { select: { id: true, name: true, email: true, role: true } },
  },
  beforeCreate: async (req, payload) => ({
    ...payload,
    markedById: req.user.id,
  }),
  beforeUpdate: async (req, payload) => ({
    ...payload,
    markedById: req.user.id,
  }),
});

const feeController = createCrudController(prisma.studentFee, {
  searchFields: ["status"],
  filterFields: ["status", "studentId", "feeStructureId"],
  defaultSort: "id",
  include: {
    student: { select: { id: true, firstName: true, lastName: true, admissionNo: true, className: true, section: true } },
    feeStructure: true,
  },
});

const feePaymentController = createCrudController(prisma.feePayment, {
  searchFields: ["receiptNumber", "paymentMethod"],
  filterFields: ["paymentMethod", "studentFeeId"],
  defaultSort: "-paymentDate",
  include: {
    studentFee: {
      include: {
        student: { select: { id: true, firstName: true, lastName: true, admissionNo: true, className: true, section: true } },
        feeStructure: true,
      }
    },
  },
});

const examController = createCrudController(prisma.exam, {
  searchFields: ["title", "subject", "className", "section", "description"],
  filterFields: ["className", "section", "subject"],
});

const resultController = createCrudController(prisma.result, {
  searchFields: ["grade", "remarks"],
  filterFields: ["studentId", "examId", "grade"],
  include: {
    student: { select: { id: true, firstName: true, lastName: true, admissionNo: true, className: true, section: true } },
    exam: { select: { id: true, title: true, subject: true, className: true, section: true, date: true, totalMarks: true, passMarks: true } },
  },
});

const noticeController = createCrudController(prisma.notice, {
  searchFields: ["title", "description"],
  filterFields: ["audience", "isPinned"],
  include: {
    createdBy: { select: { id: true, name: true, email: true, role: true } },
  },
  beforeCreate: async (req, payload) => ({
    ...payload,
    createdById: req.user.id,
  }),
  beforeUpdate: async (req, payload) => ({
    ...payload,
    createdById: req.user.id,
  }),
});

const homeworkController = createCrudController(prisma.homework, {
  searchFields: ["title", "description", "className", "section", "subject"],
  filterFields: ["className", "section", "subject", "status"],
  include: {
    createdBy: { select: { id: true, name: true, email: true, role: true } },
  },
  beforeCreate: async (req, payload) => ({
    ...payload,
    createdById: req.user.id,
  }),
  beforeUpdate: async (req, payload) => ({
    ...payload,
    createdById: req.user.id,
  }),
});

const libraryController = createCrudController(prisma.library, {
  searchFields: ["catalogueCode", "title", "author", "isbn", "category", "shelf"],
  filterFields: ["status", "category"],
});

const timetableController = createCrudController(prisma.timetable, {
  searchFields: ["className", "section", "day"],
  filterFields: ["className", "section", "day"],
  include: {
    periods: {
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true, employeeId: true, subject: true } }
      }
    }
  },
});

const baseFeeStructureController = createCrudController(prisma.feeStructure, {
  searchFields: ["sessionId", "classId", "sectionId"],
  filterFields: ["sessionId", "classId", "sectionId"],
});

const feeStructureController = {
  ...baseFeeStructureController,
  create: require("../utils/async-handler")(async (req, res) => {
    const structure = await prisma.feeStructure.create({
      data: req.body,
    });

    const students = await prisma.student.findMany({
      where: { className: structure.classId, section: structure.sectionId, status: "active" },
    });

    if (students.length > 0) {
      const studentFeesData = students.map((s) => ({
        studentId: s.id,
        feeStructureId: structure.id,
        totalFee: structure.annualFee,
        dueAmount: structure.annualFee,
        status: "Due",
      }));
      await prisma.studentFee.createMany({
        data: studentFeesData,
      });
    }

    res.status(201).json(structure);
  }),
};

const communicationController = createCrudController(prisma.communication, {
  searchFields: ["title", "message", "parentName", "parentContact"],
  filterFields: ["channel", "audience", "status", "studentId"],
  include: {
    student: { select: { id: true, firstName: true, lastName: true, admissionNo: true, className: true, section: true, parentName: true, parentPhone: true } },
    sentBy: { select: { id: true, name: true, email: true, role: true } },
  },
  beforeCreate: async (req, payload) => ({
    ...payload,
    sentById: req.user.id,
    sentAt: payload.sentAt || new Date(),
  }),
  beforeUpdate: async (req, payload) => ({
    ...payload,
    sentById: req.user.id,
  }),
});

module.exports = {
  userController,
  studentController,
  teacherController,
  attendanceController,
  feeController,
  feeStructureController,
  feePaymentController,
  examController,
  resultController,
  noticeController,
  homeworkController,
  libraryController,
  timetableController,
  communicationController,
  alumniController,
};
