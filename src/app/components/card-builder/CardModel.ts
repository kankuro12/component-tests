export const CardElementTypes =[

  'id','name','address','grade','section','rollno'
];
export class CardElement{
  name: string = 'Card Element';
  type: 'text' | 'image' | 'barcode' = 'text';
  dataType : 'static' | 'dynamic' = 'static'; // static or dynamic

  //position details
  positionX: number = 0;
  positionY: number = 0;
  width: number = 100;
  height: number = 100;

  text: string = 'Sample Text';
  dataValue : string = 'Sample Data'; // for dynamic data
  elementType: string | null = null;// Type from the CardElementTypes array

  fontSize: number = 16;
  fontFamily: string = 'Arial';
  fontColor: string = '#000000';
  fontWeight: 'normal' | 'bold' = 'normal';

}

export class CardModel {
  title: string = 'Card Title';
  //background details
  backgroundType: 'color'| 'image' = 'color'; // color or image
  backgroundColor : string = '#ffffff';
  backgroundImage : string = '';

  backgroundImagePosition : 'left' | 'center' | 'right' = 'center';
  backgroundImageSize : 'cover' | 'contain' = 'cover';
  backgroundImageRepeat : 'no-repeat' | 'repeat' = 'no-repeat';

  height: string = '200px';
  width: string = '300px';

  elements: CardElement[] = [];

  toCss() {
    let css = `
      background-color: ${this.backgroundColor};
      width: ${this.width};
      height: ${this.height};
      ${
        this.backgroundType === 'color' ? `background: ${this.backgroundColor};`
        :
        `
          background-image: url(${this.backgroundImage});
          background-position: ${this.backgroundImagePosition};
          background-size: ${this.backgroundImageSize};
          background-repeat: ${this.backgroundImageRepeat};
        `
      }
    `;
    return css;
  }

}
