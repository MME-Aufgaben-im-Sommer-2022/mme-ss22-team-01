"use strict";

import BGSectionedListViewSectionData from "../../Data/Models/BGSectionedListViewSectionData.js";
import BGListView from "./BGListView.js";
import BGListViewItemView from "./BGListViewItemView.js";
import BGSectionedListViewSectionView from "./BGSectionedListViewSectionView.js";

export default class BGSectionedListView extends BGListView {

    static get SECTION_VIEW_CREATED_NOTIFICATION_TYPE() {
        return "sectionViewCreated";
    }

    set headerViewClass(value) {
        if (this.headerViewClass !== undefined) throw new Error("Cannot register multiple header view classes");
        this._headerViewClass = value;
    }

    get headerViewClass() {
        return this._headerViewClass;
    }

    constructor(itemViewClass, headerViewClass) {
        super(itemViewClass);
        this._itemViews = []; //todo default fdallback class? [new headerViewClass()] oder einfach itemViews benutzen

        this.headerViewClass = headerViewClass;
    }

    get sectionInset() {
        const sectionViews = this._itemViews;
        if (sectionViews.length < 1) return;

        return sectionViews[0].gap;
    }

    set sectionInset(value) {
        this._itemViews.forEach(sectionView => sectionView.gap = value);
    }

    get sections() {
        return this._itemViews.map(sectionView => sectionView.section);
    }

    set sections(value) {
        this._itemViews.forEach(sectionView => sectionView.removeFromParentView());
        this._itemViews = []; //todo default fdallback class? [new headerViewClass()]
        value.forEach(section => this._addSectionView(section));
    }

    get items() {
        return this.sections.flatMap(section => section.items);// map(section => section.items).flat();
    }

    set items(value) {
        this.sections = [];

        value.forEach(item => this._addItemView(item));
        /* Todo geht auch effizienter
        const sections = this.sections;
        sections = []; // Todo ineffizient aber schnell, changes in items pro sections ermitteln und ggf löschen und neue hinzufügen
        value.forEach(item => {
            let section = sections.find(section => section.id === );
            if (section === undefined) {
                section = new BGSectionedListViewSectionData(`${BGListViewController._fallbackSectionCounter++}`, 0, 0, item);
                section.addItem(item);
                this.addSection(section);
                return;
            }
            item.section = section;
        });
        */
    }

    addSection(section) { // Todo macht der einzeiler sinn?
        this._addSectionView(section);
    }

    _addSectionView(section) {
        const sectionViews = this._itemViews;
        const headerViewClass = this._headerViewClass;
        if (headerViewClass === undefined) throw new Error("A class must be registered prior to header view instanciation");

        const itemViewClass = this._itemViewClass;
        if (itemViewClass === undefined) throw new Error("A class must be registered prior to item view instanciation");

        const sectionView = new BGSectionedListViewSectionView(headerViewClass, itemViewClass);
        sectionView.listView = this; //Todo review

        this._onSectionViewCreated(sectionView);
        sectionView.addEventListener(BGListView.ITEM_VIEW_CREATED_NOTIFICATION_TYPE, this._onSectionItemViewCreated.bind(this)); //todo bind needed? [kommt möglicherweise öfter ohne todo vor]
        sectionView.addEventListener(BGListViewItemView.ITEM_VIEW_SELECTED_NOTIFICATION_TYPE, this._onItemViewSelected.bind(this));

        sectionView.section = section;

        sectionViews.push(sectionView);

        this.addView(sectionView);
    }



    _onSectionItemViewCreated(event) {
        const itemView = event.data;

        this._onItemViewCreated(itemView);
    }

    _onSectionViewCreated(sectionView) {
        const event = new Event(BGSectionedListView.SECTION_VIEW_CREATED_NOTIFICATION_TYPE, sectionView);
        this.notifyAll(event);
    }

    removeItem(item) {
        this._itemViews.forEach(sectionView => sectionView.removeItem(item));
    }

    updateItem(item, newItem) {
        this._itemViews.forEach(sectionView => sectionView.updateItem(item, newItem));
    }

    _addItemView(item) {
        const sectionViews = this._itemViews;
        let sectionView = sectionViews.find(sectionView => sectionView.data === item.section); //todo oder über id matchen 
        if (sectionView === undefined) {
            const section = new BGSectionedListViewSectionData(undefined, 0, 0, [item]);
            this.addSection(section);
        } else {
            sectionView._addItemView(item); // todo wenn einzeiler löschen, dann hier auch nur addItem
        }
    }
}