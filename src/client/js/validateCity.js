function validateCity(city) {
    const regex = new RegExp(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/);
    if (regex.test(city)) {
        return true;
    } else {
        return false;
    }
}

export { validateCity }