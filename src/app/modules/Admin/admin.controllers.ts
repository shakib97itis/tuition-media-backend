import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AdminServices } from './admin.services';
import sendResponse from '../../utils/sendResponse';

const createAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.createAdminIntoDB(req.body);
  sendResponse(res, status.CREATED, 'Admin created successfully!', result);
});

const getAllAdmins = catchAsync(async (req, res) => {
  const { result, count } = await AdminServices.getAllAdminsFromDB(req.query);
  sendResponse(res, status.OK, 'Admins retrieved successfully!', result, count);
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.getSingleAdminFromDB(req.params.id as string);
  sendResponse(res, status.OK, 'Admin retrieved successfully!', result);
});

const updateAdmin = catchAsync(async (req, res) => {
  const { password, ...allowedBody } = req.body;
  const result = await AdminServices.updateAdminIntoDB(req.params.id as string, allowedBody);
  sendResponse(res, status.OK, 'Admin updated successfully!', result);
});

const deleteAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.deleteAdminFromDB(req.params.id as string);
  sendResponse(res, status.OK, 'Admin deleted successfully!', result);
});

const restoreAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.restoreAdminFromDB(req.params.id as string);
  sendResponse(res, status.OK, 'Admin restored successfully!', result);
});

export const AdminControllers = {
  createAdmin,
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  restoreAdmin,
};
