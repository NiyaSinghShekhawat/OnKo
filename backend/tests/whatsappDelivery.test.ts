import {strict as assert} from "node:assert";
import {runWhatsAppDeliverySweep} from "@/backend/services/whatsappDeliverySweep";
assert.equal(typeof runWhatsAppDeliverySweep,"function");
console.log("WhatsApp delivery module loaded.");
