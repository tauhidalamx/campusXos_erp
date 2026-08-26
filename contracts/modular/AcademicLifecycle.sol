// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AcademicLifecycle {
    // --- Structs ---
    struct Attendance {
        uint256 presentCount;
        uint256 totalCount;
        string remarksHash;
        bool exists;
    }

    struct TermMarks {
        uint256 internalMarks;
        uint256 externalMarks;
        uint256 practicalMarks;
        uint256 totalMarks;
        bool isPublished;
        bool exists;
    }

    struct ExamSchedule {
        string courseCode;
        string examName;
        uint256 examDate;
        string roomNumber;
        bool exists;
    }

    address public owner;

    // studentWallet => courseCode => Attendance
    mapping(address => mapping(string => Attendance)) private courseAttendance;
    
    // studentWallet => courseCode => TermMarks
    mapping(address => mapping(string => TermMarks)) private courseMarks;
    
    // courseCode => ExamSchedule
    mapping(string => ExamSchedule) private examSchedules;
    string[] private scheduledCoursesList;

    event AttendanceUpdated(address indexed student, string indexed courseCode, uint256 present, uint256 total);
    event MarksUploaded(address indexed student, string indexed courseCode, uint256 total);
    event MarksPublished(address indexed student, string indexed courseCode, bool published);
    event ExamScheduled(string indexed courseCode, string examName, uint256 examDate, string room);

    error Unauthorized();
    error ExamAlreadyScheduled();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function recordAttendance(
        address student,
        string calldata courseCode,
        uint256 present,
        uint256 total,
        string calldata remarksHash
    ) external {
        courseAttendance[student][courseCode] = Attendance({
            presentCount: present,
            totalCount: total,
            remarksHash: remarksHash,
            exists: true
        });

        emit AttendanceUpdated(student, courseCode, present, total);
    }

    function uploadMarks(
        address student,
        string calldata courseCode,
        uint256 internalMarks,
        uint256 externalMarks,
        uint256 practicalMarks
    ) external {
        uint256 total = internalMarks + externalMarks + practicalMarks;
        courseMarks[student][courseCode] = TermMarks({
            internalMarks: internalMarks,
            externalMarks: externalMarks,
            practicalMarks: practicalMarks,
            totalMarks: total,
            isPublished: false,
            exists: true
        });

        emit MarksUploaded(student, courseCode, total);
    }

    function publishMarks(
        address student,
        string calldata courseCode,
        bool published
    ) external {
        TermMarks storage m = courseMarks[student][courseCode];
        m.isPublished = published;
        emit MarksPublished(student, courseCode, published);
    }

    function scheduleExam(
        string calldata courseCode,
        string calldata examName,
        uint256 examDate,
        string calldata roomNumber
    ) external {
        if (examSchedules[courseCode].exists) revert ExamAlreadyScheduled();

        examSchedules[courseCode] = ExamSchedule({
            courseCode: courseCode,
            examName: examName,
            examDate: examDate,
            roomNumber: roomNumber,
            exists: true
        });
        
        scheduledCoursesList.push(courseCode);
        emit ExamScheduled(courseCode, examName, examDate, roomNumber);
    }

    function getAttendance(address student, string calldata courseCode) external view returns (
        uint256 present,
        uint256 total,
        string memory remarks
    ) {
        Attendance memory a = courseAttendance[student][courseCode];
        return (a.presentCount, a.totalCount, a.remarksHash);
    }

    function getMarks(address student, string calldata courseCode) external view returns (
        uint256 internalM,
        uint256 externalM,
        uint256 practicalM,
        uint256 total,
        bool published
    ) {
        TermMarks memory m = courseMarks[student][courseCode];
        return (m.internalMarks, m.externalMarks, m.practicalMarks, m.totalMarks, m.isPublished);
    }

    function getExamSchedule(string calldata courseCode) external view returns (
        string memory examName,
        uint256 examDate,
        string memory room
    ) {
        ExamSchedule memory e = examSchedules[courseCode];
        return (e.examName, e.examDate, e.roomNumber);
    }

    function getScheduledExams() external view returns (string[] memory) {
        return scheduledCoursesList;
    }
}
