/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Metriport from "../../../../..";

/**
 * @example
 *     {
 *         id: "2.16.840.1.113883.3.666.123",
 *         name: "Care Facility, LLC",
 *         npi: "1234567891",
 *         address: {
 *             addressLine1: "2261 Market Street",
 *             addressLine2: "#4818",
 *             city: "San Francisco",
 *             state: Metriport.UsState.Ca,
 *             zip: "94114",
 *             country: "USA"
 *         },
 *         tin: "12-3456789",
 *         active: true
 *     }
 */
export interface Facility extends Metriport.medical.BaseFacility {
    /**
     * The ID assigned to this Facility. This ID will be used
     * to uniquely identify this Facility in medical documents.
     *
     */
    id: string;
}