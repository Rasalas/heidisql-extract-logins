(function () {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const dataTable = document.getElementById('dataTable');

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('hover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('hover');
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('hover');
        const file = event.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            processFile(file);
        }
    });

    function processFile(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const fileContents = event.target.result;
            loadData(fileContents);
            dataTable.style.display = 'block'; // Show the table
        };
        reader.readAsText(file);
    }

    function decodeHeidisql(hex) {
        let shift = parseInt(hex.slice(-1), 10);
        hex = hex.slice(0, -1);
        let result = '';
        for (let i = 0; i < hex.length; i += 2) {
            let charCode = parseInt(hex.substr(i, 2), 16) - shift;
            result += String.fromCharCode(charCode);
        }
        return result;
    }

    function loadData(fileContents) {
        const interestingRows = ['Password', 'User', 'Host', 'Port'];
        const search = ['ä', 'ö', 'ü', 'ß'];
        const replace = ['ae', 'oe', 'ue', 'ss'];
        let data = {};

        fileContents.split('\n').forEach(line => {
            let parts = line.split('\\');
            let nameValue = parts.pop().split('<|||>');
            let key = parts.slice(1).join('/').toLowerCase();

            search.forEach((item, index) => {
                key = key.replace(new RegExp(item, 'g'), replace[index]);
            });
            key = key.replace(/^\W$/, '_');

            if (interestingRows.includes(nameValue[0])) {
                if (!data[key]) data[key] = {};
                data[key][nameValue[0]] = nameValue[0] === 'Password' ? decodeHeidisql(nameValue[2].trim()) : nameValue[2].trim();
            }
        });

        renderTable(data);
    }

    function renderTable(data) {
        const tableHeader = document.getElementById('tableHeader');
        const tableBody = document.getElementById('tableBody');

        tableHeader.innerHTML = '<th>Folder</th>'; // Clear existing headers
        tableBody.innerHTML = ''; // Clear existing rows

        let firstKey = Object.keys(data)[0];
        Object.keys(data[firstKey]).forEach(header => {
            let th = document.createElement('th');
            th.textContent = header;
            tableHeader.appendChild(th);
        });

        Object.keys(data).forEach(folder => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = folder;
            tr.appendChild(td);

            Object.values(data[folder]).forEach(value => {
                let td = document.createElement('td');
                if (value) {
                    let kbd = document.createElement('kbd');
                    kbd.style.backgroundColor = 'var(--code-background-color)';
                    kbd.style.color = 'var(--code-color)';
                    kbd.textContent = value;
                    kbd.setAttribute('data-clipboard-text', value);
                    td.appendChild(kbd);
                }
                tr.appendChild(td);
            });

            tableBody.appendChild(tr);
        });
    }

    // Clipboard copy functionality with icon change
    document.addEventListener('click', function (event) {
        const target = event.target.closest('kbd[data-clipboard-text]');
        if (target) {
            const textToCopy = target.getAttribute('data-clipboard-text');

            navigator.clipboard.writeText(textToCopy).then(() => {
                // Add the 'copied' class to show the checkmark icon
                target.classList.add('copied');

                // After 1 second, remove the 'copied' class to revert to the original icon
                setTimeout(() => {
                    target.classList.remove('copied');
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    });

    function encodeHeidisql(password, shift) {
        let hex = '';
        for (let i = 0; i < password.length; i++) {
            let charCode = password.charCodeAt(i) + shift;
            hex += charCode.toString(16).padStart(2, '0');
        }
        return hex + shift.toString();
    }

    function loadDevData() {
        const exampleConnections = {
            "Servers\\prod\\Community": {
                "Host": "example.com",
                "User": "abed",
                "Password": "coolcoolcool",
                "Port": "3306"
            },
            "Servers\\dev\\test": {
                "Host": "127.0.0.1",
                "User": "root",
                "Password": "licoricelover",
                "Port": "3306"
            }
        };

        let devFileContents = '';

        Object.keys(exampleConnections).forEach(folderPath => {
            const connection = exampleConnections[folderPath];
            Object.keys(connection).forEach(key => {
                let value = connection[key];
                if (key === "Password") {
                    value = encodeHeidisql(value, 5); // Passwort wird mit shift 5 kodiert
                }
                devFileContents += `${folderPath}\\${key}<|||>{?}<|||>${value}\n`;
            });
        });

        console.log(devFileContents);

        loadData(devFileContents);
        dataTable.style.display = 'block'; // Show the table
    }

    function checkForDevMode() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('dev')) {
            loadDevData();
        }
    }

    window.onload = checkForDevMode;
})();
