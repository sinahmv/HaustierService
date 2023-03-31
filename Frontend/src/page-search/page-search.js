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
   
    }
    
    async init() {
        // HTML-Inhalt nachladen
        await super.init();
        this._title = "Suche";

        let data = await this._app.backend.fetch("GET", "/pet"); 
    
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
           let searchButton = this._mainElement.querySelector(".search");
           searchButton.addEventListener("click", () => this._search());
           // liElement.querySelector(".action.delete").addEventListener("click", () => this._askDelete(dataset._id));
        }
    }

        //// TODO: Anzuzeigende Inhalte laden mit this._app.backend.fetch() ////
        //// TODO: Inhalte in die HTML-Struktur einarbeiten ////
        //// TODO: Neue Methoden für Event Handler anlegen und hier registrieren ////
        async _search() {
            // Eingegebene Werte prüfen
            var value = document.getElementById("types").selectedIndex;
        
            
            let data = await this._app.backend.fetch("GET", "/pet");
    
        // Je Datensatz einen Listeneintrag generieren
        let olElement = this._mainElement.querySelector("ol");
        let templateElement = this._mainElement.querySelector(".list-entry");
        let templateHtml = templateElement.outerHTML;
        templateElement.remove();

        for (let index in data) {
            if(dataset.animalType = "Hausschwein"){
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
            }  
            
        }
    };
    
} 



    