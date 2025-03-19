import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-selectc',
  imports: [FormsModule,CommonModule],
  templateUrl: './selectc.component.html',
  styleUrl: './selectc.component.scss'
})
export class SelectcComponent {
  @Input() preview: string | null = null;
  @Input() placeholder: string = "Please Select a Value";
  @Input() queryData = (keyword: string) =>{
    this.queryResult = this.datas.filter(data => data.text.toLowerCase().includes(keyword.toLowerCase()));
    if(this.pagination){
      this.currentPage = 1;
      this.totalItems = this.queryResult.length;
      this.pages = Array.from({length: Math.ceil(this.totalItems / this.pageSize)}, (_, i) => this.queryResult.slice(i * this.pageSize, i * this.pageSize + this.pageSize));
      this.showResult = [];
      this.currentIndex= -1;
      if(this.pages.length > 0){
        this.showResult = this.pages[0];
        if(this.pages.length > 1){
          this.showResult = this.showResult.concat(this.pages[1]);
        }
        console.log(this.showResult,this.pages);


      }
    }
  };
  @Input() pagination = true;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() totalItems = 0;


  @Input() transFormer = () => {
    this.datas= this.items;
    this.queryData('');
  };

  @Input() items: any[] = [];
  @Input() datas: any[] = [];

  selectedText: string|null = null;
  queryResult: any[] = [];
  showResult : any[]= [];
  pages : any[][] = [];
  modalShown = false;
  top = 0;
  left = 0;
  currentIndex=-1;
  id="selectc"+Math.random().toString(36).substring(7);
  modalPosition = 'left:0px;top:0px;';

  private _selectedValue: any = null;

  @Input()
  get selectedValue(): any {
    return this._selectedValue;
  }

  set selectedValue(val: any) {
    this._selectedValue = val;
    this.selectedText = this.datas.find(item => item.id === val)?.text || null;
    this.selectedValueChange.emit(val);
  }

  @Output() selectedValueChange = new EventEmitter<any>();



  ngOnInit(){
    this.transFormer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.transFormer();
    }
  }

  query(event: any): void {
    if(event.target){
      this.queryData(event.target.value);
    }else{
      this.queryData('');
    }
  }

  selectItem(id:any){
    this.selectedValue = id;
    this.closeModal();
  }

  public open(){
    this.showModal();
  }

  onScroll(event:any){
    if(this.pagination){
      //if the scroll is at the bottom
      if(event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight){
        if(this.currentPage < this.pages.length){
          this.currentPage++;
          this.showResult = this.showResult.concat(this.pages[this.currentPage]);
          if(this.currentPage < this.pages.length){
            this.showResult= this.showResult.concat(this.pages[this.currentPage]);
          }
        }
      }
    }
  }

  showModal(){
    this.queryData('');
    this.modalShown=true;
    setTimeout(() => {
      const element = document.querySelector('#'+this.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        this.top = rect.top;
        this.left = rect.left;
        if((this.top + 200) > window.innerHeight){
          this.modalPosition = `top:${window.innerHeight - 250}px;left:${this.left}px;`;
        }else{
          this.modalPosition = `top:${this.top}px;left:${this.left}px;`;
        }

        document.getElementById(this.id+'input')?.focus();
      }
    });
  }

  closeModal(){
    this.modalShown = false;
    this.clearQueryData();
    const inputElement = document.getElementById(this.id+'input') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

  clearQueryData(){
    this.queryResult = [];
    this.pages = [];
    this.showResult = [];
    this.currentPage = 1;
    this.totalItems = 0;

  }

  modalClicked(event : any){
    console.log(event.target.className);

    if(event.target.className === 'select-modal select-aa active'){
      this.closeModal();
    }

  }

  inputKeyDown(event: any){
    if(event.key === 'Escape' || event.key === 'Tab'){
      event.preventDefault();
      event.stopPropagation();
      this.closeModal();
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.showResult.length > 0 && this.currentIndex < this.showResult.length - 1) {
        this.currentIndex += 1;
      }
      this.scrollToItem();
    } else if (event.key === 'ArrowUp' ) {
      event.preventDefault();
      if(this.currentIndex > 0){
        this.currentIndex -= 1;
      }
      this.scrollToItem();

    } else if (event.key === 'Enter') {
      if (this.currentIndex >= 0 && this.currentIndex < this.showResult.length) {
        this.selectItem(this.showResult[this.currentIndex].id);
      }
    }
    // Add this method to the class to handle scrolling to the selected item
  }

  timeOut : any = null;
  private scrollToItem() {
    const selectedElement = document.querySelector(`#${this.id}-item-${this.currentIndex}`);
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

  }



}
