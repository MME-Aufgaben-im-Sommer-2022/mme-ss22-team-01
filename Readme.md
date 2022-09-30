# BeGreen
## Projekt
BeGreen veringert die Einstiesghürde und motiviert Personen unterschiedlicher Altersgruppen zu einem Nachhaltigem Lebensstil. Challenges erlauben es dem Nutzer Nachhaltige Aktionen spielerisch in einen seinen zu Alltag zu integrieren. Aus einem vielfältigen Katalog kann sich der Nutzer zu jeder Zeit Aufgaben zum Thema Nachhaltigkeit auswählen oder eigene erststellen. Diese können entweder persönlich oder im Team abgearbeitet werden. Für das Erfolgreiche Absolvieren einer Challenge erhält der Nutzer Punkte und kann sich anhand dieser in einem globalen Leaderboard oder mit seinen Freunden messen. Um untereinander in Kontakt zu bleiben kann sowhol in Gruppen als auch in persönlichen Chats miteinander kommuniziert werden. 

### Bereits implementierte Funktionen
- Account erstellen & mit bestehendem anmelden
- Überblick über aktive Challenges und verbleibende Zeit, um diese abzuschließen
- Mögliche Challenges angezeigt bekommen
- Challenges selber erstellen
- Challenges wieder ablehnen
- Challenges als erledigt makieren
- Belohnung für abgeschlossene Challenges in Form von Punkten
- Leaderboard
- Gruppen erstellen
- Nutzer zu Gruppe einladen
- Kommunikation mit anderen Nutzern innerhalb einer Gruppe

### Aktuellster Release
https://begreen.software-engineering.education/

## Beschreibung & Anleitung

### Login
<p align="center">
  <img src="https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-01/blob/master/docs/Login.png" width="950"/>
</p>
Beim allersten Öffnen der Anwendung muss sich der Nutzer registrieren. Hierfür gibt er seinen Namen, E-Mail-Adresse an und vergibt ein Passwort. Mit diesen Anmeldedaten kann er sich ab jetzt direkt einloggen und somit gerätebergreifend auf seine Daten zugreifen.

### Haupseite
<p align="center">
  <img src="https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-01/blob/master/docs/Hauptseite.jpeg" width="950"/>
</p>
Die Hauptseite der Anwendung besteht aus drei großen Widgets. Das rechte beinhaltet die Challenges. Hier werden alle aktiven (Gruppen- und Einzelchallenges), sowie verfügbare Challenges angezeigt. Durch das Klicken auf den blauen Pfeil nimmt der Nutzer eine Challenge an und diese wird oben im Challengeboard angezeigt. Die Anzeige enthält Informationen über die Challenge, wie Name, Beschreibung, aber auch Dauer der Challenge, Belohnung und wie viel Zeit dem Nutzer zum Abschließen der Challenge noch zur Verfügung steht.
Durch einen Klick auf den grünen Haken makiert der Nutzer die Challenge als abgeschlossen und bekommt die Punkte auf sein Konto gutgeschrieben. Mit Hilfe des roten Kreuzes wird die Challenge wieder abgelehnt und der Nutzer bekommt Punkte abgezogen.

Links unten befindet sich noch das aktuelle Leaderboard, auf welchem die eigene Platzierung und die aktuellen top drei Nutzer aufgelistet sind.

Oben links befindet sich noch das Widget für Kontakte. Durch das Klicken auf das Plus-Symbol können sowohl neue Freunde hinzugefügt, als auch neue Gruppen erstellt werden.
<p align="center">
  <img src="https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-01/blob/master/docs/kontakte.gif" width="300"/>
</p>

Wird auf eine bestehende Gruppe geklickt, gelangt der Nutzer auf die Gruppenansicht.

### Gruppenansicht
<p align="center">
  <img src="https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-01/blob/master/docs/Gruppenansicht.jpeg" width="950"/>
</p>
Hier können zunächst oben links alle Mitglieder der Gruppe betrachtet und identisch, wie auf der Hauptseite, neue Mitglieder der Gruppe hinzugefügt werden.

Darunter befindet sich eine Chatfunktion, um mit den anderen Mitgliedern kommunizieren zu können.

Auf der rechten Seite besteht die Möglichkeit, Challenges für die Gruppe anzunehmen. Diese erscheinen dann auch auf der Hauptseite.

Klickt der Nutzer auf das x-Symbol ganz oben rechts verlässt dieser die Gruppenansicht wieder und gelange auf die Hauptseite.

### Neue Challenge
Kann der Nutzer eine Challenge in der Ansicht nicht finden, befindet sich rechts oben im Challenge-Widget eine Suchfunktion. In der Suchleitste kann nun der gesucht Begriff eingegeben werden. Entweder erscheint die Challenge im Suchfenster und kann angenommen werden oder der Nutzer erstellt eine neue Challenge. Alle wichtige Felder müssen gefüllt bzw. ausgewählt werden.
<p align="center">
  <img src="https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-01/blob/master/docs/challenge.gif" width="500"/>
</p>

[Demovideo](https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-01/blob/master/docs/Demovideo.mp4)

## Installationsanleitung
1. GitHub-Respository klonen
2. In VS-Code öffnen
3. Konsole öffnen
4. Befehl: npm install prebuild
5. Befehl: npm run dev

## Team

| Name  | E-Mail | Foto | Entwickelte Bereiche |
| ------------- | ------------- | ------------- | ------------- |
| Lennart Vincent Bart  | Lennart-Vincent.Bart@stud.uni-regensburg.de  |<img src="https://user-images.githubusercontent.com/76065789/192270563-3de35dac-cb1e-41d8-90c9-edf60e49c032.jpg" width="100">| Backend Konfiguration; UI & Controller; Authentication;  |
| Natalie Franz  | Natalie-Sarah.Franz@stud.uni-regensburg.de |<img src="https://user-images.githubusercontent.com/76065789/192270854-c62d3369-f9a8-40df-b5d7-14709bfd8a15.jpg" width="100">|  Models; Testing; Layouts; |
| Maximilian Baumann  | Maximilan.Baumann@stud.uni-regensburg.de  |<img src="https://user-images.githubusercontent.com/76065789/193287932-cd3e2541-40f0-434d-a9e8-e5929f1e9185.jpg" width="100">  | Models; API-Anbindungen; Layouts; |



