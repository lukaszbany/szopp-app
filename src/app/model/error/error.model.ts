import {ValidationError} from './validation.error.model';

export class ApiError {
  status: number;
  timestamp: string;
  message: string;
  validationErrors: ValidationError[];
}
