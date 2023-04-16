"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Benutzern. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Benutzer werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class UserService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._users = DatabaseFactory.database.collection("users");
    }

    /**
     * Benutzer suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Benutzer
     */
    async search(query) {
        let cursor = this._users.find(query, {
            sort: {
                first_name: 1,
                last_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Benutzer.
     *
     * @param {Object} user Zu speichernden Benutzer
     * @return {Promise} Gespeicherter Benutzer
     */
    async create(user) {
        user = user || {};

        let newUser = {
            first_name: user.first_name || "",
            last_name:      user.last_name     || "",
            birthday:      user.birthday     || "",
        };

        let result = await this._users.insertOne(newUser);
        return await this._users.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Benutzers anhand der ID.
     *
     * @param {String} id ID des gesuchten Users
     * @return {Promise} Gefundener User
     */
    async read(id) {
        let result = await this._users.findOne({_id: new ObjectId(id)});
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
    async update(id, user) {
        let oldUser = await this._users.findOne({_id: new ObjectId(id)});
        if (!oldUser) return;

        let updateDoc = {
            $set: {},
        }

        if (user.first_name)    updateDoc.$set.first_name      = user.first_name;
        if (user.last_name)     updateDoc.$set.last_name       = user.last_name;
        if (user.birthday)      updateDoc.$set.birthday        = user.birthday;

        await this._users.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._users.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Users anhand der ID.
     *
     * @param {String} id ID des Users
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._users.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
