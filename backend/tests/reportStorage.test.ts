import {strict as assert} from "node:assert";
import {reportStoragePath} from "@/backend/firebase/storage";
assert.equal(reportStoragePath("P1","R1","my report.pdf"),"medical-reports/P1/R1/my_report.pdf");
assert.equal(reportStoragePath("P1","R1","../secret.txt"),"medical-reports/P1/R1/.._secret.txt");
console.log("Report storage path safety checks passed.");
