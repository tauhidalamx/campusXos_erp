// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CreditCompletionContract {
    address public implementation;
    address public admin;

    struct CreditRecord {
        string courseCode;
        uint256 credits;
        string grade;
        uint256 completionTimestamp;
    }

    // student => credit records list
    mapping(address => CreditRecord[]) private studentCredits;
    // student => cumulative credits earned
    mapping(address => uint256) public cumulativeCredits;

    event CreditRecorded(address indexed student, string courseCode, uint256 credits, string grade, uint256 timestamp);
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

    function recordCredit(
        address student,
        string calldata courseCode,
        uint256 credits,
        string calldata grade
    ) external onlyAdmin {
        studentCredits[student].push(CreditRecord({
            courseCode: courseCode,
            credits: credits,
            grade: grade,
            completionTimestamp: block.timestamp
        }));
        cumulativeCredits[student] += credits;
        emit CreditRecorded(student, courseCode, credits, grade, block.timestamp);
    }

    function getStudentCredits(address student) external view returns (CreditRecord[] memory) {
        return studentCredits[student];
    }
}
