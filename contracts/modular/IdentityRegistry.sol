// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityRegistry {
    // --- Roles ---
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant FACULTY_ROLE = keccak256("FACULTY_ROLE");
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");
    bytes32 public constant HOD_ROLE = keccak256("HOD_ROLE");
    bytes32 public constant DEAN_ROLE = keccak256("DEAN_ROLE");
    bytes32 public constant COE_ROLE = keccak256("COE_ROLE"); // Controller of Examination
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE"); // Course Coordinator

    address public owner;
    
    struct UserProfile {
        string name;
        string email;
        string department;
        bytes32 role;
        bool isActive;
        bool exists;
    }

    mapping(address => UserProfile) private profiles;
    mapping(string => address) private emailToAddress;
    
    mapping(bytes32 => mapping(address => bool)) private _roles;

    event ProfileRegistered(address indexed account, string name, string email, bytes32 indexed role);
    event ProfileUpdated(address indexed account, bool isActive);
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    error Unauthorized();
    error UserAlreadyExists();
    error UserDoesNotExist();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyAdmin() {
        if (!hasRole(ADMIN_ROLE, msg.sender) && msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
        _roles[ADMIN_ROLE][msg.sender] = true;
        emit RoleGranted(ADMIN_ROLE, msg.sender, msg.sender);
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account];
    }

    function grantRole(bytes32 role, address account) external onlyAdmin {
        _roles[role][account] = true;
        emit RoleGranted(role, account, msg.sender);
    }

    function revokeRole(bytes32 role, address account) external onlyAdmin {
        _roles[role][account] = false;
        emit RoleRevoked(role, account, msg.sender);
    }

    function registerUser(
        address account,
        string calldata name,
        string calldata email,
        string calldata department,
        bytes32 role
    ) external onlyAdmin {
        if (profiles[account].exists) revert UserAlreadyExists();
        
        profiles[account] = UserProfile({
            name: name,
            email: email,
            department: department,
            role: role,
            isActive: true,
            exists: true
        });
        
        emailToAddress[email] = account;
        _roles[role][account] = true;
        
        emit ProfileRegistered(account, name, email, role);
        emit RoleGranted(role, account, msg.sender);
    }

    function setUserActiveStatus(address account, bool isActive) external onlyAdmin {
        if (!profiles[account].exists) revert UserDoesNotExist();
        profiles[account].isActive = isActive;
        emit ProfileUpdated(account, isActive);
    }

    function getUserProfile(address account) external view returns (
        string memory name,
        string memory email,
        string memory department,
        bytes32 role,
        bool isActive
    ) {
        if (!profiles[account].exists) revert UserDoesNotExist();
        UserProfile memory p = profiles[account];
        return (p.name, p.email, p.department, p.role, p.isActive);
    }

    function getAddressByEmail(string calldata email) external view returns (address) {
        return emailToAddress[email];
    }
}
