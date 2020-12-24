import { Application, Container, Sprite, Texture, TilingSprite } from 'pixi.js';

import { Image } from './image.js';
import { Message, Style } from './text.js';

export class Game extends Application {
  constructor() {
    super({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
    });
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    document.body.appendChild(this.view);
    this._loadAssets();
  }
  _loadAssets() {
    this.loader
      .add('burgundyDivan', 'assets/ui/burgundyDivan.png')
      .add('grayDivan', 'assets/ui/grayDivan.png')
      .add('orangeDivan', 'assets/ui/orangeDivan.png')
      .add('torquoiseDivan', 'assets/ui/torquoiseDivan.png')
      .add('hand', 'assets/ui/hand.png')
      .add('like', 'assets/ui/icon_like.png')
      .add('logo', 'assets/ui/logo.png')
      .add('chair1', 'assets/furniture/chair1.png')
      .add('chair2', 'assets/furniture/chair2.png')
      .add('chair3', 'assets/furniture/chair3.png')
      .add('chair4', 'assets/furniture/chair4.png')
      .add('table1', 'assets/furniture/table1.png')
      .add('table2', 'assets/furniture/table2.png')
      .add('table1k', 'assets/furniture/table1k.png')

      .add('font', 'assets/font/kenvector_future.ttf')
      .add('nkar', 'assets/ui/nkar.png');

    this.loader.load(() => {
      this._onLoadComplete();
    });
  }

  _onLoadComplete() {
    this.build();
  }

  build() {
    // this.buildTitle();
    this.buildBg();
    // this.buildTable();
    // this.buildSecondTable();
  }

  pageOrintation() {
    if (this.width > this.height) {
      return 'landscape';
    }
    return 'portrait';
  }

  buildTitle() {
    const title = Sprite.from('logo');
    this.scaleChanging(title);
    title.anchor.set(0.5);
    title.position.set(this.width / 2, this.height / 10 + 5);
    this.stage.addChild(title);
  }

  buildBg() {
    const style = new Style();
    style.fontSize = 43;
    style.fill = ' #FFFFFF';
    const container = new Image(
      'nkar',
      'Tap on the piece you love! ',
      style,
      this.width,
      this.height,
      this.pageOrintation
    );
    console.warn(container.image.width);
    container.image.width = this.width;
    container.height = this.height / 13;
    const portraitX = container.image.width / 2;
    const portraitY = (this.height * 9) / 35;
    const landscapeX = container.image.width / 2;
    const landscapeY = 700; //TODO
    container.decidePosition(portraitX, portraitY, landscapeX, landscapeY);
    this.scaleChanging(container);
    this.stage.addChild(container);
  }

  buildText() {
    const style = new Style();
    style.fontSize = 43;
    style.fill = ' #FFFFFF';
    const text = new Message('Tap on the piece you love! ', style);
    this.scaleChanging(text);
    return text;
  }

  buildTable() {
    const table = Sprite.from('table1k');
    table.anchor.set(0.5);
    const portraitX = this.width / 2;
    const portraitY = (this.height * 9) / 20;
    const landscapeX = this.width / 5;
    const landscapeY = (this.height * 9) / 20;
    this.decidePosition(table, portraitX, portraitY, landscapeX, landscapeY);
    this.scaleChanging(table);
    this.stage.addChild(table);
  }

  buildSecondTable() {
    const table = Sprite.from('table1k');
    table.anchor.set(0.5);
    const portraitX = this.width / 2;
    const portraitY = (this.height * 9) / 12;
    const landscapeX = (3 * this.width) / 4;
    const landscapeY = (this.height * 9) / 20;
    this.decidePosition(table, portraitX, portraitY, landscapeX, landscapeY);
    this.scaleChanging(table);
    this.stage.addChild(table);
  }

  decidePosition(sprite, portraitX, portraitY, landscapeX, landscapeY, element) {
    if (element === undefined) {
      element = sprite;
    }
    if (this.pageOrintation() === 'landscape') {
      element.position.set(landscapeX, landscapeY);
    } else {
      element.position.set(portraitX, portraitY);
    }
  }

  scaleChanging(element) {
    if (this.width < element.width || this.height < element.height) {
      if (this.width > this.height) {
        element.scale.set(this.height / element.width);
      } else {
        element.scale.set(this.width / element.width);
      }
    }
  }
}
