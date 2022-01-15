import '@nomiclabs/hardhat-ethers';
import {ethers} from 'hardhat';

async function main() {
    const DataGovernR = await ethers.getContractFactory('DataGovernR');
    const dataGovernR = await DataGovernR.deploy();

    await dataGovernR.deployed();

    console.log('DataGovernR deployed to:', dataGovernR.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
