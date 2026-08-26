// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AcademicCreditContract {
    address public implementation;
    address public admin;

    struct CreditLimit {
        uint256 minCredits;
        uint256 maxCredits;
    }

    // student => cumulative credits earned
    mapping(address => uint256) public cumulativeCredits;
    // student => credit limits for current term
    mapping(address => CreditLimit) public studentLimits;

    event CreditsUpdated(address indexed student, uint256 newCumulativeCredits);
    event LimitsConfigured(address indexed student, uint256 minCredits, uint256 maxCredits);
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

    function updateCredits(address student, uint256 credits) external onlyAdmin {
        cumulativeCredits[student] = credits;
        emit CreditsUpdated(student, credits);
    }

    function configureLimits(address student, uint256 minC, uint256 maxC) external onlyAdmin {
        studentLimits[student] = CreditLimit(minC, maxC);
        emit LimitsConfigured(student, minC, maxC);
    }
}
