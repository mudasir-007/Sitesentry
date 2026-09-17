from src.cost_engine import CostEngine

engine = CostEngine()
sample = "The project cost is estimated at Rs. 2500 per sqft for residential construction."
result = engine.analyze(sample, project_type = "residential", city_tier="tier_1")
print(result)

