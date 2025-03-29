document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gaestebuchForm');
    const eintraegeListe = document.getElementById('eintraegeListe');

    // Lade bestehende Einträge beim Start
    ladeEintraege();

    // Event-Listener für das Formular
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Hole die Formulardaten
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const datum = new Date().toLocaleString('de-DE');

        // Erstelle neuen Eintrag
        const neuerEintrag = {
            name,
            email,
            message,
            datum
        };

        try {
            // Sende den Eintrag an den Server
            const response = await fetch('gaestebuch.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(neuerEintrag)
            });

            if (!response.ok) {
                throw new Error('Fehler beim Speichern des Eintrags');
            }

            const result = await response.json();
            if (result.success) {
                // Zeige den Eintrag an
                zeigeEintrag(neuerEintrag);

                // Setze das Formular zurück
                form.reset();

                // Zeige Erfolgsmeldung
                alert('Ihr Eintrag wurde erfolgreich gespeichert!');
            } else {
                throw new Error('Fehler beim Speichern des Eintrags');
            }
        } catch (error) {
            console.error('Fehler:', error);
            alert('Es gab einen Fehler beim Speichern Ihres Eintrags. Bitte versuchen Sie es später erneut.');
        }
    });

    // Funktion zum Laden aller Einträge
    async function ladeEintraege() {
        try {
            const response = await fetch('gaestebuch.php');
            if (!response.ok) {
                throw new Error('Fehler beim Laden der Einträge');
            }
            const eintraege = await response.json();
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
                <span class="eintrag-name">${eintrag.name}</span>
                <span class="eintrag-datum">${eintrag.datum}</span>
            </div>
            <div class="eintrag-text">${eintrag.message}</div>
        `;

        // Füge den neuen Eintrag am Anfang der Liste ein
        if (eintraegeListe.firstChild) {
            eintraegeListe.insertBefore(eintragElement, eintraegeListe.firstChild);
        } else {
            eintraegeListe.appendChild(eintragElement);
        }
    }
}); 