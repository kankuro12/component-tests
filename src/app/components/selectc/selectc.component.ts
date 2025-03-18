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
      if(this.pages.length > 0){
        this.showResult = this.pages[0];
        if(this.pages.length > 1){
          this.showResult = this.showResult.concat(this.pages[1]);
        }
        console.log(this.showResult,this.pages);


      }
    }
  };
  @Input() pagination = false;
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
    this.modalShown=false;
  }

  public open(){
    this.modalShown = true;
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

  modalClicked(event : any){
    console.log(event.target.className);

    if(event.target.className === 'select-modal select-aa active'){
      this.modalShown = false;
    }

  }




}
