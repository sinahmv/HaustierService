"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Haustieren. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Haustiere werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class AdoptionService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._users = DatabaseFactory.database.collection("adoptions");
    }

    /**
     * Haustiere suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let cursor = this._users.find(query, {
            sort: {
                user_name: 1,
                pet_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Benutzer.
     *
     * @param {Object} user Zu speicherndes Haustier
     * @return {Promise} Gespeicherte Haustier
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
     * Auslesen eines vorhandenen Besitzers anhand der ID.
     *
     * @param {String} id ID des gesuchten Users
     * @return {Promise} Gefundener User
     */
    async read(id) {
        let result = await this._adoptions.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Users, durch Überschreiben einzelner Felder
     * oder des gesamten bjekts (ohne die ID).
     *
     * @param {String} id ID des Users
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
     * Löschen eines Users anhand der ID.
     *
     * @param {String} id ID des Users
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._adoptions.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
