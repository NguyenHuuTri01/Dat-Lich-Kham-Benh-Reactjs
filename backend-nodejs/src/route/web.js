import express from "express";
import homeController from "../controllers/homeControllerr";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController';
import handBookController from '../controllers/handBookController';

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDelelteUser);
  router.get("/api/allcode", userController.getAllCode);

  router.put("/api/change-password", doctorController.changePassword);
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  router.post("/api/save-infor-doctor", doctorController.postInforDoctor);
  router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
  router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
  router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
  router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
  router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
  router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
  router.post('/api/send-remedy', doctorController.sendRemedy);

  router.post('/api/patient-book-appointment', patientController.postBookAppointment);
  router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);


  router.post('/api/create-new-specialty', specialtyController.createSpecialty);
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.get("/api/get-top-specialty", specialtyController.getTopSpecialty);
  router.get("/api/get-detail-specialty-by-id", specialtyController.getDetailSpecialtyById);

  router.post('/api/create-new-clinic', clinicController.createClinic);
  router.get("/api/get-all-clinic", clinicController.getAllClinic);
  router.get("/api/top-clinic-home", clinicController.getTopClinicHome);
  router.get("/api/get-detail-clinic-by-id", clinicController.getDetailClinicById);

  router.post('/api/create-new-handbook', handBookController.createHandBook);
  router.put("/api/edit-handbook", handBookController.handleEditHandBook);
  router.delete("/api/delete-handbook", handBookController.handleDelelteHandBook);
  router.get("/api/get-all-handbook", handBookController.getAllHandBook);
  router.get("/api/get-detail-handbook-by-id", handBookController.getDetailHandBookById);

  return app.use("/", router);
};

module.exports = initWebRoutes;
