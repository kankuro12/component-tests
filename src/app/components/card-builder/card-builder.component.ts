import { Component } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { CommonModule } from '@angular/common';
import { CardElement, CardModel } from './CardModel';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ResizeDirective } from './resize.directive';

@Component({
  selector: 'app-card-builder',
  imports: [DraggableDirective,ResizeDirective,CommonModule,FormsModule],
  templateUrl: './card-builder.component.html',
  styleUrl: './card-builder.component.scss'
})
export class CardBuilderComponent {
  default = {
    height: "200px",
    width: "300px",
    backgroundColor: "red",
  }

  dataFields =[

    'id','name','address','grade','section','rollNo','imageUrl'
  ];
  activeTab : 'cardDetail'| 'elementProperty' = 'cardDetail';
  x=0;
  y=0;


  card : CardModel = new CardModel();

  cardElement : CardElement|null = null

  ngOnInit() {

  }

  cardUpdated(){
    console.log(this.card);

  }


  addElement(type: 'text' | 'image' | 'barcode') {
    this.cardElement = new CardElement();
    this.cardElement.type = type;
    this.cardElement.positionX = 0;
    this.cardElement.positionY = 0;
    this.cardElement.width = 100;
    this.cardElement.height = 100;
    this.card.elements.push(this.cardElement);
    this.activeTab = 'elementProperty';
    this.cardUpdated();
  }

  onDragEnd(event:any, element: CardElement) {
    // Update the position of the element based on the drag event
    if (element) {
      element.positionX = event.relative.x;
      element.positionY = event.relative.y;
      this.cardUpdated();

    }
  }

  selectElement(element: CardElement) {
    this.cardElement = element;
    this.activeTab = 'elementProperty';
  }


}
