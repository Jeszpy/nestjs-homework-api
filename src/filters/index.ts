import { HttpExceptionFilter } from './HttpExceptionFilter';
import { ErrorExceptionFilter } from './ErrorExceptionFilter';

export const globalFilters = [
  new HttpExceptionFilter(),
  // new ErrorExceptionFilter(),
];
