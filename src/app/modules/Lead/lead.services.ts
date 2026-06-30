import GlobalQueryBuilder from '../../queryBuilder/GlobalQuaryBuilder';
import { ILead } from './lead.interface';
import { Lead } from './lead.model';

const createLeadIntoDB = async (payload: ILead) => {
  const result = await Lead.create(payload);
  return result;
};

const getAllLeadsFromDB = async (query: Record<string, unknown>) => {
  const leadsQuery = new GlobalQueryBuilder(Lead.find(), query);
  leadsQuery.search(['name', 'contact']);
  leadsQuery.filter();
  leadsQuery.paginate();

  const result = await leadsQuery.modelQuery.populate([
    {
      path: 'assignedTo referredBy convertedBy',
      select: 'full_name email phone',
    },
    {
      path: 'followUps.doneBy',
      select: 'full_name email phone',
      model: 'Admin',
    },
  ]);

  const count = await leadsQuery.countTotal();
  return { result, count };
};

const getNewLeadsFromBD = async (query: Record<string, unknown>) => {
  const leadsQuery = new GlobalQueryBuilder(Lead.find({ status: 'new' }), query);
  leadsQuery.search(['name', 'contact']);
  leadsQuery.filter();
  leadsQuery.paginate();
  const result = await leadsQuery.modelQuery.populate([
    {
      path: 'followUps.doneBy',
      select: 'full_name email phone',
      model: 'Admin',
    },
  ]);
  const count = await leadsQuery.countTotal();
  return { result, count };
};

const getAssignedLeadsFromBD = async (query: Record<string, unknown>) => {
  const leadsQuery = new GlobalQueryBuilder(Lead.find({ status: 'assigned' }), query);
  leadsQuery.search(['name', 'contact']);
  leadsQuery.filter();
  leadsQuery.paginate();
  const result = await leadsQuery.modelQuery.populate([
    {
      path: 'assignedTo referredBy convertedBy',
      select: 'full_name email phone',
    },
    {
      path: 'followUps.doneBy',
      select: 'full_name email phone',
      model: 'Admin',
    },
  ]);
  const count = await leadsQuery.countTotal();
  return { result, count };
};

const getAssignedOwnLeadsFromBD = async (userId: string, query: Record<string, unknown>) => {
  const leadsQuery = new GlobalQueryBuilder(
    Lead.find({ status: 'assigned', assignedTo: userId }),
    query,
  );
  leadsQuery.search(['name', 'contact']);
  leadsQuery.filter();
  leadsQuery.paginate();
  const result = await leadsQuery.modelQuery.populate([
    {
      path: 'assignedTo referredBy convertedBy',
      select: 'full_name email phone',
    },
    {
      path: 'followUps.doneBy',
      select: 'full_name email phone',
      model: 'Admin',
    },
  ]);
  const count = await leadsQuery.countTotal();
  return { result, count };
};

const makeLeadAsAssignedIntoDB = async (
  id: string,
  payload: { assignedTo: string; referredBy: string },
) => {
  const result = await Lead.findByIdAndUpdate(
    id,
    { status: 'assigned', assignedTo: payload.assignedTo, referredBy: payload.referredBy },
    { new: true },
  );
  return result;
};

const updateLeadIntoDB = async (id: string, payload: Partial<ILead> & { newFollowUp?: any }) => {
  const { newFollowUp, ...otherUpdates } = payload;

  const updateOps: Record<string, any> = {
    $set: otherUpdates,
  };

  if (newFollowUp) {
    updateOps.$push = { followUps: newFollowUp };
  }

  const result = await Lead.findByIdAndUpdate(id, updateOps, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const LeadServices = {
  createLeadIntoDB,
  getAllLeadsFromDB,
  getNewLeadsFromBD,
  getAssignedLeadsFromBD,
  getAssignedOwnLeadsFromBD,
  makeLeadAsAssignedIntoDB,
  updateLeadIntoDB,
};
