import axios from "../axios";

const handleLoginApi = (email, password) => {
  return axios.post("api/login", { email, password });
};
const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};
const createNewUserService = (data) => {
  return axios.post("/api/create-new-user", data);
};

const deleteUserService = (userId) => {
  return axios.delete("/api/delete-user", {
    data: {
      id: userId,
    },
  });
};
const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};
const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};
const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};
const getAllDoctors = () => {
  return axios.get(`/api/get-all-doctors`);
};

const saveDetailDoctorService = (data) => {
  return axios.post('/api/save-infor-doctor', data)
}

const getDetailInforDoctor = (inputId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
}

const saveBulkScheduleDoctor = (data) => {
  return axios.post('/api/bulk-create-schedule', data)
}
const getScheduleDoctorByDate = (doctorId, date) => {
  return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
}
const getExtraInforDoctorById = (doctorId, date) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
}
const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
}
const postPatientBookAppointment = (data) => {
  return axios.post('/api/patient-book-appointment', data)
}
const postVerifyBookAppointment = (data) => {
  return axios.post('/api/verify-book-appointment', data)
}
const createNewSpecialty = (data) => {
  return axios.post('/api/create-new-specialty', data)
}
const getAllSpecialty = () => {
  return axios.get(`/api/get-all-specialty`);
}
const getDetailSpecialtyById = (data) => {
  return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`);
}

const createNewClinic = (data) => {
  return axios.post('/api/create-new-clinic', data)
}
const getAllClinic = () => {
  return axios.get(`/api/get-all-clinic`);
}
const getTopClinicHomeService = (limit) => {
  return axios.get(`/api/top-clinic-home?limit=${limit}`);
};
const getDetailClinicById = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
}

const getAllPatientForDoctor = (data) => {
  return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
}

const postSendRemedy = (data) => {
  return axios.post('/api/send-remedy', data)
}

const createNewHandBook = (data) => {
  return axios.post('/api/create-new-handbook', data)
}
const editHandBook = (inputData) => {
  return axios.put("/api/edit-handbook", inputData);
};
const deleteHandBook = (handBookId) => {
  return axios.delete("/api/delete-handbook", {
    data: {
      id: handBookId,
    },
  });
};
const getAllHandBook = () => {
  return axios.get(`/api/get-all-handbook`);
};
const getDetailHandBookById = (id) => {
  return axios.get(`/api/get-detail-handbook-by-id?id=${id}`);
}
export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctorService,
  getDetailInforDoctor,
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  postPatientBookAppointment,
  postVerifyBookAppointment,
  createNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  createNewClinic,
  getAllClinic,
  getDetailClinicById,
  getAllPatientForDoctor,
  postSendRemedy,
  getAllHandBook,
  getTopClinicHomeService,
  createNewHandBook,
  editHandBook,
  deleteHandBook,
  getDetailHandBookById
};
