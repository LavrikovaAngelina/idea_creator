import { queryWithJWT, getAccessToken } from "./jwtQueries.js";
import { jwtDecode } from "jwt-decode";

function getHandle() {
    return jwtDecode(getAccessToken()).sub
};

async function getProfiles(handle, fetch_opts) {
    let response = await queryWithJWT(process.env.REACT_APP_BACKEND_BASE_URL + `/users/${handle}/profiles`, fetch_opts);
    if (response.ok) {
        var json = JSON.parse(await response.text());
        return json;
    }
};

async function postProfile(handle, profileKey, profileData, fetch_opts) {
    let body = {};
    if (profileKey === 'Individual') {
        body.profileType = 'INDIVIDUAL';
        body.name = profileData.name;
        body.surname = profileData.surname;
        body.patronymic = profileData.patronymic || '';
        body.phoneNumber = profileData.phoneNumber;
    } else {
        body.profileType = 'LEGAL';
        body.orgName = profileData.orgName;
        body.inn = profileData.legalInn;
        body.legalKind = { 'LLC': 'LLC', 'IP': 'INDIVIDUAL', 'SelfEmployed': 'SELF_EMPLOYED'}[profileKey];
        body.phoneNumber = profileData.legalPhoneNumber || '+79000000000';
    }

    let response = await queryWithJWT(process.env.REACT_APP_BACKEND_BASE_URL + `/users/${handle}/profiles`, {
                       method: "POST",
                       headers: new Headers({ 'Content-Type': 'application/json' }),
                       body: JSON.stringify(body),
                       ...fetch_opts
                   });

    if (response.ok) {
        var json = JSON.parse(await response.text());
        return { ...body, ...json };
    }
};

async function postRole(handle, profile, roleKey, roleData, fetch_opts) {
    const body = {
        profileId: profile.profileId,
        profileType: profile.profileType,
    };

    if (roleKey == 'Employee') {
        body.state = roleData.state || 'ACTIVE';
        body.speciality = roleData.speciality || 'PROGRAMMER';
    } else {
        // TODO customer fields
    }

    const response = await queryWithJWT(process.env.REACT_APP_BACKEND_BASE_URL + `/users/${handle}/${roleKey.toLowerCase()}s`, {
        method: "POST",
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
        ...fetch_opts
    });

    if (response.ok) {
        var json = JSON.parse(await response.text());
        return { ...profile, ...body, ...json };
    }
};

export { getHandle, getProfiles, postProfile, postRole }
