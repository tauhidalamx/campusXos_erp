// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RegistrationApprovalContract {
    address public implementation;
    address public admin;

    struct ApprovalChain {
        bool hodApproved;
        bool deanApproved;
        bool registrarApproved;
        bool isCompleted;
    }

    // student => session => ApprovalChain
    mapping(address => mapping(string => ApprovalChain)) public approvals;

    event ApprovalStepSign(address indexed student, string session, string role, address indexed signer);
    event RegistrationChainComplete(address indexed student, string session);
    event Upgraded(address indexed newImplementation);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Unauthorized");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function upgradeTo(address _newImplementation) external onlyAdmin {
        implementation = _newImplementation;
        emit Upgraded(_newImplementation);
    }

    function signApprovalStep(
        address student,
        string calldata session,
        string calldata role,
        address signer
    ) external onlyAdmin {
        ApprovalChain storage chain = approvals[student][session];
        bytes32 roleHash = keccak256(bytes(role));
        
        if (roleHash == keccak256(bytes("HOD"))) {
            chain.hodApproved = true;
        } else if (roleHash == keccak256(bytes("DEAN"))) {
            chain.deanApproved = true;
        } else if (roleHash == keccak256(bytes("REGISTRAR"))) {
            chain.registrarApproved = true;
        }
        
        emit ApprovalStepSign(student, session, role, signer);
        
        if (chain.hodApproved && chain.deanApproved && chain.registrarApproved) {
            chain.isCompleted = true;
            emit RegistrationChainComplete(student, session);
        }
    }
}
