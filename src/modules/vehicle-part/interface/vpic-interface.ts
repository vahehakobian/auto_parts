export interface VpicResponse {
    Count: number;
    Message: string;
    SearchCriteria: string;
    Results: Array<Record<string, string>>;
  }