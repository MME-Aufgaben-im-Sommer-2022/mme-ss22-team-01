import { Label, Color, Padding, Corners, RoundedCorner} from "../libs/WrappedUI.js";

export default class BGIconLabel extends Label {
    constructor(){
        super();
        this.fontFamily = Label.FontFamily.sansSerif;
        this.color = Color.white;
        this.padding = Padding.all("10px");
        this.backgroundColor = Color.darkGreen;
        this.corners = Corners.all(new RoundedCorner("20px"));
        this.fontWeight = Label.FontWeight.bold;
        this.textAlignment = Label.TextAlignment.center;
        this.fontSize = "13px";
        this.minWidth = "15px";
        this.minHeight = "15px";
        this.maxHeight = "40px";
        this.text = "N";
    }

    _recalculateSize(){
        this.minWidth = "19px";
        this.minHeight = "19px";
        //console.log(window.getComputedStyle(this));
    }
}