import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import {
  nepaliMonths,
  nepaliDaysOfWeek,
  getDaysInNepaliMonth,
  formattedDate,
  getCurrentBS,
  bsToAd,
  isValidNepaliDate
} from './calendar-data';

@Component({
  selector: 'app-nepali-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./nepali-datepicker.component.html',
  styleUrls: ['./nepali-datepicker.component.scss']
})
export class NepaliDatepickerComponent {
  @ViewChild('dialogEl') dialogEl!: ElementRef<HTMLDivElement>;
  @ViewChild('dialogInput') dialogInput!: ElementRef<HTMLInputElement>;
  @Input() set value(date: string) {
    if (date) {
      this.setDateFromString(date);
    }
  }
  get value(): string {
    return this.selectedDate??'';
  }

  @Output() valueChange = new EventEmitter<string>();
  @Input() minDate: string | null = null;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    console.log(this.uid);
    if(this.dialogEl && this.dialogEl.nativeElement){

      const clickedOutside = (!this.dialogInput.nativeElement.contains(event.target as Node)) && (!this.dialogEl.nativeElement.contains(event.target as Node));


      // Only close this instance's dialog if it's the one that's open and the click was outside
      if (clickedOutside && this.dialogShown) {
        this.dialogShown=false;
      }
    }
  }

  private uid='';
  dialogShown=false;
  dialogPosition={
    top:'opx',
    left:'0px'
  };
  today="";
  todayInt=0;
  todayDate={
    year:0,
    month:0,
    day:0,
  }
  daysOfWeek = nepaliDaysOfWeek;
  years = Array.from({ length: 91 }, (_, i) => 2090 - i); // 2000 to 2090
  months = nepaliMonths;

  calendarDays: number[][] = [];

  currentMonth = 0;
  currentMonthName = nepaliMonths[0];
  currentYear=0;
  currentDay=0;
  selectedDate: string | null = null;
  displayDate: string | null = null;

  constructor() {
    this.today=getCurrentBS();
    [this.todayDate.year, this.todayDate.month, this.todayDate.day] = this.today.split('-').map(Number);
    this.todayInt = (this.todayDate.year*10000)+ (this.todayDate.month * 100) + this.todayDate.day;
    this.uid = Math.random().toString(36).substr(2, 9);
  }

  ngOnInit() {
    if(!this.value){
      this.value=this.today;
      this.currentYear=this.todayDate.year;
      this.currentMonth=this.todayDate.month;
      this.currentDay=this.todayDate.day;
      this.currentMonthName = nepaliMonths[this.currentMonth - 1];
      this.selectedDate = this.today;
      this.displayDate = this.today;

    }
  }

  private setDateFromString(dateStr: string) {
    const [year, month, day] = dateStr.split('-').map(Number);
    if(year!=this.currentYear || month!=this.currentMonth){
      this.currentDay=day;
      this.currentYear = year;
      this.currentMonth=month;
      this.currentMonthName = nepaliMonths[this.currentMonth - 1];
      this.selectedDate = this.formatDate(year, month, day);
      this.displayDate =  this.selectedDate;
      this.valueChange.emit(this.selectedDate);
      this.generateCalendar();
    }

  }

  private formatDate(year: number, month: number, day: number): string {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  generateCalendar() {
    this.calendarDays = [];
    this.currentMonth=Number(this.currentMonth);
    console.log('gen');

    const daysInMonth = getDaysInNepaliMonth( this.currentYear,this.currentMonth);
    let day = 1;

    const firstDay=new Date(bsToAd(formattedDate(this.currentYear,this.currentMonth,1))).getDay();
    let _w =[];
    for (let i = 0; i < firstDay; i++) {
        _w.push(0);
    }
    for (let j = 1; j <= daysInMonth ; j++){
      _w.push(j)
    }

    while (_w.length) {
      this.calendarDays.push(_w.splice(0, 7));
    }
  }


  openDialog(): void {

    this.dialogShown=true;
    if(this.selectedDate){
      const [year,month,date]=this.selectedDate.split('-').map(Number);
      if(year!=this.currentYear || month!=this.currentMonth){

        this.currentYear=year;
        this.currentMonth=month;
        this.currentDay=date;
        this.currentMonthName = nepaliMonths[this.currentMonth - 1];
        this.generateCalendar();
      }
      const rect = this.dialogInput.nativeElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const dialogHeight = 200; // Estimated dialog height
      this.dialogPosition.top = `${Math.min(rect.bottom, windowHeight - dialogHeight)}px`;
      this.dialogPosition.left = `${rect.left}px`;
    }
    console.log(this.dialogShown,this.dialogPosition);

  }

  closeDialog(): void {
    this.dialogShown=false;
  }

  selectDate(day: number): void {
    if (day === 0) return;
    this.currentDay=day;
    this.selectedDate = this.formatDate(this.currentYear, this.currentMonth, day);
    this.displayDate = this.selectedDate;
    this.valueChange.emit(this.selectedDate);
    this.closeDialog();
  }

  prevMonth(event: MouseEvent): void {
    event.stopPropagation();

    this.currentMonth=Number(this.currentMonth);
    this.currentMonth-=1;
    if (this.currentMonth <= 0) {
      this.currentMonth=12;
      this.currentYear-=1;
      this.currentMonthName = nepaliMonths[this.currentMonth ];
    }
    this.generateCalendar();
  }

  keepFocus(event: MouseEvent): void {
    event.preventDefault();
    this.dialogInput.nativeElement.focus();
  }

  nextMonth(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.currentMonth=Number(this.currentMonth);
    this.currentMonth+=1;
    if (this.currentMonth > 12) {
      this.currentMonth=1;
      this.currentYear+=1;
      this.currentMonthName = nepaliMonths[this.currentMonth];
    }
    this.generateCalendar();
  }

  isToday(day: number): boolean {
      return this.currentYear === this.todayDate.year && this.currentMonth === this.todayDate.month && day === this.todayDate.day;
  }

  isSelected(day: number): boolean {
    if (!this.currentDay) return false;
    return this.selectedDate === this.formatDate(this.currentYear, this.currentMonth, day);
  }
  valueChanged(event: Event) {
    const date = (event.target as HTMLInputElement).value;
    if (isValidNepaliDate(date)) {
      const [year, month, day] = date.split('-').map(Number);
      const newDate = this.formatDate(year, month, day);

      // Only update if the date has actually changed
      if (newDate !== this.selectedDate) {
        // Update all values in one go
        Object.assign(this, {
          currentDay: day,
          currentYear: year,
          currentMonth: month,
          currentMonthName: nepaliMonths[month - 1],
          selectedDate: newDate,
          displayDate: newDate
        });

        this.valueChange.emit(newDate);

        // Only regenerate calendar if year or month changed
        if (year !== this.currentYear || month !== this.currentMonth) {
          this.generateCalendar();
        }
      }
    }
  }

  //make the keydown event
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Escape') {
      this.selectDate(this.currentDay);
      this.closeDialog();
      // Let the default tab behavior handle focus navigation
    }
  }

}
