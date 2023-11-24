import Web3 from 'web3';
import ABI from './abi.json'; // ต้องปรับที่อยู่ไฟล์ให้ถูกต้อง

const contractAddress = '0x6d6334d3bE4d02b9318ECe9D9be04AB803938398';

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      resolve(web3);
    } else {
      reject('Web3 not found. Please install MetaMask or use a Web3-enabled browser.');
    }
  });
};

const getContract = (web3) => {
  return new web3.eth.Contract(ABI, contractAddress);
};

export { getWeb3, getContract };
