"use client";
import { useEffect, useState } from "react";
import { getWeb3, getContract } from "./lib/SmartContract";

const YourComponent = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0); // เพิ่ม State สำหรับจำนวนเงิน
  console.log(balance);

  useEffect(() => {
    getWeb3()
      .then((newWeb3) => {
        setWeb3(newWeb3);

        // ร้องขอการอนุญาตให้เข้าถึงบัญชีผู้ใช้
        window.ethereum.enable().then(() => {
          const newContract = getContract(newWeb3);
          setContract(newContract);

          // เรียกฟังก์ชันเพื่อดึงข้อมูล
          updateBalance();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const updateBalance = async () => {
    if (web3 && contract) {
      const userAddress = (await web3.eth.getAccounts())[0];
      const userBalance = await contract.methods
        .getBalance()
        .call({ from: userAddress });
      setBalance(userBalance);
    }
  };

  const deposit = async () => {
    if (web3 && contract) {
      const userAddress = (await web3.eth.getAccounts())[0];
      // ส่งธุรกรรมฝากเงินและรอให้มี receipt หลังจากนั้นทำการอัปเดตยอดเงิน
      await contract.methods
        .deposit()
        .send({
          from: userAddress,
          value: web3.utils.toWei(amount.toString(), "ether"),
        })
        .on("receipt", async () => {
          await updateBalance();
        });
    }
  };

  const withdraw = async () => {
    if (web3 && contract) {
      const userAddress = (await web3.eth.getAccounts())[0];
      // เรียกใช้ฟังก์ชันถอนเงินใน Smart Contract
      await contract.methods
        .withdraw(web3.utils.toWei(amount.toString(), "ether"))
        .send({ from: userAddress });
      // หลังจากถอนเงินแล้วให้ทำการอัปเดตยอดเงิน
      await updateBalance();
    }
  };

  return (
    <div className="container">
      <h1>Your Wallet</h1>
      <p>Balance: {balance.toString()} ETH</p>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={deposit}>Deposit</button>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
};

export default YourComponent;
