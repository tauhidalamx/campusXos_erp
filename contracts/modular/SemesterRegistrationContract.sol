// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SemesterRegistrationContract {
    address public implementation;
    address public admin;

    struct RegistrationWindow {
        uint256 startTimestamp;
        uint256 endTimestamp;
        bool isOpen;
    }

    struct SessionCalendar {
        string termName; // e.g. "Spring", "Monsoon"
        uint256 startDate;
        uint256 endDate;
    }

    // student => isRegistered
    mapping(address => bool) public studentRegistrations;
    // session => RegistrationWindow
    mapping(string => RegistrationWindow) public registrationWindows;
    // session => SessionCalendar
    mapping(string => SessionCalendar) public sessionCalendars;

    event RegistrationOpened(string session, uint256 start, uint256 end);
    event Registered(address indexed student, string session, uint256 timestamp);
    event CalendarUpdated(string session, string termName, uint256 start, uint256 end);
    event Upgraded(address indexed newImplementation);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Unauthorized");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function initialize(address _admin) external {
        require(admin == address(0), "Already initialized");
        admin = _admin;
    }

    function upgradeTo(address _newImplementation) external onlyAdmin {
        implementation = _newImplementation;
        emit Upgraded(_newImplementation);
    }

    function configureRegistrationWindow(
        string calldata session,
        uint256 start,
        uint256 end,
        bool isOpen
    ) external onlyAdmin {
        registrationWindows[session] = RegistrationWindow(start, end, isOpen);
        emit RegistrationOpened(session, start, end);
    }

    function configureSessionCalendar(
        string calldata session,
        string calldata termName,
        uint256 start,
        uint256 end
    ) external onlyAdmin {
        sessionCalendars[session] = SessionCalendar(termName, start, end);
        emit CalendarUpdated(session, termName, start, end);
    }

    function registerStudent(address student, string calldata session) external onlyAdmin {
        studentRegistrations[student] = true;
        emit Registered(student, session, block.timestamp);
    }
}
