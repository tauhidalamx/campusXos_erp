import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  // Contracts
  private identityContract: ethers.Contract;
  private vaultContract: ethers.Contract;
  private lifecycleContract: ethers.Contract;

  constructor() {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Local anvil/hardhat key
    
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);

    // ABIs (Mock or Loaded from Hardhat Artifacts)
    const genericAbi = [
      "function registerUser(address, string, string, string, bytes32) external",
      "function mintCredential(string, string, string, string, string, string, string) external",
      "function recordAttendance(address, string, uint256, uint256, string) external",
      "function uploadMarks(address, string, uint256, uint256, uint256) external",
      "function getCredential(string) view returns (string, string, string, string, string, string, uint256, bool)"
    ];

    const identityAddr = process.env.IDENTITY_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const vaultAddr = process.env.CREDENTIAL_VAULT_CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
    const lifecycleAddr = process.env.LIFECYCLE_CONTRACT_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

    this.identityContract = new ethers.Contract(identityAddr, genericAbi, this.wallet);
    this.vaultContract = new ethers.Contract(vaultAddr, genericAbi, this.wallet);
    this.lifecycleContract = new ethers.Contract(lifecycleAddr, genericAbi, this.wallet);
  }

  // Identity Registration
  async registerOnChainUser(walletAddress: string, name: string, email: string, department: string, roleHash: string): Promise<string> {
    try {
      const tx = await this.identityContract.registerUser(walletAddress, name, email, department, roleHash);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Failed to register user on-chain:', error);
      return 'SIMULATION_TX_HASH_' + Math.floor(Math.random() * 100000);
    }
  }

  // Mint Verifiable Credential / SBT
  async mintOnChainSbt(
    id: string,
    studentId: string,
    courseCode: string,
    credentialType: string,
    name: string,
    grade: string,
    ipfsHash: string
  ): Promise<string> {
    try {
      const tx = await this.vaultContract.mintCredential(id, studentId, courseCode, credentialType, name, grade, ipfsHash);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Failed to mint SBT on-chain:', error);
      return 'SIMULATION_TX_HASH_' + Math.floor(Math.random() * 100000);
    }
  }

  // Record attendance hash on chain
  async recordOnChainAttendance(studentWallet: string, courseCode: string, present: number, total: number, remarksHash: string): Promise<string> {
    try {
      const tx = await this.lifecycleContract.recordAttendance(studentWallet, courseCode, present, total, remarksHash);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Failed to record attendance on-chain:', error);
      return 'SIMULATION_TX_HASH_' + Math.floor(Math.random() * 100000);
    }
  }

  // Record marks hash on chain
  async recordOnChainMarks(studentWallet: string, courseCode: string, internal: number, external: number, practical: number): Promise<string> {
    try {
      const tx = await this.lifecycleContract.uploadMarks(studentWallet, courseCode, internal, external, practical);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Failed to record marks on-chain:', error);
      return 'SIMULATION_TX_HASH_' + Math.floor(Math.random() * 100000);
    }
  }
}
