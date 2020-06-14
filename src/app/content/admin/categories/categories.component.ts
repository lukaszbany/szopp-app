import {Component, OnInit} from '@angular/core';
import {Category} from '../../../model/category/category.model';
import {CategoryService} from '../../../service/product/category.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {CategoryEditModalComponent} from './category-edit-modal/category-edit-modal.component';
import {EditCategory} from '../../../model/category/edit.category.model';
import {CategoryAddModalComponent} from './category-add-modal/category-add-modal.component';
import {CategoryDeleteConfirmationComponent} from './category-delete-confirmation/category-delete-confirmation.component';

const activateMessage = 'Kategoria została włączona';
const deactivateMessage = 'Kategoria została wyłączona';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {

  categoryId: number;
  parentCategory: Category;
  subcategoriesOfCurrent: Category[] = [];
  allParentCategories: Category[] = [];

  categoryTree: Category[] = [];

  constructor(private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.saveCategoryId();
  }

  private loadCategories() {
    this.loadParentCategories();

    if (this.categoryId) {
      this.loadCategory();
    }
  }

  private loadParentCategories() {
    this.categoryService
      .getCategories()
      .subscribe(categories => {
        this.allParentCategories = categories;

        if (!this.categoryId) {
          this.parentCategory = null;
          this.subcategoriesOfCurrent = this.allParentCategories;
        } else {
          this.getCategoryTree();
        }
      });
  }

  private loadCategory() {
    this.categoryService
      .getCategory(this.categoryId)
      .subscribe(category => {
        this.parentCategory = category;
        this.subcategoriesOfCurrent = category.childCategories;
        this.getCategoryTree();
      });
  }

  private saveCategoryId() {
    if (this.route.snapshot.params['id']) {
      this.categoryId = this.route.snapshot.params['id'];
    }

    this.route.params
      .subscribe((params: Params) => {
        this.categoryId = params['id'];
        this.loadCategories();
      });
  }

  private getCategoryTree() {
    if (this.allParentCategories && this.allParentCategories.length > 0) {
      this.categoryTree = this.categoryService.getCategoryTree(this.categoryId, this.allParentCategories);
    }
  }

  editCategory(category: Category) {
    let availableAsParent = this.getAllCategoriesWithoutCurrent(category);
    let editCategory = this.createEditCategory(category);
    const dialogRef = this.operEditCategoryModal(editCategory, availableAsParent);

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.loadCategories();
        this.snackBar.open('Zapisano zmiany', null, {duration: 3000});
      } else {
        this.snackBar.open('Odrzucono zmiany', null, {duration: 3000});
      }
    });
  }

  private operEditCategoryModal(editCategory: EditCategory, availableAsParent: Category[]) {
    return this.dialog.open(CategoryEditModalComponent, {
      data: {category: editCategory, availableAsParent: availableAsParent},
      disableClose: true,
      height: '650px',
      width: '600px',
    });
  }

  private createEditCategory(category: Category) {
    return new EditCategory(
      category.id,
      category.name,
      category.description,
      category.parentCategoryId,
      category.active
    );
  }

  private getAllCategoriesWithoutCurrent(category: Category) {
    return this.categoryService.findAllCategoriesWithoutCurrentCategoryAndChildren(this.allParentCategories, category.id);
  }

  addCategory(proposedParent: Category) {
    let availableAsParent = this.categoryService.findAllCategoriesRecursively(this.allParentCategories);
    const dialogRef = this.openAddCategoryModal(proposedParent, availableAsParent);

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.loadCategories();
        this.snackBar.open('Zapisano zmiany', null, {duration: 3000});
      } else {
        this.snackBar.open('Odrzucono zmiany', null, {duration: 3000});
      }
    });
  }

  private openAddCategoryModal(proposedParent: Category, availableAsParent: Category[]) {
    return this.dialog.open(CategoryAddModalComponent, {
      data: {proposedParent: proposedParent, availableAsParent: availableAsParent},
      disableClose: true,
      height: '650px',
      width: '600px',
    });
  }

  setActive(category: Category, active: boolean) {
    let editCategory = this.createEditActiveField(category, active);

    this.categoryService.editCategory(editCategory)
      .subscribe(() => {
        this.loadCategories();
        this.snackBar.open(this.getActivateMessage(active), null, {duration: 3000});
      }, error => {
        this.snackBar.open(error.error.message, null, {duration: 3000});
      });

  }

  private getActivateMessage(active: boolean) {
    return active ? activateMessage : deactivateMessage;
  }

  private createEditActiveField(category: Category, active: boolean) {
    return new EditCategory(
      category.id,
      category.name,
      category.description,
      category.parentCategoryId,
      active
    );
  }

  deleteCategory(category: Category) {
    const dialogRef = this.openDeleteConfirmationModal(category);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService
          .deleteCategory(category)
          .subscribe(success => {
            this.loadCategories();
            this.snackBar.open(success.message, null, {duration: 3000});
          }, error => {
            this.snackBar.open(error.error.message, null, {duration: 3000});
          });
      }
    });

  }

  private openDeleteConfirmationModal(category: Category) {
    return this.dialog.open(CategoryDeleteConfirmationComponent, {
      data: category
    });
  }
}
