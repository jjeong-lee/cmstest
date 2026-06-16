import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import { SessionGuard } from "../../common/auth/session.guard";
import { SessionUser } from "../store/cms.types";
import { ReviewsService } from "./reviews.service";

@Controller("reviews")
@UseGuards(SessionGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @Roles("admin", "reviewer", "publisher")
  listReviewTasks(@Query("status") status?: string, @Query("reviewerId") reviewerId?: string) {
    return this.reviewsService.listReviewTasks(status, reviewerId);
  }

  @Post(":reviewId/approve")
  @Roles("admin", "reviewer")
  approveReviewTask(
    @Param("reviewId") reviewId: string,
    @Body() body: { decisionNote?: string },
    @CurrentUser() user: SessionUser,
  ) {
    return this.reviewsService.approveReviewTask(reviewId, body?.decisionNote, user.id);
  }

  @Post(":reviewId/reject")
  @Roles("admin", "reviewer")
  rejectReviewTask(
    @Param("reviewId") reviewId: string,
    @Body() body: { decisionNote: string },
    @CurrentUser() user: SessionUser,
  ) {
    return this.reviewsService.rejectReviewTask(reviewId, body.decisionNote, user.id);
  }
}
