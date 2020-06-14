import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category} from '../../model/category/category.model';
import {EditCategory} from '../../model/category/edit.category.model';
import {AddCategory} from '../../model/category/add.category.model';
import {Success} from '../../model/success/success.model';

@Injectable({providedIn: 'root'})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>('/api/categories/');
  }

  getCategory(categoryId: number): Observable<Category> {
    return this.http
      .get<Category>('/api/categories/' + categoryId);
  }

  editCategory(editCategory: EditCategory): Observable<Category> {
    return this.http
      .put<Category>('/api/categories', editCategory, {observe: 'body'});

  }

  addCategory(addCategory: AddCategory): Observable<Category> {
    return this.http
      .post<Category>('/api/categories', addCategory, {observe: 'body'});
  }

  deleteCategory(category: Category): Observable<Success> {
    return this.http
      .delete<Success>('/api/categories/' + category.id);
  }

  getCategoryTree(currentCategoryId: number, allParentCategories: Category[]) {
    let allCategories = this.findAllCategoriesRecursively(allParentCategories);
    let currentCategory = this.findCategoryById(allCategories, currentCategoryId);

    let parentCategories = [];
    let category = currentCategory;

    while (category.parentCategoryId) {
      let parent = this.findCategoryById(allCategories, category.parentCategoryId);
      parentCategories.push(parent);
      category = parent;
    }

    return parentCategories.reverse().concat(currentCategory);
  }

  private findCategoryById(allCategories: Category[], categoryId: number): Category {
    return allCategories
      .find(category => category.id == categoryId);
  }

  findAllCategoriesRecursively(parentCategories: Category[]): Category[] {
    let categories: Category[] = [];
    for (let category of parentCategories) {
      let found = this.getRecursively(category);
      categories = categories.concat(found);
    }

    return categories;
  }

  private getRecursively(category: Category): Category[] {
    let categories: Category[] = [];
    categories.push(category);

    if (category.childCategories) {
      for (let child of category.childCategories) {
        let children = this.getRecursively(child);
        categories = categories.concat(children);
      }
    }

    return categories;
  }

  findAllCategoriesWithoutCurrentCategoryAndChildren(parentCategories: Category[], currentCategoryId: number): Category[] {
    let categories: Category[] = [];
    for (let category of parentCategories) {
      if (category.id !== currentCategoryId) {
        let found = this.getRecursivelyExcept(category, currentCategoryId);
        categories = categories.concat(found);
      }
    }

    return categories;
  }

  private getRecursivelyExcept(category: Category, currentCategoryId: number): Category[] {
    let categories: Category[] = [];
    categories.push(category);

    if (category.childCategories) {
      for (let child of category.childCategories) {
        if (child.id !== currentCategoryId) {
          let children = this.getRecursivelyExcept(child, currentCategoryId);
          categories = categories.concat(children);
        }
      }
    }

    return categories;
  }
}
