export class EditProduct {

  constructor(public id: number,
              public name: string,
              public description: string,
              public shortDescription: string,
              public price: number,
              public categoryId: number,
              public inStock: number,
              public active: boolean) {
  }

}
