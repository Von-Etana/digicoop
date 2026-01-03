"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = exports.KycStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["MEMBER"] = "MEMBER";
    Role["ADMIN"] = "ADMIN";
    Role["VENDOR"] = "VENDOR";
})(Role || (exports.Role = Role = {}));
var KycStatus;
(function (KycStatus) {
    KycStatus["PENDING"] = "PENDING";
    KycStatus["VERIFIED"] = "VERIFIED";
    KycStatus["FAILED"] = "FAILED";
})(KycStatus || (exports.KycStatus = KycStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionType["SAVINGS_CONTRIBUTION"] = "SAVINGS_CONTRIBUTION";
    TransactionType["LOAN_DISBURSEMENT"] = "LOAN_DISBURSEMENT";
    TransactionType["LOAN_REPAYMENT"] = "LOAN_REPAYMENT";
    TransactionType["GROUP_BUY"] = "GROUP_BUY";
    TransactionType["INVESTMENT"] = "INVESTMENT";
    TransactionType["DIVIDEND"] = "DIVIDEND";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["SUCCESS"] = "SUCCESS";
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
