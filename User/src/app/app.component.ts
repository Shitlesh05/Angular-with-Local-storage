import { Component, OnInit, AfterViewInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './form/form.component';
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

type DataType = {
  i : number;
  userName : string ;
  email : string;
  phoneNumber : string;
  country : string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'User';

  displayedColumns: string[] = ['userName', 'email', 'phoneNumber','country','edit','delete'];
  dataSource!: MatTableDataSource<DataType>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog)
  { }
  ngOnInit(): void {
    this.getAllUsers();
  }

  openDialog() 
  {
    this.dialog.open(DialogComponent, {
      width: '35%',
      height: '63%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllUsers();
      }
    });
  }

  getUser(){
    let data : any = JSON.parse(localStorage.getItem("userData") || '{}')
    console.log(Object.keys(data));
    return Object.keys(data);
  }
  // to display all users 
  getAllUsers(){
    const data = localStorage.getItem('userList');
    if(data !==  null)
    {
      let newData = JSON.parse(data);
      this.dataSource = new MatTableDataSource(newData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }    
  }

  // for updating records
  editUser(row :DataType )
  {
    console.log(row);
    this.dialog.open(DialogComponent,
      {
      width:'35%',
      height: '65%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllUsers();
      }
    })
  }

  // to delete the user  
  deleteUser(row: DataType){
    const data = localStorage.getItem('userList');
    console.log(row);
    
    if(data !== null)
    {
      let newData = JSON.parse(data);
      for(let i=0;i<newData.length;i++)
      {
        if(row.email === newData[i].email)
        {
          newData.splice(i , 1);
          localStorage.setItem('userList',JSON.stringify(newData));
          alert("Data deleted successfully....");
          this.getAllUsers();
          return;
        }
      }
    }
      else{
        alert("Error while deleting the record.....!");
      }
  }

// for search functionality
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
