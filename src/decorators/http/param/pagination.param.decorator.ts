import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const defaultPageNumber = 1;
const defaultPageSize = 10;
const defaultSearchNameTerm = null;

export const Pagination = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    let pageNumber: any = request.query.PageNumber;
    let pageSize: any = request.query.PageSize;
    let searchNameTerm: any = request.query.SearchNameTerm;
    if (!pageNumber) {
      pageNumber = defaultPageNumber;
    } else {
      try {
        pageNumber = +pageNumber;
        if (pageNumber <= 0) {
          pageNumber = defaultPageNumber;
        }
        if (isNaN(pageNumber)) {
          pageNumber = defaultPageNumber;
        }
      } catch (e) {
        pageNumber = defaultPageNumber;
      }
    }
    if (!pageSize) {
      pageSize = defaultPageSize;
    } else {
      try {
        pageSize = +pageSize;
        if (pageSize <= 0) {
          pageSize = defaultPageSize;
        }
        if (isNaN(pageSize)) {
          pageSize = defaultPageSize;
        }
      } catch (e) {
        pageSize = defaultPageSize;
      }
    }
    if (!searchNameTerm) {
      searchNameTerm = defaultSearchNameTerm;
    }
    return { pageNumber, pageSize, searchNameTerm };
  },
);
