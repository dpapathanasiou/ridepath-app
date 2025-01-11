const picker = document.getElementById('departFrom');

var trains = [];

function activeStations() {
    return new Set(trains.map(train => train.station));
}

function populateStations() {
    let select = document.getElementById('departFrom');
    activeStations().forEach(station => {
        let opt = document.createElement('option');
        opt.value = station;
        opt.innerHTML = getStationName(station);
        select.appendChild(opt);
    });
}

function clearResults() {
    let results = document.getElementById('results');
    results.textContent = "";
    return results;
}

function noData() {
    let nothing = document.createElement('div');
    nothing.innerHTML = `<i>No data available right now</i>`;
    return nothing;
}

function refreshButton(parent) {
    let reload = document.createElement('button');
    reload.id = "reload";
    reload.type = "button";
    reload.value = "reload";
    reload.innerText = "refresh";
    parent.appendChild(reload);

    document.getElementById('reload').addEventListener("click", (event) => {
        event.preventDefault();
        loadActiveTrains(false, picker.value);
    });
}

function populateResults(station) {
    let results = clearResults();

    let matches = trains.filter(train => train.station === station);
    if (matches.length) {
        let table = document.createElement("table");
        matches.forEach(train => {
            let row = document.createElement("tr");
            row.innerHTML = formatParsedResult(train);
            table.appendChild(row);
        });
        results.appendChild(table);
        results.style.setProperty('overflow-x', 'auto');

        let latest = matches.filter(train => train.updated !== null).map(train => train.updated).pop();
        if (latest !== undefined) {
            let update = document.createElement('div');
            update.style.setProperty('padding', '0.75em');
            update.innerHTML = `<i>${latest.toDateString()} ${latest.toLocaleTimeString()}</i>`;
            results.appendChild(update);
            refreshButton(results);
        }
    } else {
        results.appendChild(noData());
    }
}

function clearActiveTrains() {
    while (trains.length) {
        trains.pop()
    }
}

function colorDot(lineColor) {
    let dots = [];
    lineColor.split(',').forEach(color => dots.push(`<span style="color: #${color}; font-size: 2em;">&bull;</span>`));
    return dots.join('');
}

function formatParsedResult(result) {
    let html = [];
    if (routes.hasOwnProperty(result.direction)) {
        routes[result.direction]
            .filter(rt => rt.line === result.line)
            .forEach(route => {
                let ind = route.stops.indexOf(result.station);
                let lastInd = route.stops.length - 1;
                var next, last;
                if (ind > -1) {
                    next = route.stops.at(ind + 1);
                    last = route.stops.at(lastInd);
                } else {
                    next = route.stops.at(lastInd);
                    last = route.stops.at(lastInd);
                }
                html.push(`<td>${colorDot(route.line)}</td>`);
                html.push(`<td>${route.sign}</td>`);
                html.push(`<td style="text-align: right">${result.arriving}</td>`);
                html.push(`<td><span class="arrow"> -> </span>${getStationName(next)}</td>`);
                html.push(`<td><span class="arrow"> => </span>${getStationName(last)}</td>`);
            });
    }
    return html.join('');
}

function parseResult(result) {
    if (result.hasOwnProperty('consideredStation') && result.hasOwnProperty('destinations')) {
        let station = result.consideredStation;
        result.destinations.forEach(dest => {
            if (dest.hasOwnProperty('label') && dest.hasOwnProperty('messages')) {
                dest.messages.forEach(message => {
                    if (message.hasOwnProperty('lineColor') && message.hasOwnProperty('arrivalTimeMessage') && message.hasOwnProperty('lastUpdated')) {
                        trains.push({
                            station: station,
                            direction: dest.label,
                            line: message.lineColor,
                            arriving: message.arrivalTimeMessage,
                            updated: parseDate(message.lastUpdated)
                        })
                    }
                });
            }
        });
    }
}

function parseDate(datestring) {
    try {
        const dt = new Date(datestring);
        return dt;
    } catch (error) {
        console.error('parseDate', datestring, error);
        return null;
    }
}

async function loadActiveTrains(isLoad, selection) {
    const url = "/data/ridepath.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load PATH data -> HTTP response: ${response.status}`);
        }

        clearActiveTrains();
        const json = await response.json();
        if (json.hasOwnProperty('results')) {
            json.results.forEach(parseResult)
        }

        if (isLoad) {
            populateStations();
        }
        if (selection) {
            populateResults(selection);
        }
    } catch (error) {
        let results = clearResults();
        results.appendChild(noData());

        console.error(error.message);
    }
}

picker.addEventListener("change", (event) => {
    event.preventDefault();
    populateResults(picker.value);
});

window.onload = (event) => {
    loadActiveTrains(event.type === "load", null);
};
