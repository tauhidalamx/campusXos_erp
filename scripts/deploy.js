const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of CampusX modular contracts...");

  // 1. Deploy IdentityRegistry
  const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry");
  const identity = await IdentityRegistry.deploy();
  await identity.waitForDeployment();
  console.log(`IdentityRegistry deployed to: ${await identity.getAddress()}`);

  // 2. Deploy AssignmentLedger
  const AssignmentLedger = await hre.ethers.getContractFactory("AssignmentLedger");
  const assignments = await AssignmentLedger.deploy();
  await assignments.waitForDeployment();
  console.log(`AssignmentLedger deployed to: ${await assignments.getAddress()}`);

  // 3. Deploy AcademicLifecycle
  const AcademicLifecycle = await hre.ethers.getContractFactory("AcademicLifecycle");
  const lifecycle = await AcademicLifecycle.deploy();
  await lifecycle.waitForDeployment();
  console.log(`AcademicLifecycle deployed to: ${await lifecycle.getAddress()}`);

  // 4. Deploy ExamAllocation
  const ExamAllocation = await hre.ethers.getContractFactory("ExamAllocation");
  const exams = await ExamAllocation.deploy();
  await exams.waitForDeployment();
  console.log(`ExamAllocation deployed to: ${await exams.getAddress()}`);

  // 5. Deploy CredentialVault
  const CredentialVault = await hre.ethers.getContractFactory("CredentialVault");
  const vault = await CredentialVault.deploy();
  await vault.waitForDeployment();
  console.log(`CredentialVault deployed to: ${await vault.getAddress()}`);

  // 6. Deploy ApprovalAndAudit
  const ApprovalAndAudit = await hre.ethers.getContractFactory("ApprovalAndAudit");
  const audit = await ApprovalAndAudit.deploy();
  await audit.waitForDeployment();
  console.log(`ApprovalAndAudit deployed to: ${await audit.getAddress()}`);

  // 7. Deploy AttendanceSystem
  const AttendanceSystem = await hre.ethers.getContractFactory("AttendanceSystem");
  const attendanceSys = await AttendanceSystem.deploy();
  await attendanceSys.waitForDeployment();
  console.log(`AttendanceSystem deployed to: ${await attendanceSys.getAddress()}`);

  console.log("All CampusX smart contracts successfully anchored on the chain.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
