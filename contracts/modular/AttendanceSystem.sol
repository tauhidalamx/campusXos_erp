// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AttendanceSystem {
    // --- Roles ---
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant HOD_ROLE = keccak256("HOD_ROLE");
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant FACULTY_ROLE = keccak256("FACULTY_ROLE");

    struct SessionRecord {
        string sessionId;
        string courseCode;
        uint256 dateTimestamp;
        uint256 presentCount;
        uint256 totalCount;
        string sheetHash; // SHA-256 integrity check
        bool isLocked;
        bool exists;
    }

    struct CorrectionRequest {
        string requestId;
        string sessionId;
        address studentWallet;
        string requestedStatus; // Present, Absent, Excused, etc.
        string reason;
        bool isReviewed;
        bool isApproved;
        address reviewer;
        uint256 reviewedAt;
        bool exists;
    }

    struct AuditRecord {
        string logId;
        address operator;
        string action; // e.g. LOCK_ATTENDANCE, APPROVE_CORRECTION
        string details;
        uint256 timestamp;
        bool exists;
    }

    address public owner;
    
    // Mappings
    mapping(string => SessionRecord) private sessions;
    mapping(string => CorrectionRequest) private corrections;
    mapping(string => AuditRecord) private audits;
    string[] private auditLogIds;

    // Role system mapping
    mapping(bytes32 => mapping(address => bool)) private _roles;

    // Events
    event SessionRecorded(string indexed sessionId, string courseCode, uint256 dateTimestamp, string sheetHash);
    event SessionLocked(string indexed sessionId, address lockedBy);
    event CorrectionRequested(string indexed requestId, string sessionId, address indexed studentWallet, string requestedStatus);
    event CorrectionApproved(string indexed requestId, address indexed reviewer, bool approved);
    event AuditRecorded(string indexed logId, address indexed operator, string action, uint256 timestamp);

    error Unauthorized();
    error SessionAlreadyExists();
    error SessionDoesNotExist();
    error SessionIsLocked();
    error CorrectionAlreadyExists();
    error CorrectionDoesNotExist();
    error CorrectionAlreadyReviewed();
    error AuditAlreadyExists();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyRole(bytes32 role) {
        if (!_roles[role][msg.sender] && msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyAuthorizedFacultyOrAdmin() {
        if (!_roles[FACULTY_ROLE][msg.sender] && !_roles[ADMIN_ROLE][msg.sender] && msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
        _roles[ADMIN_ROLE][msg.sender] = true;
        _roles[HOD_ROLE][msg.sender] = true;
        _roles[FACULTY_ROLE][msg.sender] = true;
    }

    function grantRole(bytes32 role, address account) external onlyOwner {
        _roles[role][account] = true;
    }

    function revokeRole(bytes32 role, address account) external onlyOwner {
        _roles[role][account] = false;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account] || account == owner;
    }

    // --- Core Attendance Actions ---
    function recordSession(
        string calldata sessionId,
        string calldata courseCode,
        uint256 dateTimestamp,
        uint256 presentCount,
        uint256 totalCount,
        string calldata sheetHash
    ) external onlyAuthorizedFacultyOrAdmin {
        if (sessions[sessionId].exists) {
            if (sessions[sessionId].isLocked) revert SessionIsLocked();
        }

        sessions[sessionId] = SessionRecord({
            sessionId: sessionId,
            courseCode: courseCode,
            dateTimestamp: dateTimestamp,
            presentCount: presentCount,
            totalCount: totalCount,
            sheetHash: sheetHash,
            isLocked: false,
            exists: true
        });

        emit SessionRecorded(sessionId, courseCode, dateTimestamp, sheetHash);
    }

    function lockSession(string calldata sessionId) external onlyAuthorizedFacultyOrAdmin {
        if (!sessions[sessionId].exists) revert SessionDoesNotExist();
        SessionRecord storage s = sessions[sessionId];
        s.isLocked = true;

        emit SessionLocked(sessionId, msg.sender);
    }

    // --- Correction Workflows ---
    function submitCorrectionRequest(
        string calldata requestId,
        string calldata sessionId,
        address studentWallet,
        string calldata requestedStatus,
        string calldata reason
    ) external {
        if (corrections[requestId].exists) revert CorrectionAlreadyExists();

        corrections[requestId] = CorrectionRequest({
            requestId: requestId,
            sessionId: sessionId,
            studentWallet: studentWallet,
            requestedStatus: requestedStatus,
            reason: reason,
            isReviewed: false,
            isApproved: false,
            reviewer: address(0),
            reviewedAt: 0,
            exists: true
        });

        emit CorrectionRequested(requestId, sessionId, studentWallet, requestedStatus);
    }

    function reviewCorrection(
        string calldata requestId,
        bool approved,
        string calldata logId
    ) external onlyAuthorizedFacultyOrAdmin {
        if (!corrections[requestId].exists) revert CorrectionDoesNotExist();
        CorrectionRequest storage c = corrections[requestId];
        if (c.isReviewed) revert CorrectionAlreadyReviewed();

        c.isReviewed = true;
        c.isApproved = approved;
        c.reviewer = msg.sender;
        c.reviewedAt = block.timestamp;

        emit CorrectionApproved(requestId, msg.sender, approved);

        // Record audit automatically
        this.recordAudit(
            logId,
            msg.sender,
            approved ? "APPROVE_CORRECTION" : "REJECT_CORRECTION",
            string(abi.encodePacked("Correction ID: ", requestId, " reviewed by faculty."))
        );
    }

    // --- Audit System ---
    function recordAudit(
        string calldata logId,
        address operator,
        string calldata action,
        string calldata details
    ) external {
        if (audits[logId].exists) revert AuditAlreadyExists();

        audits[logId] = AuditRecord({
            logId: logId,
            operator: operator,
            action: action,
            details: details,
            timestamp: block.timestamp,
            exists: true
        });

        auditLogIds.push(logId);
        emit AuditRecorded(logId, operator, action, block.timestamp);
    }

    // --- Read/Query Views ---
    function getSession(string calldata sessionId) external view returns (
        string memory courseCode,
        uint256 dateTimestamp,
        uint256 presentCount,
        uint256 totalCount,
        string memory sheetHash,
        bool isLocked
    ) {
        if (!sessions[sessionId].exists) revert SessionDoesNotExist();
        SessionRecord memory s = sessions[sessionId];
        return (s.courseCode, s.dateTimestamp, s.presentCount, s.totalCount, s.sheetHash, s.isLocked);
    }

    function getCorrection(string calldata requestId) external view returns (
        string memory sessionId,
        address studentWallet,
        string memory requestedStatus,
        string memory reason,
        bool isReviewed,
        bool isApproved,
        address reviewer,
        uint256 reviewedAt
    ) {
        if (!corrections[requestId].exists) revert CorrectionDoesNotExist();
        CorrectionRequest memory c = corrections[requestId];
        return (c.sessionId, c.studentWallet, c.requestedStatus, c.reason, c.isReviewed, c.isApproved, c.reviewer, c.reviewedAt);
    }

    function getAudit(string calldata logId) external view returns (
        address operator,
        string memory action,
        string memory details,
        uint256 timestamp
    ) {
        AuditRecord memory a = audits[logId];
        return (a.operator, a.action, a.details, a.timestamp);
    }

    function getAuditLogIds() external view returns (string[] memory) {
        return auditLogIds;
    }
}
