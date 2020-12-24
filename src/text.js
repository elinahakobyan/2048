import { Text, TextStyle } from 'pixi.js';

export class Message extends Text {
  constructor(text, style) {
    super(text, style);

    this.position.set(0, 0);
    this.anchor.set(0.5);
  }
}
export class Style extends TextStyle {
  constructor() {
    super();
    this.fontFamily = 'Arial';
    this.fontSize = 70;
    this.fill = ' 0xff1010';
  }
}
