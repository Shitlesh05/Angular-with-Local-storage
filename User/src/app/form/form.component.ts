import { Component,OnInit,Inject } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class DialogComponent {

  userForm !: FormGroup;
  actionBtn : string = "Submit Form";
  Index !: number;

  constructor(private formBuilder: FormBuilder ,
     @Inject(MAT_DIALOG_DATA) public editData:any , 
    private dialogRef : MatDialogRef<DialogComponent>){}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', [Validators.required,Validators.pattern("^[0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      country: ['', Validators.required],
    });
    // this is for getting the data to edit for edit block
    if(this.editData){

      let AllData = localStorage.getItem('userList');
      if(AllData !== null)
      {
        let getDataIndex = JSON.parse(AllData);
        for(let i=0;i<getDataIndex.length;i++)
        {
          if(this.editData.email === getDataIndex[i].email)
          {
            this.Index = i;
            console.log(i);
          }
        }
      }
      this.actionBtn = "Update";
      this.userForm.controls['userName'].setValue(this.editData.userName);
      this.userForm.controls['email'].setValue(this.editData.email);
      this.userForm.controls['phoneNumber'].setValue(this.editData.phoneNumber);
      this.userForm.controls['country'].setValue(this.editData.country);
    }
  }


  addUser()
  {
    
    if(
      this.userForm.value.userName === '' ||
      this.userForm.value.email === '' ||
      this.userForm.value.phoneNumber === '' ||
      this.userForm.value.country === ''
    ) {  return;   }

    if(!this.editData){
      let AllData = localStorage.getItem('userList');
      if (AllData !== null) 
      {
        let searchData = JSON.parse(AllData);
        for (let i = 0; i < searchData.length; i++) 
        {
          if (searchData[i].email === this.userForm.value.email) 
          {
            alert('This user is already exists');
            return;
          }
        }
      }
      let data = localStorage.getItem('userList');
      if (data === null) 
      {
        let newData = [];
        newData.push(this.userForm.value);
        localStorage.setItem('userList', JSON.stringify(newData));
      } 
      else 
      {
        const newData = JSON.parse(data);
        newData.push(this.userForm.value);
        localStorage.setItem('userList', JSON.stringify(newData));
        alert('User data is added');
      }

      this.userForm.reset();
      this.dialogRef.close('save');
    }
    else
    {
      this.updateUser();
    }  
  }

  updateUser(){
    let AllData = localStorage.getItem('userList');
    if (AllData !== null) {
      let searchData = JSON.parse(AllData);
      searchData[this.Index] = this.userForm.value;
      localStorage.setItem('userList', JSON.stringify(searchData));
      alert('User is updated successfully');
    }
    this.userForm.reset();
    this.dialogRef.close('update');
  }

}
