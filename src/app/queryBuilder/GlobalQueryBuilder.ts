import { Query } from 'mongoose';

/**
 * A generic utility builder to chain and execute clean query modifiers
 * such as searching, filtering, pagination, and projection on Mongoose queries.
 */
class GlobalQueryBuilder<T> {
  // The operational Mongoose query chain instance
  public modelQuery: Query<T[], T>;
  // The raw incoming request query parameter map (req.query)
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    // Automatically apply a default descending sort by modification date
    this.modelQuery = modelQuery.sort('-updatedAt');
    this.query = query;
  }

  /**
   * Performs a case-insensitive regular expression partial text match
   * across multiple designated target schema paths using a logical $or block.
   * @param searchableFields Array of document field paths to search across
   * Example:
   */
  search(searchableFields: string[]) {
    const search = this?.query?.search as string;

    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        })),
      });
    }
    return this;
  }

  /**
   * Performs an exact-match equality check for all incoming payload criteria.
   * Automatically sanitizes and drops functional pipeline commands from direct matches.
   * Example:
   */
  filter() {
    const queryObj = { ...this.query };

    // Explicitly exclude internal block controllers from getting treated as schema filter targets
    const excludeFields = ['search', 'limit', 'page', 'fields', 'month', 'date'];
    excludeFields.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj);
    return this;
  }

  /**
   * Targets and isolates documents that match a specific creation month and year bounds.
   * Uses native database engine date conversion aggregation expressions.
   * Example:
   */
  monthFilter() {
    const { month } = this?.query;

    if (month) {
      const date = new Date(month as string);
      const year = date.getUTCFullYear();
      // JavaScript months are 0-indexed, while database query expressions use 1-indexed values
      const monthIndex = date.getUTCMonth() + 1;

      this.modelQuery = this.modelQuery.find({
        $expr: {
          $and: [
            { $eq: [{ $year: '$createdAt' }, year] },
            { $eq: [{ $month: '$createdAt' }, monthIndex] },
          ],
        },
      });
    }
    return this;
  }

  /**
   * Applies skipping and cursor slicing pagination offsets across the document match tree.
   * Example:
   */
  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  /**
   * Configures visual projection selections (hides or explicitly includes keys separated by commas)
   * Example query structure: ?fields=title,salary,location
   */
  fields() {
    const fields = (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  /**
   * Extracts and reads total match patterns ignoring pagination skip and slice boundaries.
   * Essential for feeding counts to frontend pagination components.
   */
  async countTotal() {
    // Pull the active state dictionary containing filters evaluated up to this execution point
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    return total;
  }
}

export default GlobalQueryBuilder;
