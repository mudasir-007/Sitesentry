import json
import re
import os

class CostEngine:
    def __init__(self, benchmark_path: str="src/benchmarks/cost_data.json"):
        with open(benchmark_path) as f:
            self.benchmarks= json.load(f)


    def extract_cost_per_sqft(self, text: str):
        """Extract cost per sqft figures from report text using regex."""
        patterns= [
            r'(?:rs\.?|inr|₹)\s*([\d,]+)\s*(?:per|/)\s*(?:sq\.?ft|sqft|square feet)',
            r'([\d,]+)\s*(?:rs\.?|inr|₹)\s*(?:per|/)\s*(?:sq\.?ft|sqft)',
    
        ]
        found =[]
        for pattern in patterns:
            matches = re.findall(pattern, text.lower())
            for m in matches:
                found.append(int(m.replace(",", "")))

        return found
    
    def benchmark(self, cost_per_sqft: int, project_type: str, city_tier: str):
        """Check if cost falls within expected range."""
        try:
            rate = self.benchmarks[project_type][city_tier]
            if cost_per_sqft < rate["min"]:
                return {"status": "UNDERESTIMATED", "range": rate, "value": cost_per_sqft}
            elif cost_per_sqft > rate["max"]:
                return {"status": "OVERESTIMATED", "range": rate, "value": cost_per_sqft}
            else:
                return {"status": "REALISTIC", "range": rate, "value": cost_per_sqft}
        except KeyError:
            return {"status": "UNKNOWN", "range": None, "value": cost_per_sqft}

    def analyze(self, text: str, project_type: str = "residential", city_tier: str = "tier_2"):
        costs = self.extract_cost_per_sqft(text)
        if not costs:
            return {"extracted_costs": [], "flags": [], "summary": "No cost figures found in report"}
        
        flags = [self.benchmark(c, project_type, city_tier) for c in costs]
        return {"extracted_costs": costs, "flags": flags}

