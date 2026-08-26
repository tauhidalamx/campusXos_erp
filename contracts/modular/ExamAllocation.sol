// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ExamAllocation {
    struct Hall {
        string hallNumber;
        string building;
        uint256 capacity;
        bool exists;
    }

    struct SeatingPlan {
        string seatNumber;
        address student;
        string qrVerificationHash;
        bool exists;
    }

    struct ExaminerAssignment {
        address faculty;
        string subjectCode;
        string roleName; // Invigilator, Chief Superintendent, flying_squad
        bool exists;
    }

    address public owner;

    mapping(string => Hall) private halls;
    
    // courseCode => studentAddress => SeatingPlan
    mapping(string => mapping(address => SeatingPlan)) private seating;
    
    // courseCode => ExaminerAssignment[]
    mapping(string => ExaminerAssignment[]) private examinerAssignments;

    event HallRegistered(string indexed hallNumber, string building, uint256 capacity);
    event SeatingArranged(string indexed courseCode, address indexed student, string seatNumber, string qrHash);
    event ExaminerAssigned(string indexed courseCode, address indexed faculty, string roleName);

    error Unauthorized();
    error HallAlreadyExists();
    error HallDoesNotExist();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerExamHall(
        string calldata hallNumber,
        string calldata building,
        uint256 capacity
    ) external {
        if (halls[hallNumber].exists) revert HallAlreadyExists();

        halls[hallNumber] = Hall({
            hallNumber: hallNumber,
            building: building,
            capacity: capacity,
            exists: true
        });

        emit HallRegistered(hallNumber, building, capacity);
    }

    function allocateSeating(
        string calldata courseCode,
        address student,
        string calldata seatNumber,
        string calldata qrHash
    ) external {
        seating[courseCode][student] = SeatingPlan({
            seatNumber: seatNumber,
            student: student,
            qrVerificationHash: qrHash,
            exists: true
        });

        emit SeatingArranged(courseCode, student, seatNumber, qrHash);
    }

    function assignExaminer(
        string calldata courseCode,
        address faculty,
        string calldata roleName
    ) external {
        examinerAssignments[courseCode].push(ExaminerAssignment({
            faculty: faculty,
            subjectCode: courseCode,
            roleName: roleName,
            exists: true
        }));

        emit ExaminerAssigned(courseCode, faculty, roleName);
    }

    function getHallInfo(string calldata hallNumber) external view returns (
        string memory building,
        uint256 capacity
    ) {
        if (!halls[hallNumber].exists) revert HallDoesNotExist();
        return (halls[hallNumber].building, halls[hallNumber].capacity);
    }

    function getSeatingPlan(string calldata courseCode, address student) external view returns (
        string memory seatNumber,
        string memory qrHash
    ) {
        SeatingPlan memory s = seating[courseCode][student];
        return (s.seatNumber, s.qrVerificationHash);
    }

    function getExaminers(string calldata courseCode) external view returns (ExaminerAssignment[] memory) {
        return examinerAssignments[courseCode];
    }
}
