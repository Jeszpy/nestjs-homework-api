import { CommentsWithoutPostIdType } from '../types/comments';
import { BloggerType } from '../types/bloggers';
import { PostType } from '../types/posts';
import { UserIdAndLoginType } from '../types/user';

type items =
  | BloggerType[]
  | PostType[]
  | UserIdAndLoginType[]
  | CommentsWithoutPostIdType[];

export type PaginationResultType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: items;
};

export const pagination = (
  pageNumber: number,
  pageSize: number,
  totalCount: any,
  items: items,
): PaginationResultType => {
  const pagesCount = Math.ceil(totalCount / pageSize);
  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items,
  };
};
