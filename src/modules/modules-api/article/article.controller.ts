import { Body, Controller, Get, Headers, Param, Query, Req, Res } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { QueryArticleDto } from "./dto/query-article.dto";
import { Public } from "src/common/decorators/public.decorator";
import { User } from "src/common/decorators/user.decorator";
import type { Users } from "generated/prisma";  // thêm type
import { SkipPermission } from "src/common/decorators/skip-permission.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("article")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }

    @Get()
    // @Public()
    @SkipPermission()
    @ApiBearerAuth()
    async findAll(
        @Query()
        query: QueryArticleDto,

        @Param()
        param,

        @Headers("content-type")
        headers,

        @Body()
        body,

        @Req()
        req,

        // @Res()
        // res

        @User()
        user: Users,
    ) {
        // console.log({ query, param, headers, body });
        console.log({ user: user });
        return await this.articleService.findAll(query);
    }

}