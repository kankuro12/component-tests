
export class studentCardModel  {
  id: string = 'id';
  name: string = 'name';
  address: string = 'address';
  grade: string = 'grade';
  section: string = 'section';
  rollNo: string = 'rollNo';
  imageUrl: string = 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D';

  getData(key:String) {
    return this[key as keyof studentCardModel];
  }
}
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
  dataField : string = 'id'; // for dynamic data

  fontSize: number = 16;
  fontFamily: string = 'Arial';
  fontColor: string = '#000000';
  fontWeight: 'normal' | 'bold' = 'normal';

  data : studentCardModel = new studentCardModel();

  getText(){
    return this.dataType === 'static' ? this.text : this.data.getData(this.dataField);
  }
  getImageUrl(){
    return this.dataType === 'static' ? this.text : this.data.getData(this.dataField);
  }

  toCss() {
    let css = `
      position: absolute;
      left: ${this.positionX}px;
      top: ${this.positionY}px;
      width: ${this.width}px;
      height: ${this.height}px;
      font-size: ${this.fontSize}px;
      font-family: ${this.fontFamily};
      color: ${this.fontColor};
      font-weight: ${this.fontWeight};
    `;
    return css;
  }

}

export class CardModel {
  title: string = 'Card Title';
  //background details
  backgroundType: 'color'| 'image' = 'color'; // color or image
  backgroundColor : string = '#D6D6D6';
  backgroundImage : string = '';

  backgroundImagePosition : 'left' | 'center' | 'right' = 'center';
  backgroundImageSize : 'cover' | 'contain' = 'cover';
  backgroundImageRepeat : 'no-repeat' | 'repeat' = 'no-repeat';

  height: number = 200;
  width: number = 300;

  elements: CardElement[] = [];

  toCss() {
    let css = `
      background-color: ${this.backgroundColor};
      width: ${this.width}px;
      height: ${this.height}px;
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

  toJson() {
    return JSON.stringify(this, null, 2);
  }

}
