class ComplianceChecker:
    """
    Deterministic rule-based compliance checker for private construction projects.
    Checks for mentions of required approvals and clearances.

    """

    CHECKLIST = {
        "building_permit": ["building permit", "construction permit", "municipal approval"],
        "structural_certificate": ["structural certificate", "structural approval", "structural engineer"],
        "fire_noc": ["fire noc", "fire safety", "fire clearance", "fire department"],
        "environmental_clearance": ["environmental clearance", "eia", "environmental impact"],
        "soil_test": ["soil test", "soil report", "geotechnical", "bearing capacity"],
        "electricity_approval": ["electricity connection", "power approval", "electrical clearance"],
        "water_sewage": ["water connection", "sewage approval", "drainage clearance"],
        "completion_certificate": ["completion certificate", "occupancy certificate"]
    }


    def check(self, text: str):
        text_lower = text.lower()
        results = {}

        for requirement, keywords in self.CHECKLIST.items():
            found = any(kw in text_lower for kw in keywords)
            results[requirement] ={
                "present": found,
                "status":"FOUND" if found else "MISSING" 
            }

        total= len(results)
        found_count = sum(1 for r in results.values() if r["present"])
        compliance_score = round((found_count/ total) * 100, 1)

        return {
            "checks": results,
            "compliance_score": compliance_score,
            "risk_level": "HIGH" if compliance_score < 50 else "MEDIUM" if compliance_score <75 else "LOW"

        }