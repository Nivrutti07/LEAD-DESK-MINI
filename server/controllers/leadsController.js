const Lead = require("../models/Lead");
const { validationResult } = require("express-validator");

const normalizeStatus = (status) => {
  const statusMap = {
    New: "New",
    Contacted: "Contacted",
    Closed: "Closed",
  };

  return statusMap[status] || "New";
};

const createLead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors.array().map((e) => ({ field: e.param, message: e.msg })),
      });
    }

    const { name, email, budget, message } = req.body;

    const lead = new Lead({
      name,
      email,
      budget,
      message,
      status: "New",
    });

    await lead.save();

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const {
      search = "",
      status = "",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;
    const sortOrder = order === "asc" ? 1 : -1;

    const [leads, totalLeads] = await Promise.all([
      Lead.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limitNumber),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalLeads / limitNumber));

    return res.status(200).json({
      success: true,
      data: {
        leads,
        totalPages,
        totalLeads,
        page: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    // Define the sequence: New -> Contacted -> Closed
    const statusSequence = ["New", "Contacted", "Closed"];
    const currentStatusIndex = statusSequence.indexOf(lead.status);
    const requestedStatusIndex = statusSequence.indexOf(status);

    // Ensure it only moves forward
    if (requestedStatusIndex !== currentStatusIndex + 1) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status transition. Status can only move forward: New -> Contacted -> Closed",
      });
    }

    lead.status = status;
    lead.updatedAt = Date.now();
    await lead.save();

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [totalLeads, newLeads, contactedLeads, closedLeads] =
      await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({ status: "New" }),
        Lead.countDocuments({ status: "Contacted" }),
        Lead.countDocuments({ status: "Closed" }),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        contactedLeads,
        closedLeads,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  getStats,
  getLeadById,
};
