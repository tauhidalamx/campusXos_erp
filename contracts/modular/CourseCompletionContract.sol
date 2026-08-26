// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CourseCompletionContract {
    address public implementation;
    address public admin;

    struct CompletionRecord {
        string courseCode;
        string grade;
        uint256 creditsEarned;
        bool isBacklog;
        bool exists;
    }

    // student => courseCode => CompletionRecord
    mapping(address => mapping(string => CompletionRecord)) public completionRecords;

    event CourseCompleted(address indexed student, string courseCode, string grade, uint256 credits, bool isBacklog);
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

    function recordCompletion(
        address student,
        string calldata courseCode,
        string calldata grade,
        uint256 credits,
        bool isBacklog
    ) external onlyAdmin {
        completionRecords[student][courseCode] = CompletionRecord({
            courseCode: courseCode,
            grade: grade,
            creditsEarned: credits,
            isBacklog: isBacklog,
            exists: true
        });
        emit CourseCompleted(student, courseCode, grade, credits, isBacklog);
    }
}
