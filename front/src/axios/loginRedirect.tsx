export const loginRedirect = async () => {
    window.location.href = `http://localhost:5173/login?relayState=${window.location.pathname}`;
 };