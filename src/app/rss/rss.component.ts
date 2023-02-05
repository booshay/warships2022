import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { DataService } from '../data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.css']
})
export class RssComponent implements OnInit, AfterViewInit {

  inputForm: FormGroup;
  nearbyForm: FormGroup;
  public displayedColumns = ['base', 'x', 'y', 'sector', 'delete'];
  public dataSource = new MatTableDataSource<any>();
  user: {};
  constructor(public router: Router, private fb: FormBuilder, public dataService: DataService,
    public auth: AuthService, private messageService: MessageService) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('nameRef', { static: false }) nameElementRef: ElementRef;

  ngAfterViewInit() {
    this.nameElementRef.nativeElement.focus();
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.auth.user.subscribe(data => {
      this.user = data;
      this.dataService.getData('rss', this.user)
        .subscribe(rss => {
          this.dataSource.data = rss;
          this.dataSource.sort = this.sort;
        });
    });

    this.inputForm = this.fb.group({
      base: null,
      x: null,
      y: null,
      sector: null
    });

    this.nearbyForm = this.fb.group({
      x: null,
      y: null,
      distance: null
    });

    document.getElementById('inputBase').focus();
  }

  addRss() {
    const formValue = this.inputForm.value;
    if (this.validCoords(formValue)) {
      for (let i = 0; i < this.dataSource.data.length; i++) {
        if (this.dataSource.data[i].x === formValue.x && this.dataSource.data[i].y === formValue.y) {
          this.messageService.showError('That tile already exists.  Add another.', 'Error');
          this.inputForm.reset();
          document.getElementById('inputBase').focus();
          return;
        }
      }
      this.dataService.addCoord('rss', formValue, this.user);
      this.messageService.showSuccess('Added.  Thank you!!', 'Notification');
      this.inputForm.reset();
      document.getElementById('inputBase').focus();
    }
  }

  deleteRss(id) {
    this.dataService.deleteCoord('rss', id, this.user);
  }

  validCoords(data) {
    if (data.x <= 600 && data.x >= 1 && data.y >= 1 && data.y <= 600) {
      return true;
    } else {
      this.messageService.showError('Coords must fall between 1 and 600', 'Error');
      return false;
    }
  }
  signOut() {
    this.router.navigateByUrl('/login');
    this.auth.signOut();
  }

  nearbyFilter() {
    this.dataSource.filter = '';
    const formValue = this.nearbyForm.value;
    const distance = Number(this.nearbyForm.value.distance);
    if (this.validCoords(formValue)) {
      this.dataSource.filterPredicate = (data, filter: string) => {
        const awayX = Number(data.x);
        const awayY = Number(data.y);
        const homeX = Number(filter['x']);
        const homeY = Number(filter['y']);
        console.log(Math.pow(homeX - awayX, 2) + Math.pow(homeY - awayY, 2));
        return Math.pow(homeX - awayX, 2) + Math.pow(homeY - awayY, 2) < Math.pow(distance, 2);
      };
      this.dataSource.filter = formValue; // x&Y of lower left
    } else {
      console.log('bad');
    }
  }

  resetFilter() {
    this.dataSource.filter = '';
    this.nearbyForm.reset();
  }
}

/*

data.x data.y are the coords
filter[x] filter[y] are the filter info

meX - youx ^2 + meY - youY

 return Number(data.x) > Number(filter['x']) && Number(data.x) < Number(filter['x']) + distance && Number(data.y) > Number(filter['y'])
            && Number(data.y) < Number(filter['y']) + distance;

*/
