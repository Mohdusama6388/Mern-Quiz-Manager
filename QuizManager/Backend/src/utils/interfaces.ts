export interface ReturnResponse {
  status: "success" | "error";
  message: string;
  data: {} | [];
}