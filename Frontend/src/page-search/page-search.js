"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-search.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class PageSearch extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     */
    constructor(app) {
        super(app, HtmlTemplate);

        this._emptyMessageElement = null;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
     * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
     * Element wird dann auch von der App-Klasse verwendet, um die Seite
     * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
     * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
     * zu beeinflussen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();
        this._title = "Suche";

        // Platzhalter anzeigen, wenn noch keine Daten vorhanden sind
        let data = await this._app.backend.fetch("GET", "/pet"); 
        this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");

        if (data.length) {
            this._emptyMessageElement.classList.add("hidden");
        }

        // Je Datensatz einen Listeneintrag generieren
        let olElement = this._mainElement.querySelector("ol");

        let templateElement = this._mainElement.querySelector(".list-entry");
        let templateHtml = templateElement.outerHTML;
        templateElement.remove();

        for (let index in data) {
            // Platzhalter ersetzen
            let dataset = data[index];
            let html = templateHtml;

            html = html.replace("$ID$", dataset._id);
            html = html.replace("$NAME$", dataset.name);
            html = html.replace("$ANIMALTYPE$", dataset.animalType);
            html = html.replace("$BIRTHDAY$", dataset.birthday);

            // Element in die Liste einfügen
            let dummyElement = document.createElement("div");
            dummyElement.innerHTML = html;
            let liElement = dummyElement.firstElementChild;
            liElement.remove();
            olElement.appendChild(liElement);

            // Event Handler registrieren
           // liElement.querySelector(".action.edit").addEventListener("click", () => location.hash = `#/edit/${dataset._id}`);
           // liElement.querySelector(".action.delete").addEventListener("click", () => this._askDelete(dataset._id));
        }

        //// TODO: Anzuzeigende Inhalte laden mit this._app.backend.fetch() ////
        //// TODO: Inhalte in die HTML-Struktur einarbeiten ////
        //// TODO: Neue Methoden für Event Handler anlegen und hier registrieren ////
    }
}


    