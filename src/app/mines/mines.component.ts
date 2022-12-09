import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-mines',
  templateUrl: './mines.component.html',
  styleUrls: ['./mines.component.css']
})
export class MinesComponent implements OnInit, AfterViewInit {

  constructor(public router: Router, private fb: FormBuilder, public dataService: DataService,
    public auth: AuthService, private messageService: MessageService) { }
  myForm: FormGroup;
  rutileForm: FormGroup;
  zoneForm: FormGroup;
  public displayedColumns = ['lvl', 'type', 'x', 'y', 'enhanced', 'delete'];
  public dataSource = new MatTableDataSource<any>();
  levels = ['All', 46, 48, 50];
  levelsSelect = ['46', '48', '50'];
  enhancements = ['0', '50', '100', '150', '200'];
  tileTypes = ['Gold', 'Iron', 'Oil', 'Copper', 'Uranium'];
  lvlvalue: number;
  enhanced: number;
  typevalue: string;
  temp = '';
  user: {};
  zones = [
    { z: 1, x: 0, y: 401 },
    { z: 2, x: 201, y: 401 },
    { z: 3, x: 401, y: 401 },
    { z: 4, x: 0, y: 201 },
    { z: 5, x: 201, y: 201 },
    { z: 6, x: 401, y: 201 },
    { z: 7, x: 0, y: 0 },
    { z: 8, x: 201, y: 0 },
    { z: 9, x: 401, y: 0 }
  ]


  @ViewChild('nameRef', { static: false }) nameElementRef: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngAfterViewInit() {
    this.nameElementRef.nativeElement.focus();
  }

  ngOnInit() {
    this.auth.user.subscribe(data => {
      this.user = data;
      this.dataService.getData('mine', this.user)
        .subscribe(mine => {
          this.dataSource.data = mine;
          this.dataSource.sort = this.sort;
        });
    });

    this.myForm = this.fb.group({
      lvl: null,
      type: null,
      x: null,
      y: null,
      enhanced: '0'
    });

    this.rutileForm = this.fb.group({
      x: null,
      y: null
    });

    this.zoneForm = this.fb.group({
      z: null
    });
  }

  applyRadioFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data, filter: string) => {
      return data.lvl === filter;
    };
    if (filterValue === 'All') {
      filterValue = '';
    }
    this.dataSource.filter = filterValue.toString().trim().toLowerCase();
  }

  rutileFilter() {
    const formValue = this.rutileForm.value;
    this.dataSource.filterPredicate = (data, filter: string) => {
      return Number(data.x) > Number(filter['x']) && Number(data.x) < Number(filter['x']) + 100 && Number(data.y) > Number(filter['y'])
        && Number(data.y) < Number(filter['y']) + 100;
    };
    this.dataSource.filter = formValue; // x&Y of lower left
  }

  zoneFilter() {  //    { z: 4, x: 0, y: 201 }
    const formValue = this.zoneForm.value;
    this.dataSource.filterPredicate = (data, filter: string) => {
      const zone = this.zones.find(({ z }) => z === Number(filter['z']));
      return Number(data.x) > Number(zone['x']) && Number(data.x) < Number(zone['x']) + 200 && Number(data.y) > Number(zone['y'])
        && Number(data.y) < Number(zone['y']) + 200;
    };
    if (formValue.z >= 0 && formValue.z <= 9) {
      this.dataSource.filter = formValue;
    }
    else {
      this.messageService.showError('Please enter a number 0-9', 'Error')
    }
  }

  addRelic() {
    const formValue = this.myForm.value;
    if (this.validCoords(formValue)) {
      for (let i = 0; i < this.dataSource.data.length; i++) {
        if (this.dataSource.data[i].x === formValue.x && this.dataSource.data[i].y === formValue.y) {
          this.messageService.showError('That tile already exists.  Add another.', 'Error');
          this.myForm.reset();
          return;
        }
      }
      this.dataService.addCoord('mine', formValue, this.user);
      this.messageService.showSuccess('Added.  Thank you!!', 'Notification');
      this.myForm.reset();
    }
  }

  deleteRelic(id) {
    this.dataService.deleteCoord('mine', id, this.user);
  }

  updateCoord(id, enhancement) {
    this.dataService.editCoord('mine', this.user, id, enhancement);
  }

  validLevel() {
    const lvl = this.myForm.value.lvl;
    const acceptLvl = [46, 48, 50];

    if (lvl !== null && acceptLvl.indexOf(Number(lvl)) === -1) {
      this.messageService.showError('Only levels 46, 48 and 50 are accepted', 'Error');
      this.myForm.reset();
    }
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

  logit(e, id) {
    console.log(e);
  }
}
