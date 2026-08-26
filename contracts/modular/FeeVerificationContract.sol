// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FeeVerificationContract {
    address public implementation;
    address public admin;

    struct Invoice {
        string invoiceId;
        uint256 amountDue;
        bool isCleared;
        string invoiceType; // TUITION, HOSTEL, TRANSPORT, LIBRARY_FINE, etc.
    }

    // student => invoices
    mapping(address => Invoice[]) private studentInvoices;
    // student => fee clearance status
    mapping(address => bool) public generalFeeClearance;

    event InvoiceGenerated(address indexed student, string invoiceId, uint256 amount, string invoiceType);
    event FeeCleared(address indexed student, string invoiceId, string paymentReceiptHash);
    event GeneralClearanceUpdated(address indexed student, bool cleared);
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

    function generateInvoice(
        address student,
        string calldata invoiceId,
        uint256 amount,
        string calldata invoiceType
    ) external onlyAdmin {
        studentInvoices[student].push(Invoice({
            invoiceId: invoiceId,
            amountDue: amount,
            isCleared: false,
            invoiceType: invoiceType
        }));
        emit InvoiceGenerated(student, invoiceId, amount, invoiceType);
    }

    function recordPaymentClearance(
        address student,
        string calldata invoiceId,
        string calldata receiptHash
    ) external onlyAdmin {
        Invoice[] storage invoices = studentInvoices[student];
        for (uint256 i = 0; i < invoices.length; i++) {
            if (keccak256(bytes(invoices[i].invoiceId)) == keccak256(bytes(invoiceId))) {
                invoices[i].isCleared = true;
                emit FeeCleared(student, invoiceId, receiptHash);
                break;
            }
        }
    }

    function setGeneralFeeClearance(address student, bool cleared) external onlyAdmin {
        generalFeeClearance[student] = cleared;
        emit GeneralClearanceUpdated(student, cleared);
    }

    function getStudentInvoices(address student) external view returns (Invoice[] memory) {
        return studentInvoices[student];
    }
}
