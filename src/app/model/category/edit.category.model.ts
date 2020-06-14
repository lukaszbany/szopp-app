export class EditCategory {

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public parentCategoryId: number,
    public active: boolean) {
  }

}
