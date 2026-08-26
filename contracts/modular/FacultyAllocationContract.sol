// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FacultyAllocationContract {
    address public implementation;
    address public admin;

    struct Allocation {
        string courseCode;
        address faculty;
        string status; // PENDING, ACCEPTED, DECLINED
        bool deanApproved;
        uint256 assignedHours;
    }

    // allocationId => Allocation
    mapping(string => Allocation) public allocations;
    // faculty => teaching workload hours
    mapping(address => uint256) public facultyWorkloadHours;

    event FacultyAssigned(string allocationId, address indexed faculty, string courseCode, uint256 weeklyHours);
    event DeanApproved(string allocationId, address indexed dean);
    event AllocationResponse(string allocationId, string status);
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

    function createAllocation(
        string calldata allocationId,
        string calldata courseCode,
        address faculty,
        uint256 weeklyHours
    ) external onlyAdmin {
        allocations[allocationId] = Allocation({
            courseCode: courseCode,
            faculty: faculty,
            status: "PENDING",
            deanApproved: false,
            assignedHours: weeklyHours
        });
        emit FacultyAssigned(allocationId, faculty, courseCode, weeklyHours);
    }

    function approveByDean(string calldata allocationId, address dean) external onlyAdmin {
        require(allocations[allocationId].faculty != address(0), "Allocation does not exist");
        allocations[allocationId].deanApproved = true;
        emit DeanApproved(allocationId, dean);
    }

    function respondToAllocation(string calldata allocationId, string calldata status) external onlyAdmin {
        require(allocations[allocationId].faculty != address(0), "Allocation does not exist");
        allocations[allocationId].status = status;
        
        if (keccak256(bytes(status)) == keccak256(bytes("ACCEPTED"))) {
            address faculty = allocations[allocationId].faculty;
            facultyWorkloadHours[faculty] += allocations[allocationId].assignedHours;
        }
        
        emit AllocationResponse(allocationId, status);
    }
}
