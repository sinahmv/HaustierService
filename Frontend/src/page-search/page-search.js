"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-search.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten einer Adresse
 * zur Verfügung.
 */
export default class PageSearch extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app) {
        super(app, HtmlTemplate);

        // Eingabefelder
        this._NameInput = null;
        this._animalTypeInput     = null;
        this._birthdayInput     = null;
    }
}
