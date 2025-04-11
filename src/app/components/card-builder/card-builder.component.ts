import { Component } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { CommonModule } from '@angular/common';
import { CardModel } from './CardModel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-builder',
  imports: [DraggableDirective,CommonModule,FormsModule],
  templateUrl: './card-builder.component.html',
  styleUrl: './card-builder.component.scss'
})
export class CardBuilderComponent {
  default = {
    height: "200px",
    width: "300px",
    backgroundColor: "red",
  }

  activeTab : 'cardDetail'| 'elementProperty' = 'cardDetail';
  x=0;
  y=0;

  card : CardModel = new CardModel();

  dragEnd(event: any) {
    this.x =Math.floor( event.relative.x);
    this.y = Math.floor(event.relative.y);
  }
}
