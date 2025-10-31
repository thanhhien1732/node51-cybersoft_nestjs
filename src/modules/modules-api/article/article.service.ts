import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { QueryArticleDto } from './dto/query-article.dto';

@Injectable()
export class ArticleService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(query: QueryArticleDto) {
        let { page, pageSize, filters: filtersStringJson } = query;

        page = +page > 0 ? +page : 1;
        pageSize = +pageSize > 0 ? +pageSize : 1;

        const filters = JSON.parse(filtersStringJson || '{}') || {};

        const index = (page - 1) * pageSize;

        // lọc lại filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                delete filters[key];
                return;
            }

            if (typeof value === 'string') {
                filters[key] = {
                    contains: value,
                };
            }
        });

        const articlesPromise = this.prisma.articles.findMany({
            skip: index,

            take: pageSize,

            where: {
                ...filters,
                isDeleted: false,
            },
        });

        const totalItemPromise = this.prisma.articles.count();

        const [articles, totalItem] = await Promise.all([
            articlesPromise,
            totalItemPromise,
        ]);

        const totalPage = Math.ceil(totalItem / pageSize);

        return {
            page,
            pageSize,
            totalItem: totalItem,
            totalPage: totalPage,
            items: articles || [],
        };
    }
}
