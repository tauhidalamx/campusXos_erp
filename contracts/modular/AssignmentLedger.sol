// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AssignmentLedger {
    struct Assignment {
        string assignmentId;
        string courseCode;
        string title;
        string rubricHash;
        uint256 dueDate;
        uint256 weightage;
        bool isDraft;
        bool isArchived;
        bool exists;
    }

    struct Submission {
        string submissionId;
        address student;
        string ipfsHash;
        uint256 timestamp;
        uint256 score;
        string feedbackHash;
        bool isEvaluated;
        bool exists;
    }

    address public owner;
    
    // Mappings
    mapping(string => Assignment) private assignments;
    mapping(string => mapping(address => Submission)) private submissions; // assignmentId => student => Submission
    mapping(string => address[]) private submissionKeys; // assignmentId => student addresses list

    event AssignmentCreated(string indexed assignmentId, string courseCode, string title, uint256 dueDate);
    event AssignmentUpdated(string indexed assignmentId, bool isDraft, bool isArchived);
    event SubmissionUploaded(string indexed assignmentId, address indexed student, string ipfsHash, uint256 timestamp);
    event SubmissionEvaluated(string indexed assignmentId, address indexed student, uint256 score, string feedbackHash);

    error Unauthorized();
    error AssignmentAlreadyExists();
    error AssignmentDoesNotExist();
    error SubmissionDoesNotExist();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createAssignment(
        string calldata assignmentId,
        string calldata courseCode,
        string calldata title,
        string calldata rubricHash,
        uint256 dueDate,
        uint256 weightage,
        bool isDraft
    ) external {
        // In production, verify msg.sender has Faculty or Admin role in IdentityRegistry
        if (assignments[assignmentId].exists) revert AssignmentAlreadyExists();

        assignments[assignmentId] = Assignment({
            assignmentId: assignmentId,
            courseCode: courseCode,
            title: title,
            rubricHash: rubricHash,
            dueDate: dueDate,
            weightage: weightage,
            isDraft: isDraft,
            isArchived: false,
            exists: true
        });

        emit AssignmentCreated(assignmentId, courseCode, title, dueDate);
    }

    function updateAssignmentState(
        string calldata assignmentId,
        bool isDraft,
        bool isArchived
    ) external {
        if (!assignments[assignmentId].exists) revert AssignmentDoesNotExist();
        
        Assignment storage a = assignments[assignmentId];
        a.isDraft = isDraft;
        a.isArchived = isArchived;

        emit AssignmentUpdated(assignmentId, isDraft, isArchived);
    }

    function submitAssignment(
        string calldata assignmentId,
        string calldata submissionId,
        string calldata ipfsHash
    ) external {
        if (!assignments[assignmentId].exists) revert AssignmentDoesNotExist();

        Submission storage s = submissions[assignmentId][msg.sender];
        if (!s.exists) {
            submissionKeys[assignmentId].push(msg.sender);
        }

        submissions[assignmentId][msg.sender] = Submission({
            submissionId: submissionId,
            student: msg.sender,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            score: 0,
            feedbackHash: "",
            isEvaluated: false,
            exists: true
        });

        emit SubmissionUploaded(assignmentId, msg.sender, ipfsHash, block.timestamp);
    }

    function evaluateSubmission(
        string calldata assignmentId,
        address student,
        uint256 score,
        string calldata feedbackHash
    ) external {
        if (!submissions[assignmentId][student].exists) revert SubmissionDoesNotExist();

        Submission storage s = submissions[assignmentId][student];
        s.score = score;
        s.feedbackHash = feedbackHash;
        s.isEvaluated = true;

        emit SubmissionEvaluated(assignmentId, student, score, feedbackHash);
    }

    function getAssignment(string calldata assignmentId) external view returns (
        string memory courseCode,
        string memory title,
        string memory rubricHash,
        uint256 dueDate,
        uint256 weightage,
        bool isDraft,
        bool isArchived
    ) {
        if (!assignments[assignmentId].exists) revert AssignmentDoesNotExist();
        Assignment memory a = assignments[assignmentId];
        return (a.courseCode, a.title, a.rubricHash, a.dueDate, a.weightage, a.isDraft, a.isArchived);
    }

    function getSubmission(string calldata assignmentId, address student) external view returns (
        string memory submissionId,
        string memory ipfsHash,
        uint256 timestamp,
        uint256 score,
        string memory feedbackHash,
        bool isEvaluated
    ) {
        if (!submissions[assignmentId][student].exists) revert SubmissionDoesNotExist();
        Submission memory s = submissions[assignmentId][student];
        return (s.submissionId, s.ipfsHash, s.timestamp, s.score, s.feedbackHash, s.isEvaluated);
    }

    function getSubmissionsList(string calldata assignmentId) external view returns (address[] memory) {
        return submissionKeys[assignmentId];
    }
}
