"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Adoptionen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adoptionen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class AdoptionService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._adoptions = DatabaseFactory.database.collection("adoptions");
    }

    /**
     * Adoptionen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adoptionen
     */
    async search(query) {
        let cursor = this._adoptions.find(query, {
            sort: {
                user_name: 1,
                pet_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Adoption.
     *
     * @param {Object} adoption Zu speichernde Adoption
     * @return {Promise} Gespeicherte Adoption
     */
    async create(adoption) {
        adoption = adoption || {};

        let newAdoption = {
            user_name: adoption.user_name || "",
            pet_name:      adoption.pet_name     || "",
            date:      adoption.date     || "",
        };

        let result = await this._adoptions.insertOne(newAdoption);
        return await this._adoptions.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Adoption anhand der ID.
     *
     * @param {String} id ID der gesuchten Adoption
     * @return {Promise} Gefundene Adoption
     */
    async read(id) {
        let result = await this._adoptions.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Adoption, durch Überschreiben einzelner Felder
     * oder des gesamten bjekts (ohne die ID).
     *
     * @param {String} id ID der Adoption
     * @param {[type]} user Zu speichernde Daten
     * @return {Promise} Gespeicherte Daten
     */
    async update(id, adoption) {
        let oldAdoption = await this._adoptions.findOne({_id: new ObjectId(id)});
        if (!oldAdoption) return;

        let updateDoc = {
            $set: {},
        }

        if (adoption.user_name) updateDoc.$set.user_name = adoption.user_name;
        if (adoption.pet_name)      updateDoc.$set.pet_name      = adoption.pet_name;
        if (adoption.date)      updateDoc.$set.date      = adoption.date;

        await this._adoptions.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._adoptions.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Adoption anhand der ID.
     *
     * @param {String} id ID der Adoption
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._adoptions.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
