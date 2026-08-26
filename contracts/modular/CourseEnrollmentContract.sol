// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CourseEnrollmentContract {
    address public implementation;
    address public admin;

    struct EnrollmentRecord {
        string courseCode;
        string section;
        uint256 enrolledAt;
        bool isActive;
    }

    // student => enrollment records list
    mapping(address => EnrollmentRecord[]) private studentEnrollments;
    // courseCode => active enrollment count
    mapping(string => uint256) public courseSeatsTaken;

    event StudentEnrolled(address indexed student, string courseCode, string section, uint256 timestamp);
    event EnrollmentCancelled(address indexed student, string courseCode);
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

    function enrollStudent(
        address student,
        string calldata courseCode,
        string calldata section
    ) external onlyAdmin {
        studentEnrollments[student].push(EnrollmentRecord({
            courseCode: courseCode,
            section: section,
            enrolledAt: block.timestamp,
            isActive: true
        }));
        courseSeatsTaken[courseCode]++;
        emit StudentEnrolled(student, courseCode, section, block.timestamp);
    }

    function cancelEnrollment(address student, string calldata courseCode) external onlyAdmin {
        EnrollmentRecord[] storage records = studentEnrollments[student];
        for (uint256 i = 0; i < records.length; i++) {
            if (keccak256(bytes(records[i].courseCode)) == keccak256(bytes(courseCode)) && records[i].isActive) {
                records[i].isActive = false;
                if (courseSeatsTaken[courseCode] > 0) {
                    courseSeatsTaken[courseCode]--;
                }
                emit EnrollmentCancelled(student, courseCode);
                break;
            }
        }
    }

    function getStudentEnrollments(address student) external view returns (EnrollmentRecord[] memory) {
        return studentEnrollments[student];
    }
}
