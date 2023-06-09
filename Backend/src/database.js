"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("app_database");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        //// TODO: Methode anpassen, um zur eigenen App passende Demodaten anzulegen ////
        //// oder die Methode ggf. einfach löschen und ihren Aufruf oben entfernen.  ////
        let pets = this.database.collection("pets");

        if (await pets.estimatedDocumentCount() === 0) {
            pets.insertMany([
                {
                    name: "Willy",
                    animalType: "Hund",
                    birthday: "10.10.2022",
                },
            ]);
        }

        let users = this.database.collection("users");

        if (await users.estimatedDocumentCount() === 0) {
            users.insertMany([
                {
                    first_name: "Sinah",
                    last_name: "Müller-Vietinghoff",
                    birthday: "17.07.2001",
                },
            ]);
        }

        let adoptions = this.database.collection("adoptions");

        if (await adoptions.estimatedDocumentCount() === 0) {
            adoptions.insertMany([
                {
                    user_name: "Sinah",
                    pet_name: "Willy",
                    date: "03.04.2023",
                },
            ]);
        }
    }
}

export default new DatabaseFactory();
