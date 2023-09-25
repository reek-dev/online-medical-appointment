const { DoctorService } = require('../services/doctor.service');

exports.createDoctor = async (req, res, next) => {
  DoctorService.create(req, res, next);
};

exports.getDoctor = async (req, res, next) => {
  DoctorService.get(req, res, next);
};

exports.getAllDoctors = async (req, res, next) => {
  DoctorService.getAll(req, res, next);
};

exports.updateDoctor = async (req, res, next) => {
  DoctorService.update(req, res, next);
};

exports.deleteDoctor = async (req, res, next) => {
  DoctorService.delete(req, res, next);
};
