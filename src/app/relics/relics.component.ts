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
  selector: 'app-relics',
  templateUrl: './relics.component.html',
  styleUrls: ['./relics.component.css']
})
export class RelicsComponent implements OnInit, AfterViewInit {
  myForm: FormGroup;
  public displayedColumns = ['lvl', 'x', 'y', 'delete'];
  public dataSource = new MatTableDataSource<any>();
  levels = ['All', 30, 40, 50];
  levelsSelect = ['30', '40', '50'];
  lvlvalue: number;
  temp = '';
  user: {};
  constructor(public router: Router, private fb: FormBuilder, public dataService: DataService,
    public auth: AuthService, private messageService: MessageService) { }

  @ViewChild('nameRef', { static: false }) nameElementRef: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngAfterViewInit() {
    this.nameElementRef.nativeElement.focus();
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.auth.user.subscribe(data => {
      this.user = data;
      this.dataService.getData('relic', this.user)
        .subscribe(relics => {
          this.dataSource.data = relics;
          this.dataSource.sort = this.sort;
        });
    });

    this.myForm = this.fb.group({
      lvl: null,
      x: null,
      y: null
    });

    // document.getElementById('lvl').focus();

    this.dataSource.filterPredicate = (data, filter: string) => {
      return data.lvl === filter;
    };
  }

  applyFilter(filterValue: string) {
    if (filterValue === 'All') {
      filterValue = '';
    }
    this.dataSource.filter = filterValue.toString().trim().toLowerCase();
  }


  addRelic() {
    const formValue = this.myForm.value;
    if (this.validCoords(formValue)) {
      for (let i = 0; i < this.dataSource.data.length; i++) {
        if (this.dataSource.data[i].x === formValue.x && this.dataSource.data[i].y === formValue.y) {
          this.messageService.showError('That tile already exists.  Add another.', 'Error');
          this.myForm.reset();
          // document.getElementById('lvl').focus();
          return;
        }
      }
      this.dataService.addCoord('relic', formValue, this.user);
      this.messageService.showSuccess('Added.  Thank you!!', 'Notification');
      this.myForm.reset();
    }
  }

  deleteRelic(id) {
    this.dataService.deleteCoord('relic', id, this.user);
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

}
