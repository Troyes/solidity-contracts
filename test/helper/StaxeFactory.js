let dummyDeadline = 11111111122222222222222222;
let dummyLat = 1234567890.123456;
let dummyLng = -9876543210.654321;
let dummyName = 'dummy';
let isMined = true;

function Builder(contract) {
    if (!(this instanceof Builder)) {
        throw new Error("Builder should be created with keyword new")
    }

    return {
        withName: (name) => {
            dummyName = name;
            return this;
        },
        withDeadline: (deadline) => {
            dummyDeadline = deadline;
            return this;
        },
        withLatitude: (lat) => {
            dummyLat = lat;
            return this;
        },
        withLongitude: (lng) => {
            dummyLng = lng;
            return this;
        },
        withoutMining: () => {
            isMined = false;
            return this;
        },
        build: () => {
            if (isMined) {
                return contract.createStaxe(dummyName, dummyDeadline, dummyLat, dummyLng);
            } else {
                return contract.createStaxe.call(dummyName, dummyDeadline, dummyLat, dummyLng);
            }
        }
    }
}

module.exports = {
    Builder
}