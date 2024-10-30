import { DateTime } from 'luxon'
import { Report as ReportPrismaModel } from '@prisma/client'
import { Report } from '~/modules/Reports/Domain/Report'

export class ReportModelTranslator {
  public static toDomain (prismaReportModel: ReportPrismaModel) {
    return new Report(
      prismaReportModel.id,
      prismaReportModel.postId,
      prismaReportModel.type,
      prismaReportModel.userIp,
      prismaReportModel.userName,
      prismaReportModel.userEmail,
      prismaReportModel.content,
      DateTime.fromJSDate(prismaReportModel.createdAt),
      DateTime.fromJSDate(prismaReportModel.updatedAt)
    )
  }

  public static toDatabase (report: Report): ReportPrismaModel {
    return {
      id: report.id,
      postId: report.postId,
      type: report.type,
      userIp: report.userIp,
      userEmail: report.userEmail,
      userName: report.userName,
      content: report.content,
      createdAt: report.createdAt.toJSDate(),
      updatedAt: report.updatedAt.toJSDate(),
    }
  }
}
