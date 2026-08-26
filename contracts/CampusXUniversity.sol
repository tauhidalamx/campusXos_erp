// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CampusXUniversityOS
 * @dev On-chain core identity, academic credentialing, financial escrow, and governance ledger for the CAMPUSX University Operating System.
 * Supports Soulbound Certificates, RBAC, dynamic course catalog registries, tuition payment books, research grants milestone escrows, and campus voting.
 */
contract CampusXUniversity {

    // --- Access Control Roles ---
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant FACULTY_ROLE = keccak256("FACULTY_ROLE");
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");
    bytes32 public constant PARENT_ROLE = keccak256("PARENT_ROLE");
    bytes32 public constant ALUMNI_ROLE = keccak256("ALUMNI_ROLE");

    address public owner;
    
    // Role management
    mapping(bytes32 => mapping(address => bool)) private _roles;

    // --- Reentrancy Guard State ---
    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _reentrancyStatus = _NOT_ENTERED;

    // --- Student & Course Registries Structs ---
    struct Student {
        string studentId;
        string name;
        bool isEnrolled;
        uint256 currentSemester;
        string department;
        bool exists;
    }

    struct Course {
        string courseCode;
        string title;
        uint8 credits;
        bool isActive;
    }

    // Student Registry maps
    mapping(address => Student) private students;
    mapping(string => address) private studentIdToAddress;
    mapping(address => string[]) private studentRegisteredCourses;

    // Course Registry maps
    mapping(string => Course) private courses;
    string[] private courseCatalog;

    // --- Soulbound Credentials (SBT) ---
    struct Certificate {
        string studentId;
        string studentName;
        string courseCode;
        string grade;
        uint256 issueDate;
        address issuer;
        string ipfsHash; // Off-chain metadata hash for verification
        bool isValid;
    }

    mapping(uint256 => Certificate) private certificates;
    uint256 public nextCertificateId;

    // --- Tuition & Financial Gateways ---
    struct TuitionFee {
        uint256 totalDue;
        uint256 amountPaid;
        bool isPaidFull;
    }

    mapping(string => TuitionFee) public tuitionFees;

    // --- Research Grants Escrow ---
    struct Grant {
        uint256 id;
        string title;
        address payable leadResearcher;
        uint256 totalFunding;
        uint256 disbursedFunding;
        uint8 totalMilestones;
        uint8 currentMilestone;
        bool isApproved;
        bool isCompleted;
    }

    mapping(uint256 => Grant) private grants;
    uint256 public nextGrantId;

    // --- Decentralized Campus Governance ---
    struct Proposal {
        uint256 id;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        bool executed;
        bool exists;
    }

    mapping(uint256 => Proposal) private proposals;
    mapping(uint256 => mapping(address => bool)) private proposalVoters;
    uint256 public nextProposalId;

    // --- Custom Errors ---
    error Unauthorized();
    error RoleAlreadyGranted();
    error RoleNotGranted();
    error ReentrancyGuardError();
    error StudentAlreadyExists();
    error StudentDoesNotExist();
    error CourseDoesNotExist();
    error CourseAlreadyExists();
    error InvalidPaymentAmount();
    error GrantDoesNotExist();
    error GrantAlreadyApproved();
    error InsufficientEscrowBalance();
    error MilestoneCompleted();
    error InvalidProposalId();
    error ProposalExpired();
    error ProposalNotExpired();
    error VotingAlreadyEnded();
    error AlreadyVoted();
    error TransferFailed();
    error CertificateDoesNotExist();

    // --- Events ---
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    
    event StudentEnrolled(string indexed studentId, address indexed wallet, string name);
    event StudentStatusUpdated(string indexed studentId, bool isEnrolled);
    
    event CourseAdded(string indexed courseCode, string title, uint8 credits);
    event CourseRegistered(address indexed student, string indexed courseCode);
    event CourseDropped(address indexed student, string indexed courseCode);

    event CertificateMinted(
        uint256 indexed certificateId,
        string studentId,
        string studentName,
        string courseCode,
        string grade,
        uint256 issueDate,
        string ipfsHash,
        address indexed issuer
    );
    event CertificateRevoked(uint256 indexed certificateId, string reason);

    event TuitionFeeSet(string indexed studentId, uint256 totalDue);
    event TuitionFeePaid(string indexed studentId, address indexed sender, uint256 amountPaid, uint256 totalPaid);
    
    event GrantProposed(uint256 indexed grantId, string title, address indexed researcher, uint256 fundingAmount);
    event GrantApproved(uint256 indexed grantId);
    event GrantFunded(uint256 indexed grantId, uint256 amount);
    event MilestoneReleased(uint256 indexed grantId, uint8 milestoneIndex, uint256 amount);

    event ProposalCreated(uint256 indexed proposalId, string description, uint256 endTime);
    event ProposalVoted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);

    // --- Modifiers ---
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyAdmin() {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert Unauthorized();
        _;
    }

    modifier onlyRegistrar() {
        if (!hasRole(REGISTRAR_ROLE, msg.sender) && !hasRole(ADMIN_ROLE, msg.sender)) revert Unauthorized();
        _;
    }

    modifier onlyFaculty() {
        if (!hasRole(FACULTY_ROLE, msg.sender) && !hasRole(ADMIN_ROLE, msg.sender)) revert Unauthorized();
        _;
    }

    modifier nonReentrant() {
        if (_reentrancyStatus == _ENTERED) revert ReentrancyGuardError();
        _reentrancyStatus = _ENTERED;
        _;
        _reentrancyStatus = _NOT_ENTERED;
    }

    constructor() {
        owner = msg.sender;
        _roles[ADMIN_ROLE][msg.sender] = true;
        _roles[REGISTRAR_ROLE][msg.sender] = true;
        emit RoleGranted(ADMIN_ROLE, msg.sender, msg.sender);
        emit RoleGranted(REGISTRAR_ROLE, msg.sender, msg.sender);
    }

    // --- Role Access Controls ---
    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account];
    }

    function grantRole(bytes32 role, address account) external onlyAdmin {
        if (hasRole(role, account)) revert RoleAlreadyGranted();
        _roles[role][account] = true;
        emit RoleGranted(role, account, msg.sender);
    }

    function revokeRole(bytes32 role, address account) external onlyAdmin {
        if (!hasRole(role, account)) revert RoleNotGranted();
        _roles[role][account] = false;
        emit RoleRevoked(role, account, msg.sender);
    }

    // --- Student & Enrollment Registry ---
    function enrollNewStudent(
        address wallet,
        string calldata studentId,
        string calldata name,
        string calldata department
    ) external onlyRegistrar {
        if (students[wallet].exists) revert StudentAlreadyExists();
        if (studentIdToAddress[studentId] != address(0)) revert StudentAlreadyExists();

        students[wallet] = Student({
            studentId: studentId,
            name: name,
            isEnrolled: true,
            currentSemester: 1,
            department: department,
            exists: true
        });

        studentIdToAddress[studentId] = wallet;
        _roles[STUDENT_ROLE][wallet] = true;

        emit StudentEnrolled(studentId, wallet, name);
        emit RoleGranted(STUDENT_ROLE, wallet, msg.sender);
    }

    function setStudentEnrollmentStatus(address wallet, bool isEnrolled) external onlyRegistrar {
        if (!students[wallet].exists) revert StudentDoesNotExist();
        students[wallet].isEnrolled = isEnrolled;
        emit StudentStatusUpdated(students[wallet].studentId, isEnrolled);
    }

    function promoteStudentSemester(address wallet) external onlyRegistrar {
        if (!students[wallet].exists) revert StudentDoesNotExist();
        students[wallet].currentSemester += 1;
    }

    function getStudentInfo(address wallet) external view returns (
        string memory studentId,
        string memory name,
        bool isEnrolled,
        uint256 currentSemester,
        string memory department,
        string[] memory registeredCourses
    ) {
        if (!students[wallet].exists) revert StudentDoesNotExist();
        Student memory s = students[wallet];
        return (s.studentId, s.name, s.isEnrolled, s.currentSemester, s.department, studentRegisteredCourses[wallet]);
    }

    // --- Course Registry ---
    function addCourseToCatalog(
        string calldata courseCode,
        string calldata title,
        uint8 credits
    ) external onlyRegistrar {
        if (courses[courseCode].isActive) revert CourseAlreadyExists();
        courses[courseCode] = Course({
            courseCode: courseCode,
            title: title,
            credits: credits,
            isActive: true
        });
        courseCatalog.push(courseCode);
        emit CourseAdded(courseCode, title, credits);
    }

    function registerForCourse(string calldata courseCode) external {
        if (!students[msg.sender].exists || !students[msg.sender].isEnrolled) revert StudentDoesNotExist();
        if (!courses[courseCode].isActive) revert CourseDoesNotExist();

        // Check duplicates
        string[] storage registered = studentRegisteredCourses[msg.sender];
        for (uint256 i = 0; i < registered.length; i++) {
            if (keccak256(abi.encodePacked(registered[i])) == keccak256(abi.encodePacked(courseCode))) {
                revert CourseAlreadyExists();
            }
        }

        registered.push(courseCode);
        emit CourseRegistered(msg.sender, courseCode);
    }

    function dropRegisteredCourse(string calldata courseCode) external {
        if (!students[msg.sender].exists) revert StudentDoesNotExist();
        
        string[] storage registered = studentRegisteredCourses[msg.sender];
        bool found = false;
        uint256 index;
        for (uint256 i = 0; i < registered.length; i++) {
            if (keccak256(abi.encodePacked(registered[i])) == keccak256(abi.encodePacked(courseCode))) {
                found = true;
                index = i;
                break;
            }
        }

        if (!found) revert CourseDoesNotExist();

        // Swap with last and pop
        registered[index] = registered[registered.length - 1];
        registered.pop();

        emit CourseDropped(msg.sender, courseCode);
    }

    function getCourseCatalog() external view returns (string[] memory) {
        return courseCatalog;
    }

    function getCourseDetails(string calldata courseCode) external view returns (
        string memory title,
        uint8 credits,
        bool isActive
    ) {
        Course memory c = courses[courseCode];
        if (!c.isActive) revert CourseDoesNotExist();
        return (c.title, c.credits, c.isActive);
    }

    // --- Soulbound Credentials (SBT) ---
    function mintCertificate(
        string calldata studentId,
        string calldata studentName,
        string calldata courseCode,
        string calldata grade,
        string calldata ipfsHash
    ) external onlyFaculty returns (uint256) {
        address sWallet = studentIdToAddress[studentId];
        if (sWallet == address(0)) revert StudentDoesNotExist();

        uint256 certId = nextCertificateId++;

        certificates[certId] = Certificate({
            studentId: studentId,
            studentName: studentName,
            courseCode: courseCode,
            grade: grade,
            issueDate: block.timestamp,
            issuer: msg.sender,
            ipfsHash: ipfsHash,
            isValid: true
        });

        emit CertificateMinted(
            certId,
            studentId,
            studentName,
            courseCode,
            grade,
            block.timestamp,
            ipfsHash,
            msg.sender
        );

        return certId;
    }

    function revokeCertificate(uint256 certificateId, string calldata reason) external onlyRegistrar {
        if (!certificates[certificateId].isValid) revert CertificateDoesNotExist();
        certificates[certificateId].isValid = false;
        emit CertificateRevoked(certificateId, reason);
    }

    function getCertificate(uint256 certificateId) external view returns (
        string memory studentId,
        string memory studentName,
        string memory courseCode,
        string memory grade,
        uint256 issueDate,
        address issuer,
        string memory ipfsHash,
        bool isValid
    ) {
        Certificate memory cert = certificates[certificateId];
        if (cert.issueDate == 0) revert CertificateDoesNotExist();
        return (
            cert.studentId,
            cert.studentName,
            cert.courseCode,
            cert.grade,
            cert.issueDate,
            cert.issuer,
            cert.ipfsHash,
            cert.isValid
        );
    }

    // --- Tuition & Financial Gateways ---
    function setTuitionFee(string calldata studentId, uint256 totalDue) external onlyRegistrar {
        address sWallet = studentIdToAddress[studentId];
        if (sWallet == address(0)) revert StudentDoesNotExist();

        tuitionFees[studentId].totalDue = totalDue;
        tuitionFees[studentId].isPaidFull = tuitionFees[studentId].amountPaid >= totalDue;

        emit TuitionFeeSet(studentId, totalDue);
    }

    function payTuition(string calldata studentId) external payable nonReentrant {
        if (msg.value == 0) revert InvalidPaymentAmount();
        address sWallet = studentIdToAddress[studentId];
        if (sWallet == address(0)) revert StudentDoesNotExist();

        TuitionFee storage fee = tuitionFees[studentId];
        fee.amountPaid += msg.value;
        if (fee.totalDue > 0 && fee.amountPaid >= fee.totalDue) {
            fee.isPaidFull = true;
        }

        emit TuitionFeePaid(studentId, msg.sender, msg.value, fee.amountPaid);
    }

    // --- Research Grants Escrow ---
    function proposeGrant(
        string calldata title,
        address payable leadResearcher,
        uint256 totalFunding,
        uint8 totalMilestones
    ) external onlyFaculty returns (uint256) {
        uint256 grantId = nextGrantId++;
        grants[grantId] = Grant({
            id: grantId,
            title: title,
            leadResearcher: leadResearcher,
            totalFunding: totalFunding,
            disbursedFunding: 0,
            totalMilestones: totalMilestones,
            currentMilestone: 0,
            isApproved: false,
            isCompleted: false
        });

        emit GrantProposed(grantId, title, leadResearcher, totalFunding);
        return grantId;
    }

    function approveAndFundGrant(uint256 grantId) external payable onlyAdmin {
        Grant storage g = grants[grantId];
        if (g.totalFunding == 0) revert GrantDoesNotExist();
        if (g.isApproved) revert GrantAlreadyApproved();
        if (msg.value != g.totalFunding) revert InvalidPaymentAmount();

        g.isApproved = true;
        emit GrantApproved(grantId);
        emit GrantFunded(grantId, msg.value);
    }

    function releaseMilestoneFunding(uint256 grantId) external onlyAdmin nonReentrant {
        Grant storage g = grants[grantId];
        if (!g.isApproved) revert GrantDoesNotExist();
        if (g.isCompleted) revert MilestoneCompleted();

        uint256 paymentPerMilestone = g.totalFunding / g.totalMilestones;
        g.currentMilestone += 1;
        g.disbursedFunding += paymentPerMilestone;

        if (g.currentMilestone == g.totalMilestones) {
            g.isCompleted = true;
        }

        // Safe transfer
        (bool success, ) = g.leadResearcher.call{value: paymentPerMilestone}("");
        if (!success) revert TransferFailed();

        emit MilestoneReleased(grantId, g.currentMilestone, paymentPerMilestone);
    }

    function getGrantInfo(uint256 grantId) external view returns (
        string memory title,
        address leadResearcher,
        uint256 totalFunding,
        uint256 disbursedFunding,
        uint8 totalMilestones,
        uint8 currentMilestone,
        bool isApproved,
        bool isCompleted
    ) {
        Grant memory g = grants[grantId];
        if (g.totalFunding == 0) revert GrantDoesNotExist();
        return (
            g.title,
            g.leadResearcher,
            g.totalFunding,
            g.disbursedFunding,
            g.totalMilestones,
            g.currentMilestone,
            g.isApproved,
            g.isCompleted
        );
    }

    // --- Decentralized Campus Governance ---
    function createProposal(string calldata description, uint256 votingDurationSeconds) external returns (uint256) {
        if (!hasRole(FACULTY_ROLE, msg.sender) && !hasRole(STUDENT_ROLE, msg.sender)) revert Unauthorized();

        uint256 proposalId = nextProposalId++;
        uint256 endTime = block.timestamp + votingDurationSeconds;

        proposals[proposalId].id = proposalId;
        proposals[proposalId].description = description;
        proposals[proposalId].endTime = endTime;
        proposals[proposalId].exists = true;

        emit ProposalCreated(proposalId, description, endTime);
        return proposalId;
    }

    function castVote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        if (!p.exists) revert InvalidProposalId();
        if (block.timestamp > p.endTime) revert VotingAlreadyEnded();
        if (proposalVoters[proposalId][msg.sender]) revert AlreadyVoted();

        // Calculate vote weight based on role (Faculty = 3 weight, student/others = 1 weight)
        uint256 weight = 1;
        if (hasRole(FACULTY_ROLE, msg.sender)) {
            weight = 3;
        } else if (hasRole(ADMIN_ROLE, msg.sender)) {
            weight = 5;
        }

        if (support) {
            p.votesFor += weight;
        } else {
            p.votesAgainst += weight;
        }

        proposalVoters[proposalId][msg.sender] = true;
        emit ProposalVoted(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) external onlyAdmin returns (bool passed) {
        Proposal storage p = proposals[proposalId];
        if (!p.exists) revert InvalidProposalId();
        if (block.timestamp <= p.endTime) revert ProposalNotExpired();
        if (p.executed) revert ProposalExpired();

        p.executed = true;
        passed = p.votesFor > p.votesAgainst;
        emit ProposalExecuted(proposalId, passed);
    }

    function getProposalInfo(uint256 proposalId) external view returns (
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 endTime,
        bool executed
    ) {
        Proposal storage p = proposals[proposalId];
        if (!p.exists) revert InvalidProposalId();
        return (p.description, p.votesFor, p.votesAgainst, p.endTime, p.executed);
    }

    // --- University Treasury Management ---
    function withdrawTreasuryFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        
        // Find total pending locked grant funds to keep them in escrow
        uint256 lockedEscrow = 0;
        for (uint256 i = 0; i < nextGrantId; i++) {
            Grant memory g = grants[i];
            if (g.isApproved && !g.isCompleted) {
                lockedEscrow += (g.totalFunding - g.disbursedFunding);
            }
        }

        if (balance <= lockedEscrow) revert InsufficientEscrowBalance();
        uint256 withdrawable = balance - lockedEscrow;

        (bool success, ) = payable(owner).call{value: withdrawable}("");
        if (!success) revert TransferFailed();
    }
}
