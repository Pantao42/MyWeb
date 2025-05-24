document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gaestebuchForm');
    const eintraegeListe = document.getElementById('eintraegeListe');
    const STORAGE_KEY = 'gaestebuchEintraege';

    // Hilfsfunktion zum Escapen von HTML
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // E-Mail-Validierung
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Funktion zum Lesen der Einträge
    function getEintraege() {
        const eintraege = localStorage.getItem(STORAGE_KEY);
        return eintraege ? JSON.parse(eintraege) : [];
    }

    // Funktion zum Speichern der Einträge
    function saveEintraege(eintraege) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(eintraege));
    }

    // Lade bestehende Einträge beim Start
    ladeEintraege();

    // Event-Listener für das Formular
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Hole die Formulardaten
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const datum = new Date().toLocaleString('de-DE');

        // Validierung
        if (!name || !email || !message) {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }

        if (!isValidEmail(email)) {
            alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return;
        }

        // Erstelle neuen Eintrag
        const neuerEintrag = {
            id: Date.now(), // Eindeutige ID für jeden Eintrag
            name,
            email,
            message,
            datum
        };

        try {
            // Lade bestehende Einträge
            const eintraege = getEintraege();
            
            // Füge neuen Eintrag am Anfang hinzu
            eintraege.unshift(neuerEintrag);
            
            // Speichere aktualisierte Einträge
            saveEintraege(eintraege);

            // Zeige den Eintrag an
            zeigeEintrag(neuerEintrag);

            // Setze das Formular zurück
            form.reset();

            // Zeige Erfolgsmeldung
            alert('Ihr Eintrag wurde erfolgreich gespeichert!');
        } catch (error) {
            console.error('Fehler:', error);
            alert('Es gab einen Fehler beim Speichern Ihres Eintrags. Bitte versuchen Sie es später erneut.');
        }
    });

    // Funktion zum Löschen eines Eintrags
    function loescheEintrag(id) {
        if (confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
            try {
                const eintraege = getEintraege();
                const aktualisierteEintraege = eintraege.filter(eintrag => eintrag.id !== id);
                saveEintraege(aktualisierteEintraege);
                ladeEintraege(); // Lade die Liste neu
            } catch (error) {
                console.error('Fehler beim Löschen:', error);
                alert('Fehler beim Löschen des Eintrags.');
            }
        }
    }

    // Funktion zum Laden aller Einträge
    function ladeEintraege() {
        try {
            eintraegeListe.innerHTML = ''; // Lösche bestehende Einträge
            const eintraege = getEintraege();
            eintraege.forEach(eintrag => zeigeEintrag(eintrag));
        } catch (error) {
            console.error('Fehler:', error);
            eintraegeListe.innerHTML = '<p class="error">Fehler beim Laden der Einträge. Bitte versuchen Sie es später erneut.</p>';
        }
    }

    // Funktion zum Anzeigen eines Eintrags
    function zeigeEintrag(eintrag) {
        const eintragElement = document.createElement('div');
        eintragElement.className = 'eintrag';
        eintragElement.innerHTML = `
            <div class="eintrag-header">
                <span class="eintrag-name">${escapeHTML(eintrag.name)}</span>
                <span class="eintrag-datum">${escapeHTML(eintrag.datum)}</span>
                <button class="loeschen-btn" onclick="loescheEintrag(${eintrag.id})">Löschen</button>
            </div>
            <div class="eintrag-text">${escapeHTML(eintrag.message)}</div>
        `;

        // Füge den neuen Eintrag am Anfang der Liste ein
        if (eintraegeListe.firstChild) {
            eintraegeListe.insertBefore(eintragElement, eintraegeListe.firstChild);
        } else {
            eintraegeListe.appendChild(eintragElement);
        }
    }

    // Mache die Löschfunktion global verfügbar
    window.loescheEintrag = loescheEintrag;
}); 