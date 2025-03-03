export const loginRedirect = async () => {
    window.location.href = `https://localhost/login?relayState=${window.location.pathname}`;
};
