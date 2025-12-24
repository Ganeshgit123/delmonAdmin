export interface ApiResponse<T = unknown> {
  error: boolean;
  message: string;
  data: T;
}
