// static reference data about the PATH network

const stations = new Map([
    ["09S", "9th Street"],
    ["14S", "14th Street"],
    ["23S", "23rd Street"],
    ["33S", "33rd Street"],
    ["CHR", "Christopher Street"],
    ["EXP", "Exchange Place"],
    ["GRV", "Grove Street"],
    ["HAR", "Harrison"],
    ["HOB", "Hoboken"],
    ["JSQ", "Journal Square"],
    ["NEW", "Newport"],
    ["NWK", "Newark"],
    ["WTC", "World Trade Center"],
]);

function getStationName(id) {
    return stations.has(id) ? stations.get(id) : id;
}

const routes = {
    ToNJ: [
        { line: "D93A30", sign: "Newark", stops: ["WTC", "EXP", "GRV", "JSQ", "HAR", "NWK"] },
        { line: "FF9900", sign: "Journal Square", stops: ["33S", "23S", "14S", "09S", "CHR", "NEW", "GRV", "JSQ"] },
        { line: "4D92FB", sign: "Hoboken", stops: ["33S", "23S", "14S", "09S", "CHR", "HOB"] },
        { line: "65C100", sign: "Hoboken", stops: ["WTC", "EXP", "NEW", "HOB"] },
        { line: "4D92FB,FF9900", sign: "Journal Square via Hoboken", stops: ["33S", "23S", "14S", "09S", "CHR", "HOB", "NEW", "GRV", "JSQ"] }
    ],
    ToNY: [
        { line: "D93A30", sign: "World Trade Center", stops: ["NWK", "HAR", "JSQ", "GRV", "EXP", "WTC"] },
        { line: "FF9900", sign: "33rd Street", stops: ["JSQ", "GRV", "NEW", "CHR", "09S", "14S", "23S", "33S"] },
        { line: "4D92FB", sign: "33rd Street", stops: ["HOB", "CHR", "09S", "14S", "23S", "33S"] },
        { line: "65C100", sign: "World Trade Center", stops: ["HOB", "NEW", "EXP", "WTC"] },
        { line: "4D92FB,FF9900", sign: "33rd Street via Hoboken", stops: ["JSQ", "GRV", "NEW", "HOB", "CHR", "09S", "14S", "23S", "33S"] }
    ]
};

