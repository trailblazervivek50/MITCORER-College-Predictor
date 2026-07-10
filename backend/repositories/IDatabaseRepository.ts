import { CutoffRecord } from "../models/CutoffRecord";

export interface IDatabaseRepository {
  /**
   * Loads the database into memory.
   */
  loadData(): Promise<void>;

  /**
   * Search for records matching the specific criteria.
   * If a field is undefined, it is ignored in the search.
   */
  search(criteria: {
    category?: string;
    branch?: string;
    minPercentile?: number;
  }): Promise<CutoffRecord[]>;

  /**
   * Returns all cached records.
   */
  getAllRecords(): CutoffRecord[];
}
