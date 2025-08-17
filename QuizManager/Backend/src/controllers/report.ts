import Report from "../models/report";
import ProjectError from "../helper/error";
import { Request,Response,NextFunction} from 'express'
import {ReturnResponse} from "../utils/interfaces"
const getReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    let reportData;

    if (reportId) {
      const report = await Report.findById(reportId);

      if (!report) {
        throw Object.assign(new ProjectError("Report not found"), { statusCode: 404 });
      }

      if (report.userId.toString() !== req.userId) {
        throw Object.assign(new ProjectError("You are not allowed"), { statusCode: 403 });
      }

      reportData = report;
    } else {
      const reports = await Report.find({ userId: req.userId });
      if (!reports.length) {
        throw Object.assign(new ProjectError("No reports found"), { statusCode: 404 });
      }
      reportData = reports;
    }

    const resp: ReturnResponse = {
      status: "success",
      message: "Report retrieved successfully",
      data: reportData
    };

    res.json(resp);
  } catch (error) {
    next(error);
  }
};
export {getReport};
