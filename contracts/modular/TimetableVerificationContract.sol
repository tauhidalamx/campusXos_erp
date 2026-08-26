// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TimetableVerificationContract {
    address public implementation;
    address public admin;

    struct TimetableSlot {
        string courseCode;
        string dayOfWeek;
        string startTime;
        string endTime;
        string room;
    }

    // student => session => TimetableSlot[]
    mapping(address => mapping(string => TimetableSlot[])) private studentSchedules;
    // session => published timetable hash
    mapping(string => bytes32) public publishedTimetableHashes;

    event TimetablePublished(string session, bytes32 timetableHash, uint256 timestamp);
    event StudentTimetableAssigned(address indexed student, string session, string courseCode, string room);
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

    function publishTimetableHash(string calldata session, bytes32 timetableHash) external onlyAdmin {
        publishedTimetableHashes[session] = timetableHash;
        emit TimetablePublished(session, timetableHash, block.timestamp);
    }

    function assignStudentTimetable(
        address student,
        string calldata session,
        string calldata courseCode,
        string calldata dayOfWeek,
        string calldata startTime,
        string calldata endTime,
        string calldata room
    ) external onlyAdmin {
        studentSchedules[student][session].push(TimetableSlot({
            courseCode: courseCode,
            dayOfWeek: dayOfWeek,
            startTime: startTime,
            endTime: endTime,
            room: room
        }));
        emit StudentTimetableAssigned(student, session, courseCode, room);
    }

    function getStudentTimetable(address student, string calldata session) external view returns (TimetableSlot[] memory) {
        return studentSchedules[student][session];
    }
}
