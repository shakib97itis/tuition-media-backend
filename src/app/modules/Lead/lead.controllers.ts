import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LeadServices } from './lead.services';


const createLead = catchAsync(async (req, res) => {
  const result = await LeadServices.createLeadIntoDB(req.body);
  sendResponse(res, status.CREATED, 'Lead created successfully!', result);
});

const getAllLeads = catchAsync(async (req, res) => {
  const { result, count } = await LeadServices.getAllLeadsFromDB(req.query);
  sendResponse(res, status.OK, 'New leads retrieved successfully!', result, count);
});

const getNewLeads = catchAsync(async (req, res) => {
  const { result, count } = await LeadServices.getNewLeadsFromBD(req.query);
  sendResponse(res, status.OK, 'New leads retrieved successfully!', result, count);
});

const getAssignedLeads = catchAsync(async (req, res) => {
  const { result, count } = await LeadServices.getAssignedLeadsFromBD(req.query);
  sendResponse(res, status.OK, 'Assigned leads retrieved successfully!', result, count);
});

const getAssignedOwnLeads = catchAsync(async (req, res) => {
  const { result, count } = await LeadServices.getAssignedOwnLeadsFromBD(
    req.params.id as string,
    req.query,
  );
  sendResponse(res, status.OK, 'Assigned own leads retrieved successfully!', result, count);
});

const makeLeadAsAssigned = catchAsync(async (req, res) => {
  const result = await LeadServices.makeLeadAsAssignedIntoDB(req.params.id as string, req.body);
  sendResponse(res, status.OK, 'Lead marked as assigned successfully!', result);
});

const updateLead = catchAsync(async (req, res) => {
  const result = await LeadServices.updateLeadIntoDB(req.params.id as string, req.body);
  sendResponse(res, status.OK, 'Lead updated successfully!', result);
});

export const LeadControllers = {
  createLead,
  getAllLeads,
  getNewLeads,
  getAssignedLeads,
  getAssignedOwnLeads,
  makeLeadAsAssigned,
  updateLead,
};
