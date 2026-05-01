const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the modal trigger in the main render block
if (!content.includes('modal.type === "db_settings"')) {
    content = content.replace(
        '{modal.type === "messages" && <MessagesModal t={t} customMessages={customMessages} setCustomMessages={setCustomMessages} onClose={() => setModal(null)} />}',
        '{modal.type === "messages" && <MessagesModal t={t} customMessages={customMessages} setCustomMessages={setCustomMessages} onClose={() => setModal(null)} />}\n            {modal.type === "db_settings" && <DbSettingsModal onClose={() => setModal(null)} />}'
    );
}

fs.writeFileSync(filePath, content);
console.log("Successfully fixed DB Settings modal trigger.");
