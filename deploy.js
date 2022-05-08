const axios = require('axios');


const stack = require('./stackdeploy.json');
const currentService = 'BE_VERSION';
const currentVersion = require('./package.json').version.toString();
stack.Env.find(env => env.name === currentService).value = currentVersion;
const domain = 'http://20hcb.tiennm.xyz:9000';
// const domain = 'http://20hcb.tiennm.xyz:9000';


async function getToken() {
    const data = JSON.stringify({ "username": 'ccnlthd', "password": 'ccnlthd&^#$&*^#$' });

    const config = {
        method: 'post',
        url: `${domain}/api/auth`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return await new Promise((solve, reject) => {
        axios(config)
            .then(function (response) {
                solve(response?.data?.jwt || null);
            })
            .catch(function (error) {
                throw new Error(error);
            });
    });
}

async function deploy() {
    const token = await getToken();
    console.log(`Login with token ${token}`);

    if (!token) process.exit(142);

    const data = JSON.stringify(stack);
    const config = {
        method: 'put',
        url: `${domain}/api/stacks/3?endpointId=2`,
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response?.data));
        })
        .catch(function (error) {
            throw new Error(error);
        });
}

deploy();
