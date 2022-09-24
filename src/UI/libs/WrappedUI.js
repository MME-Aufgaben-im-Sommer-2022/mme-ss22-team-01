"use strict";

import Observable, { Event } from "../../utils/Observable.js";

//TODO Style rules noch umsetzen auf fromStyleRule undso

class ImplementationError extends Error { }

class ColorParsingError extends Error { }

class Stylable {
    static fromStyle(style) {
        throw new ImplementationError();
    }

    toStyle() {
        throw new ImplementationError();
    }

    equals(value) {
        throw new ImplementationError();
    }
}

export class Color {
    static get Format() {
        return Object.freeze({
            hex: "(?:^|\\s+)#?(?:(?:(?<fullRed>[a-f\\d]{2})(?<fullGreen>[a-f\\d]{2})(?<fullBlue>[a-f\\d]{2})(?<fullAlpha>[a-f\\d]{2})?)|(?:(?<shortRed>[a-f\\d])(?<shortGreen>[a-f\\d])(?<shortBlue>[a-f\\d])(?<shortAlpha>[a-f\\d])?))(?:\\s+|$)",
            rgb: "(?:^|\\s+)rgba?\\((?<red>0|255|25[0-4]|2[0-4]\\d|1\\d\\d|0?\\d?\\d),\\s?(?<green>0|255|25[0-4]|2[0-4]\\d|1\\d\\d|0?\\d?\\d),\\s?(?<blue>0|255|25[0-4]|2[0-4]\\d|1\\d\\d|0?\\d?\\d)(?:,\\s?(?<alpha>0|0?\\.\\d|1(\\.0)?))?\\)(?:\\s+|$)",
            /**
             * Quelle: https://gist.github.com/sethlopezme/d072b945969a3cc2cc11
             * Abgerufen am 13.08.2022 
             * Autor: sethlopezme
            */
        });
    }

    constructor(red, green, blue, alpha = 1.0) {
        this._red = red;
        this._green = green;
        this._blue = blue;
        this._alpha = alpha;
    }

    get red() {
        return this._red;
    }

    get green() {
        return this._green;
    }

    get blue() {
        return this._blue;
    }

    get alpha() {
        return this._alpha;
    }

    set red(value) {
        this._red = value;
    }

    set green(value) {
        this._green = value;
    }

    set blue(value) {
        this._blue = value;
    }

    set alpha(value) {
        this._alpha = value;
    }

    toStyleRule() {
        const components = `${this.red}, ${this.green}, ${this.blue}`;
        const alpha = this.alpha;
        const str = alpha === 1.0 ? `rgb(${components})` : `rgba(${components}, ${alpha})`;

        return str;
    }

    static fromHex(str) {
        const regex = new RegExp(Color.Format.hex, "i");

        const match = regex.exec(str);
        const error = new ColorParsingError(`Cannot parse ${str} using hex format`);

        if (match === null || match.groups === undefined) throw error;

        const groups = match.groups;

        let red = groups.shortRed;
        let green = groups.shortGreen;
        let blue = groups.shortBlue;
        let alpha = "ff";

        if (red !== undefined && green !== undefined && blue !== undefined) { if (groups.shortAlpha !== undefined) alpha = groups.shortAlpha; }
        else if (groups.fullRed !== undefined && groups.fullGreen !== undefined && groups.fullBlue !== undefined) {
            red = groups.fullRed;
            green = groups.fullGreen;
            blue = groups.fullBlue;
            if (groups.fullAlpha !== undefined) { alpha = groups.fullAlpha; }
        }
        else throw error;

        const redComponent = parseInt(red.padStart(2, red), 16);
        const greenComponent = parseInt(green.padStart(2, green), 16);
        const blueComponent = parseInt(blue.padStart(2, blue), 16);
        const alphaComponent = Number(parseInt(alpha.padStart(2, alpha), 16) / 255);

        const color = new Color(redComponent, greenComponent, blueComponent, alphaComponent);

        return color;
    }

    static fromRGB(str) {
        const regex = new RegExp(Color.Format.rgb, "i");

        const match = regex.exec(str);

        if (match === null || match.groups === undefined) throw new ColorParsingError(`Cannot parse ${str} using rgb(a) format`);

        const groups = match.groups;

        const redComponent = parseInt(groups.red);
        const greenComponent = parseInt(groups.green);
        const blueComponent = parseInt(groups.blue);
        let alphaComponent = 1.0;

        if (groups.alpha !== undefined) alphaComponent = Number(groups.alpha);

        const color = new Color(redComponent, greenComponent, blueComponent, alphaComponent);

        return color;
    }


    static fromStyleRule(str, format = undefined) { // todo hier noch regex neu machen: Quelle: https://gist.github.com/sethlopezme/d072b945969a3cc2cc11
        let color;

        switch (format) {
            case undefined:
                try {
                    color = Color.fromRGB(str);
                }
                catch (error) {
                    if ((error instanceof ColorParsingError) === false) throw error; // Todo review

                    color = Color.fromHex(str);
                }
                break;
            case Color.Format.hex:
                color = Color.fromHex(str);
                break;
            case Color.Format.rgb:
                color = Color.fromRGB(str);
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
        return color;
    }


    static get white() {
        return new this(255, 255, 255);
    }

    static get black() {
        return new this(0, 0, 0);
    }

    static get red() {
        return new this(255, 0, 0);
    }

    static get blue() {
        return new this(0, 0, 255);
    }

    static get green() {
        return new this(0, 255, 0);
    }

    static get yellow() {
        return new this(255, 255, 0);
    }

    static get magenta() {
        return new this(255, 0, 255);
    }

    static get cyan() {
        return new this(0, 255, 255);
    }

    static get orange() {
        return new this(255, 128, 0);
    }

    static get aqua() {
        return new this(0, 255, 255);
    }

    static get aquamarine() {
        return new this(127, 255, 212);
    }

    static get brown() {
        return new this(165, 42, 42);
    }

    static get coral() {
        return new this(255, 127, 80);
    }

    static get crimson() {
        return new this(220, 20, 60);
    }

    static get darkBlue() {
        return new this(0, 0, 139);
    }

    static get darkGrey() {
        return new this(169, 169, 169);
    }

    static get darkGreen() {
        return new this(0, 100, 0);
    }

    static get grey() {
        return new this(128, 128, 128);
    }

    static get green() {
        return new this(0, 128, 0);
    }

    static get gold() {
        return new this(255, 215, 0);
    }

    static get indigo() {
        return new this(75, 0, 130);
    }

    static get ivory() {
        return new this(255, 255, 240);
    }

    static get khaki() {
        return new this(240, 230, 140);
    }

    static get lavender() {
        return new this(230, 230, 250);
    }

    static get lightBlue() {
        return new this(173, 216, 230);
    }

    static get lightGreen() {
        return new this(144, 238, 144);
    }

    static get lightGrey() {
        return new this(211, 211, 211);
    }

    static get lime() {
        return new this(0, 255, 0);
    }

    static get navy() {
        return new this(0, 0, 128);
    }

    static get olive() {
        return new this(128, 128, 0);
    }

    static get pink() {
        return new this(255, 192, 203);
    }

    static get purple() {
        return new this(128, 0, 128);
    }

    static get salmon() {
        return new this(250, 128, 114);
    }

    static get teal() {
        return new this(0, 128, 128);
    }

    static get turquoise() {
        return new this(64, 224, 208);
    }

    static get violet() {
        return new this(238, 130, 238);
    }

    static get transparent() {
        return new this(0, 0, 0, 0);
    }
}


class Shadow {
    constructor(offsetX, offsetY, color = Color.black, blurRadius) {
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._color = color;
        this._blurRadius = blurRadius;
    }

    get offsetX() {
        return this._offsetX;
    }

    get offsetY() {
        return this._offsetY;
    }

    get color() {
        return this._color;
    }

    get blurRadius() {
        return this._blurRadius;
    }

    toStyleRule() {
        const offsetX = this.offsetX;
        const offsetY = this.offsetY;
        const color = this.color;
        const blurRadius = this.blurRadius;

        if (offsetX === undefined) throw new Error("Cannot provide a style rule withou offsetX");
        if (offsetY === undefined) throw new Error("Cannot provide a style rule withou offsetY");

        let str = `${offsetX} ${offsetY}`;
        if (blurRadius !== undefined) str += ` ${blurRadius}`;
        if (color !== undefined) str = `${color.toStyleRule()} ${str}`;

        return str;
    }

    static fromStyleRule(str) {
        if (View._propertyIsSet(str) === false) throw new Error("Cannot parse data from unset property");

        const color = Color.fromStyleRule(str);

        const constraints = View._deriveConstrains(str);
        const length = constraints.length;

        if (length < 2) throw new Error("Cannot parse shadow information");
        const offsetX = constraints[0];
        const offsetY = constraints[1];

        let blurRadius;
        if (length > 2) blurRadius = constraints[2];

        return new Shadow(offsetX, offsetY, color, blurRadius);
    }
}

export class TextShadow extends Shadow {
    // todo static get shadow defaults
}

export class BoxShadow extends Shadow {
    constructor(offsetX, offsetY, color, blurRadius, spreadRadius, inset = false) {
        super(offsetX, offsetY, color, blurRadius);

        this._spreadRadius = spreadRadius;
        this._inset = inset;
    }

    get spreadRadius() {
        return this._spreadRadius;
    }

    get inset() {
        return this._inset;
    }

    toStyleRule() {
        const spreadRadius = this.spreadRadius;

        let str = super.toStyleRule();

        if (spreadRadius !== undefined) str += ` ${spreadRadius}`;
        if (this.inset === true) str += ` inset`;

        return str;
    }

    static fromStyleRule(str) {
        const shadow = Shadow.fromStyleRule(str);

        const inset = str.includes("inset");

        const constraints = View._deriveConstrains(str);
        let spreadRadius;
        if (constraints.length > 3) spreadRadius = constraints[constraints.length - 1];

        return new BoxShadow(shadow.offsetX, shadow.offsetY, shadow.color, shadow.blurRadius, spreadRadius, inset);
    }

    // todo static get shadow defaults
}

export class Corners extends Stylable {
    constructor(topLeft, topRight, bottomLeft, bottomRight) {
        super();

        this._topLeft = topLeft;
        this._topRight = topRight;
        this._bottomLeft = bottomLeft;
        this._bottomRight = bottomRight;
    }

    static get unset() {
        return new this(undefined, undefined, undefined, undefined);
    }

    static all(value) {
        return new this(value, value, value, value);
    }

    static topLeft(value) {
        return new this(value, undefined, undefined, undefined);
    }

    static topRight(value) {
        return new this(undefined, value, undefined, undefined);
    }

    static bottomLeft(value) {
        return new this(undefined, undefined, value, undefined);
    }

    static bottomRight(value) {
        return new this(value, undefined, undefined, value);
    }

    static bottom(value) {
        return new this(undefined, undefined, value, value);
    }

    static top(value) {
        return new this(value, value, undefined, undefined);
    }

    static left(value) {
        return new this(value, undefined, value, undefined);
    }

    static right(value) {
        return new this(undefined, value, undefined, value);
    }

    get topLeft() {
        return this._topLeft;
    }

    get topRight() {
        return this._topRight;
    }

    get bottomLeft() {
        return this._bottomLeft;
    }

    get bottomRight() {
        return this._bottomRight;
    }

    set topLeft(value) {
        this._topLeft = value;
    }

    set topRight(value) {
        this._topRight = value;
    }

    set bottomLeft(value) {
        this._bottomLeft = value;
    }

    set bottomRight(value) {
        this._bottomRight = value;
    }

    toStyle() {
        let style = {
            borderRadius: "",

            /*
            borderTopLeftRadius: "",
            borderTopRightRadius: "",
            borderBottomLeftRadius: "",
            borderBottomRightRadius: ""
            */
        };

        const topLeft = this.topLeft;
        const topRight = this.topRight;
        const bottomLeft = this.bottomLeft;
        const bottomRight = this.bottomRight;

        if (topLeft !== undefined && topLeft === topRight && topRight === bottomLeft && bottomLeft === bottomRight) {
            style.borderRadius = topLeft.radius;
        }
        else {
            if (topLeft !== undefined) style.borderTopLeftRadius = topLeft.radius;
            if (topRight !== undefined) style.borderTopRightRadius = topRight.radius;
            if (bottomLeft !== undefined) style.borderBottomLeftRadius = bottomLeft.radius;
            if (bottomRight !== undefined) style.borderBottomRightRadius = bottomRight.radius;
        }

        return style;
    }

    static fromStyle(style) {
        const borderRadius = style.borderRadius;

        let corners = Corners.unset;

        if (View._propertyIsSet(borderRadius) === true) {
            const roundedCorner = new RoundedCorner(borderRadius);
            corners = Corners.all(roundedCorner);
        }

        const topLeftCornerRadius = style.borderTopLeftRadius;
        if (View._propertyIsSet(topLeftCornerRadius) === true) corners.topLeft = new RoundedCorner(topLeftCornerRadius);

        const topRightCornerRadius = style.borderTopRightRadius;
        if (View._propertyIsSet(topRightCornerRadius) === true) corners.topRight = new RoundedCorner(topRightCornerRadius);

        const bottomLeftCornerRadius = style.borderBottomLeftRadius;
        if (View._propertyIsSet(bottomLeftCornerRadius) === true) corners.bottomLeft = new RoundedCorner(bottomLeftCornerRadius);

        const bottomRightCornerRadius = style.borderBottomRightRadius;
        if (View._propertyIsSet(bottomRightCornerRadius) === true) corners.bottomRight = new RoundedCorner(bottomRightCornerRadius);

        return corners;
    }

    equals(value) {
        return this.topLeft === value.topLeft && this.topRight === value.topRight && this.bottomLeft === value.bottomLeft && this.bottomRight === value.bottomRight;
    }
}

export class RoundedCorner {
    constructor(radius) {
        this._radius = radius;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
    }
}

export class Border {
    static get Style() {
        return Object.freeze({
            none: "none",
            hidden: "hidden",
            dotted: "dotted",
            dashed: "dashed",
            solid: "solid",
            double: "double",
            groove: "groove",
            ridge: "ridge",
            inset: "inset",
            outset: "outset"
        });
    }

    constructor(color, width = 1.0, style = Border.Style.solid) {
        this._color = color;
        this._width = width;
        this._style = style;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    get style() {
        return this._style;
    }

    set style(value) {
        this._style = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    static get none() {
        return new Border(undefined, undefined, Border.Style.none);
    }
}

export class Inset extends Stylable {
    constructor(top, left, right, bottom) {
        super();

        this._top = top;
        this._left = left;
        this._right = right;
        this._bottom = bottom;
    }

    static vertical(value) {
        return new this(value, undefined, undefined, value);
    }

    static horizontal(value) {
        return new this(undefined, value, value, undefined);
    }

    static top(value) {
        return new this(value, undefined, undefined, undefined);
    }

    static bottom(value) {
        return new this(undefined, undefined, undefined, value);
    }

    static left(value) {
        return new this(undefined, value, undefined, undefined);
    }

    static right(value) {
        return new this(undefined, undefined, value, undefined);
    }

    static axes(horizontal = undefined, vertical = undefined) {
        return new this(vertical, horizontal, horizontal, vertical);
    }

    static all(value) {
        return new this(value, value, value, value);
    }

    static get unset() {
        return new this(undefined, undefined, undefined, undefined);
    }

    get top() {
        return this._top;
    }

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    get bottom() {
        return this._bottom;
    }

    set top(value) {
        this._top = value;
    }

    set left(value) {
        this._left = value;
    }

    set right(value) {
        this._right = value;
    }

    set bottom(value) {
        this._bottom = value;
    }

    equals(value) {
        return value.left === this.left && value.right === this.right && value.top === this.top && value.bottom === this.bottom;
    }
}

export class Margin extends Inset {
    static get zero() {
        return new this("0px", "0px", "0px", "0px");
    }

    static fromStyle(style) {
        const left = style.marginLeft;
        const right = style.marginRight;
        const top = style.marginTop;
        const bottom = style.marginBottom;

        const margin = new Margin(top, left, right, bottom);

        return margin;
    }

    toStyle() {
        let style = {
            marginLeft: "", // Todo hierfür konzept überlegen
            marginRight: "",
            marginTop: "",
            marginBottom: ""
        };

        const left = this.left;
        const right = this.right;
        const top = this.top;
        const bottom = this.bottom;

        if (left !== undefined) style.marginLeft = left;
        if (right !== undefined) style.marginRight = right;
        if (top !== undefined) style.marginTop = top;
        if (bottom !== undefined) style.marginBottom = bottom;

        return style;
    }
}

export class Padding extends Margin {

    static fromStyle(style) {
        const left = style.paddingLeft;
        const right = style.paddingRight;
        const top = style.paddingTop;
        const bottom = style.paddingBottom;

        const inset = new Padding(top, left, right, bottom);

        return inset;
    }

    toStyle() {
        let style = {
            paddingLeft: "",
            paddingRight: "",
            paddingTop: "",
            paddingBottom: ""
        }

        const left = this.left;
        const right = this.right;
        const top = this.top;
        const bottom = this.bottom;

        if (left !== undefined) style.paddingLeft = left;
        if (right !== undefined) style.paddingRight = right;
        if (top !== undefined) style.paddingTop = top;
        if (bottom !== undefined) style.paddingBottom = bottom;

        return style;
    }
}

export class Borders extends Inset {
    toStyle() {
        let style = {
            borderColor: "",
            borderStyle: "",
            borderWidth: "",

            /*
            borderLeftColor: "",
            borderLeftStyle: "",
            borderLeftWidth: "",

            borderRightColor: "",
            borderRightStyle: "",
            borderRightWidth: "",

            borderTopColor: "",
            borderTopStyle: "",
            borderTopWidth: "",

            borderBottomColor: "",
            borderBottomStyle: "",
            borderBottomWidth: ""
            */
        };

        const left = this.left;
        const right = this.right;
        const top = this.top;
        const bottom = this.bottom;

        if (top !== undefined && left === right && right === top && top === bottom) {
            const borderColor = top.color;
            const borderStyle = top.style;
            const borderWidth = top.width;

            if (borderColor !== undefined) style.borderColor = borderColor.toStyleRule();
            if (borderStyle !== undefined) style.borderStyle = borderStyle;
            if (borderWidth !== undefined) style.borderWidth = borderWidth;
        }
        else {
            if (left !== undefined) {
                const borderColor = left.color;
                const borderStyle = left.style;
                const borderWidth = left.width;

                if (borderColor !== undefined) style.borderLeftColor = borderColor.toStyleRule();
                if (borderStyle !== undefined) style.borderLeftStyle = borderStyle;
                if (borderWidth !== undefined) style.borderLeftWidth = borderWidth;
            }
            if (right !== undefined) {
                const borderColor = right.color;
                const borderStyle = right.style;
                const borderWidth = right.width;

                if (borderColor !== undefined) style.borderRightColor = borderColor.toStyleRule();
                if (borderStyle !== undefined) style.borderRightStyle = borderStyle;
                if (borderWidth !== undefined) style.borderRightWidth = borderWidth;
            }
            if (top !== undefined) {
                const borderColor = top.color;
                const borderStyle = top.style;
                const borderWidth = top.width;

                if (borderColor !== undefined) style.borderTopColor = borderColor.toStyleRule();
                if (borderStyle !== undefined) style.borderTopStyle = borderStyle;
                if (borderWidth !== undefined) style.borderTopWidth = borderWidth;
            }
            if (bottom !== undefined) {
                const borderColor = bottom.color;
                const borderStyle = bottom.style;
                const borderWidth = bottom.width;

                if (borderColor !== undefined) style.borderBottomColor = borderColor.toStyleRule();
                if (borderStyle !== undefined) style.borderBottomStyle = borderStyle;
                if (borderWidth !== undefined) style.borderBottomWidth = borderWidth;
            }
        }

        return style;
    }

    static _deriveBorder(color, width, style) { // Todo stattdessen vielleicht (static) Border.fromStyle?
        let borderColor;
        let borderWidth;
        let borderStyle;

        if (View._propertyIsSet(color) === true) borderColor = Color.fromStyleRule(color);
        if (View._propertyIsSet(width) === true) borderWidth = width;
        if (View._propertyIsSet(style) === true) borderStyle = style;

        if (borderColor !== undefined || borderWidth !== undefined || borderStyle !== undefined) return new Border(borderColor, borderWidth, borderStyle);
    }

    static fromStyle(style) {

        const borderColor = style.borderColor;
        const borderWidth = style.borderWidth;
        const borderStyle = style.borderStyle;

        let borders = Borders.unset;

        const commonBorder = Borders._deriveBorder(borderColor, borderWidth, borderStyle);
        if (commonBorder !== undefined) borders = Borders.all(commonBorder);

        const leftColor = style.borderLeftColor;
        const leftWidth = style.borderLeftWidth;
        const leftStyle = style.borderLeftStyle;

        const leftBorder = Borders._deriveBorder(leftColor, leftWidth, leftStyle);
        if (leftBorder !== undefined) borders.left = leftBorder;

        const rightColor = style.borderRightColor;
        const rightWidth = style.borderRightWidth;
        const rightStyle = style.borderRightStyle;

        const rightBorder = Borders._deriveBorder(rightColor, rightWidth, rightStyle);
        if (rightBorder !== undefined) borders.right = rightBorder;

        const topColor = style.borderTopColor;
        const topWidth = style.borderTopWidth;
        const topStyle = style.borderTopStyle;

        const topBorder = Borders._deriveBorder(topColor, topWidth, topStyle);
        if (topBorder !== undefined) borders.top = topBorder;

        const bottomColor = style.borderBottomColor;
        const bottomWidth = style.borderBottomWidth;
        const bottomStyle = style.borderBottomStyle;

        const bottomBorder = Borders._deriveBorder(bottomColor, bottomWidth, bottomStyle);
        if (bottomBorder !== undefined) borders.bottom = bottomBorder;

        return borders;
    }
}

export class View extends Observable {

    constructor() {
        super();

        this._createNode();

        this._views = [];
    }

    set pointerEvents(value) {
        this.node.style.pointerEvents = value;
    }

    get pointerEvents() {
        return this.node.style.pointerEvents;
    }

    static get display() {
        return "block";
    }

    get isHidden() {
        return this.node.style.display === "none";
    }

    set isHidden(value) {
        this.node.style.display = value ? "none" : this.constructor.display;
    }

    get views() {
        return this._views;
    }

    static get tag() {
        throw new ImplementationError();
    }

    get classList() {
        return this.node.classList;
    }

    get id() {
        return this.node.id;
    }

    set id(value) {
        this.node.id = value;
    }

    addViewBefore(view, nextView) {
        this._prepareView(view);

        if (nextView === undefined) throw new Error("Cannot insert a view before another view without a reference view");

        this.node.insertBefore(view.node, nextView.node);
    }

    addView(view) {
        this._prepareView(view);

        this.node.appendChild(view.node);
    }

    _prepareView(view) {
        if (view.parentView !== undefined) throw new Error("Cannot add view to more than one parent view");

        this.views.push(view);

        view.parentView = this;
    }

    removeView(view) {
        const views = this.views;
        const index = views.indexOf(view);

        if (index >= 0) views.splice(index, 1);
        this.node.removeChild(view.node);
        view.parentView = undefined;

        return view;
    }

    removeFromParentView() {
        const parentView = this.parentView;

        if (parentView === undefined) return;

        parentView.removeView(this);

        return parentView;
    }

    removeViews() {
        const views = this.views;
        views.splice(0, views.length).forEach(view => this.removeView(view));
    }

    _createNode() {
        const node = document.createElement(this.constructor.tag);
        node.style.display = this.constructor.display;

        this._node = node;

        return node;
    }

    get node() {
        return this._node;
    }

    get parentView() {
        return this._parentView;
    }

    get isDisabled() {
        return this.node.disabled;
    }

    set isDisabled(value) {
        this.node.disabled = value;

        this.views.forEach(view => view.isDisabled = value);
    }

    get innerHTML() {
        return this.node.innerHTML;
    }

    set innerHTML(value) {
        this.node.innerHTML = value;
    }

    set parentView(value) {
        this._parentView = value;
    }

    static get PointerEvents() {
        return Object.freeze({
            auto: "auto",
            none: "none"
        });
    }

    static get Position() {
        return Object.freeze({
            static: "static",
            relative: "relative",
            absolute: "absolute",
            sticky: "sticky",
            fixed: "fixed"
        });
    }

    static get Overflow() {
        return Object.freeze({
            visible: "visible",
            hidden: "hidden",
            scroll: "scroll",
            automatic: "auto"
        });
    }

    static _propertyIsSet(value) {
        return value !== undefined && value !== "" && value !== "unset";
    }

    static _deriveConstrains(str) {
        const regex = new RegExp("[+-]?\\d+(?:\\.\\d+)?(?:%|vmax|vmin|vh|vw|rem|ch|ex|em|cm|mm|in|px|pt|pc)", "g");

        const match = str.match(regex);

        if (match === null) throw new Error("Unable to parse constraints");

        return match;
    }

    addDOMEventListener(type, listener) {
        this.node.addEventListener(type, listener); // TODO da noch false am ende?
    }

    get overflow() {
        const overflow = this.node.style.overflow;
        const values = Object.values(View.Overflow);

        const value = values.find(value => value === overflow);
        if (value === undefined) throw new Error(`Unsupported overflow: ${overflow}`);

        return value;
    }

    set overflow(value) {
        this.node.style.overflow = value;
    }

    get position() {
        const position = this.node.style.position;
        const values = Object.values(View.Position);

        const value = values.find(value => value === position);
        if (value === undefined) throw new Error(`Unsupported position: ${position}`);

        return value;
    }

    get zIndex() {
        return this.node.style.zIndex;
    }

    set zIndex(value) {
        this.node.style.zIndex = value;
    }

    set position(value) {
        this.node.style.position = value;
    }

    get top() {
        return this.node.style.top;
    }

    set top(value) {
        this.node.style.top = value;
    }

    get left() {
        return this.node.style.left;
    }

    set left(value) {
        this.node.style.left = value;
    }

    get bottom() {
        return this.node.style.bottom;
    }

    set bottom(value) {
        this.node.style.bottom = value;
    }

    get right() {
        return this.node.style.right;
    }

    set right(value) {
        this.node.style.right = value;
    }

    get width() {
        return this.node.style.width;
    }

    set width(value) {
        this.node.style.width = value;
    }

    get height() {
        return this.node.style.height;
    }

    set height(value) {
        this.node.style.height = value;
    }

    get minWidth() {
        return this.node.style.minWidth;
    }

    set minWidth(value) {
        this.node.style.minWidth = value;
    }

    get minHeight() {
        return this.node.style.minHeight;
    }

    set minHeight(value) {
        this.node.style.minHeight = value;
    }

    get maxWidth() {
        return this.node.style.maxWidth;
    }

    set maxWidth(value) {
        this.node.style.maxWidth = value;
    }

    get maxHeight() {
        return this.node.style.maxHeight;
    }

    set maxHeight(value) {
        this.node.style.maxHeight = value;
    }

    get margin() {
        const style = this.node.style;

        return Margin.fromStyle(style);
    }

    set margin(value) {
        if (value === undefined) return;

        Object.assign(this.node.style, value.toStyle());
    }

    get padding() {
        const style = this.node.style;

        return Padding.fromStyle(style);
    }

    set padding(value) {
        if (value === undefined) return;

        Object.assign(this.node.style, value.toStyle());
    }

    get grow() {
        return this.node.style.flexGrow;
    }

    set grow(value) {
        this.node.style.flexGrow = value;
    }

    get shrink() {
        return this.node.style.flexShrink;
    }

    set shrink(value) {
        this.node.style.flexShrink = value;
    }

    get basis() {
        return this.node.style.flexBasis;
    }

    set basis(value) {
        this.node.style.flexBasis = value;
    }

    get backgroundColor() {
        const backgroundColor = this.node.style.backgroundColor;

        if (View._propertyIsSet(backgroundColor) === true) return Color.fromStyleRule(backgroundColor);
    }

    set backgroundColor(value) {
        this.node.style.backgroundColor = value.toStyleRule();
    }

    get backgroundImage() {
        return this.node.style.backgroundImage;
    }

    set backgroundImage(value) {
        this.node.style.backgroundImage = value;
    }

    get backgroundSize() {
        return this.node.style.backgroundSize;
    }

    set backgroundSize(value) {
        this.node.style.backgroundSize = value;
    }

    get color() {
        const color = this.node.style.color;

        if (View._propertyIsSet(color) === true) return Color.fromStyleRule(color);
    }

    set color(value) {
        const node = this.node;

        node.style.color = value.toStyleRule();
    }

    set borders(value) {
        if (value === undefined) return;

        Object.assign(this.node.style, value.toStyle());
    }

    get borders() {
        const style = this.node.style;

        return Borders.fromStyle(style);
    }

    get corners() {
        const style = this.node.style;

        return Corners.fromStyle(style);
    }

    set corners(value) {
        if (value === undefined) return;

        Object.assign(this.node.style, value.toStyle());
    }

    get shadow() {
        const style = this.node.style;

        return BoxShadow.fromStyleRule(style.boxShadow);
    }

    set shadow(value) {
        if (value === undefined) return; // Todo review
        const node = this.node;

        node.style.boxShadow = value.toStyleRule();
    }

    get filter() {
        const style = this.node.style;

        return GaussianBlurFilter.fromStyle(style);
    }

    set filter(value) {
        if (value === undefined) return;

        Object.assign(this.node.style, value.toStyle());
    }

    get gridInset() {
        const style = this.node.style;

        return GridInset.fromStyle(style);
    }

    set gridInset(value) {
        if (value === undefined) return;

        Object.assign(this.node.style, value.toStyle());
    }

    get htmlText() {
        return this.node.outerHTML;
    }
}

export class GaussianBlurFilter extends Stylable {
    constructor(radius) {
        super();

        this._radius = radius;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
    }

    static fromStyle(style) {
        const filter = style.filter;
        if (View._propertyIsSet(filter) === false || filter.includes("blur") === false) return;

        const constraints = View._deriveConstrains(filter);
        if (constraints.left !== 1) throw new Error(`Cannot derive gaussian blur from rule ${filter}`);

        const radius = constraints[0];

        return new GaussianBlurFilter(radius);
    }

    toStyle() {
        let style = { filter: "" };

        style.filter = `blur(${this.radius})`;

        return style;
    }

    equals(value) {
        return this.radius === value.radius;
    }
}

export class GridInset extends Inset {
    static fromStyle(style) { // Todo des direkt in view auslagern, nicht in inset (davor evaluieren, ob sinvoll)
        const left = style.gridColumnStart;
        const right = style.gridColumnEnd;
        const top = style.gridRowStart;
        const bottom = style.gridRowEnd;

        const margin = new GridInset(top, left, right, bottom);

        return margin;
    }

    toStyle() {
        let style = {
            gridColumnStart: "", // Todo hierfür konzept überlegen
            gridColumnEnd: "",
            gridRowStart: "",
            gridRowEnd: ""
        };

        const left = this.left;
        const right = this.right;
        const top = this.top;
        const bottom = this.bottom;

        if (left !== undefined) style.gridColumnStart = left;
        if (right !== undefined) style.gridColumnEnd = right;
        if (top !== undefined) style.gridRowStart = top;
        if (bottom !== undefined) style.gridRowEnd = bottom;

        return style;
    }
}

export class Gap {
    constructor(horizontal, vertical) {
        this._horizontal = horizontal;
        this._vertical = vertical;

        // Todo oder hier einfach object.freeze(this), dann Inset und alle Unterklassen analog, oder observable und dann parent notifien und wert neu setzen
    }

    static all(value) {
        return new this(value, value);
    }

    static get zero() {
        return new this("0px", "0px");
    }

    static get unset() {
        return new this(undefined, undefined);
    }

    get horizontal() {
        return this._horizontal;
    }

    set horizontal(value) {
        this._horizontal = value;
    }

    get vertical() {
        return this._vertical;
    }

    set vertical(value) {
        this._vertical = value;
    }
}

export class Grid extends View {

    static get display() {
        return "grid";
    }

    static get tag() {
        return "span";
    }

    get gap() {
        const node = this.node;

        const vertical = node.style.gridColumnGap;
        const horizontal = node.style.gridRowGap;

        return new Gap(horizontal, vertical);
    }

    set gap(value) {
        const node = this.node;

        node.style.gridColumnGap = value.vertical;
        node.style.gridRowGap = value.horizontal;
    }

    set columns(value) {
        this.node.style.gridTemplateColumns = value;
    }

    get columns() {
        return this.node.style.gridTemplateColumns;
    }

    set rows(value) {
        this.node.style.gridTemplateRows = value;
    }

    get rows() {
        return this.node.style.gridTemplateRows;
    }
}

export class StackView extends View {

    static get Axis() {
        return Object.freeze({
            vertical: "column",
            horizontal: "row"
        });
    }

    static get Direction() {
        return Object.freeze({
            default: "",
            reversed: "-reverse"
        });
    }

    static get Wrap() {
        return Object.freeze({
            none: "nowrap",
            wrap: "wrap",
            reversed: "wrap-reverse"
        });
    }

    static get MainAxisAlignment() {
        return Object.freeze({
            flexStart: "flex-start",
            flexEnd: "flex-end",
            start: "start",
            end: "end",
            center: "center",
            spaceBetween: "space-between",
            spaceAround: "space-around",
            spaceEvenly: "space-evenly",
            left: "left",
            right: "right"
        });
    }

    static get CrossAxisAlignment() {
        return Object.freeze({
            stretch: "stretch",
            flexStart: "flex-start",
            flexEnd: "flex-end",
            center: "center",
            baseline: "baseline",
            firstBaseline: "first baseline",
            lastBaseline: "last baseline",
            start: "start",
            end: "end",
            selfStart: "self-start",
            selfEnd: "self-end"
        });
    }

    static get WrapCrossAxisAlignment() {
        return Object.freeze({
            default: "unset", // oder unset oder ""?? TODO
            flexStart: "flex-start",
            flexEnd: "flex-end",
            center: "center",
            spaceBetween: "space-between",
            spaceAround: "space-around",
            spaceEvenly: "space-evenly",
            stretch: "stretch",
            start: "start",
            end: "end",
            baseline: "baseline",
            firstBaseline: "first baseline",
            lastBaseline: "last baseline"
        });
    }

    static get CrossAxisSelfAlignment() {
        return Object.freeze({
            auto: "auto",
            flexStart: "flex-start",
            flexEnd: "flex-end",
            center: "center",
            baseline: "baseline",
            stretch: "stretch"
        });
    }

    constructor(axis = StackView.Axis.vertical, mainAxisAlignment = StackView.MainAxisAlignment.flexStart, crossAxisAlignment = StackView.CrossAxisAlignment.stretch, gap = Gap.unset, direction = StackView.Direction.default, wrap = StackView.Wrap.none, wrapCrossAxisAlignment = StackView.WrapCrossAxisAlignment.default) {
        super();

        this.axis = axis;
        this.direction = direction;
        this.wrap = wrap;
        this.mainAxisAlignment = mainAxisAlignment;
        this.crossAxisAlignment = crossAxisAlignment;
        this.wrapCrossAxisAlignment = wrapCrossAxisAlignment;
        this.gap = gap;
    }

    get order() {
        return this.node.style.order;
    }

    set order(value) {
        this.node.style.order = value;
    }

    get axis() {
        const vertical = StackView.Axis.vertical;
        if (this.node.style.flexDirection.startsWith(vertical) === true) return vertical;

        return StackView.Axis.horizontal;
    }

    set axis(value) {
        this.node.style.flexDirection = value;
    }

    get direction() {
        const reverse = StackView.Direction.reversed;
        if (this.node.style.flexDirection.endsWith(reverse) === true) return reverse;

        return StackView.Direction.default;
    }

    set direction(value) {
        const node = this.node;
        const reverse = StackView.Direction.reversed;

        switch (value) {
            case StackView.Direction.default:
                node.style.flexDirection = node.style.flexDirection.replace(reverse, "");
                break;
            case reverse:
                if (this.direction !== value) node.style.flexDirection += reverse;
                break;
            default:
                throw new Error(`Unsupported direction ${value}`);
        }
    }

    get wrap() {
        const wrap = this.node.style.flexWrap;
        const values = Object.values(StackView.Wrap);

        const value = values.find(value => value === wrap);
        if (value === undefined) throw new Error(`Unsupported wrap: ${wrap}`);

        return value;
    }

    set wrap(value) {
        this.node.style.flexWrap = value;
    }

    get mainAxisAlignment() {
        const alignment = this.node.style.justifyContent;
        const values = Object.values(StackView.MainAxisAlignment);

        const value = values.find(value => value === alignment);
        if (value === undefined) throw new Error(`Unsupported main axis alignment: ${alignment}`);

        return value;
    }

    set mainAxisAlignment(value) {
        this.node.style.justifyContent = value;
    }

    get crossAxisAlignment() {
        const alignment = this.node.style.alignItems;
        const values = Object.values(StackView.CrossAxisAlignment);

        const value = values.find(value => value === alignment);
        if (value === undefined) throw new Error(`Unsupported cross axis alignment: ${alignment}`);

        return value;
    }

    set crossAxisAlignment(value) {
        this.node.style.alignItems = value;
    }

    get wrapCrossAxisAlignment() {
        const alignment = this.node.style.alignContent;
        const values = Object.values(StackView.WrapCrossAxisAlignment);

        const value = values.find(value => value === alignment);
        if (value === undefined) throw new Error(`Unsupported wrap cross axis alignment: ${alignment}`);

        return value;
    }

    set wrapCrossAxisAlignment(value) {
        this.node.style.alignContent = value;
    }

    get crossAxisSelfAlignment() {
        const alignment = this.node.style.alignSelf;
        const values = Object.values(StackView.CrossAxisSelfAlignment);

        const value = values.find(value => value === alignment);
        if (value === undefined) throw new Error(`Unsupported cross self axis alignment: ${alignment}`);

        return value;
    }

    set crossAxisSelfAlignment(value) {
        this.node.style.alignSelf = value;
    }

    get gap() {
        const node = this.node;

        const vertical = node.style.columnGap;
        const horizontal = node.style.rowGap;

        return new Gap(horizontal, vertical);
    }

    set gap(value) {
        const node = this.node;

        node.style.columnGap = value.vertical;
        node.style.rowGap = value.horizontal;
    }

    static get display() {
        return "flex";
    }

    static get tag() {
        return "span"; // Todo oder block?
    }
}

export class Label extends View {

    static get WhiteSpace() {
        return Object.freeze({
            default: "normal",
            nowrap: "nowrap",
            pre: "pre",
            preWrap: "pre-wrap",
            preLine: "pre-line",
            breakSpaces: "break-spaces"
        });
    }

    static get FontWeight() {
        return Object.freeze({
            normal: "normal",
            bold: "bold",
            bolder: "bolder",
            lighter: "lighter",
            "100": "100",
            "200": "200",
            "300": "300",
            "400": "400",
            "500": "500",
            "600": "600",
            "700": "700",
            "800": "800",
            "900": "900"
        });
    }

    static get TextAlignment() {
        return Object.freeze({
            start: "start",
            end: "end",
            left: "left",
            right: "right",
            center: "center",
            justify: "justify",
        });
    }

    static get FontFamily() {
        return Object.freeze({
            serif: "serif",
            sansSerif: "sans-serif",
            monospace: "monospace",
            cursive: "cursive",
            fantasy: "fantasy",
            inherit: "inherit"
        });
    }

    static get TextOverflow() {
        return Object.freeze({
            ellipsis: "ellipsis",
            clip: "clip",
        });
    }

    constructor(text = "") {
        super();

        this.text = text;
    }

    get webkitTextSizeAdjust() {
        return this.node.style.webkitTextSizeAdjust;
    }

    set webkitTextSizeAdjust(value) {
        this.node.style.webkitTextSizeAdjust = value;
    }

    get text() {
        return this.node.innerText;
    }

    set text(value) {
        this.node.innerText = value;
    }

    get fontSize() {
        const node = this.node;

        const fontSize = node.style.fontSize;

        return fontSize;
    }

    set fontSize(value) {
        const node = this.node;

        const fontSize = value;

        node.style.fontSize = fontSize;
    }

    get fontFamily() {
        return this.node.style.fontFamily;
    }

    set fontFamily(value) {
        this.node.style.fontFamily = value;
    }

    get fontStyle() {
        return this.node.style.fontStyle;
    }

    set fontStyle(value) {
        this.node.style.fontStyle = value;
    }

    get whiteSpace() {
        const whiteSpace = this.node.style.whiteSpace;
        const values = Object.values(Label.WhiteSpace);

        const value = values.find(value => value === whiteSpace);
        if (value === undefined) throw new Error(`Unsupported whiteSpace: ${whiteSpace}`);

        return value;
    }

    set whiteSpace(value) {
        this.node.style.whiteSpace = value;
    }

    get textOverflow() {
        const textOverflow = this.node.style.textOverflow;
        const values = Object.values(Label.TextOverflow);

        const value = values.find(value => value === textOverflow);
        if (value === undefined) throw new Error(`Unsupported textOverflow: ${textOverflow}`);

        return value;
    }

    set textOverflow(value) {
        this.node.style.textOverflow = value;
    }

    get fontWeight() {
        const fontWeight = this.node.style.fontWeight;
        const values = Object.values(Label.FontWeight);

        const value = values.find(value => value === fontWeight);
        if (value === undefined) throw new Error(`Unsupported fontWeight: ${fontWeight}`);

        return value;
    }

    set fontWeight(value) {
        this.node.style.fontWeight = value;
    }

    get textAlignment() {
        const textAlignment = this.node.style.textAlign;
        const values = Object.values(Label.TextAlignment);

        const value = values.find(value => value === textAlignment);
        if (value === undefined) throw new Error(`Unsupported textAlignment: ${textAlignment}`);

        return value;
    }

    set textAlignment(value) {
        this.node.style.textAlign = value;
    }

    get textShadow() {
        const style = this.node.style;

        return TextShadow.fromStyleRule(style.textShadow);
    }

    set textShadow(value) {
        if (value === undefined) return;

        this.node.style.textShadow = value.toStyleRule();
    }

    static get tag() {
        return "span";
    }
}

export class Icon extends Label {
    static get tag() {
        return "i";
    }
}

export class TextField extends Label {

    constructor(text, onChange) {
        super(text);

        this.onChange = onChange;

        this._addListeners();
    }

    get onChange() {
        return this._onChange;
    }

    set onChange(value) {
        this._onChange = value;
    }

    get onKeyPress() {
        return this._onKeyPress;
    }

    set onKeyPress(value) {
        this._onKeyPress = value;
    }

    get onPaste() {
        return this._onPaste;
    }

    set onPaste(value) {
        this._onPaste = value;
    }

    get onInput() {
        return this._onInput;
    }

    set onInput(value) {
        this._onInput = value;
    }

    static get TEXT_FIELD_CHANGE_NOTIFICATION_TYPE() {
        return "change";
    }

    static get TEXT_FIELD_KEYPRESS_NOTIFICATION_TYPE() {
        return "keypress";
    }

    static get TEXT_FIELD_PASTE_NOTIFICATION_TYPE() {
        return "paste";
    }

    static get TEXT_FIELD_INPUT_NOTIFICATION_TYPE() {
        return "input";
    }

    get isRequired() {
        return this.node.required;
    }

    set isRequired(value) {
        this.node.required = value;
    }

    isValid() {
        return this.node.checkValidity();
    }

    validate() {
        return this.node.reportValidity();
    }

    set validationMessage(value) {
        return this.node.setCustomValidity(value);
    }

    get validationMessage() {
        return this.node.validationMessage;
    }

    static get TextInputType() {
        return Object.freeze({
            text: "text",
            password: "password",
            email: "email",
            search: "search",
            telephone: "tel",
            url: "url"
        });
    }

    get textInputType() {
        const textInputType = this.node.type;
        const values = Object.values(TextField.TextInputType);

        const value = values.find(value => value === textInputType);
        if (value === undefined) throw new Error(`Unsupported textInputType: ${textInputType}`);

        return value;
    }

    set textInputType(value) {
        this.node.type = value;
    }

    static get tag() {
        return "input";
    }

    get text() {
        return this.node.value;
    }

    set text(value) {
        this.node.value = value;
    }

    get placeholder() {
        return this.node.placeholder;
    }

    set placeholder(value) {
        this.node.placeholder = value;
    }

    get isFocused() {
        return document.activeElement === this.node;
    }

    focus() {
        this.node.focus();
    }

    clear() {
        this.text = "";
    }

    _onChangeWrapper() {
        const onChange = this.onChange;
        if (onChange !== undefined) onChange();

        const event = new Event(TextField.TEXT_FIELD_CHANGE_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _onKeyPressWrapper() {
        const onKeyPress = this.onKeyPress;
        if (onKeyPress !== undefined) onKeyPress();

        const event = new Event(TextField.TEXT_FIELD_KEYPRESS_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _onPasteWrapper() {
        const onPaste = this.onPaste;
        if (onPaste !== undefined) onPaste();

        const event = new Event(TextField.TEXT_FIELD_PASTE_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _onInputWrapper() {
        const onInput = this.onInput;
        if (onInput !== undefined) onInput();

        const event = new Event(TextField.TEXT_FIELD_INPUT_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _addListeners() {
        const node = this.node;

        node.addEventListener(TextField.TEXT_FIELD_CHANGE_NOTIFICATION_TYPE, this._onChangeWrapper.bind(this), true); // Todo des noch ändern
        node.addEventListener(TextField.TEXT_FIELD_KEYPRESS_NOTIFICATION_TYPE, this._onChangeWrapper.bind(this), true); // Todo des noch ändern
        node.addEventListener(TextField.TEXT_FIELD_PASTE_NOTIFICATION_TYPE, this._onChangeWrapper.bind(this), true); // Todo des noch ändern
        node.addEventListener(TextField.TEXT_FIELD_INPUT_NOTIFICATION_TYPE, this._onChangeWrapper.bind(this), true); // Todo des noch ändern
    }

    get readOnly() {
        return this.node.readonly;
    }

    set readOnly(value) {
        this.node.readonly = value;
    }

    get minLength() {
        return this.node.minLength;
    }

    set minLength(value) {
        this.node.minLength = value;
    }

    get maxLength() {
        return this.node.maxLength;
    }

    set maxLength(value) {
        this.node.maxLength = value;
    }

    get pattern() {
        return this.node.pattern;
    }

    set pattern(value) {
        this.node.pattern = value;
    }
}

export class TextArea extends TextField {
    static get Resize() {
        return Object.freeze({
            both: "both",
            horizontal: "horizontal",
            vertical: "vertical",
            none: "none"
        });
    }

    static get Wrap() {
        return Object.freeze({
            hard: "hard",
            soft: "soft",
            off: "off"
        });
    }

    static get tag() {
        return "textarea";
    }

    get rows() {
        return this.node.rows;
    }

    set rows(value) {
        this.node.rows = value;
    }

    get cols() {
        return this.node.cols;
    }

    set cols(value) {
        this.node.cols = value;
    }

    get wrap() {
        return this.node.wrap;
    }

    set wrap(value) {
        this.node.wrap = value;
    }

    set resize(value) {
        this.node.style.resize = value;
    }

    get resize() {
        return this.node.style.resize;
    }
}

export class TextView extends Label {
    static get tag() {
        return "p";
    }
}

export class Header extends View {
    static get tag() {
        return "header";
    }
}

export class Section extends View {
    static get tag() {
        return "section";
    }
}

export class Footer extends View {
    static get tag() {
        return "footer";
    }
}

export class Navigation extends View {
    static get tag() {
        return "nav";
    }
}

export class InlineBlock extends View {
    static get tag() {
        return "span";
    }
}

export class Block extends View {
    static get tag() {
        return "div";
    }
}

export class Headline1 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h1";
    }
}

export class Headline2 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h2";
    }
}

export class Headline3 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h3";
    }
}

export class Headline4 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h4";
    }
}

export class Headline5 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h5";
    }
}

export class Headline6 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h6";
    }
}

export class Button extends Label {
    static get BUTTON_CLICK_NOTIFICATION_TYPE() {
        return "click";
    }

    static get BUTTON_MOUSE_OVER_NOTIFICATION_TYPE() {
        return "mouseenter";
    }

    static get BUTTON_MOUSE_OUT_NOTIFICATION_TYPE() {
        return "mouseleave";
    }

    constructor(text, onClick, onMouseOver, onMouseOut) {
        super(text);

        this.onClick = onClick;
        this.onMouseOver = onMouseOver;
        this.onMouseOut = onMouseOut;

        this._addListeners();
    }

    static get tag() {
        return "button";
    }

    _addListeners() {
        const node = this.node;

        node.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onClickWrapper.bind(this), true); // Todo des noch ändern
        node.addEventListener(Button.BUTTON_MOUSE_OUT_NOTIFICATION_TYPE, this._onMouseOutWrapper.bind(this), true);
        node.addEventListener(Button.BUTTON_MOUSE_OVER_NOTIFICATION_TYPE, this._onMouseOverWrapper.bind(this), true);
    }

    _onClickWrapper(event) {
        const onClick = this.onClick;
        if (onClick !== undefined) onClick(event);

        const e = new Event(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this);
        this.notifyAll(e);
    }

    _onMouseOutWrapper(event) {
        const onMouseOut = this.onMouseOut;
        if (onMouseOut !== undefined) onMouseOut(event);

        const e = new Event(Button.BUTTON_MOUSE_OUT_NOTIFICATION_TYPE, this);
        this.notifyAll(e);
    }

    _onMouseOverWrapper(event) {
        const onMouseOver = this.onMouseOver;
        if (onMouseOver !== undefined) onMouseOver(event);

        const e = new Event(Button.BUTTON_MOUSE_OVER_NOTIFICATION_TYPE, this);
        this.notifyAll(e);
    }

    get onClick() {
        return this._onClick;
    }

    get onMouseOver() {
        return this._onMouseOver;
    }

    get onMouseOut() {
        return this._onMouseOut;
    }

    set onClick(value) {
        this._onClick = value;
    }

    set onMouseOver(value) {
        this._onMouseOver = value;
    }

    set onMouseOut(value) {
        this._onMouseOut = value;
    }
}
/*
export class Option extends View {
    get text() {
        return this.node.text;
    }

    set text(value) {
        this.node.text = value;
    }

    static get tag() {
        return "option";
    }
}
*/
export class Select extends View {

    constructor() {
        super();

        this._addListeners();
    }

    static get SELECT_ON_SELECTION_TYPE_NOTIFICATION() { // todo namen vereinheitlichen
        return "select";
    }

    get options() {
        return this.node.options;
    }

    add(option) {
        this.options.add(option);
    }

    get selectedIndex() {
        return this.node.selectedIndex;
    }

    get selectedOption() {
        const options = this.options;
        const selectedIndex = this.selectedIndex;
        if (options.length < 1 || selectedIndex < 0) return;

        return options[selectedIndex];
    }

    _addListeners() {
        this.node.addEventListener(Select.SELECT_ON_SELECTION_TYPE_NOTIFICATION, this._onSelect.bind(this), true); // Todo des noch ändern
    }

    _onSelect(event) {
        const e = new Event(Select.SELECT_ON_SELECTION_TYPE_NOTIFICATION, this);
        this.notifyAll(e);
    }

    static get tag() {
        return "select";
    }
}

class ViewPortAnchor extends View {
    static _sharedInstance;

    static get sharedInstance() {
        if (ViewPortAnchor._sharedInstance === undefined) ViewPortAnchor._sharedInstance = new ViewPortAnchor();

        return ViewPortAnchor._sharedInstance;
    }

    _createNode() {
        const node = document.body;

        this._node = node;

        return node;
    }
}

export class Controller extends Observable {

    static get PRESENTATION_STATE_CHANGE_NOTIFICATION_TYPE() {
        return "presentationStateChanged";
    }

    static get VIEWS_CREATED_NOTIFICATION_TYPE() {
        return "viewsCreated";
    }

    static get PresentationState() {
        return Object.freeze({
            presented: "presented",
            presenting: "presenting"
        });
    }

    get presentationState() {
        return this._presentationState;
    }

    set presentationState(value) {
        if (this.presentationState === value) return;

        this._presentationState = value;
        this._onPresentationStateChange();
    }

    constructor() {
        super();
        this._controllers = [];

        this._createView();
        this._onViewsCreated();
        this._determinePresentationState();
    }

    get controllers() {
        return this._controllers;
    }

    _onViewsCreated() {
        const event = new Event(Controller.VIEWS_CREATED_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _createView() {
        //const view = new Section();
        const stackView = new StackView(StackView.Axis.vertical, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.stretch);
        this._view = stackView;

        return stackView;
    }

    addController(controller, parentView = this.view) {
        if (controller.parentController !== undefined) throw new Error("Cannot add controller to more than one parent controller");

        this.controllers.push(controller);

        controller.parentController = this;

        parentView.addView(controller.view);

        this._determinePresentationState();
    }

    _determinePresentationState() {
        this.presentationState = this.controllers.length > 0 ? Controller.PresentationState.presenting : Controller.PresentationState.presented;
    }

    _onPresentationStateChange() {
        const event = new Event(Controller.PRESENTATION_STATE_CHANGE_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    removeController(controller) {
        const controllers = this.controllers;
        const index = controllers.indexOf(controller);

        const view = controller.view;
        const parentView = view.parentView;
        if (parentView !== undefined) parentView.removeView(view);

        if (index >= 0) controllers.splice(index, 1);
        controller.parentController = undefined;

        this._determinePresentationState();

        return controller;
    }

    removeControllers() {
        this.controllers.forEach(this.removeController.bind(this));
    }

    removeFromParentController() {
        const parentController = this.parentController;

        if (parentController === undefined) return;

        parentController.removeController(this);

        return parentController;
    }

    removeControllers() {
        const controllers = this.controllers;

        console.log(controllers.length);

        controllers.splice(0, controllers.length).forEach(controller => controller.removeFromParentController());
    }

    get parentController() {
        return this._parentController;
    }

    set parentController(value) {
        this._parentController = value;
    }

    get view() {
        return this._view;
    }
}

export class RootController extends Controller {
    constructor() {
        super();

        this._attachView();
    }

    _attachView() {
        const view = this.view;

        ViewPortAnchor.sharedInstance.addView(view);
    }

    _createView() {
        const view = super._createView();

        view.position = View.Position.absolute;
        view.left = "0px";
        view.right = "0px";
        view.bottom = "0px";
        view.top = "0px";

        return view;
    }

    removeFromParentController() {
        const parentController = super.removeFromParentController();

        this.view.removeFromParentView();

        return parentController;
    }
}