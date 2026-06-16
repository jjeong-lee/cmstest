import { Controller, Get, UseGuards } from "@nestjs/common";
import { SessionGuard } from "../../common/auth/session.guard";
import { RolesGuard } from "../../common/auth/roles.guard";
import { ContentTypesService } from "./content-types.service";

@Controller("content-types")
@UseGuards(SessionGuard, RolesGuard)
export class ContentTypesController {
  constructor(private readonly contentTypesService: ContentTypesService) {}

  @Get()
  listContentTypes() {
    return this.contentTypesService.listContentTypes();
  }
}
