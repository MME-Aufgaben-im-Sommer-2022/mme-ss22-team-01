/*eslint no-magic-numbers: "off"*/
import Observable, { Event } from "../../utils/Observable.js";

class ImplementationError extends Error { }
class ColorParsingError extends Error { }

/**
 * this class is used as a base class for ui-objects that rely on multiple css-rules to define a state
 */
class Stylable {
    /**
     * this method is used to derive an instance from css rules
     */
    static fromStyle() {
        throw new ImplementationError();
    }

    /**
     * this method is used to derive css rules from the objects-internal state
     */
    toStyle() {
        throw new ImplementationError();
    }

    /**
     * compare wether two elements match each other
     */
    equals() {
        throw new ImplementationError();
    }
}

/**
 * this class used to represent colors and derive them from css rules
 */
export class Color {
    /**
     * this constant is used to define patterns for the currently supported color formats
     */
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

    /**
     * this getter/setter format is used to access the red, green, blue and alpha color components that internally represent the color
     */

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

    /**
     * this method is used to create an rgb color rule to represent the color
     * @returns a string as css rule
     */
    toStyleRule() {
        const components = `${this.red}, ${this.green}, ${this.blue}`, alpha = this.alpha;

        return alpha === 1.0 ? `rgb(${components})` : `rgba(${components}, ${alpha})`;
    }

    /**
     * this method is used to create a new instance from a css rule (as hex)
     * @param {string} str 
     * @returns 
     */
    static fromHex(str) {
        const regex = new RegExp(Color.Format.hex, "i"), match = regex.exec(str), error = new ColorParsingError(`Cannot parse ${str} using hex format`);

        if (match === null || match.groups === undefined) { throw error; }

        let groups = match.groups, red = groups.shortRed, green = groups.shortGreen, blue = groups.shortBlue, alpha = "ff";

        if (red !== undefined && green !== undefined && blue !== undefined) { if (groups.shortAlpha !== undefined) { alpha = groups.shortAlpha; } }
        else if (groups.fullRed !== undefined && groups.fullGreen !== undefined && groups.fullBlue !== undefined) {
            red = groups.fullRed;
            green = groups.fullGreen;
            blue = groups.fullBlue;
            if (groups.fullAlpha !== undefined) { alpha = groups.fullAlpha; }
        }
        else { throw error; }

        return new Color(parseInt(red.padStart(2, red), 16), parseInt(green.padStart(2, green), 16), parseInt(blue.padStart(2, blue), 16), Number(parseInt(alpha.padStart(2, alpha), 16) / 255));
    }

    /**
     * this method is used to create a new instance based on a css rule (in rgb)
     * @param {string} str 
     * @returns 
     */
    static fromRGB(str) {
        const regex = new RegExp(Color.Format.rgb, "i"), match = regex.exec(str);

        if (match === null || match.groups === undefined) { throw new ColorParsingError(`Cannot parse ${str} using rgb(a) format`); }

        let groups = match.groups, alphaComponent = 1.0;
        if (groups.alpha !== undefined) { alphaComponent = Number(groups.alpha); }

        return new Color(parseInt(groups.red), parseInt(groups.green), parseInt(groups.blue), alphaComponent);
    }

    /**
     * this method is used to derive a new instance from any css color string within the known formats
     * @param {string} str input string
     * @param {string} format a specific format to be used
     * @returns 
     */
    static fromStyleRule(str, format) {
        let color;

        switch (format) {
            case undefined:
                try {
                    color = Color.fromRGB(str);
                }
                catch (error) {
                    if ((error instanceof ColorParsingError) === false) { throw error; }

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

    /**
     * the getter/setter pairs below define pre-defined web colors as constants
     */
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

/**
 * this class is used to represent a generic shadow and convert it in css notation
 */
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
        const offsetX = this.offsetX, offsetY = this.offsetY, color = this.color, blurRadius = this.blurRadius;

        if (offsetX === undefined) { throw new Error("Cannot provide a style rule withou offsetX"); }
        if (offsetY === undefined) { throw new Error("Cannot provide a style rule withou offsetY"); }

        let str = `${offsetX} ${offsetY}`;
        if (blurRadius !== undefined) { str += ` ${blurRadius}`; }
        if (color !== undefined) { str = `${color.toStyleRule()} ${str}`; }

        return str;
    }

    static fromStyleRule(str) {
        if (View._propertyIsSet(str) === false) { throw new Error("Cannot parse data from unset property"); }

        const color = Color.fromStyleRule(str), constraints = View._deriveConstrains(str), length = constraints.length;

        let blurRadius, offsetX, offsetY;

        if (length < 2) { throw new Error("Cannot parse shadow information"); }
        offsetX = constraints[0];
        offsetY = constraints[1];

        if (length > 2) { blurRadius = constraints[2]; }

        return new Shadow(offsetX, offsetY, color, blurRadius);
    }
}

/**
 * class alias
 */
export class TextShadow extends Shadow { }

/**
 * this class is used to implement shadow for box-contents
 */
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

        if (spreadRadius !== undefined) { str += ` ${spreadRadius}`; }
        if (this.inset === true) { str += " inset"; }

        return str;
    }

    static fromStyleRule(str) {
        const shadow = Shadow.fromStyleRule(str), inset = str.includes("inset"), constraints = View._deriveConstrains(str);
        let spreadRadius;
        if (constraints.length > 3) { spreadRadius = constraints[constraints.length - 1]; }

        return new BoxShadow(shadow.offsetX, shadow.offsetY, shadow.color, shadow.blurRadius, spreadRadius, inset);
    }
}

/**
 * this class is used to apply corner-styles to objects
 */
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
        };

        const topLeft = this.topLeft, topRight = this.topRight, bottomLeft = this.bottomLeft, bottomRight = this.bottomRight;

        if (topLeft !== undefined && topLeft === topRight && topRight === bottomLeft && bottomLeft === bottomRight) {
            style.borderRadius = topLeft.radius;
        }
        else {
            if (topLeft !== undefined) { style.borderTopLeftRadius = topLeft.radius; }
            if (topRight !== undefined) { style.borderTopRightRadius = topRight.radius; }
            if (bottomLeft !== undefined) { style.borderBottomLeftRadius = bottomLeft.radius; }
            if (bottomRight !== undefined) { style.borderBottomRightRadius = bottomRight.radius; }
        }

        return style;
    }

    static fromStyle(style) {
        const borderRadius = style.borderRadius, topLeftCornerRadius = style.borderTopLeftRadius, topRightCornerRadius = style.borderTopRightRadius, bottomLeftCornerRadius = style.borderBottomLeftRadius, bottomRightCornerRadius = style.borderBottomRightRadius;

        let corners = Corners.unset;

        if (View._propertyIsSet(borderRadius) === true) {
            const roundedCorner = new RoundedCorner(borderRadius);
            corners = Corners.all(roundedCorner);
        }

        if (View._propertyIsSet(topLeftCornerRadius) === true) { corners.topLeft = new RoundedCorner(topLeftCornerRadius); }
        if (View._propertyIsSet(topRightCornerRadius) === true) { corners.topRight = new RoundedCorner(topRightCornerRadius); }
        if (View._propertyIsSet(bottomLeftCornerRadius) === true) { corners.bottomLeft = new RoundedCorner(bottomLeftCornerRadius); }
        if (View._propertyIsSet(bottomRightCornerRadius) === true) { corners.bottomRight = new RoundedCorner(bottomRightCornerRadius); }

        return corners;
    }

    equals(value) {
        return this.topLeft === value.topLeft && this.topRight === value.topRight && this.bottomLeft === value.bottomLeft && this.bottomRight === value.bottomRight;
    }
}

/**
 * this class is used to represent single corners, it may be used together with Corners
 */
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

/**
 * this class is used to represent borders
 */
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
            outset: "outset",
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

/**
 * this class is used to define two dimensional properties on every side on a box-based elements.
 */
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

/**
 * used as a wrapper class for css margins
 */
export class Margin extends Inset {
    static get zero() {
        return new this("0px", "0px", "0px", "0px");
    }

    static fromStyle(style) {
        return new Margin(style.marginTop, style.marginLeft, style.marginRight, style.marginBottom);
    }

    toStyle() {
        let style = {
            marginLeft: "",
            marginRight: "",
            marginTop: "",
            marginBottom: "",
        };

        const left = this.left, right = this.right, top = this.top, bottom = this.bottom;

        if (left !== undefined) { style.marginLeft = left; }
        if (right !== undefined) { style.marginRight = right; }
        if (top !== undefined) { style.marginTop = top; }
        if (bottom !== undefined) { style.marginBottom = bottom; }

        return style;
    }
}

/**
 * used as a wrapper class for css paddings
 */
export class Padding extends Margin {
    static fromStyle(style) {

        return new Padding(style.paddingTop, style.paddingLeft, style.paddingRight, style.paddingBottom);
    }

    toStyle() {
        let style = {
            paddingLeft: "",
            paddingRight: "",
            paddingTop: "",
            paddingBottom: "",
        };

        const left = this.left, right = this.right, top = this.top, bottom = this.bottom;

        if (left !== undefined) { style.paddingLeft = left; }
        if (right !== undefined) { style.paddingRight = right; }
        if (top !== undefined) { style.paddingTop = top; }
        if (bottom !== undefined) { style.paddingBottom = bottom; }

        return style;
    }
}

/**
 * used as a wrapper class for css borders
 */
export class Borders extends Inset {
    toStyle() {
        let style = {
            borderColor: "",
            borderStyle: "",
            borderWidth: "",
        };

        const left = this.left, right = this.right, top = this.top, bottom = this.bottom;

        if (top !== undefined && left === right && right === top && top === bottom) {
            const borderColor = top.color, borderStyle = top.style, borderWidth = top.width;

            if (borderColor !== undefined) { style.borderColor = borderColor.toStyleRule(); }
            if (borderStyle !== undefined) { style.borderStyle = borderStyle; }
            if (borderWidth !== undefined) { style.borderWidth = borderWidth; }
        }
        else {
            if (left !== undefined) {
                const borderColor = left.color, borderStyle = left.style, borderWidth = left.width;

                if (borderColor !== undefined) { style.borderLeftColor = borderColor.toStyleRule(); }
                if (borderStyle !== undefined) { style.borderLeftStyle = borderStyle; }
                if (borderWidth !== undefined) { style.borderLeftWidth = borderWidth; }
            }
            if (right !== undefined) {
                const borderColor = right.color, borderStyle = right.style, borderWidth = right.width;

                if (borderColor !== undefined) { style.borderRightColor = borderColor.toStyleRule(); }
                if (borderStyle !== undefined) { style.borderRightStyle = borderStyle; }
                if (borderWidth !== undefined) { style.borderRightWidth = borderWidth; }
            }
            if (top !== undefined) {
                const borderColor = top.color, borderStyle = top.style, borderWidth = top.width;

                if (borderColor !== undefined) { style.borderTopColor = borderColor.toStyleRule(); }
                if (borderStyle !== undefined) { style.borderTopStyle = borderStyle; }
                if (borderWidth !== undefined) { style.borderTopWidth = borderWidth; }
            }
            if (bottom !== undefined) {
                const borderColor = bottom.color, borderStyle = bottom.style, borderWidth = bottom.width;

                if (borderColor !== undefined) { style.borderBottomColor = borderColor.toStyleRule(); }
                if (borderStyle !== undefined) { style.borderBottomStyle = borderStyle; }
                if (borderWidth !== undefined) { style.borderBottomWidth = borderWidth; }
            }
        }

        return style;
    }

    /**
     * this method is used to derive an instance of Border for given css properties if possible
     * @param {string} color a css color string
     * @param {string} width a css unit
     * @param {string} style a css unit
     * @returns instance of Border or undefined
     */
    static _deriveBorder(color, width, style) {
        let borderColor, borderWidth, borderStyle;

        if (View._propertyIsSet(color) === true) { borderColor = Color.fromStyleRule(color); }
        if (View._propertyIsSet(width) === true) { borderWidth = width; }
        if (View._propertyIsSet(style) === true) { borderStyle = style; }

        if (borderColor !== undefined || borderWidth !== undefined || borderStyle !== undefined) { return new Border(borderColor, borderWidth, borderStyle); }
        return undefined;
    }

    static fromStyle(style) {

        const borderColor = style.borderColor, borderWidth = style.borderWidth, borderStyle = style.borderStyle, commonBorder = Borders._deriveBorder(borderColor, borderWidth, borderStyle);

        let borders = Borders.unset, leftBorder, rightBorder, topBorder, bottomBorder;

        if (commonBorder !== undefined) { borders = Borders.all(commonBorder); }

        leftBorder = Borders._deriveBorder(style.borderLeftColor, style.borderLeftWidth, style.borderLeftStyle);
        if (leftBorder !== undefined) { borders.left = leftBorder; }

        rightBorder = Borders._deriveBorder(style.borderRightColor, style.borderRightWidth, style.borderRightStyle);
        if (rightBorder !== undefined) { borders.right = rightBorder; }

        topBorder = Borders._deriveBorder(style.borderTopColor, style.borderTopWidth, style.borderTopStyle);
        if (topBorder !== undefined) { borders.top = topBorder; }

        bottomBorder = Borders._deriveBorder(style.borderBottomColor, style.borderBottomWidth, style.borderBottomStyle);
        if (bottomBorder !== undefined) { borders.bottom = bottomBorder; }

        return borders;
    }
}

/**
 * this class is the base class for all displayable ui elements that use a base dom-root.
 */
export class View extends Observable {

    /**
     * this constant is used to represent pointer events 
     */
    static get PointerEvents() {
        return Object.freeze({
            auto: "auto",
            none: "none",
        });
    }

    /**
     * this constant is used to represent css positions
     */
    static get Position() {
        return Object.freeze({
            static: "static",
            relative: "relative",
            absolute: "absolute",
            sticky: "sticky",
            fixed: "fixed",
        });
    }

    /**
     * this constant is used to represent css overflow rules
     */
    static get Overflow() {
        return Object.freeze({
            visible: "visible",
            hidden: "hidden",
            scroll: "scroll",
            automatic: "auto",
        });
    }

    constructor() {
        super();

        this._createNode();

        this._views = [];
    }

    /**
     * these setters/getters below are used to expose access to ui properties act as proxy to manipulate the DOM-Node
     */
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

    get overflow() {
        const overflow = this.node.style.overflow, values = Object.values(View.Overflow), value = values.find(value => value === overflow);
        if (value === undefined) { throw new Error(`Unsupported overflow: ${overflow}`); }

        return value;
    }

    set overflow(value) {
        this.node.style.overflow = value;
    }

    get position() {
        const position = this.node.style.position, values = Object.values(View.Position), value = values.find(value => value === position);
        if (value === undefined) { throw new Error(`Unsupported position: ${position}`); }

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
        if (value === undefined) { return; }

        Object.assign(this.node.style, value.toStyle());
    }

    get padding() {
        const style = this.node.style;

        return Padding.fromStyle(style);
    }

    set padding(value) {
        if (value === undefined) { return; }

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

        if (View._propertyIsSet(backgroundColor) === true) { return Color.fromStyleRule(backgroundColor); }
        return undefined;
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

        if (View._propertyIsSet(color) === true) { return Color.fromStyleRule(color); }
        return undefined;
    }

    set color(value) {
        const node = this.node;

        node.style.color = value.toStyleRule();
    }

    set borders(value) {
        if (value === undefined) { return; }

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
        if (value === undefined) { return; }

        Object.assign(this.node.style, value.toStyle());
    }

    get shadow() {
        const style = this.node.style;

        return BoxShadow.fromStyleRule(style.boxShadow);
    }

    set shadow(value) {
        if (value === undefined) { return; }
        const node = this.node;

        node.style.boxShadow = value.toStyleRule();
    }

    get filter() {
        const style = this.node.style;

        return GaussianBlurFilter.fromStyle(style);
    }

    set filter(value) {
        if (value === undefined) { return; }

        Object.assign(this.node.style, value.toStyle());
    }

    get gridInset() {
        const style = this.node.style;

        return GridInset.fromStyle(style);
    }

    set gridInset(value) {
        if (value === undefined) { return; }

        Object.assign(this.node.style, value.toStyle());
    }

    get htmlText() {
        return this.node.outerHTML;
    }

    /**
     * this method is used to insert a new view before another view
     * @param {View} view the view to be inserted
     * @param {View} nextView the reference view
     */
    addViewBefore(view, nextView) {
        this._prepareView(view);

        if (nextView === undefined) { throw new Error("Cannot insert a view before another view without a reference view"); }

        this.node.insertBefore(view.node, nextView.node);
    }

    /**
     * this method is used to insert a new view
     * @param {View} view 
     */
    addView(view) {
        this._prepareView(view);

        this.node.appendChild(view.node);
    }

    /**
     * this method inserts a new view into the data structure if eligible
     * @param {View} view 
     */
    _prepareView(view) {
        if (view.parentView !== undefined) { throw new Error("Cannot add view to more than one parent view"); }

        this.views.push(view);

        view.parentView = this;
    }

    /**
     * this method is used to remove a view if possible
     * @param {View} view 
     * @returns the removed view
     */
    removeView(view) {
        const views = this.views, index = views.indexOf(view);

        if (index >= 0) { views.splice(index, 1); }
        this.node.removeChild(view.node);
        view.parentView = undefined;

        return view;
    }

    /**
     * this method is used to remove a view from its parent view
     * @returns the parentView (or undefined)
     */
    removeFromParentView() {
        const parentView = this.parentView;

        if (parentView === undefined) { return undefined; }

        parentView.removeView(this);

        return parentView;
    }

    /**
     * this method removes all child views
     */
    removeViews() {
        const views = this.views;
        views.splice(0, views.length).forEach(view => this.removeView(view));
    }

    /**
     * this method is used to create a DOM-node for the view 
     */
    _createNode() {
        const node = document.createElement(this.constructor.tag);
        node.style.display = this.constructor.display;

        this._node = node;

        return node;
    }

    /**
     * this method is used to determine wether a property is set as css rule or not
     * @param {string} value a css rule
     * @returns 
     */
    static _propertyIsSet(value) {
        return value !== undefined && value !== "" && value !== "unset";
    }

    /**
     * this method is used recover css rules from a string
     * @param {string} str the css rule to be parsed
     * @returns 
     */
    static _deriveConstrains(str) {
        const regex = new RegExp("[+-]?\\d+(?:\\.\\d+)?(?:%|vmax|vmin|vh|vw|rem|ch|ex|em|cm|mm|in|px|pt|pc)", "g"), match = str.match(regex);

        if (match === null) { throw new Error("Unable to parse constraints"); }

        return match;
    }

    /**
     * this method is used to add a dom listener to the internal node
     * @param {string} type 
     * @param {object} listener 
     */
    addDOMEventListener(type, listener) {
        this.node.addEventListener(type, listener);
    }
}

/**
 * this method is a css wrapper for gaussian blur filters
 */
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
        if (View._propertyIsSet(this.filter) === false || this.filter.includes("blur") === false) { return undefined; }

        const filter = style.filter, constraints = View._deriveConstrains(filter);
        if (constraints.left !== 1) { throw new Error(`Cannot derive gaussian blur from rule ${filter}`); }

        return new GaussianBlurFilter(constraints[0]);
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

/**
 * this is a css rule wrapper to represent the layout of a view inside a grid
 */
export class GridInset extends Inset {
    static fromStyle(style) {
        return new GridInset(style.gridRowStart, style.gridColumnStart, style.gridColumnEnd, style.gridRowEnd);
    }

    toStyle() {
        let style = {
            gridColumnStart: "",
            gridColumnEnd: "",
            gridRowStart: "",
            gridRowEnd: "",
        };

        const left = this.left, right = this.right, top = this.top, bottom = this.bottom;

        if (left !== undefined) { style.gridColumnStart = left; }
        if (right !== undefined) { style.gridColumnEnd = right; }
        if (top !== undefined) { style.gridRowStart = top; }
        if (bottom !== undefined) { style.gridRowEnd = bottom; }

        return style;
    }
}

/**
 * this class is a css wrapper to represent gaps
 */
export class Gap {
    constructor(horizontal, vertical) {
        this._horizontal = horizontal;
        this._vertical = vertical;
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

/**
 * this is a wrapper class for a css Grid based view
 */
export class Grid extends View {

    static get display() {
        return "grid";
    }

    static get tag() {
        return "span";
    }

    get gap() {
        const node = this.node;

        return new Gap(node.style.gridRowGap, node.style.gridColumnGap);
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

/**
 * this class is used to create a view container that forces its child views to an intrinsic layout alongside one axis
 */
export class StackView extends View {
    /**
     * this constant is used to represent layout axes
     */
    static get Axis() {
        return Object.freeze({
            vertical: "column",
            horizontal: "row",
        });
    }

    /**
     * this constant is used to define layout directions
     */
    static get Direction() {
        return Object.freeze({
            default: "",
            reversed: "-reverse",
        });
    }

    /**
     * this constant is used to define layout wrap modes
     */
    static get Wrap() {
        return Object.freeze({
            none: "nowrap",
            wrap: "wrap",
            reversed: "wrap-reverse",
        });
    }

    /**
     * this constant is used to define possible main axis alignments
     */
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
            right: "right",
        });
    }

    /**
     * this constant is used to define possible cross axis alignments
     */
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
            selfEnd: "self-end",
        });
    }

    /**
     * this constant is used to define possible wrap cross axis alignments
     */
    static get WrapCrossAxisAlignment() {
        return Object.freeze({
            default: "unset",
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
            lastBaseline: "last baseline",
        });
    }

    /**
     * this constant is used to define or override the cross axis alignment of the view itself
     */
    static get CrossAxisSelfAlignment() {
        return Object.freeze({
            auto: "auto",
            flexStart: "flex-start",
            flexEnd: "flex-end",
            center: "center",
            baseline: "baseline",
            stretch: "stretch",
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

    /**
     * these getters/setters are used to manage access to css properties of the node
     */
    get order() {
        return this.node.style.order;
    }

    set order(value) {
        this.node.style.order = value;
    }

    get axis() {
        const vertical = StackView.Axis.vertical;
        if (this.node.style.flexDirection.startsWith(vertical) === true) { return vertical; }

        return StackView.Axis.horizontal;
    }

    set axis(value) {
        this.node.style.flexDirection = value;
    }

    get direction() {
        const reverse = StackView.Direction.reversed;
        if (this.node.style.flexDirection.endsWith(reverse) === true) { return reverse; }

        return StackView.Direction.default;
    }

    set direction(value) {
        const node = this.node, reverse = StackView.Direction.reversed;

        switch (value) {
            case StackView.Direction.default:
                node.style.flexDirection = node.style.flexDirection.replace(reverse, "");
                break;
            case reverse:
                if (this.direction !== value) { node.style.flexDirection += reverse; }
                break;
            default:
                throw new Error(`Unsupported direction ${value}`);
        }
    }

    get wrap() {
        const wrap = this.node.style.flexWrap, values = Object.values(StackView.Wrap), value = values.find(value => value === wrap);
        if (value === undefined) { throw new Error(`Unsupported wrap: ${wrap}`); }

        return value;
    }

    set wrap(value) {
        this.node.style.flexWrap = value;
    }

    get mainAxisAlignment() {
        const alignment = this.node.style.justifyContent, values = Object.values(StackView.MainAxisAlignment), value = values.find(value => value === alignment);
        if (value === undefined) { throw new Error(`Unsupported main axis alignment: ${alignment}`); }

        return value;
    }

    set mainAxisAlignment(value) {
        this.node.style.justifyContent = value;
    }

    get crossAxisAlignment() {
        const alignment = this.node.style.alignItems, values = Object.values(StackView.CrossAxisAlignment), value = values.find(value => value === alignment);
        if (value === undefined) { throw new Error(`Unsupported cross axis alignment: ${alignment}`); }

        return value;
    }

    set crossAxisAlignment(value) {
        this.node.style.alignItems = value;
    }

    get wrapCrossAxisAlignment() {
        const alignment = this.node.style.alignContent, values = Object.values(StackView.WrapCrossAxisAlignment), value = values.find(value => value === alignment);
        if (value === undefined) { throw new Error(`Unsupported wrap cross axis alignment: ${alignment}`); }

        return value;
    }

    set wrapCrossAxisAlignment(value) {
        this.node.style.alignContent = value;
    }

    get crossAxisSelfAlignment() {
        const alignment = this.node.style.alignSelf, values = Object.values(StackView.CrossAxisSelfAlignment), value = values.find(value => value === alignment);
        if (value === undefined) { throw new Error(`Unsupported cross self axis alignment: ${alignment}`); }

        return value;
    }

    set crossAxisSelfAlignment(value) {
        this.node.style.alignSelf = value;
    }

    get gap() {
        const node = this.node;

        return new Gap(node.style.rowGap, node.style.columnGap);
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
        return "span";
    }
}

/**
 * this is a wrapper class for a label that uses a span tag
 */
export class Label extends View {

    static get WhiteSpace() {
        return Object.freeze({
            default: "normal",
            nowrap: "nowrap",
            pre: "pre",
            preWrap: "pre-wrap",
            preLine: "pre-line",
            breakSpaces: "break-spaces",
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
            "900": "900",
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
            inherit: "inherit",
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
        return this.node.style.fontSize;
    }

    set fontSize(value) {
        this.node.style.fontSize = value;
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
        const whiteSpace = this.node.style.whiteSpace, values = Object.values(Label.WhiteSpace), value = values.find(value => value === whiteSpace);
        if (value === undefined) { throw new Error(`Unsupported whiteSpace: ${whiteSpace}`); }

        return value;
    }

    set whiteSpace(value) {
        this.node.style.whiteSpace = value;
    }

    get textOverflow() {
        const textOverflow = this.node.style.textOverflow, values = Object.values(Label.TextOverflow), value = values.find(value => value === textOverflow);
        if (value === undefined) { throw new Error(`Unsupported textOverflow: ${textOverflow}`); }

        return value;
    }

    set textOverflow(value) {
        this.node.style.textOverflow = value;
    }

    get fontWeight() {
        const fontWeight = this.node.style.fontWeight, values = Object.values(Label.FontWeight), value = values.find(value => value === fontWeight);
        if (value === undefined) { throw new Error(`Unsupported fontWeight: ${fontWeight}`); }

        return value;
    }

    set fontWeight(value) {
        this.node.style.fontWeight = value;
    }

    get textAlignment() {
        const textAlignment = this.node.style.textAlign, values = Object.values(Label.TextAlignment), value = values.find(value => value === textAlignment);
        if (value === undefined) { throw new Error(`Unsupported textAlignment: ${textAlignment}`); }

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
        if (value === undefined) { return; }

        this.node.style.textShadow = value.toStyleRule();
    }

    static get tag() {
        return "span";
    }
}

/**
 * this class is a wrapper for icon views
 */
export class Icon extends Label {
    static get tag() {
        return "i";
    }
}

/**
 * this class resembles a text field using the html input tag
 */
export class TextField extends Label {

    /**
     * this constant is used to define text input types
     */
    static get TextInputType() {
        return Object.freeze({
            text: "text",
            password: "password",
            email: "email",
            search: "search",
            telephone: "tel",
            url: "url",
        });
    }

    /**
     * event labels
     */
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

    constructor(text, onChange) {
        super(text);

        this.onChange = onChange;

        this._addListeners();
    }

    /**
     * the setters/getters below expose access to to callback functions
     */
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

     /**
     * the getters/setters below are expose ui elements and their properties
     */
    get isRequired() {
        return this.node.required;
    }

    set isRequired(value) {
        this.node.required = value;
    }

    get isValid() {
        return this.node.checkValidity();
    }

    set validationMessage(value) {
        this.node.setCustomValidity(value);
    }

    get validationMessage() {
        return this.node.validationMessage;
    }

    get textInputType() {
        const textInputType = this.node.type, values = Object.values(TextField.TextInputType), value = values.find(value => value === textInputType);
        if (value === undefined) { throw new Error(`Unsupported textInputType: ${textInputType}`); }

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

    /**
     * this method can be used to focus the dom node
     */
    focus() {
        this.node.focus();
    }

    /**
     * this method clears the textfield
     */
    clear() {
        this.text = "";
    }

    /**
     * the methods below are used to trigger callback functions and propagate click events to observers
     */
    _onChangeWrapper() {
        const onChange = this.onChange;
        if (onChange !== undefined) { onChange(); }

        this.notifyAll(new Event(TextField.TEXT_FIELD_CHANGE_NOTIFICATION_TYPE, this));
    }

    _onKeyPressWrapper() {
        const onKeyPress = this.onKeyPress;
        if (onKeyPress !== undefined) { onKeyPress(); }

        this.notifyAll(new Event(TextField.TEXT_FIELD_KEYPRESS_NOTIFICATION_TYPE, this));
    }

    _onPasteWrapper() {
        const onPaste = this.onPaste;
        if (onPaste !== undefined) { onPaste(); }

        this.notifyAll(new Event(TextField.TEXT_FIELD_PASTE_NOTIFICATION_TYPE, this));
    }

    _onInputWrapper() {
        const onInput = this.onInput;
        if (onInput !== undefined) { onInput(); }

        this.notifyAll(new Event(TextField.TEXT_FIELD_INPUT_NOTIFICATION_TYPE, this));
    }

    /**
     * this method is used to attach listeners on the dom element
     */
    _addListeners() {
        const node = this.node;

        node.addEventListener(TextField.TEXT_FIELD_CHANGE_NOTIFICATION_TYPE, this._onChangeWrapper.bind(this), true);
        node.addEventListener(TextField.TEXT_FIELD_KEYPRESS_NOTIFICATION_TYPE, this._onChangeWrapper.bind(this), true);
        node.addEventListener(TextField.TEXT_FIELD_PASTE_NOTIFICATION_TYPE, this._onChangeWrapper.bind(this), true);
        node.addEventListener(TextField.TEXT_FIELD_INPUT_NOTIFICATION_TYPE, this._onChangeWrapper.bind(this), true);
    }

    /**
     * this method checks if the text input satisfies all validation constraints set on the text field and issues a visual warning message if needed 
     * @returns a boolean flag to indicate wether the content is valid
     */
    validate() {
        return this.node.reportValidity();
    }
}

/**
 * this class is used to create a broader area for text input
 */
export class TextArea extends TextField {

    /**
     * this constant is used to define resizing options
     */
    static get Resize() {
        return Object.freeze({
            both: "both",
            horizontal: "horizontal",
            vertical: "vertical",
            none: "none",
        });
    }

    /**
     * this constant is used to define css wrapping options
     */
    static get Wrap() {
        return Object.freeze({
            hard: "hard",
            soft: "soft",
            off: "off",
        });
    }

    /**
     * this view uses an textarea html tag
     */
    static get tag() {
        return "textarea";
    }

    /**
     * the getters/setters below provide access to ui properties
     */
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

/**
 * this is a wrapper class for html p-nodes
 */
export class TextView extends Label {
    static get tag() {
        return "p";
    }
}

/**
 * this is a wrapper class for html header-nodes
 */
export class Header extends View {
    static get tag() {
        return "header";
    }
}

/**
 * this is a wrapper class for html section-nodes
 */
export class Section extends View {
    static get tag() {
        return "section";
    }
}

/**
 * this is a wrapper class for html footer-nodes
 */
export class Footer extends View {
    static get tag() {
        return "footer";
    }
}

/**
 * this is a wrapper class for html nav-nodes
 */
export class Navigation extends View {
    static get tag() {
        return "nav";
    }
}

/**
 * this is a wrapper class for html span-nodes
 */
export class InlineBlock extends View {
    static get tag() {
        return "span";
    }
}

/**
 * this is a wrapper class for html div-nodes
 */
export class Block extends View {
    static get tag() {
        return "div";
    }
}

/**
 * this is a wrapper class for html h1-nodes
 */
export class Headline1 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h1";
    }
}

/**
 * this is a wrapper class for html h2-nodes
 */
export class Headline2 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h2";
    }
}

/**
 * this is a wrapper class for html h3-nodes
 */
export class Headline3 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h3";
    }
}

/**
 * this is a wrapper class for html h4-nodes
 */
export class Headline4 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h4";
    }
}

/**
 * this is a wrapper class for html h5-nodes
 */
export class Headline5 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h5";
    }
}

/**
 * this is a wrapper class for html h6-nodes
 */
export class Headline6 extends Label {
    constructor(text) {
        super(text);
    }

    static get tag() {
        return "h6";
    }
}

/**
 * this is a wrapper class for creating buttons
 */
export class Button extends Label {

    /**
     * event labels
     */
    static get BUTTON_CLICK_NOTIFICATION_TYPE() {
        return "click";
    }

    static get BUTTON_MOUSE_OVER_NOTIFICATION_TYPE() {
        return "mouseenter";
    }

    static get BUTTON_MOUSE_OUT_NOTIFICATION_TYPE() {
        return "mouseleave";
    }

    static get tag() {
        return "button";
    }

    constructor(text, onClick, onMouseOver, onMouseOut) {
        super(text);

        this.onClick = onClick;
        this.onMouseOver = onMouseOver;
        this.onMouseOut = onMouseOut;

        this._addListeners();
    }

    /**
     * the getters/setters below are used to manage access to callback functions
     */
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

    /**
     * this method is used to attach listeners for callback functions on the DOM-node
     */
    _addListeners() {
        const node = this.node;

        node.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onClickWrapper.bind(this), true);
        node.addEventListener(Button.BUTTON_MOUSE_OUT_NOTIFICATION_TYPE, this._onMouseOutWrapper.bind(this), true);
        node.addEventListener(Button.BUTTON_MOUSE_OVER_NOTIFICATION_TYPE, this._onMouseOverWrapper.bind(this), true);
    }

    /**
     * these wrapper functions are needed to notify observers and trigger callback functions
     */
    _onClickWrapper(event) {
        const onClick = this.onClick;
        if (onClick !== undefined) { onClick(event); }

        this.notifyAll(new Event(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this));
    }

    _onMouseOutWrapper(event) {
        const onMouseOut = this.onMouseOut;
        if (onMouseOut !== undefined) { onMouseOut(event); }

        this.notifyAll(new Event(Button.BUTTON_MOUSE_OUT_NOTIFICATION_TYPE, this));
    }

    _onMouseOverWrapper(event) {
        const onMouseOver = this.onMouseOver;
        if (onMouseOver !== undefined) { onMouseOver(event); }

        this.notifyAll(new Event(Button.BUTTON_MOUSE_OVER_NOTIFICATION_TYPE, this));
    }
}

/**
 * this is a wrapper class for html-select tags
 */
export class Select extends View {

    constructor() {
        super();

        this._addListeners();
    }

    /**
     * label for selection events
     */
    static get SELECT_ON_SELECTION_TYPE_NOTIFICATION() {
        return "select";
    }

    /**
     * the setters/getters below manage access for native css properties 
     */
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
        const options = this.options, selectedIndex = this.selectedIndex;
        if (options.length < 1 || selectedIndex < 0) { return undefined; }

        return options[selectedIndex];
    }

    /**
     * this method is used to attach native listeners an bind callback functions
     */
    _addListeners() {
        this.node.addEventListener(Select.SELECT_ON_SELECTION_TYPE_NOTIFICATION, this._onSelect.bind(this), true);
    }

    /**
     * this method is used to notify observers upon selection
     */
    _onSelect() {
        this.notifyAll(new Event(Select.SELECT_ON_SELECTION_TYPE_NOTIFICATION, this));
    }

    static get tag() {
        return "select";
    }
}

/**
 * this class is used to provide a root view as anchor to attach child views
 */
class ViewPortAnchor extends View {
    static _sharedInstance;

    static get sharedInstance() {
        if (ViewPortAnchor._sharedInstance === undefined) { ViewPortAnchor._sharedInstance = new ViewPortAnchor(); }

        return ViewPortAnchor._sharedInstance;
    }

    _createNode() {
        const node = document.body;

        this._node = node;

        return node;
    }
}

/**
 * this class resembles a view container that encapsulates logic and provides lifecycle control
 */
export class Controller extends Observable {
    /**
     * event labels
     */
    static get PRESENTATION_STATE_CHANGE_NOTIFICATION_TYPE() {
        return "presentationStateChanged";
    }

    static get VIEWS_CREATED_NOTIFICATION_TYPE() {
        return "viewsCreated";
    }

    /**
     * this constant is used to define states for when the controller is displaying content and presenting another controller
     */
    static get PresentationState() {
        return Object.freeze({
            presented: "presented",
            presenting: "presenting",
        });
    }

    /**
     * this getter/setter-pair is used to manage access to the parent controller if an instance has been presenting this controller
     */
    get parentController() {
        return this._parentController;
    }

    set parentController(value) {
        this._parentController = value;
    }

    /**
     * this getter exposes this root view of the controller as anchor for other views
     */
    get view() {
        return this._view;
    }

    /**
     * this getter/setter-pair is used to expose the current state of presentation
     */
    get presentationState() {
        return this._presentationState;
    }

    set presentationState(value) {
        if (this.presentationState === value) { return; }

        this._presentationState = value;
        this._onPresentationStateChange();
    }

    /**
     * this getter us used to access child controllers that may have been presented
     */
    get controllers() {
        return this._controllers;
    }

    constructor() {
        super();
        this._controllers = [];

        this._createView();
        this._onViewsCreated();
        this._determinePresentationState();
    }

    /**
     * this method gets called if the controller has finished loading its own views
     */
    _onViewsCreated() {
        const event = new Event(Controller.VIEWS_CREATED_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    /**
     * this method is used to create the root view of the controller
     * @returns an instance of view
     */
    _createView() {
        const stackView = new StackView(StackView.Axis.vertical, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.stretch);
        this._view = stackView;

        return stackView;
    }

    /**
     * this method is used to present another controller in a given view
     * @param {Controller} controller 
     * @param {View} parentView 
     */
    addController(controller, parentView = this.view) {
        if (controller.parentController !== undefined) { throw new Error("Cannot add controller to more than one parent controller"); }

        this.controllers.push(controller);

        controller.parentController = this;

        parentView.addView(controller.view);

        this._determinePresentationState();
    }

    /**
     * this method is used to determine the current presentation mode 
     */
    _determinePresentationState() {
        this.presentationState = this.controllers.length > 0 ? Controller.PresentationState.presenting : Controller.PresentationState.presented;
    }

    /**
     * this method is used to notify observers of a presentation change state
     */
    _onPresentationStateChange() {
        const event = new Event(Controller.PRESENTATION_STATE_CHANGE_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    /**
     * this method is used to dismiss a controller if currently presented
     * @param {Controller} controller 
     * @returns 
     */
    removeController(controller) {
        const controllers = this.controllers, index = controllers.indexOf(controller), view = controller.view, parentView = view.parentView;
        if (parentView !== undefined) { parentView.removeView(view); }

        if (index >= 0) { controllers.splice(index, 1); }
        controller.parentController = undefined;

        this._determinePresentationState();

        return controller;
    }

    /**
     * this method is used to purge all presented controllers
     */
    removeControllers() {
        this.controllers.forEach(this.removeController.bind(this));
    }

    /**
     * this method is used to remove this controller instance from its parent controller
     * @returns the parent controller or undefined
     */
    removeFromParentController() {
        const parentController = this.parentController;

        if (parentController === undefined) { return undefined; }

        parentController.removeController(this);

        return parentController;
    }
}

/**
 * this class is used to create a page-filling root controller for other controllers to attach to
 */
export class RootController extends Controller {
    constructor() {
        super();

        this._attachView();
    }

    /**
     * this method is needed to attach this root controller to the document
     */
    _attachView() {
        const view = this.view;

        ViewPortAnchor.sharedInstance.addView(view);
    }

    /**
     * this method is overridden from its superclass to facilitate a page-filling view
     * @returns the main view of the controller
     */
    _createView() {
        const view = super._createView();

        view.position = View.Position.absolute;
        view.left = "0px";
        view.right = "0px";
        view.bottom = "0px";
        view.top = "0px";

        return view;
    }

    /**
     * this method is adapted to account for the absence of an presenting controller
     * @returns parent controller or undefined
     */
    removeFromParentController() {
        const parentController = super.removeFromParentController();

        this.view.removeFromParentView();

        return parentController;
    }
}