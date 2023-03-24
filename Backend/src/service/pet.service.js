"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Haustieren. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Haustiere werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class PetService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._animals = DatabaseFactory.database.collection("pets");
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
        let cursor = this._animals.find(query, {
            sort: {
                first_name: 1,
                last_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Haustiers.
     *
     * @param {Object} animal Zu speicherndes Haustier
     * @return {Promise} Gespeicherte Haustier
     */
    async create(animal) {
        animal = animal || {};

        let newAnimal = {
            name: animal.name || "",
            animalType:      animal.animalType     || "",
            birthday:      animal.birthday     || "",
        };

        let result = await this._animals.insertOne(newAnimal);
        return await this._animals.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Haustiers anhand ihrer ID.
     *
     * @param {String} id ID des gesuchten Tieres
     * @return {Promise} Gefundenes Haustier
     */
    async read(id) {
        let result = await this._animals.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Haustiers, durch Überschreiben einzelner Felder
     * oder des gesamten Adressobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Tieres
     * @param {[type]} address Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten oder undefined
     */
    async update(id, animal) {
        let oldAnimal = await this._animals.findOne({_id: new ObjectId(id)});
        if (!oldAnimal) return;

        let updateDoc = {
            $set: {},
        }

        if (animal.name) updateDoc.$set.name = animal.name;
        if (animal.animalType)      updateDoc.$set.animalType      = animal.animalType;
        if (animal.birthday)      updateDoc.$set.birthday      = animal.birthday;

        await this._animals.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._animals.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Haustiers anhand der ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._animals.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
