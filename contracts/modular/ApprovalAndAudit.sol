// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ApprovalAndAudit {
    struct ApprovalState {
        string approvalId;
        string actionType; // MARKS_PUBLISH, EXAM_PUBLISH, DEGREE_ISSUE
        address initiator;
        uint256 signatureCount;
        bool isApproved;
        bool exists;
    }

    struct AuditLog {
        string logId;
        address operator;
        string userRole;
        string action;
        string payloadHash;
        uint256 timestamp;
        bool exists;
    }

    address public owner;
    
    // Mappings
    mapping(string => ApprovalState) private approvals;
    mapping(string => mapping(address => bool)) private hasSigned; // approvalId => signer => signed
    
    mapping(string => AuditLog) private auditLogs;
    string[] private auditLogIds;

    event ApprovalInitiated(string indexed approvalId, string actionType, address initiator);
    event ApprovalSigned(string indexed approvalId, address indexed signer);
    event ActionApproved(string indexed approvalId);
    event AuditRecorded(string indexed logId, address indexed operator, string action, uint256 timestamp);

    error Unauthorized();
    error ApprovalAlreadyExists();
    error ApprovalDoesNotExist();
    error AlreadySigned();
    error AuditAlreadyExists();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function initiateApproval(string calldata approvalId, string calldata actionType) external {
        if (approvals[approvalId].exists) revert ApprovalAlreadyExists();

        approvals[approvalId] = ApprovalState({
            approvalId: approvalId,
            actionType: actionType,
            initiator: msg.sender,
            signatureCount: 0,
            isApproved: false,
            exists: true
        });

        emit ApprovalInitiated(approvalId, actionType, msg.sender);
    }

    function signApproval(string calldata approvalId, uint256 threshold) external {
        if (!approvals[approvalId].exists) revert ApprovalDoesNotExist();
        if (hasSigned[approvalId][msg.sender]) revert AlreadySigned();

        hasSigned[approvalId][msg.sender] = true;
        
        ApprovalState storage a = approvals[approvalId];
        a.signatureCount += 1;

        emit ApprovalSigned(approvalId, msg.sender);

        if (a.signatureCount >= threshold && !a.isApproved) {
            a.isApproved = true;
            emit ActionApproved(approvalId);
        }
    }

    function recordAudit(
        string calldata logId,
        address operator,
        string calldata roleName,
        string calldata action,
        string calldata payloadHash
    ) external {
        if (auditLogs[logId].exists) revert AuditAlreadyExists();

        auditLogs[logId] = AuditLog({
            logId: logId,
            operator: operator,
            userRole: roleName,
            action: action,
            payloadHash: payloadHash,
            timestamp: block.timestamp,
            exists: true
        });

        auditLogIds.push(logId);
        emit AuditRecorded(logId, operator, action, block.timestamp);
    }

    function getApproval(string calldata approvalId) external view returns (
        string memory actionType,
        address initiator,
        uint256 signatureCount,
        bool isApproved
    ) {
        if (!approvals[approvalId].exists) revert ApprovalDoesNotExist();
        ApprovalState memory a = approvals[approvalId];
        return (a.actionType, a.initiator, a.signatureCount, a.isApproved);
    }

    function hasUserSigned(string calldata approvalId, address user) external view returns (bool) {
        return hasSigned[approvalId][user];
    }

    function getAuditLog(string calldata logId) external view returns (
        address operator,
        string memory roleName,
        string memory action,
        string memory payloadHash,
        uint256 timestamp
    ) {
        AuditLog memory l = auditLogs[logId];
        return (l.operator, l.userRole, l.action, l.payloadHash, l.timestamp);
    }

    function getAllAuditLogIds() external view returns (string[] memory) {
        return auditLogIds;
    }
}
