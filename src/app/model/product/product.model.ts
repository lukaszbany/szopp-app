import {Image} from './image.model';

export class Product {
  public id: number;
  public name: string;
  public description: string;
  public shortDescription: string;
  public price: number;
  public categoryId: number;
  public inStock: number;
  public images: Image[];
  public active: boolean;
}
