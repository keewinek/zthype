const MAX_LOADING_TIME = 1500
setTimeout(() => {
    if (document.getElementById('loading-screen')) {
        document.getElementById('loading-screen').style.display = 'none';
        console.log(`Loading screen removed after ${MAX_LOADING_TIME} ms.`);
    }
}, MAX_LOADING_TIME)