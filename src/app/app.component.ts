import { Component, ViewChild, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NepaliDatepickerComponent } from './components/nepali-datepicker/nepali-datepicker.component';
import { getCurrentBS } from './components/nepali-datepicker/calendar-data';
import { SettingService } from './services/setting.service';
import { HttpClient } from '@angular/common/http';
import { FilePickerComponent } from './components/file-picker/file-picker.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SelectcComponent } from './components/selectc/selectc.component';
import { CommonModule } from '@angular/common';
import { CardBuilderComponent } from './components/card-builder/card-builder.component';

@Component({
  selector: 'app-root',
  imports: [NgSelectModule,FormsModule,CommonModule,CardBuilderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('citiesSelector') citiesSelector: SelectcComponent | null = null;
  file : File | null = null;
  selectedCityId : number | null  = null;
  cities:any[] = [];

  constructor(private setting: SettingService, private http: HttpClient) {
    this.http.get('https://cdn-dairy-co.com/static/banks.json').subscribe((banks:any) => {
      this.cities = banks.map((bank: any) => ({ id: bank[0], text: bank[1] }));
    });
  }


  fileChanged(file: File | null) {
    this.file = file;
  }

  uploadFile() {
    // if(this.file){
    //   const formData = new FormData();
    //   formData.append('file', this.file);
    //   this.http.post('http://localhost:8000/upload.php', formData).subscribe((response) => {
    //     console.log(response);
    //   });
    // }

    console.log(this.selectedCityId);
    console.log(this.cities.find(city => city.id === this.selectedCityId));

  }

  openSelect(){
    if(this.citiesSelector){
      this.citiesSelector.open();
    }
  }





}
