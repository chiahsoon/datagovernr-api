/**
* @type import('hardhat/config').HardhatUserConfig
*/

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import {HardhatUserConfig, task} from 'hardhat/config';
import {setupConfig} from './src/config/config';

setupConfig();

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const config: HardhatUserConfig = {
    solidity: '0.8.11',
    defaultNetwork: 'localhost',
    networks: {
        localhost: {
            url: 'http://127.0.0.1:8545',
            forking: {
                url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
            },
        },
    },
    paths: {
        sources: './contracts',
        tests: './test',
    },
};

export default config;
