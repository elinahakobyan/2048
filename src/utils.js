export const randomInt = (min, max) => {
    const mi = Math.ceil(min);
    const ma = Math.floor(max);
    return Math.floor(Math.random() * (ma - mi + 1)) + mi;
};

export const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = randomInt(0, i);
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
};

export const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

export const sampleSize = (arr, size) => {
    const shuffled = [...arr]; // arr.slice(0);
    shuffle(shuffled);
    return shuffled.slice(0, size);
};
