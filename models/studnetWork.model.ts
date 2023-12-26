export interface StudentWork {
  id?: string;
  createAt?: string;
  updateAt: string;
  picture?: string;
  body?: string;
  comment?: string;
  isSummited?: boolean;
  score?: number;
  studentOnAssignmentId?: string;
  status: "have-work" | "no-work";
}
