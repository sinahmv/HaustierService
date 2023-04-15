"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-edit-adoption.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten einer Adoption
 * zur Verfügung.
 */
export default class PageEditAdoption extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);

        // Bearbeiteter Datensatz
        this._editId = editId;

        this._dataset = {
            user_name: "",
            pet_name: "",
            date: "",
        };

        // Eingabefelder
        this._userNameInput = null;
        this._petNameInput    = null;
        this._dateInput     = null;
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
     *
     * HINWEIS: In dieser Version der App wird mit dem üblichen DOM-Methoden
     * gearbeitet, um den finalen HTML-Code der Seite zu generieren. In größeren
     * Apps würde man ggf. eine Template Engine wie z.B. Nunjucks integrieren
     * und den JavaScript-Code dadurch deutlich vereinfachen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();

        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/adoption/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.user_name}`; //first_name
        } else {
            this._url = `/adoption`;
            this._title = "Vermittlung hinzufügen";
        }

        this._pets = await this._app.backend.fetch("GET", "/pet")
        this._users = await this._app.backend.fetch("GET", "/user")

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$USERNAME$", this._dataset.user_name);
        html = html.replace("$PETNAME$", this._dataset.pet_name);
        html = html.replace("$DATE$", this._dataset.date);
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._userNameInput = this._mainElement.querySelector("input.user_name");
        this._petNameInput  = this._mainElement.querySelector("input.pet_name");
        this._dateInput    = this._mainElement.querySelector("input.date");
    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
     * in die Listenübersicht zurück.
     */
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id        = this._editId;
        this._dataset.user_name = this._userNameInput.value.trim();
        this._dataset.pet_name  = this._petNameInput.value.trim();
        this._dataset.date     = this._dateInput.value.trim();

        if (!this._dataset.user_name) {
            alert("Geben Sie erst einen Namen ein.");
            return;
        }

        if (!this._dataset.pet_name) {
            alert("Geben Sie erst einen Namen ein.");
            return;
        }

        if (!this._dataset.date) {
            alert("Geben Sie erst ein Datum ein.");
            return;
        }

        var userExists = false
        for (let index in this._users) {
            let dataset = this._users[index];
            if(this._dataset.user_name == dataset.first_name){
                userExists = true
            }
        }
        if(!userExists){
            alert("Der User " +this._dataset.user_name+" ist nicht bekannt!")
            return;
        }
        var petExists = false
        for (let index in this._pets) {
            let dataset = this._pets[index];
            if(this._dataset.pet_name == dataset.name){
                petExists = true
            }
        }
        if(!petExists){
            alert("Das Tier " +this._dataset.pet_name+" ist nicht bekannt!")
            return;
        }

        // Datensatz speichern
        try {
            if (this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/adoption/";
    }
};
