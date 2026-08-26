// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CredentialVault {
    struct AcademicCredential {
        string studentId;
        string courseCode;
        string credentialType; // DEGREE, TRANSCRIPT, CERTIFICATE, SCHOLARSHIP
        string name;
        string grade;
        string ipfsHash;
        uint256 issueDate;
        bool isValid;
        bool exists;
    }

    struct ResearchPaper {
        string paperId;
        string title;
        address leadResearcher;
        string coAuthors;
        string ipfsHash;
        uint256 registeredAt;
        bool exists;
    }

    address public owner;
    
    // mapping to store credentials by ID
    mapping(string => AcademicCredential) private credentials;
    // studentId => list of credential IDs
    mapping(string => string[]) private studentCredentials;

    // mapping to store research papers by ID
    mapping(string => ResearchPaper) private papers;
    string[] private paperIds;

    event CredentialMinted(string indexed id, string studentId, string credentialType, string ipfsHash);
    event CredentialRevoked(string indexed id, string reason);
    event ResearchRegistered(string indexed paperId, string title, address leadResearcher, string ipfsHash);

    error Unauthorized();
    error CredentialAlreadyExists();
    error CredentialDoesNotExist();
    error ResearchAlreadyExists();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function mintCredential(
        string calldata id,
        string calldata studentId,
        string calldata courseCode,
        string calldata credentialType,
        string calldata name,
        string calldata grade,
        string calldata ipfsHash
    ) external {
        if (credentials[id].exists) revert CredentialAlreadyExists();

        credentials[id] = AcademicCredential({
            studentId: studentId,
            courseCode: courseCode,
            credentialType: credentialType,
            name: name,
            grade: grade,
            ipfsHash: ipfsHash,
            issueDate: block.timestamp,
            isValid: true,
            exists: true
        });

        studentCredentials[studentId].push(id);
        emit CredentialMinted(id, studentId, credentialType, ipfsHash);
    }

    function revokeCredential(string calldata id, string calldata reason) external {
        if (!credentials[id].exists) revert CredentialDoesNotExist();
        credentials[id].isValid = false;
        emit CredentialRevoked(id, reason);
    }

    function registerResearch(
        string calldata paperId,
        string calldata title,
        address leadResearcher,
        string calldata coAuthors,
        string calldata ipfsHash
    ) external {
        if (papers[paperId].exists) revert ResearchAlreadyExists();

        papers[paperId] = ResearchPaper({
            paperId: paperId,
            title: title,
            leadResearcher: leadResearcher,
            coAuthors: coAuthors,
            ipfsHash: ipfsHash,
            registeredAt: block.timestamp,
            exists: true
        });

        paperIds.push(paperId);
        emit ResearchRegistered(paperId, title, leadResearcher, ipfsHash);
    }

    function getCredential(string calldata id) external view returns (
        string memory studentId,
        string memory courseCode,
        string memory credentialType,
        string memory name,
        string memory grade,
        string memory ipfsHash,
        uint256 issueDate,
        bool isValid
    ) {
        if (!credentials[id].exists) revert CredentialDoesNotExist();
        AcademicCredential memory c = credentials[id];
        return (c.studentId, c.courseCode, c.credentialType, c.name, c.grade, c.ipfsHash, c.issueDate, c.isValid);
    }

    function getStudentCredentials(string calldata studentId) external view returns (string[] memory) {
        return studentCredentials[studentId];
    }

    function getResearchPaper(string calldata paperId) external view returns (
        string memory title,
        address leadResearcher,
        string memory coAuthors,
        string memory ipfsHash,
        uint256 registeredAt
    ) {
        ResearchPaper memory p = papers[paperId];
        return (p.title, p.leadResearcher, p.coAuthors, p.ipfsHash, p.registeredAt);
    }

    function getAllResearchIds() external view returns (string[] memory) {
        return paperIds;
    }
}
