
//think about what to return
async function queryWithJWT(addr, fetch_params) {
    let res = await fetch(addr, addAccess(fetch_params));
    if (res.status == 401) {
        if (await tryUpdateTokens(fetch_params)) {
            return await fetch(addr, addAccess(fetch_params));
        }
    }
    return res;
}

async function queryGetsJWT(addr, init) {
    init.credentials = "include";
    let res = await fetch(addr, { ...init, credentials: "include" });
    if (res.ok) {
        var tokens = JSON.parse(await res.text());
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
    }
    return res;
}

async function tryUpdateTokens(fetch_params) {
    const auth_params = addRefresh({ credentials: "include", method: "GET" });
    let res = await queryGetsJWT(process.env.REACT_APP_BACKEND_BASE_URL + "/auth/refresh",
        { ...fetch_params, ...auth_params});
    return res.ok;
}

function getAccessToken() {
    return localStorage.getItem('accessToken');
}

function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

function setAccessToken(value) {
    return localStorage.setItem('accessToken', value);
}

function setRefreshToken(value) {
    return localStorage.setItem('refreshToken', value);
}

function removeAccessToken() {
    return localStorage.removeItem('accessToken');
}

function removeRefreshToken() {
    return localStorage.removeItem('refreshToken');
}

function addAccess(init) {
    return addAuthToken(init, "Bearer " + getAccessToken())
}

function addRefresh(init) {
    return addAuthToken(init, "Bearer " + getRefreshToken())
}

function addAuthToken(init, token) {
    let params_to_add = {credentials: "include"}
    if (!init.headers) {
        params_to_add.headers = new Headers({Authorization: token});
    } else {
        if (init.headers.has('Authorization')) {
            throw "HTTP Headers already have 'Authorization' header"
        }
        params_to_add.headers = cloneHeaders(init.headers)
        params_to_add.headers.append('Authorization', token)
    }
    return {
        ...init,
        ...params_to_add,
    };
}

function cloneHeaders(fromHeaders) {
    var to = new Headers();
    for (var kv of fromHeaders.entries()) {
        to.append(kv[0], kv[1]);
    }
    return to;
}

function deleteAllJWT() {
    removeAccessToken();
    removeRefreshToken();
}

export { queryWithJWT, queryGetsJWT, tryUpdateTokens, deleteAllJWT, getAccessToken }
