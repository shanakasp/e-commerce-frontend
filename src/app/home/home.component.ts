import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ImageProcessingService } from '../image-processing.service';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pageNumber = 0;

  productDetails = [];

  showLoadButton = false;

  constructor(private productService: ProductService,
              private imageProcessingService: ImageProcessingService,
              private router: Router) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  // tslint:disable-next-line:typedef
  searchByKeyword(searchkeyword) {
    console.log(searchkeyword);
    this.pageNumber = 0;
    this.productDetails = [];
    this.getAllProducts(searchkeyword);
  }

  // tslint:disable-next-line:typedef
  public getAllProducts(searchKey: string = '') {
    this.productService.getAllProducts(this.pageNumber, searchKey)
    .pipe(
      map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
    )
    .subscribe(
      (resp: Product[]) => {
        console.log(resp);
        // tslint:disable-next-line:triple-equals
        this.showLoadButton = resp.length == 12;
        resp.forEach(p => this.productDetails.push(p));
      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  // tslint:disable-next-line:typedef
  public loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }

  // tslint:disable-next-line:typedef
  showProductDetails(productId) {
    this.router.navigate(['/productViewDetails', {productId}]);
  }
}
