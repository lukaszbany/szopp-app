export class Category {
  public id: number;
  public name: string;
  public description: string;
  public parentCategoryId: number;
  public childCategories: Category[];
  public active: boolean;
}
