import { Response, NextFunction } from "express";
import { Parser } from "json2csv";
import Lead from "../models/Lead";
import { AuthRequest, LeadStatus, LeadSource, SortOrder } from "../types";
import { AppError } from "../middleware/errorHandler";

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "10",
      status,
      source,
      search,
      sort = "latest",
    } = req.query as {
      page?: string;
      limit?: string;
      status?: LeadStatus;
      source?: LeadSource;
      search?: string;
      sort?: SortOrder;
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};

    // Role-based filtering: sales users see only their leads
    if (req.user?.role === "sales") {
      filter.createdBy = req.user.id;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

    const [leads, totalCount] = await Promise.all([
      Lead.find(filter)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      message: "Leads retrieved successfully",
      data: { leads },
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    // Sales users can only view their own leads
    if (
      req.user?.role === "sales" &&
      lead.createdBy._id.toString() !== req.user.id
    ) {
      throw new AppError("Access denied", 403);
    }

    res.status(200).json({
      success: true,
      message: "Lead retrieved successfully",
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, status, source, notes, assignedTo } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || "New",
      source,
      notes,
      assignedTo: assignedTo || null,
      createdBy: req.user?.id,
    });

    await lead.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    // Sales users can only update their own leads
    if (
      req.user?.role === "sales" &&
      lead.createdBy.toString() !== req.user.id
    ) {
      throw new AppError(
        "Access denied. You can only update your own leads.",
        403,
      );
    }

    const allowedFields = [
      "name",
      "email",
      "status",
      "source",
      "notes",
      "assignedTo",
    ];
    const updates: Record<string, unknown> = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: { lead: updatedLead },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    // Sales users can only delete their own leads
    if (
      req.user?.role === "sales" &&
      lead.createdBy.toString() !== req.user.id
    ) {
      throw new AppError(
        "Access denied. You can only delete your own leads.",
        403,
      );
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = "latest",
    } = req.query as {
      status?: LeadStatus;
      source?: LeadSource;
      search?: string;
      sort?: SortOrder;
    };

    const filter: Record<string, unknown> = {};

    if (req.user?.role === "sales") {
      filter.createdBy = req.user.id;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

    const leads = await Lead.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: sortOrder })
      .lean();

    const csvFields = [
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Status", value: "status" },
      { label: "Source", value: "source" },
      { label: "Notes", value: "notes" },
      { label: "Created At", value: "createdAt" },
    ];

    const parser = new Parser({ fields: csvFields });
    const csv = parser.parse(leads);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="leads-export-${new Date().toISOString().split("T")[0]}.csv"`,
    );

    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const getLeadStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user?.role === "sales") {
      filter.createdBy = req.user.id;
    }

    const [statusStats, sourceStats, totalCount] = await Promise.all([
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: "$source", count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(filter),
    ]);

    const byStatus: Record<string, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Lost: 0,
    };
    statusStats.forEach((s: { _id: string; count: number }) => {
      byStatus[s._id] = s.count;
    });

    const bySource: Record<string, number> = {
      Website: 0,
      Instagram: 0,
      Referral: 0,
    };
    sourceStats.forEach((s: { _id: string; count: number }) => {
      bySource[s._id] = s.count;
    });

    res.status(200).json({
      success: true,
      message: "Lead stats retrieved",
      data: {
        totalCount,
        byStatus,
        bySource,
      },
    });
  } catch (error) {
    next(error);
  }
};
